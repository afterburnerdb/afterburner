//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function explanationTablep2(tabname, numpats, samplesize, binatt){
if (typeof numpats == undefined)
  numpats=10;
if (typeof samplesize == undefined)
  samplesize=16;
if (typeof binatt == undefined)
  binatt="p";
  this.tabname=tabname;
  this.tab=daSchema.getTable(tabname);
  this.numatts;
  this.numpats=numpats;
  this.two2d; 
  this.samplesize=samplesize;
  this.sofpofs=this.samplesize*this.two2d;
  this.colNs=[]; 
  this.colPs=[];
  this.pcol=-1.32;
  this.binatt=binatt;
  this.sample;
  this.et={ patsp:0,
            patscount:0,
            lambdas:[],
            sumq:[],
            p:[],
            q:[],
            count:[] };
  this.kldivo=0;
  this.kldivf=-1;
  this.et;
  lilinf=20;
  this.D_ep;
  this.ps_sumpp;
  this.ps_sumqp;
  this.ps_countp;
  this.tabsize=this.tab.numrows;
  this.thresh=1+(this.tabsize/5000);
  //
  this.explain = function(){
  ABi.dropTable('et');
  ABi.createTable('et')
     .addCol('origin',2)
     .addCol('dest',2)
     .addCol('fldate',2)
     .addCol('flday',2)
     .addCol('fltime',2)
     .addCol('status',2)
     .addCol('plane',2)
     .addCol('bookclass',2)
     .addCol('count',0)
     .addCol('p',1)
     .addCol('lambda',1)
     .addCol('q',1)
     .addCol('sumq',1)
     .addCol('breakthresh',1);
    var init_count=this.tabsize;
    var init_avgp=ABi.select().from(this.tab.name).field(_avg(binatt)).eval();
    var init_lambda=Math.log2(init_avgp/(1-init_avgp));
    var init_avgq=init_avgp;
    var init_sumq=init_avgp*this.tabsize;
    ABi.insert('et')
       .values([_null(),_null(),_null(),_null(),_null(),_null(),_null(),_null(),
               init_count,
               init_avgp,
               init_lambda,
               init_avgq,
               init_sumq]);

    this.et.patsp=malloc((this.numatts*this.numpats)<<2);

    for(var i=0;i<this.numatts*this.numpats;i++)
      mem32[(this.et.patsp + (i<<2))>>2]=-666;
    this.et.patscount=1;
    this.et.count.push(this.tabsize);
    this.et.p.push(ABi.select().from(this.tab.name).field(_avg(binatt)).eval());
    this.et.lambdas.push(Math.log2(this.et.p[0]/(1-this.et.p[0])));
    this.et.q.push(this.et.p[0]);
    this.et.sumq.push(this.et.q[0]*this.et.count[0]);

    this.ps_sumpp=malloc(this.sofpofs<<2);
    this.ps_sumqp=malloc(this.sofpofs<<2);
    this.ps_countp=malloc(this.sofpofs<<2);

    this.D_ep=ABi.alterTable('upgrade').addColIfNotExists('q',1);
    
    for (var i=0;i<this.tabsize;i++)
      memF32[(this.D_ep+(i<<2))>>2]=this.et.p[0];
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
    var suml;
    var doitagain=1;
    var inf=0;
    while(doitagain&&(inf++<25)){
      doitagain=0;
      //ABi.select()
      //   .from('upgrade')
      //   .field(udf_update_estimates('origin','dest','flday','fltime','status','plane','bookclass'));
      //this.udf_update_estimates=function('origin','dest','flday','fltime','status','plane','bookclass')
      var suml;
      ABi.select()
         .from('upgrade')
         .field(_udf(
                  suml=_decvar(_float()),
                  _assign(suml,0),
                  _reftab('et'),
                  _loop('et',
                    _if(_and(
                          _or(_isnull('et.origin'),   _eq('upgrade.origin','et.origin')),
                          _or(_isnull('et.dest'),     _eq('upgrade.dest','et.dest')),
                          _or(_isnull('et.flday'),    _eq('upgrade.flday','et.flday')),
                          _or(_isnull('et.fldate'),   _eq('upgrade.fldate','et.fldate')),
                          _or(_isnull('et.fltime'),   _eq('upgrade.fltime','et.fltime')),
                          _or(_isnull('et.status'),   _eq('upgrade.status','et.status')),
                          _or(_isnull('et.plane'),    _eq('upgrade.plane','et.plane')),
                          _or(_isnull('et.bookclass'),_eq('upgrade.bookclass','et.bookclass'))),
                      _assign(suml,_add(suml,'lambda')))),
                    _assign('upgrade.q',_div(_pow(2,suml),_add(_pow(2,suml),1)))
                    ))
         .eval();
      //for (var rid=0; rid<this.tabsize; rid++){
      //  suml=0;
      //  for (var pid=0; pid<this.et.patscount; pid++){
      //    if (this.match(rid,pid))
      //      suml+=this.et.lambdas[pid];
      //  }
      //  memF32[(this.D_ep+(rid<<2))>>2]=Math.pow(2, suml)/(Math.pow(2, suml)+1);
      //}

      ABi.select()
         .from('et')
         .field(_udf(_assign('et.sumq',0))) 
         .eval();
      //for (var pid=0; pid<this.et.patscount;pid++){
      //  this.et.sumq[pid]=0;
      //}

      ABi.select()
         .from('upgrade')
         .field(_udf(
                  _reftab('et'),
                  _loop('et',
                    _if(_and(
                          _or(_isnull('et.origin'),   _eq('upgrade.origin','et.origin')),
                          _or(_isnull('et.dest'),     _eq('upgrade.dest','et.dest')),
                          _or(_isnull('et.flday'),    _eq('upgrade.flday','et.flday')),
                          _or(_isnull('et.fltime'),   _eq('upgrade.fltime','et.fltime')),
                          _or(_isnull('et.status'),   _eq('upgrade.status','et.status')),
                          _or(_isnull('et.plane'),    _eq('upgrade.plane','et.plane')),
                          _or(_isnull('et.bookclass'),_eq('upgrade.bookclass','et.bookclass'))),
                      _assign('et.sumq',_add('et.sumq','upgrade.q')))),
                    ))
         .eval();
      //
      //for (var rid=0; rid<this.tabsize; rid++){
      //  for (var pid=0; pid<this.et.patscount;pid++){
      //    if (this.match(rid,pid)){
      //      this.et.sumq[pid]+=memF32[(this.D_ep+(rid<<2))>>2];
      //    }
      //  }
      //}
      
      var diff;
      doitagain=ABi.select()
         .from('et')
         .field(_udf(
                  diff=_decvar(),
                  _assign('q',_div('sumq','count')),
                  _ifelse(_eq('p','q'),
                    _assign(diff,0),
                    _ifelse(_and(_eq('p',0),_eq('q',1)),
                      _assign(diff,_mul('count',lilinf)),
                      _ifelse(_eq('p',0),
                        _assign(diff,_mul('count',_log2(_div(1,_sub(1,'q'))))),
                        _ifelse(_and(_eq('p',1),_eq('q',0)),
                          _assign(diff,_mul('count',lilinf)),
                          _ifelse(_eq('p',1),
                            _assign(diff,_mul('count',_log2(_div(1,'q')))),
                            _ifelse(_eq('q',0),
                              _assign(diff,_add(_mul(_mul('count','p'),lilinf),_mul(_mul('count',_sub(1,'p')),_log2(_sub(1,'p'))))),
                              _ifelse(_eq('q',0),
                                _assign(diff,_add(_mul(_mul('count','p'),_log2('p')),_mul(_mul('count',_sub(1,'p')),lilinf))),
                                _assign(diff,_add(_mul(_mul('count','p'),_log2(_div('p','q'))) , _mul(_mul('count',_sub(1,'p')),_log2(_div(_sub(1,'p'),_sub(1,'q'))))))


                  ))))))),
                  _if(_gte(diff,this.thresh), 
                      _ifelse(_or(_eq('p',0),_eq('q',1)),
                             _assign('lambda',_sub('lambda',lilinf)),
                             _ifelse(_or(_eq('p',1),_eq('q',0)),
                                    _assign('lambda',_add('lambda',lilinf)),
                                    _assign('lambda',_add(_add('lambda',_log2(_div('p','q'))),_log2(_div(_sub(1,'q'),_sub(1,'p')))))
                  ))),
                  //_ifelse(_gte(diff,this.thresh), _assign('breakthresh', 1), _assign('breakthresh', 0))
                  _assign('breakthresh',diff)
                  ),
                _countif('*',_gte('breakthresh',this.thresh)))
         .eval();
      //for (var pid=0; pid<this.et.patscount;pid++){
      //  this.et.q[pid]=this.et.sumq[pid]/this.et.count[pid];
      //  if (this.breakthresh(this.et.p[pid],this.et.q[pid],this.et.count[pid])){
      //    doitagain=true;
      //  } else continue;
      //  var newlambda=this.updateLambda(this.et.p[pid],this.et.q[pid],this.et.lambdas[pid]);
      //  this.et.lambdas[pid]=newlambda;
      //}
    }
    console.log("inf:"+inf)
    var t1=get_time_ms();
    return t1-t0;
  }
//  this.udf_update_estimates=function('origin','dest','flday','fltime','status','plane','bookclass'){
//    var suml=_decvar();
//    _assign(suml,0);
//    _loop('et',
//      _if(_and(
//            _and(_notNull('et.origin'),   _neq('upgrade.origin','et.origin')),
//            _and(_notNull('et.dest'),     _neq('upgrade.dest','et.dest')),
//            _and(_notNull('et.flday'),    _neq('upgrade.flday','et.flday')),
//            _and(_notNull('et.fltime'),   _neq('upgrade.fltime','et.fltime')),
//            _and(_notNull('et.status'),   _neq('upgrade.status','et.status')),
//            _and(_notNull('et.plane'),    _neq('upgrade.plane','et.plane')),
//            _and(_notNull('et.bookclass'),_neq('upgrade.bookclass','et.bookclass'))),
//        _assign(suml,_add(suml,'lambda')));
//      _assign('q',_div(_pow(2,suml),_add(_pow(2,suml),1)));
//  }
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
      var p=mem32[(this.pcol + (rid<<2))>>2];
      var q=memF32[(this.D_ep+(rid<<2))>>2];
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
    var t0=get_time_ms();
    for (var i=0; i<this.sofpofs;i++){
      memF32[(this.ps_sumpp + (i<<2))>>2]=0;
      memF32[(this.ps_sumqp + (i<<2))>>2]=0;
      mem32[(this.ps_countp + (i<<2))>>2]=0;
    }
    var tmpp,tmpq,tmpanc,curranc;
    var shade=0;
    var powit=0;
    for (var rid=0; rid<this.tabsize; rid++){
      for (var sid=0;sid<this.samplesize;sid++){
        tmpp=mem32[(this.pcol + (rid<<2))>>2]
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
          memF32[(this.ps_sumpp + (patid<<2))>>2]=memF32[(this.ps_sumpp + (patid<<2))>>2]+tmpp;
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
        mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+cid)<<2))>>2]=mem32[(this.colPs[cid]+(this.sample[sid]<<2))>>2];
      }
    //

    this.et.p.push(maxp);
    this.et.q.push(maxq);
    this.et.count.push(maxcount);
    this.et.lambdas.push(maxlambda);
    ABi.insert('et')
       .values([mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+0)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+1)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+2)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+3)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+4)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+5)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+6)<<2))>>2],
                mem32[(this.et.patsp+(((this.et.patscount*this.numatts)+7)<<2))>>2],
               maxcount,
               maxp,
               maxlambda,
               maxq,
               maxq*maxcount]);

    this.et.patscount++;
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
  this.printET=function(){
    var kldiv=this.calcKLDIV();
    this.kldivf=kldiv;
    console.log('debug:'+ 'printET:  kldiv:'+kldiv);
    console.log('debug:'+ 'kldiv droped from:' + this.kldivo + " to:" +kldiv + " infogain:"+(this.kldivo-kldiv))
    for (var pid=0;pid<this.numpats;pid++){
      var patstr="pid:"+pid+"::";
      for (var cid=0; cid<this.numatts; cid++){
        if (mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2] == -666)
          patstr+= '*,';
        else 
          patstr+=strToString(mem32[(this.et.patsp+(((pid*this.numatts)+cid)<<2))>>2]) + ',';
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
function bench_explainp2(tabname,summaryrows,samplesize){
  var runtimes=[];
  var kldivs=[];
  tt1=get_time_ms(); 
  for (var c=0;c<10;c++){
    var et = new explanationTablep2(tabname,summaryrows,samplesize,'p');
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
