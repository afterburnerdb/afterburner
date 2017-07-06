//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function correlationTablep1(tabname, numpats, samplesize, att1, att2){
  if (typeof numpats == undefined)
    numpats=10;
  if (typeof samplesize == undefined)
    samplesize=16;
  if (typeof att1 == undefined) att1="p1";
  if (typeof att2 == undefined) att2="p2";
  this.tabname=tabname;
  this.tab=daSchema.getTable(tabname);
  this.numatts;
  this.numpats=numpats;
  this.two2d; 
  this.samplesize=samplesize;
  this.sofpofs=this.samplesize*this.two2d;
  this.colNs=[]; 
  this.colPs=[];
  this.numdistbins;
  this.tabsize=this.tab.numrows;
  this.thresh=1+(this.tabsize/5000);
  this.att1=att1;
  this.att2=att2;
  this.sample;
  this.cet={patsp:0,
            patscount:0,
            countv:[],
            countm1v:[],
            countm2v:[],
            summ1v:[],
            summ2v:[],
            avgm1v:[],
            avgm2v:[],
            lambdam1v:[],
            lambdam2v:[],
            pearson:[]};
  //this.kldivm1o=0;
  //this.kldivm2o=0;
  //this.kldivo=0;
  //this.kldivm1f=-1;
  //this.kldivm2f=-1;
  //this.kldivf.m1=-1;
  this.cet;
  lilinf=20;
  //
  this.explain = function(){
    var att1=this.att1;
    var att2=this.att2;
    this.att1vals=abdb.select().from(this.tab.name).field(att1).group(att1).toArray2();
    this.att2vals=abdb.select().from(this.tab.name).field(att2).group(att2).toArray2();
    this.numdistbins=this.att1vals*this.att2vals;
    this.cet.patsp=malloc((this.numatts*this.numpats)<<2);
    for(var i=0;i<this.numatts*this.numpats;i++)
      mem32[(this.cet.patsp + (i<<2))>>2]=-666;
    this.cet.patscount=1;

    var freqs=abdb.select().from(this.tab.name)
    this.att2vals.forEach(xx=> {
      this.att1vals.forEach(x => {
        freqs=freqs.field(_countif('*',_and(_eq(att1,x),_eq(att2,xx))));
      });
    });

    freqs=freqs.toArray2();
    console.log("freqs:"+freqs);
    this.cet.countm1v.push([]);
    this.cet.countm2v.push([]);
    this.cet.summ1v.push([]);
    this.cet.summ2v.push([]);
    this.cet.avgm1v.push([]);
    this.cet.avgm2v.push([]);
    this.cet.lambdam1v.push([]);
    this.cet.lambdam2v.push([]);

    this.cet.countm1v[0][0]=freqs[0]+freqs[1];
    this.cet.countm1v[0][1]=freqs[2]+freqs[3];
    this.cet.countm2v[0][0]=freqs[0]+freqs[2];
    this.cet.countm2v[0][1]=freqs[1]+freqs[3];

    this.cet.summ1v[0][0]=(freqs[0]*this.att1vals[0]) + (freqs[1]*this.att1vals[1]);
    this.cet.summ1v[0][1]=(freqs[2]*this.att1vals[0]) + (freqs[3]*this.att1vals[1]);
    this.cet.summ2v[0][0]=(freqs[0]*this.att2vals[0]) + (freqs[2]*this.att2vals[1]);
    this.cet.summ2v[0][1]=(freqs[1]*this.att2vals[0]) + (freqs[3]*this.att2vals[1]);

    this.cet.avgm1v[0][0]=this.cet.summ1v[0][0]/this.cet.countm1v[0][0];
    this.cet.avgm1v[0][1]=this.cet.summ1v[0][1]/this.cet.countm1v[0][1];
    this.cet.avgm2v[0][0]=this.cet.summ2v[0][0]/this.cet.countm2v[0][0];
    this.cet.avgm2v[0][1]=this.cet.summ2v[0][1]/this.cet.countm2v[0][1];

    this.cet.lambdam1v[0][0]=Math.log2(this.cet.avgm1v[0][0]/(1-this.cet.avgm1v[0][0]));
    this.cet.lambdam1v[0][1]=Math.log2(this.cet.avgm1v[0][1]/(1-this.cet.avgm1v[0][1]));
    this.cet.lambdam2v[0][0]=Math.log2(this.cet.avgm2v[0][0]/(1-this.cet.avgm2v[0][0]));
    this.cet.lambdam2v[0][1]=Math.log2(this.cet.avgm2v[0][1]/(1-this.cet.avgm2v[0][1]));

    console.log("this.cet.countm1v[0][0]:"+this.cet.countm1v[0][0]);
    console.log("this.cet.countm1v[0][1]:"+this.cet.countm1v[0][1]);
    console.log("this.cet.countm2v[0][0]:"+this.cet.countm2v[0][0]);
    console.log("this.cet.countm2v[0][1]:"+this.cet.countm2v[0][1]);

    console.log("this.cet.summ1v[0][0]:"+this.cet.summ1v[0][0]);
    console.log("this.cet.summ1v[0][1]:"+this.cet.summ1v[0][1]);
    console.log("this.cet.summ2v[0][0]:"+this.cet.summ2v[0][0]);
    console.log("this.cet.summ2v[0][1]:"+this.cet.summ2v[0][1]);

    console.log("this.cet.avgm1v[0][0]:"+this.cet.avgm1v[0][0]);
    console.log("this.cet.avgm1v[0][1]:"+this.cet.avgm1v[0][1]);
    console.log("this.cet.avgm2v[0][0]:"+this.cet.avgm2v[0][0]);
    console.log("this.cet.avgm2v[0][1]:"+this.cet.avgm2v[0][1]);

    console.log("this.cet.lambdam1v[0][0]:"+this.cet.lambdam1v[0][0]);
    console.log("this.cet.lambdam1v[0][1]:"+this.cet.lambdam1v[0][1]);
    console.log("this.cet.lambdam2v[0][0]:"+this.cet.lambdam2v[0][0]);
    console.log("this.cet.lambdam2v[0][1]:"+this.cet.lambdam2v[0][1]);

    qval=abdb.select().from(this.tab.name).field(_variance(att1),_variance(att2),_covariance(att1,att2)).toArray2();
    this.cet.pearson.push(calcPearson(qval[0],qval[1],qval[2]));
    //
    this.D_em1v0p=malloc(this.tabsize<<2);
    this.D_em1v1p=malloc(this.tabsize<<2);
    this.D_em2v0p=malloc(this.tabsize<<2);
    this.D_em2v1p=malloc(this.tabsize<<2);

    this.ps_countm1v0p=malloc(this.sofpofs<<2);
    this.ps_countm1v1p=malloc(this.sofpofs<<2);
    this.ps_countm2v0p=malloc(this.sofpofs<<2);
    this.ps_countm2v1p=malloc(this.sofpofs<<2);

    this.ps_summ1v0p=malloc(this.sofpofs<<2);
    this.ps_summ1v1p=malloc(this.sofpofs<<2);
    this.ps_summ2v0p=malloc(this.sofpofs<<2);
    this.ps_summ2v1p=malloc(this.sofpofs<<2);

    this.ps_sumem1v0p=malloc(this.sofpofs<<2);
    this.ps_sumem1v1p=malloc(this.sofpofs<<2);
    this.ps_sumem2v0p=malloc(this.sofpofs<<2);
    this.ps_sumem2v1p=malloc(this.sofpofs<<2);

    for (var i=0;i<this.tabsize;i++){
      memF32[(this.D_em1v0p+(i<<2))>>2]=this.cet.avgm1v[0][0];
      memF32[(this.D_em1v1p+(i<<2))>>2]=this.cet.avgm1v[0][1];
      memF32[(this.D_em2v0p+(i<<2))>>2]=this.cet.avgm2v[0][0];
      memF32[(this.D_em2v1p+(i<<2))>>2]=this.cet.avgm2v[0][1];
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
      tit+=this.iterative_scalling();
    }
    console.log("sampling total time(ms):"+tis);
    console.log("sXd total time(ms):"+tsxd);
    console.log("iterative scalling total time(ms):"+tit);
    this.printCET();
  }
  this.tlcat=function(rid1,rid2){//*=>0
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
  this.iterative_scalling = function(){
    var t0=get_time_ms();
    var not_converged=1;
    var suml;
    var doitagain=1;
    while(doitagain){
      doitagain=0;
      for (var rid=0; rid<this.tabsize; rid++){
        suml=0;
        for (var pid=0; pid<this.cet.patscount; pid++){
          if (this.match(rid,pid))
            suml+=this.cet.lambdas[pid];
        }
        memF32[(this.D_ep+(rid<<2))>>2]=Math.pow(2, suml)/(Math.pow(2, suml)+1);
      }
      for (var pid=0; pid<this.cet.patscount;pid++){
        this.cet.sumq[pid]=0;
      }
      for (var rid=0; rid<this.tabsize; rid++){
        for (var pid=0; pid<this.cet.patscount;pid++){
          if (this.match(rid,pid)){
            this.cet.sumq[pid]+=memF32[(this.D_ep+(rid<<2))>>2];
          }
        }
      }
      for (var pid=0; pid<this.cet.patscount;pid++){
        var oldlambda=this.cet.lambdas[pid];
        this.cet.q[pid]=this.cet.sumq[pid]/this.cet.count[pid];
        if (this.breakthresh(this.cet.pearson[pid],this.cet.q[pid],this.cet.count[pid])){
          doitagain=true;
        } else continue;
        var newlambda=this.updateLambda(this.cet.pearson[pid],this.cet.q[pid],this.cet.lambdas[pid]);
        this.cet.lambdas[pid]=newlambda;
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
//    console.log('debug:'+ 'new diff:' + diff);
    return diff>thresh;
  }
  this.updateLambda=function(p,q,lambda){
    if (p==0) return lambda-lilinf;
    if (q==1) return lambda-lilinf;
    if (p==1) return lambda+lilinf;
    if (q==0) return lambda+lilinf;
    ret=(lambda + Math.log2(p/q) + Math.log2((1-q)/(1-p)));
//    if (ret > lilinf) return lilinf;
//    else if (ret < -lilinf) return -lilinf;
    return ret;
  }
  this.lambda2est=function(lambda){
    return Math.pow(2,lambda)/(Math.pow(2,lambda)+1);
  }
  this.calcKLDIV = function(){
    var kldivm1=0;
    var kldivm2=0;
    var e1,e2;
    for (var rid=0; rid<this.tabsize; rid++){
      var m1=mem32[(this.m1col + (rid<<2))>>2];
      var m2=mem32[(this.m2col + (rid<<2))>>2];
      if (m2==0)
       e1=memF32[(this.D_em1v0p+(rid<<2))>>2];
      else 
       e1=memF32[(this.D_em1v1p+(rid<<2))>>2];

      if (m1==0)
       e2=memF32[(this.D_em2v0p+(rid<<2))>>2];
      else 
       e2=memF32[(this.D_em2v1p+(rid<<2))>>2];

      if (m1==1)
        kldivm1-=(Math.log2(e1));
      else if (m1==0)
        kldivm1-=(Math.log2(1-e1));
      else 
        crashme++;

      if (m2==1)
        kldivm2-=(Math.log2(e2));
      else if (m2==0)
        kldivm2-=(Math.log2(1-e2));
      else 
        crashme++;
//        console.log("m1:"+m1);
//        console.log("e1:"+e1);
//        console.log("m2:"+m2);
//        console.log("e2:"+e2);
//        console.log("kldivm1:"+kldivm1);
//        console.log("kldivm2:"+kldivm2 + "   rid:"+rid);
//
//      if(rid==5){
//        break;
//      }
    }
    return {m1:kldivm1, m2:kldivm2};
  }
  //Database:
  this.getColNsPs=function(){
    var coln;
    for (var i=0;i<this.tab.numcols;i++){
      coln=this.tab.colnames[i]
      if ( coln == 'id') continue;
      if ( coln == this.att1){ 
        this.m1col=daSchema.getColPByName(coln,this.tab.name);
        continue;
      }
      if ( coln == this.att2){ 
        this.m2col=daSchema.getColPByName(coln,this.tab.name);
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
      mem32[(this.ps_countm1v0p+(i<<2))>>2]=0;
      mem32[(this.ps_countm1v1p+(i<<2))>>2]=0;
      mem32[(this.ps_countm2v0p+(i<<2))>>2]=0;
      mem32[(this.ps_countm2v1p+(i<<2))>>2]=0;

      memF32[(this.ps_summ1v0p+(i<<2))>>2]=0;
      memF32[(this.ps_summ1v1p+(i<<2))>>2]=0;
      memF32[(this.ps_summ2v0p+(i<<2))>>2]=0;
      memF32[(this.ps_summ2v1p+(i<<2))>>2]=0;

      memF32[(this.ps_sumem1v0p+(i<<2))>>2]=0;
      memF32[(this.ps_sumem1v1p+(i<<2))>>2]=0;
      memF32[(this.ps_sumem2v0p+(i<<2))>>2]=0;
      memF32[(this.ps_sumem2v1p+(i<<2))>>2]=0;
    }
    var tmpm1,tmpm2,tmpq,tmpanc,curranc;
    var shade=0;
    var powit=0;
    for (var rid=0; rid<this.tabsize; rid++){
      for (var sid=0;sid<this.samplesize;sid++){
        tmpm1=mem32[(this.m1col + (rid<<2))>>2]
        tmpm2=mem32[(this.m2col + (rid<<2))>>2]
        tmpq=memF32[(this.D_ep+(rid<<2))>>2];
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
          memF32[(this.ps_sumpp + (patid<<2))>>2]=memF32[(this.ps_sumpp + (patid<<2))>>2]+tmpm1;
          memF32[(this.ps_sumqp + (patid<<2))>>2]=memF32[(this.ps_sumqp + (patid<<2))>>2]+tmpq;
          mem32[(this.ps_countp + (patid<<2))>>2]=mem32[(this.ps_countp + (patid<<2))>>2]+1;
        }
      }
    }
    var maxcount;
    var maxp;
    var maxq;
    var maxgain=0;
    var maxpat;
    var maxlambda=0;
    for (var pid=0;pid<this.sofpofs;pid++){
      var count=mem32[(this.ps_countp + (pid<<2))>>2];
      var p=memF32[(this.ps_sumpp + (pid<<2))>>2]/count;
      var q=memF32[(this.ps_sumqp + (pid<<2))>>2]/count;
      var gain=0;
      if (p==1) gain= count*Math.log2(1/q);
      else if (p==0) gain= count * ((1-p)*(Math.log2((1-p)/(1-q))));
      else gain= count * ((p*Math.log2(p/q) ) + ((1-p)*(Math.log2((1-p)/(1-q)))));
      if (gain>maxgain){
        maxgain=gain;
        maxpat=pid;
        maxcount=count;
        maxq=q;
        maxp=p;
        if (p==0) maxlambda=-lilinf;
        else if (p==1) maxlambda=lilinf;
        else maxlambda=Math.log2(p/q);
      }
    }

    var aid=maxpat%this.two2d;
    var sid=Math.floor(maxpat/this.two2d);

    //
    for (var cid=0;cid<this.numatts;cid++)
      if ((Math.pow(2,cid)&aid)>0) {
        mem32[(this.cet.patsp+(((this.cet.patscount*this.numatts)+cid)<<2))>>2]=mem32[(this.colPs[cid]+(this.sample[sid]<<2))>>2];
      }
    this.cet.patscount++;
    //

    this.cet.pearson.push(maxp);
    this.cet.q.push(maxq);
    this.cet.count.push(maxcount);
    this.cet.lambdas.push(maxlambda);
    var t1=get_time_ms();
    return t1-t0;
  }
  //Misc:
  this.match=function(rid,pid){
    for (var cid=0; cid<this.numatts; cid++){
      if ((mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2] != -666) && 
          (mystrcmp(mem32[(this.colPs[cid] + (rid<<2))>>2],mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2])))
        return false;
    }
    return true;
  }
  this.toOBJ=function(){
    //if (this.kldivf.m1<0)
    this.kldivf=this.calcKLDIV();
    var pats=[];
    for (var pid=0;pid<this.numpats;pid++){
      var newpat={ cols:[],
                   count:-1,
                   pearson:-1 };
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          newpat.cols.push('*');
        else 
          newpat.cols.push(strToString(mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2]));
      }
      newpat.estm1v0= this.lambda2est(this.cet.lambdam1v[pid][0]);
      newpat.estm1v1= this.lambda2est(this.cet.lambdam1v[pid][1]);
      newpat.estm2v0= this.lambda2est(this.cet.lambdam2v[pid][0]);
      newpat.estm2v1= this.lambda2est(this.cet.lambdam2v[pid][1]);
      newpat.pearson= this.cet.pearson[pid];
      newpat.count1v0= this.cet.countm1v[pid][0];
      newpat.count1v1= this.cet.countm1v[pid][1];
      newpat.count2v0= this.cet.countm2v[pid][0];
      newpat.count2v1= this.cet.countm2v[pid][1];
      pats.push(newpat);
    }
    return {  kldiv:this.kldivf,
              infogainm1:(this.kldivo.m1-this.kldivf.m1),
              infogainm2:(this.kldivo.m2-this.kldivf.m2),
              pats:pats };
  }
  this.printCET=function(){
    var etobj=this.toOBJ();
    var patstr="pid:"+pid+"::";
    for (var pid=0;pid<this.numpats;pid++){
      var patstr="pid:"+pid+"::";
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          patstr+= '*,';
        else 
          patstr+=strToString(mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2]) + ',';
      }
      patstr+="|| est:[" + 
      this.lambda2est(this.cet.lambdam1v[pid][0])+","+
      this.lambda2est(this.cet.lambdam1v[pid][1])+","+
      this.lambda2est(this.cet.lambdam2v[pid][0])+","+
      this.lambda2est(this.cet.lambdam2v[pid][1])+"] counts:["+
      this.cet.countm1v[pid][0]+","+
      this.cet.countm1v[pid][1]+","+
      this.cet.countm2v[pid][0]+","+
      this.cet.countm2v[pid][1]+"] pearson:"+
      this.cet.pearson[pid];

      console.log(patstr);
      console.log("kldiv final m1:"+this.kldivf.m1.toFixed(2)+ " m2:"+this.kldivf.m2.toFixed(2)+ 
                  " infogainm1:"+(this.kldivo.m1-this.kldivf.m1).toFixed(2)+
                  " infogainm2:"+(this.kldivo.m2-this.kldivf.m2).toFixed(2));
    }
  }
  //
  console.log('debug:'+ "correlation table:(tabname="+tabname+
                                         ", numpats="+numpats+
                                         ", samplesize="+samplesize+
                                         ", att1="+att1+
                                         ", att2="+att2+")" );
  this.getColNsPs();
}
function bench_correlationp1(tabname,summaryrows,samplesize){
//todo:
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){                              
  console.log('exporting explanation');       
  module.exports=dataSource;  
}else delete module;                     
//////////////////////////////////////////////////////////////////////////////
