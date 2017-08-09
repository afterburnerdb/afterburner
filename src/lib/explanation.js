//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function explanationTable(tabname, numpats, samplesize, binatt){
if (typeof numpats == undefined)
  numpats=10;
if (typeof samplesize == undefined)
  samplesize=16;
if (typeof binatt == undefined)
  binatt="p";
  this.tabname=tabname;
  this.tab=daSchema.getTable(tabname);
  this.numatts;
  this.two2d; 
  this.samplesize=samplesize;
  this.sofpofs=this.samplesize*this.two2d;
  this.colNs=[]; 
  this.colPs=[];
  this.pcol=-1.32;
  this.tabsize=this.tab.numrows;
  this.thresh=1+(this.tabsize/5000);
  this.numpats=numpats;
  this.binatt=binatt;
  this.sample;
  this.et={ pats:[],
            lambdas:[],
            sumq:[],
            p:[],
            q:[],
            count:[] };
  this.kldivo=0;
  this.kldivf=-1;
  this.et;
  lilinf=20;
  this.D_e;
  //
  this.explain = function(){

    this.et.pats.push(new Array(this.numatts).fill('*'));
    this.et.count.push(this.tabsize);
    //this.et.sump.push(abdb.select().from(this.tab.name).field(sum(binatt)).eval());
    this.et.p.push(abdb.select().from(this.tab.name).field(_avg(binatt)).eval());
    this.et.lambdas.push(Math.log2(this.et.p[0]/(1-this.et.p[0])));
    this.et.q.push(this.et.p[0]);
    this.et.sumq.push(this.et.q[0]*this.et.count[0]);
    this.D_e=(new Array(this.tabsize)).fill(this.et.q[0]);

    //run iterative scaling
    this.kldivo=this.calcKLDIV();
    for (var iter=1;iter<numpats;iter++){
//      console.log('debug:'+ 'gen_new_pats:');
      this.sample=this.sampleDraw(this.samplesize,this.tabsize);
//      console.log("sample:"+this.sample);
      
      this.sXd();
      this.iterative_scaling();
    }
    this.printET();
  }
  //Math:
  //inf=0;
  this.tlcat=function(rid1,rid2){//*=>0
    var lrank=0;
    for (var cid=0; cid<this.numatts; cid++){
      if (mystrcmp(mem32[(this.colPs[cid] + (rid1<<2)>>2)], mem32[(this.colPs[cid] + (rid2<<2))>>2])==0)
        lrank |= 1<<cid;
    }
    //console.log("debug:" + rid1 +"x"+rid2 + "=lrank"+lrank.toString(2));
    //if (inf++>100) asfd=asdfasf;
    return lrank;
  }

  this.sampleDraw=function(ss,ds){
    if (ss>ds) return null;
    var sample= new Object();
    //sample[0]=null; //debug
    while(Object.keys(sample).length<ss){
        sample[Math.floor(Math.random()*ds)]=null;
    }
    return Object.keys(sample);
  }
  this.iterative_scaling = function(){
//    console.log('debug:'+ 'it_scall');
    var not_converged=true;
    var suml;
    var doitagain=true;
    var inf=0;//debug
    while(doitagain&&(inf++<200)){
      doitagain=false;
      for (var rid=0; rid<this.tabsize; rid++){
        suml=0;
        for (var pid=0; pid<this.et.pats.length; pid++){
          if (this.match(rid,pid))
            suml+=this.et.lambdas[pid];
        }
        this.D_e[rid]=Math.pow(2, suml)/(Math.pow(2, suml)+1);
      }

      for (var pid=0; pid<this.et.pats.length;pid++){
        this.et.sumq[pid]=0;
      }
      for (var rid=0; rid<this.tabsize; rid++){
        for (var pid=0; pid<this.et.pats.length;pid++){
          if (this.match(rid,pid)){
            this.et.sumq[pid]+=this.D_e[rid];
          }
        }
      }
      for (var pid=0; pid<this.et.pats.length;pid++){
        var oldlambda=this.et.lambdas[pid];
        this.et.q[pid]=this.et.sumq[pid]/this.et.count[pid];
        if (this.breakthresh(this.et.p[pid],this.et.q[pid],this.et.count[pid])){
          doitagain=true;
        } else continue;
        var newlambda=this.updateLambda(this.et.p[pid],this.et.q[pid],this.et.lambdas[pid]);
        this.et.lambdas[pid]=newlambda;
//        console.log('debug: pid:' + pid + ', newlambda:' + newlambda+ " p:"+this.et.p[pid] + " q:" + this.et.q[pid] + " oldlambda:" + oldlambda);
      }

    }
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
    var kldiv=0;
    for (var rid=0; rid<this.tabsize; rid++){
      p=mem32[(this.pcol + (rid<<2))>>2];
      q=this.D_e[rid];
      if (p==1)
        kldiv-=(Math.log2(q));
      else if (p==0)
        kldiv-=(Math.log2(1-q));
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
      if ( coln == this.binatt){ 
        this.pcol=daSchema.getColPByName(coln,this.tab.name);
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
//    console.log("debug: sXd::");
    var ps_sump=new Array(this.sofpofs).fill(0);
    var ps_sumq=new Array(this.sofpofs).fill(0);
    var ps_count=new Array(this.sofpofs).fill(0);

    var tmpp,tmpq,tmpanc,curranc;
    var shade=0;
    var powit=0;
    var nexts=[];
    var max_gain=0;
    for (var rid=0; rid<this.tabsize; rid++){
      for (var sid=0;sid<this.samplesize;sid++){
        //console.log("crossing rid:"+rid+",sid:"+sid);
        tmpp=mem32[(this.pcol + (rid<<2))>>2]
        tmpq=this.D_e[rid];
        var patval=this.tlcat(rid, this.sample[sid]);
        if (patval){
          nexts.push(patval);
          //console.log("push:"+patval+",nexts.length:"+nexts.length);
        }
        while(nexts.length>0){
          var ht=new Object();
          while (nexts.length>0){
            curranc=nexts.pop();
            if (typeof curranc == 'string')
              curranc = parseInt(curranc);
            var patid=(sid*this.two2d)+curranc;
            //console.log("pop:"+curranc.toString(2)+",nexts.length:"+nexts.length+", manip:"+ patid + ",  ps_count[patid] "+ ps_count[patid] );
            ps_sump[patid]+=tmpp;
            ps_sumq[patid]+=tmpq;
            ps_count[patid]++;

            if (curranc==(curranc&-curranc)){
              //console.log("curranc:"+curranc+", ham weight=1 -> continue");
              continue;
            }
            else{
              //console.log("curranc:"+curranc+", ham weight>1");
            }
            shade=0;
            while (curranc!=shade){
              var ancshdd=(curranc^shade);
              powit=(ancshdd&-ancshdd);
              ht[(curranc ^ powit)]=null;
              //console.log("ht push:"+(curranc ^ powit));
              shade |=powit;
              //console.log("ancshdd:"+ancshdd + ","+ancshdd.toString(2));
              //console.log("powit:"+powit + ","+powit.toString(2));
              //console.log("curranc, shade:"+curranc.toString(2)+","+shade.toString(2));
              //console.log("inf:"+inf)
            }
          }
          nexts=Object.keys(ht);
          //console.log("nexts:"+nexts);
          ///return;
        }
        ps_sump[(sid*this.two2d)]+=tmpp;
        ps_sumq[(sid*this.two2d)]+=tmpq;
        ps_count[(sid*this.two2d)]++;
      }
      //console.log("debug: done with P(s)::"+crashme*21);
    }
    //console.log("debug: done with P(s)::"+crashme*21);
    var maxcount;
    var maxp;
    var maxq;
    var maxgain=0;
    var maxpat;
    var maxlambda=0;
    for (var pid=0;pid<this.sofpofs;pid++){
      var sigstr="";
      var count=ps_count[pid];
      var p=ps_sump[pid]/count;
      var q=ps_sumq[pid]/count;
      var gain=0;
      if (p==1) gain= count*Math.log2(1/q);
      else if (p==0) gain= count * ((1-p)*(Math.log2((1-p)/(1-q))));
      else gain= count * ((p*Math.log2(p/q) ) + ((1-p)*(Math.log2((1-p)/(1-q)))));
      if (gain>maxgain){
//        console.log("debug: new winner gain::"+gain+" maxgain:"+maxgain+" maxcount:"+count+" maxp:"+p+" maxq"+q+" maxlambda:"+maxlambda);
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
    
    var pat=new Array(this.numatts).fill('*');
    for (var cid=0;cid<this.numatts;cid++)
        if ((Math.pow(2,cid)&aid)>0) 
          pat[cid]=(strToString(mem32[(this.colPs[cid] + (this.sample[sid]<<2))>>2]));
    
//    console.log("debug: set on a maxpat::"+maxpat+" aid:"+aid+":"+aid.toString(2)+";  sid:"+sid+"; pats:"+pat);
    //debug:
    if (aid==0){
      this.printET();
    }
    //debug:
    this.et.pats.push(pat);
    this.et.p.push(maxp);
    this.et.q.push(maxq);
    this.et.count.push(maxcount);
    this.et.lambdas.push(maxlambda);
  }
  this.pushPat=function(pat){
    this.et.pats.push(pat);
    var pid=this.et.pats.length-1;
    var qans=abdb.select()
      .from(this.tabname)
      .fields(_avg(this.binatt),_count('*'))
      .toArray();
    var p=qans[0];
    var count=qans[1];
    var q=0;
    for (var rid=0; rid<this.tabsize; rid++){
      if (this.match(rid,pid))
          q+=this.D_e[rid];
    }
    q=q/count;
    var lambda=0;
    if (p==0) lambda=-lilinf;
    else if (p==1) lambda=lilinf;
    else lambda=Math.log2(p/q);

    this.et.p.push(p);
    this.et.q.push(q);
    this.et.count.push(count);
    this.et.lambdas.push(lambda);
  }
  //Misc:
  this.match=function(rid,pid){
    for (var cid=0; cid<this.numatts; cid++){
      if ((this.et.pats[pid][cid]!='*') && (!mystrcmplit(mem32[(this.colPs[cid] + (rid<<2))>>2], this.et.pats[pid][cid])))
        return false;
    }
    return true;
  }
  this.printET=function(){
    var kldiv=this.calcKLDIV();
    this.kldivf=kldiv;
    console.log('debug:'+ 'printET:  kldiv:'+kldiv);
    console.log('debug:'+ 'kldiv droped from:' + this.kldivo + " to:" +kldiv + " infogain:"+(this.kldivo-kldiv))
    for (var pid=0;pid<this.numpats;pid++){
//      console.log('debug:'+ ' looping ET:');
      var patstr="pid:"+pid+"::";
      for (var cid=0; cid<this.numatts; cid++){
        patstr+=this.et.pats[pid][cid] + ',';
      }
      patstr+="||" + this.lambda2est(this.et.lambdas[pid]) +','+ this.et.p[pid] + ',' + this.et.count[pid];
      console.log(patstr);
    }
  }
  //
  console.log('debug:'+ "explanation table:(tabname="+tabname+
                                         ", numpats="+numpats+
                                         ", samplesize="+samplesize+
                                         ", binatt="+binatt+")" );
  this.getColNsPs();
}
function bench_explain(tabname,summaryrows,samplesize){
  var runtimes=[];
  var kldivs=[];
  var tt1=get_time_ms();
  var repeat=10;
  if (tabname=='income'){
    console.log("warning income db too large for this tech.. repeating 3 times only");
    repeat=3;
  }
  for (var c=0;c<repeat;c++){
    var et = new explanationTable(tabname,summaryrows,samplesize,'p');
    t0=get_time_ms(); 
    et.explain(); 
    t1=get_time_ms();
    runtimes.push(t1-t0);
    kldivs.push(et.kldivf);
  }
  var tt2=get_time_ms();
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
