//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var lilinf=20;
function correlationTablep1_dir(tabname, numpats, samplesize, att1, att2){
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
            support:[],
            freqsv0v0:[],
            freqsv0v1:[],
            freqsv1v0:[],
            freqsv1v1:[],
            countm1v:[],
            countm2v:[],
            summ1v:[],
            summ2v:[],
            sumem1v:[],
            sumem2v:[],
            avgm1v:[],
            avgm2v:[],
            avgem1v:[],
            avgem2v:[],
            lambdam1v:[],
            lambdam2v:[],
            pearson:[]};
  this.cet;
  //

  //
  this.explain = function(){
    this.explain_t0=get_time_ms();
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
    this.cet.freqsv0v0.push(freqs[0]);
    this.cet.freqsv0v1.push(freqs[2]);
    this.cet.freqsv1v0.push(freqs[1]);
    this.cet.freqsv1v1.push(freqs[3]);
    this.cet.countm1v.push([]);
    this.cet.countm2v.push([]);
    this.cet.summ1v.push([]);
    this.cet.summ2v.push([]);
    this.cet.sumem1v.push([]);
    this.cet.sumem2v.push([]);
    this.cet.avgm1v.push([]);
    this.cet.avgm2v.push([]);
    this.cet.avgem1v.push([]);
    this.cet.avgem2v.push([]);
    this.cet.lambdam1v.push([]);
    this.cet.lambdam2v.push([]);

    this.cet.support.push(freqs[0]+freqs[1]+freqs[2]+freqs[3]);
    this.cet.countm1v[0][0]=freqs[0]+freqs[1];
    this.cet.countm1v[0][1]=freqs[2]+freqs[3];
    this.cet.countm2v[0][0]=freqs[0]+freqs[2];
    this.cet.countm2v[0][1]=freqs[1]+freqs[3];

    this.cet.summ1v[0][0]=(freqs[0]*this.att1vals[0]) + (freqs[1]*this.att1vals[1]);
    this.cet.summ1v[0][1]=(freqs[2]*this.att1vals[0]) + (freqs[3]*this.att1vals[1]);
    this.cet.summ2v[0][0]=(freqs[0]*this.att2vals[0]) + (freqs[2]*this.att2vals[1]);
    this.cet.summ2v[0][1]=(freqs[1]*this.att2vals[0]) + (freqs[3]*this.att2vals[1]);

    this.cet.sumem1v[0][0]=(freqs[0]*this.att1vals[0]) + (freqs[1]*this.att1vals[1]);
    this.cet.sumem1v[0][1]=(freqs[2]*this.att1vals[0]) + (freqs[3]*this.att1vals[1]);
    this.cet.sumem2v[0][0]=(freqs[0]*this.att2vals[0]) + (freqs[2]*this.att2vals[1]);
    this.cet.sumem2v[0][1]=(freqs[1]*this.att2vals[0]) + (freqs[3]*this.att2vals[1]);

    this.cet.avgm1v[0][0]=this.cet.summ1v[0][0]/this.cet.countm1v[0][0];
    this.cet.avgm1v[0][1]=this.cet.summ1v[0][1]/this.cet.countm1v[0][1];
    this.cet.avgm2v[0][0]=this.cet.summ2v[0][0]/this.cet.countm2v[0][0];
    this.cet.avgm2v[0][1]=this.cet.summ2v[0][1]/this.cet.countm2v[0][1];

    this.cet.avgem1v[0][0]=this.cet.sumem1v[0][0]/this.cet.countm1v[0][0];
    this.cet.avgem1v[0][1]=this.cet.sumem1v[0][1]/this.cet.countm1v[0][1];
    this.cet.avgem2v[0][0]=this.cet.sumem2v[0][0]/this.cet.countm2v[0][0];
    this.cet.avgem2v[0][1]=this.cet.sumem2v[0][1]/this.cet.countm2v[0][1];


    this.cet.lambdam1v[0][0]=Math.log2(this.cet.avgm1v[0][0]/(1-this.cet.avgm1v[0][0]));
    this.cet.lambdam1v[0][1]=Math.log2(this.cet.avgm1v[0][1]/(1-this.cet.avgm1v[0][1]));
    this.cet.lambdam2v[0][0]=Math.log2(this.cet.avgm2v[0][0]/(1-this.cet.avgm2v[0][0]));
    this.cet.lambdam2v[0][1]=Math.log2(this.cet.avgm2v[0][1]/(1-this.cet.avgm2v[0][1]));

    //
    this.D_em1p=malloc(this.tabsize<<2);
    this.D_em2p=malloc(this.tabsize<<2);

    this.ps_freqsv0v0=malloc(this.sofpofs<<2);
    this.ps_freqsv0v1=malloc(this.sofpofs<<2);
    this.ps_freqsv1v0=malloc(this.sofpofs<<2);
    this.ps_freqsv1v1=malloc(this.sofpofs<<2);

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

    for (var rid=0;rid<this.tabsize;rid++){
      var m1=mem32[(this.m1col + (rid<<2))>>2];
      var m2=mem32[(this.m2col + (rid<<2))>>2];
      if (m2==0)
        memF32[(this.D_em1p+(rid<<2))>>2]=this.cet.avgm1v[0][0];
      else if (m2==1)
        memF32[(this.D_em1p+(rid<<2))>>2]=this.cet.avgm1v[0][1];
      if (m1==0)
        memF32[(this.D_em2p+(rid<<2))>>2]=this.cet.avgm2v[0][0];
      else if (m1==1)
        memF32[(this.D_em2p+(rid<<2))>>2]=this.cet.avgm2v[0][1];
    }

    this.kldivo=this.calcKLDIV();
    var tsxd=0;
    var tit=0;


    for (var iter=1;iter<numpats;iter++){
      this.sample=this.sampleDraw(this.samplesize,this.tabsize);
      tsxd+=this.sXd();
      tit+=this.iterative_scaling();
    }
    console.log("sXd total time(ms):"+tsxd);
    console.log("iterative scaling total time(ms):"+tit);
    this.explain_t1=get_time_ms();
    this.prepSummary();
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
  this.iterative_scaling = function(){
    var t0=get_time_ms();
    var not_converged=1;
    var sumlm1;
    var sumlm2;
    var doitagain=1;

    //console.log("pid0.ests:"+this.lambda2est(this.cet.lambdam1v[0][0])+","+
    //  this.lambda2est(this.cet.lambdam1v[0][1])+","+
    //  this.lambda2est(this.cet.lambdam2v[0][0])+","+
    //  this.lambda2est(this.cet.lambdam2v[0][1])+"] counts:["+
    //  this.cet.countm1v[0][0]+","+
    //  this.cet.countm1v[0][1]+","+
    //  this.cet.countm2v[0][0]+","+
    //  this.cet.countm2v[0][1]+"]"); 
    //console.log("pid1.ests:"+this.lambda2est(this.cet.lambdam1v[1][0])+","+
    //  this.lambda2est(this.cet.lambdam1v[1][1])+","+
    //  this.lambda2est(this.cet.lambdam2v[1][0])+","+
    //  this.lambda2est(this.cet.lambdam2v[1][1])+"] counts:["+
    //  this.cet.countm1v[1][0]+","+
    //  this.cet.countm1v[1][1]+","+
    //  this.cet.countm2v[1][0]+","+
    //  this.cet.countm2v[1][1]+"]"); 

    //var infloop=250;
    while(doitagain){
      //if(!infloop--) { console.log("infloop:"+infloop);break;}
      doitagain=0;
      for (var rid=0; rid<this.tabsize; rid++){
        sumlm1=0;
        sumlm2=0;

        var m1=mem32[(this.m1col + (rid<<2))>>2];
        var m2=mem32[(this.m2col + (rid<<2))>>2];

        for (var pid=0; pid<this.cet.patscount; pid++){
          if (this.match(rid,pid)){
            if (m2==0)
              sumlm1+=this.cet.lambdam1v[pid][0];
            else if (m2==1)
              sumlm1+=this.cet.lambdam1v[pid][1];
            if (m1==0)
              sumlm2+=this.cet.lambdam2v[pid][0];
            else if (m1==1)
              sumlm2+=this.cet.lambdam2v[pid][1];
          }
        }

        memF32[(this.D_em1p+(rid<<2))>>2]=Math.pow(2, sumlm1)/(Math.pow(2, sumlm1)+1);
        memF32[(this.D_em2p+(rid<<2))>>2]=Math.pow(2, sumlm2)/(Math.pow(2, sumlm2)+1);
      }

      for (var pid=0; pid<this.cet.patscount;pid++){
        this.cet.sumem1v[pid][0]=0;
        this.cet.sumem1v[pid][1]=0;
        this.cet.sumem2v[pid][0]=0;
        this.cet.sumem2v[pid][1]=0;
      }

      for (var rid=0; rid<this.tabsize; rid++){
        var m1=mem32[(this.m1col + (rid<<2))>>2];
        var m2=mem32[(this.m2col + (rid<<2))>>2];
        for (var pid=0; pid<this.cet.patscount;pid++){
          if (this.match(rid,pid)){
            if (m2==0)
              this.cet.sumem1v[pid][0]+=memF32[(this.D_em1p+(rid<<2))>>2];
            else if (m2==1)
              this.cet.sumem1v[pid][1]+=memF32[(this.D_em1p+(rid<<2))>>2];
            if (m1==0)
              this.cet.sumem2v[pid][0]+=memF32[(this.D_em2p+(rid<<2))>>2];
            else if (m1==1)
              this.cet.sumem2v[pid][1]+=memF32[(this.D_em2p+(rid<<2))>>2];
          }
        }
      }
      for (var pid=0; pid<this.cet.patscount;pid++){
        var oldlambdam1v0=this.cet.lambdam1v[pid][0];
        var oldlambdam1v1=this.cet.lambdam1v[pid][1];
        var oldlambdam2v0=this.cet.lambdam2v[pid][0];
        var oldlambdam2v1=this.cet.lambdam2v[pid][1];

        this.cet.avgem1v[pid][0]=this.cet.sumem1v[pid][0]/this.cet.countm1v[pid][0];
        this.cet.avgem1v[pid][1]=this.cet.sumem1v[pid][1]/this.cet.countm1v[pid][1];
        this.cet.avgem2v[pid][0]=this.cet.sumem2v[pid][0]/this.cet.countm2v[pid][0];
        this.cet.avgem2v[pid][1]=this.cet.sumem2v[pid][1]/this.cet.countm2v[pid][1];

        //console.log("======doitagain:========="+doitagain);

        var tmpbt;
        tmpbt=this.breakthresh(this.cet.avgm1v[pid][0],this.cet.avgem1v[pid][0],this.cet.countm1v[pid][0]);
        if(tmpbt){
          var newlambdam1v0=this.updateLambda(this.cet.avgm1v[pid][0], this.cet.avgem1v[pid][0],this.cet.lambdam1v[pid][0]);
          this.cet.lambdam1v[pid][0]=newlambdam1v0;
          doitagain=true;
        }

        tmpbt=this.breakthresh(this.cet.avgm1v[pid][1],this.cet.avgem1v[pid][1],this.cet.countm1v[pid][1]);
        if(tmpbt){
          var newlambdam1v1=this.updateLambda(this.cet.avgm1v[pid][1], this.cet.avgem1v[pid][1],this.cet.lambdam1v[pid][1]);
          this.cet.lambdam1v[pid][1]=newlambdam1v1;
          doitagain=true;
        }

        //tmpbt=this.breakthresh(this.cet.avgm2v[pid][0],this.cet.avgem2v[pid][0],this.cet.countm2v[pid][0]);
        //if(tmpbt){
        //  var newlambdam2v0=this.updateLambda(this.cet.avgm2v[pid][0], this.cet.avgem2v[pid][0],this.cet.lambdam2v[pid][0]);
        //  this.cet.lambdam2v[pid][0]=newlambdam2v0;
        //  doitagain=true;
        //}
        //tmpbt=this.breakthresh(this.cet.avgm2v[pid][1],this.cet.avgem2v[pid][1],this.cet.countm2v[pid][1]);
        //if(tmpbt){
        //  var newlambdam2v1=this.updateLambda(this.cet.avgm2v[pid][1], this.cet.avgem2v[pid][1],this.cet.lambdam2v[pid][1]);
        //  this.cet.lambdam2v[pid][1]=newlambdam2v1;
        //  doitagain=true;
        //}
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
    var kldivm1=0;
    var kldivm2=0;
    var e1,e2;
    for (var rid=0; rid<this.tabsize; rid++){
      var m1=mem32[(this.m1col + (rid<<2))>>2];
      var m2=mem32[(this.m2col + (rid<<2))>>2];
      var e1=memF32[(this.D_em1p+(rid<<2))>>2];
      var e2=memF32[(this.D_em2p+(rid<<2))>>2];

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
    }
    return {m1:kldivm1, m2:kldivm2};
  }
  this.calcMultiKLDIV = function(){
    console.log("@calcMultiKLDIV");
    var patscount_org=this.cet.patscount;
    var kldivs=[];
    var infogains=[];
    while (this.cet.patscount){
      this.iterative_scaling();
      var kldivcur=this.calcKLDIV();
      kldivs.push(kldivcur);
      infogains.push({m1:(this.kldivo.m1-kldivcur.m1), m2:(this.kldivo.m2-kldivcur.m2)});
      this.cet.patscount--;
    }
    this.cet.patscount=patscount_org;
    return {kldivs:kldivs.reverse(), infogains:infogains.reverse()};
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
      mem32[(this.ps_freqsv0v0+(i<<2))>>2]=0;
      mem32[(this.ps_freqsv0v1+(i<<2))>>2]=0;
      mem32[(this.ps_freqsv1v0+(i<<2))>>2]=0;
      mem32[(this.ps_freqsv1v1+(i<<2))>>2]=0;

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
    var tmpm1,tmpm2,tmpem1,tmpem2,tmpanc,curranc;
    var shade=0;
    var powit=0;
    for (var rid=0; rid<this.tabsize; rid++){
      for (var sid=0;sid<this.samplesize;sid++){
        tmpm1=mem32[(this.m1col + (rid<<2))>>2]
        tmpm2=mem32[(this.m2col + (rid<<2))>>2]

        tmpem1=memF32[(this.D_em1p+(rid<<2))>>2];
        tmpem2=memF32[(this.D_em2p+(rid<<2))>>2]; 
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


          if((tmpm1==0)&(tmpm2==0))
            mem32[(this.ps_freqsv0v0 + (patid<<2))>>2]=mem32[(this.ps_freqsv0v0 + (patid<<2))>>2]+1;
          else if((tmpm1==0)&(tmpm2==1)) 
            mem32[(this.ps_freqsv0v1 + (patid<<2))>>2]=mem32[(this.ps_freqsv0v1 + (patid<<2))>>2]+1;
          else if((tmpm1==1)&(tmpm2==0)) 
            mem32[(this.ps_freqsv1v0 + (patid<<2))>>2]=mem32[(this.ps_freqsv1v0 + (patid<<2))>>2]+1;
          else if((tmpm1==1)&(tmpm2==1)) 
            mem32[(this.ps_freqsv1v1 + (patid<<2))>>2]=mem32[(this.ps_freqsv1v1 + (patid<<2))>>2]+1;

          if(tmpm2==0)
            mem32[(this.ps_countm1v0p + (patid<<2))>>2]=mem32[(this.ps_countm1v0p + (patid<<2))>>2]+1;
          else if(tmpm2==1)
            mem32[(this.ps_countm1v1p + (patid<<2))>>2]=mem32[(this.ps_countm1v1p + (patid<<2))>>2]+1;
          if(tmpm1==0)
            mem32[(this.ps_countm2v0p + (patid<<2))>>2]=mem32[(this.ps_countm2v0p + (patid<<2))>>2]+1;
          else if(tmpm1==1)
            mem32[(this.ps_countm2v1p + (patid<<2))>>2]=mem32[(this.ps_countm2v1p + (patid<<2))>>2]+1;

          if(tmpm2==0)
            memF32[(this.ps_summ1v0p + (patid<<2))>>2]=memF32[(this.ps_summ1v0p + (patid<<2))>>2]+tmpm1;
          else if(tmpm2==1)
            memF32[(this.ps_summ1v1p + (patid<<2))>>2]=memF32[(this.ps_summ1v1p + (patid<<2))>>2]+tmpm1;
          if(tmpm1==0)
            memF32[(this.ps_summ2v0p + (patid<<2))>>2]=memF32[(this.ps_summ2v0p + (patid<<2))>>2]+tmpm2;
          else if(tmpm1==1)
            memF32[(this.ps_summ2v1p + (patid<<2))>>2]=memF32[(this.ps_summ2v1p + (patid<<2))>>2]+tmpm2;
 
          if(tmpm2==0){
            memF32[(this.ps_sumem1v0p + (patid<<2))>>2]=memF32[(this.ps_sumem1v0p + (patid<<2))>>2]+tmpem1;
          }
          else if(tmpm2==1){
            memF32[(this.ps_sumem1v1p + (patid<<2))>>2]=memF32[(this.ps_sumem1v1p + (patid<<2))>>2]+tmpem1;
          }
          if(tmpm1==0)
            memF32[(this.ps_sumem2v0p + (patid<<2))>>2]=memF32[(this.ps_sumem2v0p + (patid<<2))>>2]+tmpem2;
          else if(tmpm1==1)
            memF32[(this.ps_sumem2v1p + (patid<<2))>>2]=memF32[(this.ps_sumem2v1p + (patid<<2))>>2]+tmpem2;
        }
      }
    }

    var maxgain=0;
    var maxpat;
    for (var pid=0;pid<this.sofpofs;pid++){

      var countm1v0=mem32[(this.ps_countm1v0p + (pid<<2))>>2];
      var countm1v1=mem32[(this.ps_countm1v1p + (pid<<2))>>2];
      var countm2v0=mem32[(this.ps_countm2v0p + (pid<<2))>>2];
      var countm2v1=mem32[(this.ps_countm2v1p + (pid<<2))>>2];

      var avgm1v0=memF32[(this.ps_summ1v0p + (pid<<2))>>2]/countm1v0;
      var avgm1v1=memF32[(this.ps_summ1v1p + (pid<<2))>>2]/countm1v1;
      var avgm2v0=memF32[(this.ps_summ2v0p + (pid<<2))>>2]/countm2v0;
      var avgm2v1=memF32[(this.ps_summ2v1p + (pid<<2))>>2]/countm2v1;


      var avgem1v0=memF32[(this.ps_sumem1v0p + (pid<<2))>>2]/countm1v0;
      var avgem1v1=memF32[(this.ps_sumem1v1p + (pid<<2))>>2]/countm1v1;
      var avgem2v0=memF32[(this.ps_sumem2v0p + (pid<<2))>>2]/countm2v0;
      var avgem2v1=memF32[(this.ps_sumem2v1p + (pid<<2))>>2]/countm2v1;

      var gain_m1v0;
      var gain_m1v1;
      var gain_m2v0;
      var gain_m2v1;
      
      if (countm1v0==0) gain_m1v0=0;
      else if (avgm1v0==1) gain_m1v0= countm1v0*Math.log2(1/avgem1v0);
      else if (avgm1v0==0) gain_m1v0= countm1v0 * ((1-avgm1v0)*(Math.log2((1-avgm1v0)/(1-avgem1v0))));
      else gain_m1v0= countm1v0 * ((avgm1v0*Math.log2(avgm1v0/avgem1v0) ) + ((1-avgm1v0)*(Math.log2((1-avgm1v0)/(1-avgem1v0)))));

      if (countm1v1==0) gain_m1v1=0;
      else if (avgm1v1==1) gain_m1v1= countm1v1*Math.log2(1/avgem1v1);
      else if (avgm1v1==0) gain_m1v1= countm1v1 * ((1-avgm1v1)*(Math.log2((1-avgm1v1)/(1-avgem1v1))));
      else gain_m1v1= countm1v1 * ((avgm1v1*Math.log2(avgm1v1/avgem1v1) ) + ((1-avgm1v1)*(Math.log2((1-avgm1v1)/(1-avgem1v1)))));

      if (countm2v0==0) gain_m2v0=0;
      else if (avgm2v0==1) gain_m2v0= countm2v0*Math.log2(1/avgem2v0);
      else if (avgm2v0==0) gain_m2v0= countm2v0 * ((1-avgm2v0)*(Math.log2((1-avgm2v0)/(1-avgem2v0))));
      else gain_m2v0= countm2v0 * ((avgm2v0*Math.log2(avgm2v0/avgem2v0) ) + ((1-avgm2v0)*(Math.log2((1-avgm2v0)/(1-avgem2v0)))));

      if (countm2v1==0) gain_m2v1=0;
      else if (avgm2v1==1) gain_m2v1= countm2v1*Math.log2(1/avgem2v1);
      else if (avgm2v1==0) gain_m2v1= countm2v1 * ((1-avgm2v1)*(Math.log2((1-avgm2v1)/(1-avgem2v1))));
      else gain_m2v1= countm2v1 * ((avgm2v1*Math.log2(avgm2v1/avgem2v1) ) + ((1-avgm2v1)*(Math.log2((1-avgm2v1)/(1-avgem2v1)))));

      //var gain= gain_m1v0+gain_m1v1+gain_m2v0+gain_m2v1;
      var gain= gain_m1v0+gain_m1v1;//+gain_m2v0+gain_m2v1;

      if(isNaN(gain)) crashme3++;

      if (gain>maxgain){
        //console.log("avgm1v0:"+avgm1v0+" avgem1v0:"+avgem1v0+" countm1v0:"+countm1v0);
        //console.log("@pid:"+pid+" gain:"+gain+" gain_m1v0:"+gain_m1v0+" gain_m1v1:"+gain_m1v1+" gain_m2v0:"+gain_m2v0+" gain_m2v1:"+gain_m2v1+" maxgain:"+maxgain);
        maxgain=gain;
        maxpat=pid;
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
    var maxfreqsv0v0=mem32[(this.ps_freqsv0v0 + (maxpat<<2))>>2];
    var maxfreqsv0v1=mem32[(this.ps_freqsv0v1 + (maxpat<<2))>>2];
    var maxfreqsv1v0=mem32[(this.ps_freqsv1v0 + (maxpat<<2))>>2];
    var maxfreqsv1v1=mem32[(this.ps_freqsv1v1 + (maxpat<<2))>>2];

    var maxcountm1v0=mem32[(this.ps_countm1v0p + (maxpat<<2))>>2];
    var maxcountm1v1=mem32[(this.ps_countm1v1p + (maxpat<<2))>>2];
    var maxcountm2v0=mem32[(this.ps_countm2v0p + (maxpat<<2))>>2];
    var maxcountm2v1=mem32[(this.ps_countm2v1p + (maxpat<<2))>>2];

    var maxavgm1v0=memF32[(this.ps_summ1v0p + (maxpat<<2))>>2]/maxcountm1v0;
    var maxavgm1v1=memF32[(this.ps_summ1v1p + (maxpat<<2))>>2]/maxcountm1v1;
    var maxavgm2v0=memF32[(this.ps_summ2v0p + (maxpat<<2))>>2]/maxcountm2v0;
    var maxavgm2v1=memF32[(this.ps_summ2v1p + (maxpat<<2))>>2]/maxcountm2v1;

    var maxavgem1v0=memF32[(this.ps_sumem1v0p + (maxpat<<2))>>2]/maxcountm1v0;
    var maxavgem1v1=memF32[(this.ps_sumem1v1p + (maxpat<<2))>>2]/maxcountm1v1;
    var maxavgem2v0=memF32[(this.ps_sumem2v0p + (maxpat<<2))>>2]/maxcountm2v0;
    var maxavgem2v1=memF32[(this.ps_sumem2v1p + (maxpat<<2))>>2]/maxcountm2v1;

    var maxlambdam1v0=0;
    var maxlambdam1v1=0;
    var maxlambdam2v0=0;
    var maxlambdam2v1=0;

    if (maxavgm1v0==0) maxlambdam1v0=-lilinf;
    else if (maxavgm1v0==1) maxlambdam1v0=lilinf;
    else maxlambdam1v0=Math.log2(maxavgm1v0/maxavgem1v0);
    //console.log("maxlambda1v0:"+maxlambdam1v0+" maxavgm1v0:"+maxavgm1v0+" maxavgem1v0:"+maxavgem1v0);
    
    if (maxavgm1v1==0) maxlambdam1v1=-lilinf;
    else if (maxavgm1v1==1) maxlambdam1v1=lilinf;
    else maxlambdam1v1=Math.log2(maxavgm1v1/maxavgem1v1);

    if (maxavgm2v0==0) maxlambdam2v0=-lilinf;
    else if (maxavgm2v0==1) maxlambdam2v0=lilinf;
    else maxlambdam2v0=Math.log2(maxavgm2v0/maxavgem2v0);

    if (maxavgm2v1==0) maxlambdam2v1=-lilinf;
    else if (maxavgm2v1==1) maxlambdam2v1=lilinf;
    else maxlambdam2v1=Math.log2(maxavgm2v1/maxavgem2v1);
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    this.cet.freqsv0v0.push(maxfreqsv0v0);
    this.cet.freqsv0v1.push(maxfreqsv0v1);
    this.cet.freqsv1v0.push(maxfreqsv1v0);
    this.cet.freqsv1v1.push(maxfreqsv1v1);

    this.cet.countm1v.push([]);
    this.cet.countm2v.push([]);
    this.cet.summ1v.push([]);
    this.cet.summ2v.push([]);
    this.cet.sumem1v.push([]);
    this.cet.sumem2v.push([]);
    this.cet.avgm1v.push([]);
    this.cet.avgm2v.push([]);
    this.cet.avgem1v.push([]);
    this.cet.avgem2v.push([]);
    this.cet.lambdam1v.push([]);
    this.cet.lambdam2v.push([]);
    var pi=this.cet.patscount-1;
    this.cet.countm1v[pi][0]=maxcountm1v0;
    this.cet.countm1v[pi][1]=maxcountm1v1;
    this.cet.countm2v[pi][0]=maxcountm2v0;
    this.cet.countm2v[pi][1]=maxcountm2v1;

    this.cet.summ1v[pi][0]=memF32[(this.ps_summ1v0p + (maxpat<<2))>>2];
    this.cet.summ1v[pi][1]=memF32[(this.ps_summ1v1p + (maxpat<<2))>>2];
    this.cet.summ2v[pi][0]=memF32[(this.ps_summ2v0p + (maxpat<<2))>>2];
    this.cet.summ2v[pi][1]=memF32[(this.ps_summ2v1p + (maxpat<<2))>>2];

    this.cet.avgm1v[pi][0]=maxavgm1v0;
    this.cet.avgm1v[pi][1]=maxavgm1v1;
    this.cet.avgm2v[pi][0]=maxavgm2v0;
    this.cet.avgm2v[pi][1]=maxavgm2v1;

    this.cet.lambdam1v[pi][0]=maxlambdam1v0;
    this.cet.lambdam1v[pi][1]=maxlambdam1v1;
    this.cet.lambdam2v[pi][0]=maxlambdam2v0;
    this.cet.lambdam2v[pi][1]=maxlambdam2v1;
//-==-=-=-=-=-=-=-=-=-=-=-=-=-
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
    return this.tableSummaryOBJ;
  }
  this.prepSummary=function (){
    var infos=this.infos=this.calcMultiKLDIV();
    this.kldivf=infos.kldivs[infos.kldivs.length-1];
    this.infogainf=infos.infogains[infos.kldivs.length-1];
    var pats=[];
    for (var pid=0;pid<this.numpats;pid++){
      var newpat={ cols:[],
                   support:-1,
                   pearson:-1 };
      var pearsonQ=abdb.select().from(this.tab.name).field(_variance(att1),_variance(att2),_covariance(att1,att2));
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          newpat.cols.push('*');
        else {
          newpat.cols.push(strToString(mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2]));
          pearsonQ.where(_eq(this.colNs[cid],strToString(mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2])));
        }
      }
      var qval=pearsonQ.toArray2();
      this.cet.pearson.push(calcPearson(qval[0],qval[1],qval[2]));

      newpat.estm1v0= this.lambda2est(this.cet.lambdam1v[pid][0]);
      newpat.estm1v1= this.lambda2est(this.cet.lambdam1v[pid][1]);
      newpat.estm2v0= this.lambda2est(this.cet.lambdam2v[pid][0]);
      newpat.estm2v1= this.lambda2est(this.cet.lambdam2v[pid][1]);
      newpat.pearson= this.cet.pearson[pid];
      newpat.count1v0= this.cet.countm1v[pid][0];
      newpat.count1v1= this.cet.countm1v[pid][1];
      newpat.count2v0= this.cet.countm2v[pid][0];
      newpat.count2v1= this.cet.countm2v[pid][1];
      newpat.freqsv0v0=this.cet.freqsv0v0[pid];
      newpat.freqsv0v1=this.cet.freqsv0v1[pid];
      newpat.freqsv1v0=this.cet.freqsv1v0[pid];
      newpat.freqsv1v1=this.cet.freqsv1v1[pid];
      newpat.support=newpat.freqsv0v0+ newpat.freqsv0v1 + newpat.freqsv1v0 + newpat.freqsv1v1;
      pats.push(newpat);
    }
    this.tableSummaryOBJ= {  kldivf:this.kldivf,
              infogain:this.infogainf,
              infos:infos,
              pats:pats,
              explaintime: (this.explain_t1-this.explain_t0) };

  }
  this.printCETstr=function(){
    var cetstr="";
    for (var pid=0;pid<this.numpats;pid++){
      var patstr="pid:"+pid+"::,";
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          patstr+= '*,';
        else 
          patstr+=strToString(mem32[(this.cet.patsp+(((pid*this.numatts)+cid)<<2))>>2]) + ',';
      }
      patstr+=",, avg:["+
      this.cet.avgm1v[pid][0]+","+
      this.cet.avgm1v[pid][1]+","+
      this.cet.avgm2v[pid][0]+","+
      this.cet.avgm2v[pid][1]+"] est:[" + 
      this.lambda2est(this.cet.lambdam1v[pid][0])+","+
      this.lambda2est(this.cet.lambdam1v[pid][1])+","+
      this.lambda2est(this.cet.lambdam2v[pid][0])+","+
      this.lambda2est(this.cet.lambdam2v[pid][1])+"] counts:["+
      this.cet.countm1v[pid][0]+","+
      this.cet.countm1v[pid][1]+","+
      this.cet.countm2v[pid][0]+","+
      this.cet.countm2v[pid][1]+"] pearson:"+
      this.cet.pearson[pid];

      patstr+="kldiv final m1:"+this.kldivf.m1.toFixed(2)+ " m2:"+this.kldivf.m2.toFixed(2);
      patstr+=" infogainm1:"+(this.infogainf.m1).toFixed(2);
      patstr+=" infogainm2:"+(this.infogainf.m2).toFixed(2)+"\n";
      cetstr+=patstr;
    }
    return cetstr;
  }
  this.printCET=function(){
    console.log(this.printCETstr());
  }
  //Constructor:
  console.log('debug:'+ "correlation table:(tabname="+tabname+
                                         ", numpats="+numpats+
                                         ", samplesize="+samplesize+
                                         ", att1="+att1+
                                         ", att2="+att2+")" );
  this.getColNsPs();
}
//
function bench_correlationp1_dir(tabname,summaryrows,samplesize){
  var detlog="tabname,summaryrows,samplesize\n";
  detlog+=tabname+","+summaryrows+","+samplesize+"\n\n";
  var tableslog="";
  var runtimes=[];
  var kldivfs=[];
  var infogains=[];
  var infoss=[];
  tt1=get_time_ms(); 
  for (var c=0;c<5;c++){
    var cet = new correlationTablep1_dir(tabname,summaryrows,samplesize,'p1','p2');
    cet.explain(); 
    tableslog+=cet.printCETstr()+"\n\n";
    var ceto=glob=cet.toOBJ();
    runtimes.push(ceto.explaintime);
    kldivfs.push(ceto.kldivf);
    infogains.push(ceto.infogain);
    infoss.push(ceto.infos);
  }
  tt2=get_time_ms();
  console.log('benchmark total time (ms)'+(tt2-tt1));
  console.log('benchmark tabname:'+ tabname);
  console.log('benchmark summaryrows:'+ summaryrows);
  console.log('benchmark samplesize:'+ samplesize);
  console.log('runtimes:'+runtimes);

  detlog+="runtimes:,"+runtimes+"\n";
  detlog+="kldivfs(m1):,";
  kldivfs.forEach((x)=>{detlog+=x.m1+","});
  detlog+="\n";
  detlog+="infogains(m1):,";
  infogains.forEach((x)=>{detlog+=x.m1+","});
  detlog+="\n";
  detlog+="kldivfs(m2):,";
  kldivfs.forEach((x)=>{detlog+=x.m2+","});
  detlog+="\n";
  detlog+="infogains(m2):,";
  infogains.forEach((x)=>{detlog+=x.m2+","});
  detlog+="\n";
  detlog+="\nper pattern kldivfs(m1):\n";
  for (var i=0;i<summaryrows;i++){
    detlog+="pat"+(i+1)+",";
    infoss.forEach((x)=>{detlog+=x.kldivs[i].m1+","});
    detlog+="\n";
  }
  detlog+="\nper pattern infogains(m1):\n";
  for (var i=0;i<summaryrows;i++){
    detlog+="pat"+(i+1)+",";
    infoss.forEach((x)=>{detlog+=x.infogains[i].m1+","});
    detlog+="\n";
  }
  detlog+="\nper pattern kldivfs(m2):\n";
  for (var i=0;i<summaryrows;i++){
    detlog+="pat"+(i+1)+",";
    infoss.forEach((x)=>{detlog+=x.kldivs[i].m2+","});
    detlog+="\n";
  }
  detlog+="\nper pattern infogains(m2):\n";
  for (var i=0;i<summaryrows;i++){
    detlog+="pat"+(i+1)+",";
    infoss.forEach((x)=>{detlog+=x.infogains[i].m2+","});
    detlog+="\n";
  }
  console.log("@bench_correlationp1:"+detlog);
  detlog+="\n\n";
  detlog+=tableslog;
  return detlog;
}
function bench_correlationp1_dirs(tabnames,summaryrows,samplesizes){
  console.log("@bench_correlationp1s:")
  var results_str="";
  for (var i=0;i<tabnames.length;i++){
    for (var ii=0;ii<samplesizes.length;ii++){
      results_str+=bench_correlationp1_dir(tabnames[i],summaryrows,samplesizes[ii]);
    }
  }
  downloadResultsFile(results_str, "results."+Date.now()+".csv");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){                              
  console.log('exporting explanation');       
  module.exports=dataSource;  
}else delete module;                     
//////////////////////////////////////////////////////////////////////////////
