//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function mExplanationTablep1(tabname, numpats, samplesize, binatt1, binatt2){
if (typeof numpats == undefined)
  numpats=10;
if (typeof samplesize == undefined)
  samplesize=16;
if (typeof binatt1 == undefined) binatt1="p1";
if (typeof binatt2 == undefined) binatt2="p2";
  this.tabname=tabname;
  this.tab=daSchema.getTable(tabname);
  this.numatts;
  this.numpats=numpats;
  this.two2d; 
  this.samplesize=samplesize;
  this.sofpofs=this.samplesize*this.two2d;
  this.colNs=[]; 
  this.colPs=[];
  this.p1col=-1.32;
  this.p2col=-1.32;
  this.tabsize=this.tab.numrows;
  this.thresh=1+(this.tabsize/5000);
  this.binatt1=binatt1;
  this.binatt2=binatt2;
  this.sample;
  this.et={ patsp:0,
            patscount:0,
            p1:[],
            p2:[],
            q1:[],
            q2:[],
            sumq1:[],
            sumq2:[],
            count:[],
            lambdas1:[],
            lambdas2:[]};
  this.kldivo=0;
  this.kldivf=-1;
  this.et;
  lilinf=20;
  this.D_ep1;
  this.D_ep2;
  this.ps_sump1p;
  this.ps_sump2p;
  this.ps_sumq1p;
  this.ps_sumq2p;
  this.ps_countp;
  //
  this.explain = function(){
    this.et.patsp=malloc((this.numatts*this.numpats)<<2);
    for(var i=0;i<this.numatts*this.numpats;i++)
      mem32[(this.et.patsp + (i<<2))>>2]=-666;
    this.et.patscount=1;
    this.et.count.push(this.tabsize);
    this.et.p1.push(abdb.select().from(this.tab.name).field(_avg(binatt1)).eval());
    this.et.p2.push(abdb.select().from(this.tab.name).field(_avg(binatt2)).eval());
    this.et.lambdas1.push(Math.log2(this.et.p1[0]/(1-this.et.p1[0])));
    this.et.lambdas2.push(Math.log2(this.et.p2[0]/(1-this.et.p2[0])));
    this.et.q1.push(this.et.p1[0]);
    this.et.q2.push(this.et.p2[0]);
    this.et.sumq1.push(this.et.q1[0]*this.et.count[0]);
    this.et.sumq2.push(this.et.q2[0]*this.et.count[0]);

    this.ps_sump1p=malloc(this.sofpofs<<2);
    this.ps_sump2p=malloc(this.sofpofs<<2);
    this.ps_sumq1p=malloc(this.sofpofs<<2);
    this.ps_sumq2p=malloc(this.sofpofs<<2);
    this.ps_countp=malloc(this.sofpofs<<2);

    this.D_ep1=malloc(this.tabsize<<2);
    this.D_ep2=malloc(this.tabsize<<2);
    for (var i=0;i<this.tabsize;i++){
      memF32[(this.D_ep1+(i<<2))>>2]=this.et.p1[0];
      memF32[(this.D_ep2+(i<<2))>>2]=this.et.p2[0];
    }
    this.kldivo=this.calcKLDIV();
    var tis=0;
    var tsxd=0;
    var tit=0;
    for (var iter=1;iter<numpats;iter++){
      var tis0=get_time_ms();
      this.sample=this.sampleDraw(this.samplesize,this.tabsize);
      tis+=get_time_ms()-tis0;
      tsxd+=this.sXd();
      tit+=this.iterative_scaling();
    }
    console.log("sampling total time(ms):"+tis);
    console.log("sXd total time(ms):"+tsxd);
    console.log("iterative scaling total time(ms):"+tit);
    this.printET();
  }
  this.tlcat=function(rid1, rid2){//*=>0
    var lrank=0;
    for (var cid=0; cid<this.numatts; cid++){
      if (mystrcmp(mem32[(this.colPs[cid] + (rid1<<2)>>2)], mem32[(this.colPs[cid] + (rid2<<2))>>2])==0)
        lrank |= 1<<cid;
    }
    return lrank;
  }

  this.sampleDraw=function(ss,ds){
    if (ss>ds) return null;
    var sample= new Object();
    while(Object.keys(sample).length<ss){
        sample[Math.floor(Math.random()*ds)]=null;
    }
    return Object.keys(sample);
  }
  this.iterative_scaling = function(){
    var t0=get_time_ms();
    var suml1;
    var suml2;
    var doitagain=true;
    while(doitagain){
      doitagain=false;
      for (var rid=0; rid<this.tabsize; rid++){
        suml1=0;
        suml2=0;
        for (var pid=0; pid<this.et.patscount; pid++){
          if (this.match(rid,pid)){
            suml1+=this.et.lambdas1[pid];
            suml2+=this.et.lambdas2[pid];
          }
        }
        memF32[(this.D_ep1+(rid<<2))>>2]=Math.pow(2, suml1)/(Math.pow(2, suml1)+1);
        memF32[(this.D_ep2+(rid<<2))>>2]=Math.pow(2, suml2)/(Math.pow(2, suml2)+1);
      }
      for (var pid=0; pid<this.et.patscount;pid++){
        this.et.sumq1[pid]=0;
        this.et.sumq2[pid]=0;
      }
      megacounts=[0,0,0,0,0];
      for (var rid=0; rid<this.tabsize; rid++){
        for (var pid=0; pid<this.et.patscount;pid++){
          if (this.match(rid,pid)){
            this.et.sumq1[pid]+=memF32[(this.D_ep1+(rid<<2))>>2];
            this.et.sumq2[pid]+=memF32[(this.D_ep2+(rid<<2))>>2];
            megacounts[pid]++;
          }
        }
      }
      for (var pid=0; pid<this.et.patscount;pid++){
        var oldlambda1=this.et.lambdas1[pid];
        var oldlambda2=this.et.lambdas2[pid];
        this.et.q1[pid]=this.et.sumq1[pid]/this.et.count[pid];
        this.et.q2[pid]=this.et.sumq2[pid]/this.et.count[pid];

        var tmpbt;
        tmpbt=this.breakthresh(this.et.p1[pid],this.et.q1[pid],this.et.count[pid]);
        if (tmpbt){
          var newlambda1=this.updateLambda(this.et.p1[pid],this.et.q1[pid],this.et.lambdas1[pid]);
          this.et.lambdas1[pid]=newlambda1;
          doitagain=true;
        }
        tmpbt=this.breakthresh(this.et.p2[pid],this.et.q2[pid],this.et.count[pid]);
        if (tmpbt){
          var newlambda2=this.updateLambda(this.et.p2[pid],this.et.q2[pid],this.et.lambdas2[pid]);
          this.et.lambdas2[pid]=newlambda2;
          doitagain=true;
        } 
      }
    }
    var t1=get_time_ms();
    return t1-t0;
  }
  this.breakthresh=function(p,q,count){
    var thresh=this.thresh;
    var diff;
    if (p==q) diff=0;
    else if (p==0 && q== 1.0) diff=count*lilinf;
    else if (p==0) diff= (count * Math.log2(1/ 1-q));
    else if (p==1 && q==0) diff=count*lilinf;
    else if (p==1) diff=(count*Math.log2(1/q));
    else if (q==0) diff=((count*p*lilinf) + (count*(1-p)*Math.log2(1-p)));
    else if (q==0) diff=((count*p*Math.log2(p))+(count*(1-p)*lilinf));
    else diff= ((count*p*Math.log2(p/q))+(count*(1-p)*(Math.log2((1-p)/(1-q)))));
    return diff>thresh;
  }
  this.updateLambda=function(p,q,lambda){
    if (p==0) return lambda-lilinf;
    if (q==1) return lambda-lilinf;
    if (p==1) return lambda+lilinf;
    if (q==0) return lambda+lilinf;
    ret=(lambda + Math.log2(p/q) + Math.log2((1-q)/(1-p)));
    return ret;
  }
  this.lambda2est=function(lambda){
    return Math.pow(2,lambda)/(Math.pow(2,lambda)+1);
  }
  this.calcKLDIV = function(){
    var kldiv=0;
    for (var rid=0; rid<this.tabsize; rid++){
      var p1=mem32[(this.p1col + (rid<<2))>>2];
      var p2=mem32[(this.p2col + (rid<<2))>>2];
      var q1=memF32[(this.D_ep1+(rid<<2))>>2];
      var q2=memF32[(this.D_ep2+(rid<<2))>>2];
      if (p1==1)
        kldiv-=(Math.log2(q1));
      else if (p1==0)
        kldiv-=(Math.log2(1-q1));
      else 
        crashme++;
      if (p2==1)
        kldiv-=(Math.log2(q2));
      else if (p2==0)
        kldiv-=(Math.log2(1-q2));
      else 
        crashme++;
    }
    return kldiv;
  }
  //Database:
  this.getColNsPs=function(){
    var coln;
    for (var i=0;i<this.tab.numcols;i++){
      coln=this.tab.colnames[i]
      if ( coln == 'id') continue;
      if ( coln == this.binatt1 ){ 
        this.p1col=daSchema.getColPByName(coln,this.tab.name);
        continue;
      }
      if ( coln == this.binatt2 ){ 
        this.p2col=daSchema.getColPByName(coln,this.tab.name);
        continue;
      }
      this.colNs.push(coln);
      this.colPs.push(daSchema.getColPByName(coln,this.tab.name));
    }
    this.numatts=this.colNs.length;
    this.two2d=Math.pow(2,this.numatts); 
    this.sofpofs=this.samplesize*this.two2d;
  }
  this.sXd=function(){
    var t0=get_time_ms();
    for (var i=0; i<this.sofpofs;i++){
      memF32[(this.ps_sump1p + (i<<2))>>2]=0;
      memF32[(this.ps_sump2p + (i<<2))>>2]=0;
      memF32[(this.ps_sumq1p + (i<<2))>>2]=0;
      memF32[(this.ps_sumq2p + (i<<2))>>2]=0;
      mem32[(this.ps_countp + (i<<2))>>2]=0;
    }
    var tmpp,tmpq,tmpanc,curranc;
    var shade=0;
    var powit=0;
    for (var rid=0; rid<this.tabsize; rid++){
      for (var sid=0;sid<this.samplesize;sid++){
        tmpp1=mem32[(this.p1col + (rid<<2))>>2];
        tmpp2=mem32[(this.p2col + (rid<<2))>>2];
        tmpq1=memF32[(this.D_ep1+(rid<<2))>>2];
        tmpq2=memF32[(this.D_ep2+(rid<<2))>>2];
//
        var patval=0;
        var hamW=0;
        var sidrid=this.sample[sid];
        for (var cid=0; cid<this.numatts; cid++){
          if (mystrcmp(mem32[(this.colPs[cid] + (rid<<2)>>2)], mem32[(this.colPs[cid] + (sidrid<<2))>>2])==0){
            patval |= 1<<cid;
            hamW++;
          }
        }
        var sops=(1<<hamW);
        for (var i=0;i<sops;i++){
          shade=patval;
          curranc=0;
          for(var h=0;h<hamW;h++){
            powit=(shade&-shade);
            if(i&(1<<h)){
              curranc|=powit;
            }
            shade^=powit;
          }
          var patid=(sid*this.two2d)+curranc;
          memF32[(this.ps_sump1p + (patid<<2))>>2]=memF32[(this.ps_sump1p + (patid<<2))>>2]+tmpp1;
          memF32[(this.ps_sump2p + (patid<<2))>>2]=memF32[(this.ps_sump2p + (patid<<2))>>2]+tmpp2;

          memF32[(this.ps_sumq1p + (patid<<2))>>2]=memF32[(this.ps_sumq1p + (patid<<2))>>2]+tmpq1;
          memF32[(this.ps_sumq2p + (patid<<2))>>2]=memF32[(this.ps_sumq2p + (patid<<2))>>2]+tmpq2;

          mem32[(this.ps_countp + (patid<<2))>>2]=mem32[(this.ps_countp + (patid<<2))>>2]+1;

        }
      }
    }
    var maxcount;
    var maxp1;
    var maxp2;
    var maxq1;
    var maxq2;
    var maxgain=0;
    var maxpat;
    var maxlambda1=0;
    var maxlambda2=0;
    for (var pid=0;pid<this.sofpofs;pid++){
      var count=mem32[(this.ps_countp + (pid<<2))>>2];
      var p1=memF32[(this.ps_sump1p + (pid<<2))>>2]/count;
      var p2=memF32[(this.ps_sump2p + (pid<<2))>>2]/count;
      var q1=memF32[(this.ps_sumq1p + (pid<<2))>>2]/count;
      var q2=memF32[(this.ps_sumq2p + (pid<<2))>>2]/count;
      var gain1=0;
      var gain2=0;
      if (p1==1) gain1= count*Math.log2(1/q1);
      else if (p1==0) gain1= count * ((1-p1)*(Math.log2((1-p1)/(1-q1))));
      else gain1= count * ((p1*Math.log2(p1/q1) ) + ((1-p1)*(Math.log2((1-p1)/(1-q1)))));

      if (p2==1) gain2= count*Math.log2(1/q2);
      else if (p2==0) gain2= count * ((1-p2)*(Math.log2((1-p2)/(1-q2))));
      else gain2= count * ((p2*Math.log2(p2/q2) ) + ((1-p2)*(Math.log2((1-p2)/(1-q2)))));
      var gain = gain1+gain2;
      if (gain>maxgain){
        maxgain=gain;
        maxpat=pid;
        maxp1=p1;
        maxp2=p2;
        maxq1=q1;
        maxq2=q2;
        maxcount=count;

        if (p1==0) maxlambda1=-lilinf;
        else if (p1==1) maxlambda1=lilinf;
        else maxlambda1=Math.log2(p1/q1);

        if (p2==0) maxlambda2=-lilinf;
        else if (p2==1) maxlambda2=lilinf;
        else maxlambda2=Math.log2(p2/q2);
      }
    }

    var aid=maxpat%this.two2d;
    var sid=Math.floor(maxpat/this.two2d);

    //
    for (var cid=0;cid<this.numatts;cid++)
      if ((Math.pow(2,cid)&aid)>0) {
        mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+cid)<<2))>>2]=mem32[(this.colPs[cid]+(this.sample[sid]<<2))>>2];
      }
    this.et.patscount++;
    //

    this.et.p1.push(maxp1);
    this.et.p2.push(maxp2);
    this.et.q1.push(maxq1);
    this.et.q2.push(maxq2);
    this.et.count.push(maxcount);
    this.et.lambdas1.push(maxlambda1);
    this.et.lambdas2.push(maxlambda2);
    var t1=get_time_ms();
    return t1-t0;
  }
  //Misc:
  this.match=function(rid,pid){
    for (var cid=0; cid<this.numatts; cid++){
      if ((mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2] != -666) && 
          (mystrcmp(mem32[(this.colPs[cid] + (rid<<2))>>2],mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2])))
        return false;
    }
    return true;
  }
  this.toOBJ=function(){
    if (this.kldivf<0)
      this.kldivf=this.calcKLDIV();
    var pats=[];
    for (var pid=0;pid<this.numpats;pid++){
      var newpat={ cols:[],
                   count:-1,
                   avgp1:-1,
                   avgp2:-1 };
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          newpat.cols.push('*');
        else 
          newpat.cols.push(strToString(mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2]));
      }
      newpat.est1= this.lambda2est(this.et.lambdas1[pid]);
      newpat.est2= this.lambda2est(this.et.lambdas2[pid]);
      newpat.avgp1= this.et.p1[pid];
      newpat.avgp2= this.et.p2[pid];
      newpat.count= this.et.count[pid];
      pats.push(newpat);
    }
    return {  kldiv:this.kldivf,
              infogain:this.kldivo-this.kldivf,
              pats:pats };
  }
  this.printET=function(){
    var etobj=this.toOBJ();
    console.log('debug:'+ 'printET:  kldiv:'+etobj.kldiv);
    console.log('debug:'+ 'kldiv droped from:' + this.kldivo + " to:" +etobj.kldiv + " infogain:"+etobj.infogain);
    var patstr="pid:"+pid+"::";
    for (var pid=0;pid<this.numpats;pid++){
      var patstr="pid:"+pid+"::";
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          patstr+= '*,';
        else 
          patstr+=strToString(mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2]) + ',';
      }
      patstr+="|||" + this.lambda2est(this.et.lambdas1[pid]) +','+ this.et.p1[pid] + '||' +
              "|||" + this.lambda2est(this.et.lambdas2[pid]) +','+ this.et.p2[pid] + '||' +
              + this.et.count[pid];
      console.log(patstr);
    }
  }
  //
  console.log('debug:'+ "explanation table:(tabname="+tabname+
                                         ", numpats="+numpats+
                                         ", samplesize="+samplesize+
                                         ", binatt1="+binatt1+
                                         ", binatt2="+binatt2+")" );
  this.getColNsPs();
}
function bench_mexplainp1(tabname,summaryrows,samplesize){
  var runtimes=[];
  var kldivs=[];
  tt1=get_time_ms(); 
  for (var c=0;c<10;c++){
    var et = new mExplanationTablep1(tabname,summaryrows,samplesize,'p1','p2');
    t0=get_time_ms(); 
    et.explain(); 
    t1=get_time_ms();
    runtimes.push(t1-t0);
    kldivs.push(et.kldivf);
  }
  tt2=get_time_ms();
  console.log('benchmark total time (ms)'+(tt2-tt1));
  console.log('benchmark tabname:'+ tabname);
  console.log('benchmark summaryrows:'+ summaryrows);
  console.log('benchmark samplesize:'+ samplesize);
  console.log('kldivs:'+kldivs);
  console.log('runtimes:'+runtimes);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){                              
  console.log('exporting explanation');       
  module.exports=dataSource;  
}else delete module;                     
//////////////////////////////////////////////////////////////////////////////
