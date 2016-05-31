//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var uniqueVarCounter=0;

function Afterburner(){
  this.select = function(param){
    uniqueVarCounter=0;
    this.fromA=[];
    this.joinA=[];
    this.onA=[];
    this.joinP='';
    this.attsA=[];
    this.fstr=[];
    this.aggsA=[];
    this.whereA=[];
    this.groupA=[];
    this.orderA=[];
    this.limitA=-1;
    this.resA=[];
    return this;
  }
//////////////////////////////////////////////////////////////////////////////
//API
  this.from = function(param){
    this.fromA.push(param);
    return this;
  }
  this.join = function(param){
    this.joinA.push(param);
    return this;
  }
  this.on = function(param1, param2){
    this.onA.push(param1);
    this.onA.push(param2);
    this.joinP=eq(param1,param2);
    return this;
  }
  this.field = function(param, ...rest){
    if (boundAtt=daSchema.bindCol(param)){
      type= daSchema.getColTypeByName(param);
      this.attsA.push(param);
      if (daSchema.getColTypeByName(param)!==1)
        this.fstr.push(`exec:mem32[(temps+(tempsptr<<2))>>2]=`+daSchema.bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::
  postexek:mem32[(temps+(tempsptr<<2))>>2]=`+daSchema.bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::`);
      else 
        this.fstr.push(`exec:memF32[(temps+(tempsptr<<2))>>2]=`+daSchema.bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=`+daSchema.bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::`);

      this.resA.push("res.addCol2('"+param+"',"+type+");");
    } else {
      this.resA.push(extractfrom(param,'post'));
      this.aggsA.push(param);
      this.fstr.push(param);
    }
    if (rest.length>0)
      return this.field(rest[0], ...rest.splice(1));
    else 
      return this;
  }
  this.where = function(param, ...rest){
    this.whereA.push(param);
    if (rest.length>0)
      return this.where(rest[0], ...rest.splice(1));
    else 
      return this;
  }
  this.group = function(param, ...rest){
    this.groupA.push(param);
    if (this.attsA.indexOf(param)<0)
      this.groupA.push(param);
    if (rest.length>0)
      return this.group(rest[0], ...rest.splice(1));
    else 
      return this;
   }
  this.order = function(param, ...rest){
    this.orderA.push(param);
    if (rest.length>0)
      return this.order(rest[0], ...rest.splice(1));
    else 
      return this;
   }
  this.limit = function(param){
    this.limitA=param;
    return this;
  }
//////////////////////////////////////////////////////////////////////////////
//EXPANDS
  this.expandFrom = function(){
  fromTab=this.fromA[0];
  tabLen=daSchema.getTabSizeByName(fromTab);
  filter=this.expandFilter();
  return `dec:var trav_`+fromTab+`=-1;:: 
	 loop: while(1){ trav_`+fromTab+`=trav_`+fromTab+`+1|0; if ((trav_`+fromTab+`|0) >= `+tabLen+`) break; `+filter+`  ::`;
  }
  this.expandJoin = function(){
  jTab=this.joinA[0];
  tabLen=daSchema.getTabSizeByName(jTab);
  jfilter=this.expandJFilter();
  return  `
   pre:i=0;while(1){::
   pre:    mem32[((h1bb+(i<<2))|0)>>2]=0;::
   pre:    i=(i+1)|0;::
   pre:    if((i|0)>=(hashBitFilter|0)) break;::
   pre:  }::
   dec:var trav_`+jTab+`=-1;::
   pre:trav_`+jTab+`=-1; while(1){trav_`+jTab+`=trav_`+jTab+`+1|0; if((trav_`+jTab+`|0)>=`+tabLen+`) break; `+jfilter+`;::
   pre:  hk=(`+daSchema.bindCol(this.onA[1])+` & (hashBitFilter|0))|0;::
   pre:  if (bp=mem32[((h1bb+(hk<<2))|0)>>2]|0){::
   pre:    while(mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]|0){::
   pre:      bp= mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]|0;::
   pre:    }::
   pre:    if((mem32[bp>>2]|0) >= (hash1BucketSize|0)){::
   pre:      bp=(h1tb+((curr1NumBucks) * (((hash1BucketSize+2)|0)<<2)|0))|0;
   pre:      bp=(h1tb+(curr1NumBucks<<5))|0;::
   pre:      curr1NumBucks=(curr1NumBucks+1)|0;::
   pre:      mem32[((bp+((hash1BucketSize+1|0)<<2))|0)>>2]=bp;::
   pre:      mem32[bp>>2]=0;::
   pre:      mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]=0;::
   pre:    }::
   pre:  }else{//reception::
   pre:    bp=(h1tb+(curr1NumBucks<<5))|0;::
   pre:    curr1NumBucks=(curr1NumBucks+1)|0;::
   pre:    mem32[((h1bb+(hk<<2))|0)>>2]=bp|0;::
   pre:    mem32[bp>>2]=0;::
   pre:    mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]=0;::
   pre:  };::
   pre:  //put one::
   pre:  tmp=(((mem32[bp>>2]|0)+1)|0);::
   pre:  mem32[bp>>2]=tmp;::
   pre:  mem32[((bp+(tmp<<2))|0)>>2]= trav_`+jTab+`|0;::
   pre:}::
       prej:hk=`+daSchema.bindCol(this.onA[0])+`;::
       prej:currb=-1;::
       prej:curr=0;::
       prej:currb=mem32[((h1bb+(hk<<2))|0)>>2]|0;::
       join:while(currb){ ::
       join:  if ((curr|0)>=(mem32[currb>>2]|0)){::
       join:    if (currb=mem32[(currb+(((hash1BucketSize+1)|0)<<2)|0)>>2]|0){::
       join:      curr=1;::
       join:      trav_`+jTab+`=mem32[((currb+(curr<<2))|0)>>2]|0;}::
       join:    else::
       join:     break;::
       join:  }else{::
       join:    curr=curr+1|0;::
       join:    trav_`+jTab+`=mem32[((currb+(curr<<2))|0)>>2]|0;::
       join:  }::
       join:  if(!(`+this.joinP+`)) continue; ::`;
  }

  this.expandFields = function(){
    ret="";
    for (var i=0;i<this.fstr.length;i++){
      ret=ret+this.fstr[i];
    }
    return ret;
  }
  this.expandFilter = function(){
    ret='if(!(';
    for (var i=0;i<this.whereA.length;i++){
      ret=ret + '(' +this.whereA[i] + ')&';
    }
    if (ret=='if(!(') return '';
    return ret.substring(0,ret.length-1)+')) continue;';
  }
  this.expandJFilter = function(){
    ret='if(!('
    for (var i=0;i<this.whereA.length;i++){
      if (this.whereA[i].match(new RegExp(".*"+this.joinA[0]+".*",'g'))){
          ret=ret + '(' +this.whereA[i] + ')&';
          this.whereA.splice(i,1);
        }
    }
    if (ret=='if(!(') return '';
    return ret.substring(0,ret.length-1)+')) continue;';
  }
  this.expandGroup = function(){
    daTrav=this.fromA[0];
    daConts="(";
    daHash="(hk=(";
    daHashn="(hk=(";
    for(var i=0;i<this.attsA.length;i++){
      daConts+=contbind(this.attsA[i]) + "|";
      daHash+= gbind(this.attsA[i]) + "+"
      daHashn+= gbindn(this.attsA[i]) + "+"
    }
    daConts=daConts.substring(0,daConts.length-2);
    daConts+=")|0)";
    daHash=daHash.substring(0,daHash.length-1);
    daHash+=")|0)";
    daHashn=daHashn.substring(0,daHashn.length-1);
    daHashn+="))";

    return `
      dec:var otrav_`+this.fromA[0]+`=-1;::
      pre:i=0;while(1){::
      pre:    mem32[((h2bb+(i<<2))|0)>>2]=0;::
      pre:    i=(i+1)|0;::
      pre:    if((i|0)>=(hashBitFilter|0)) break;::
      pre:  }::
      group:  hk=`+daHash+`;::
      group:  if (bp=mem32[((h2bb+(hk<<2))|0)>>2]|0){::
      group:    while(mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0){::
      group:      bp= mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0;::
      group:    }::
      group:    if((mem32[bp>>2]|0) >= (hash2BucketSize|0)){::
      group:      bp=(h2tb+(curr2NumBucks<<12))|0;::
      group:      curr2NumBucks=(curr2NumBucks+1)|0;::
      group:      mem32[((bp+((hash2BucketSize+1|0)<<2))|0)>>2]=bp;::
      group:      mem32[bp>>2]=0;::
      group:      mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:    }::
      group:  }else{//reception::
      group:    bp=(h2tb+(curr2NumBucks<<12))|0;::
      group:    curr2NumBucks=(curr2NumBucks+1)|0;::
      group:    mem32[((h2bb+(hk<<2))|0)>>2]=bp|0;::
      group:    mem32[bp>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:  };::
      group:  //put one::
      group:  tmp=(((mem32[bp>>2]|0)+1)|0);::
      group:  mem32[bp>>2]=tmp;::
      group:  mem32[((bp+(tmp<<2))|0)>>2]= trav_`+daTrav+`|0;::
      daconts:(`+daConts+`)::
      dahashn:(`+daHashn+`)::`;
  }
  this.expandGroupJoinKey = function(){
    aTrav=this.fromA[0];
    bTrav=this.joinA[0];
    daConts="(";
    daHash="((";
    daHashn="(hk=(";
    for(var i=0;i<this.attsA.length;i++){
      daConts+=contbind(this.attsA[i]) + "|";
      daHash+= gbind(this.attsA[i]) + "+"
      daHashn+= gbindn(this.attsA[i]) + "+"
    }
    daConts=daConts.substring(0,daConts.length-2);
    daConts+=")|0)";
    daHash=daHash.substring(0,daHash.length-1);
    daHash+=")|0)";
    daHashn=daHashn.substring(0,daHashn.length-1);
    daHashn+="))";

    return `
      dec:var otrav_`+this.fromA[0]+`=-1;::
      dec:var otrav_`+this.joinA[0]+`=-1;::
      pre:i=0;while(1){::
      pre:    mem32[((h2bb+(i<<2))|0)>>2]=0;::
      pre:    i=(i+1)|0;::
      pre:    if((i|0)>=(hashBitFilter|0)) break;::
      pre:  }::
      group:  hk=`+daHash+`;::
      group:  if (bp=mem32[((h2bb+(hk<<2))|0)>>2]|0){::
      group:    while(mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0){::
      group:      bp= mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0;::
      group:    }::
      group:    if((mem32[bp>>2]|0) >= (hash2BucketSize|0)){::
      group:      bp=(h2tb+(curr2NumBucks<<12))|0;::
      group:      curr2NumBucks=(curr2NumBucks+1)|0;::
      group:      mem32[((bp+((hash2BucketSize+1|0)<<2))|0)>>2]=bp;::
      group:      mem32[bp>>2]=0;::
      group:      mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:    }::
      group:  }else{//reception::
      group:    bp=(h2tb+(curr2NumBucks<<12))|0;::
      group:    curr2NumBucks=(curr2NumBucks+1)|0;::
      group:    mem32[((h2bb+(hk<<2))|0)>>2]=bp|0;::
      group:    mem32[bp>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:  };::
      group:  //put one::
      group:  tmp=(((mem32[bp>>2]|0)+2)|0);::
      group:  mem32[bp>>2]=(tmp)|0;::
      group:  mem32[((bp+(tmp<<2))|0)>>2]= trav_`+aTrav+`|0;::
      group:  mem32[((bp+((tmp+1)<<2))|0)>>2]= trav_`+bTrav+`|0;::
      daconts:(`+daConts+`)::
      dahashn:(`+daHashn+`)::`;
  }
//////////////////////////////////////////////////////////////////////////////
//BUILD
  this.validate = function(){
    if (this.fromA.length<1)
      new Error('No from tables ');
    if (this.fromA.length>1)
      new Error('Too many from tables:' + this.fromA.length);
    if ((this.fromA.length==1) &&  (this.joinA.length==1) && (this.groupA.length>1))
      return this.buildGroupJoin();
    if ((this.fromA.length==1) &&  (this.joinA.length==1))
      return this.buildJoin();
    if ((this.fromA.length==1) &&  (this.groupA.length>0))
      return this.buildGroup();
    if ((this.fromA.length==1))
      return this.build();
    return 'bug';
  }
  this.buildGroupJoin = function(){
   combound="trav_"+this.fromA[0]+"=(mem32[((currb+(curr<<2))|0)>>2]|0);"
   combound+="trav_"+this.joinA[0]+"=(mem32[((currb+(((curr+1)|0)<<2))|0)>>2]|0);"
   ocombound="otrav_"+this.fromA[0]+"=(mem32[((currb+(curr<<2))|0)>>2]|0);"
   ocombound+="otrav_"+this.joinA[0]+"=(mem32[((currb+(((curr+1)|0)<<2))|0)>>2]|0);"
   all=this.expandJoin();
   all=all+this.expandFrom();
   all=all+this.expandGroupJoinKey();
   all=all+this.expandFields();
   dec=extractfrom(all,'dec');
   prepend=extractfrom(all,'pre');
   preexek=extractfrom(all,'preexek');
   looper=extractfrom(all,'loop');
   prejoiner=extractfrom(all,'prej');
   joiner=extractfrom(all,'join');
   grouper=extractfrom(all,'group');
   execs=extractfrom(all,'exec',null,'tempsptr');
  postexek=extractfrom(all,'postexek');
   sorter=extractfrom(all,'sorter');
   limiter=extractfrom(all,'limit');
   ret="function runner(){"
   ret=ret+dec+'/*dec*/';
   ret=ret+prepend+'/*prepend*/';
   ret=ret+looper+'/*looper*/';
   ret=ret+prejoiner+'/*prejoiner*/';
   ret=ret+joiner+'/*joiner*/';
   ret=ret+grouper+'}}/*grouper*/';
   ret=ret+`
while(redo)
{
  redo=0;
  hki=-1;
  while(1){hki=hki+1|0;if ((hki|0)>=(hashBitFilter|0)) break;
    if(ob=currb=mem32[((h2bb+(hki<<2))|0)>>2]|0){
      curr=2;col=0;
      `+ocombound+`
      `+preexek+`
      while(currb){ 
        if ((curr|0)>(mem32[currb>>2]|0)){
          if (currb=mem32[(currb+(((hash2BucketSize+1)|0)<<2)|0)>>2]|0){
            curr=2;
            `+combound+`
          }
          else
           break;
        }else{
          `+combound+`
          curr=curr+2|0;
        }
        if (`+daConts+`){
          col=1;
          //redo=1;
          break;
        }
        `+execs+`
      }
      if(col){
        //todo: handle cols
      } else {
        `+postexek+`      
      }
    }
  }
}`
//   ret=ret+execs+'}/*execs*/';
//    ret=ret+'transpose('+sorter+');';
    ret=ret+limiter+'/*limiter*/';
    ret=ret+"return tempsptr|0;}";
    return ret;
  }
  this.buildJoin = function(){
   all=this.expandJoin();
   all=all+this.expandFrom();
//   all=all+this.expandFilter();
   all=all+this.expandFields();
   dec=extractfrom(all,'dec');
   prepend=extractfrom(all,'pre');
//   preexek=extractfrom(all,'preexek');
   looper=extractfrom(all,'loop');
   prejoiner=extractfrom(all,'prej');
   joiner=extractfrom(all,'join');
//   filter=extractfrom(all,'filter');
   execs=extractfrom(all,'exec');
   postexek=extractfrom(all,'postexek');
   sorter=extractfrom(all,'sorter');
   limiter=extractfrom(all,'limit');
   ret="function runner(){"
   ret=ret+dec+'/*dec*/';
   ret=ret+prepend+'/*prepend*/';
//   ret=ret+preexek+'/*preexek*/';
   ret=ret+looper+'/*looper*/';
//   ret=ret+filter+'{/*filter*/';
   ret=ret+prejoiner+'/*prejoiner*/';
   ret=ret+joiner+'/*joiner*/';
   ret=ret+execs+'}/*execs*/}';
   ret=ret+postexek+'/*postexek*/';
//   ret=ret+'transpose('+sorter+');';
   ret=ret+limiter+'/*limiter*/';
   ret=ret+"return tempsptr|0;}";
    return ret;
  }

  this.buildGroup = function(){
    combound="trav_"+this.fromA[0]+"=mem32[((currb+(curr<<2))|0)>>2]|0;"
    ocombound="otrav_"+this.fromA[0]+"=(mem32[((currb+(curr<<2))|0)>>2]|0);"
    all=this.expandFrom();
    all=all+this.expandGroup();
    all=all+this.expandFilter();
    all=all+this.expandFields();
    dec=extractfrom(all,'dec');
    prepend=extractfrom(all,'pre');
    preexek=extractfrom(all,'preexek');
    looper=extractfrom(all,'loop');
    filter=extractfrom(all,'filter');
    grouper=extractfrom(all,'group');
    execs=extractfrom(all,'exec',null,'tempsptr');
    postexek=extractfrom(all,'postexek');
    sorter=extractfrom(all,'sorter');
    limiter=extractfrom(all,'limit');
    daconts=extractfrom(all,'daconts');
    dahashn=extractfrom(all,'dahashn');
    ret="function runner(){"
    ret=ret+dec+'/*dec*/';
    ret=ret+prepend+'/*prepend*/';
    ret=ret+looper+'/*looper*/';
    ret=ret+filter+'/*filter*/';
    ret=ret+grouper+'}/*grouper*/';
    ret=ret+`
while(redo)
{
  redo=0;
//  h=primes[nexthcount++];
  hki=-1;
  while(1){hki=hki+1|0;if ((hki|0)>=(hashBitFilter|0)) break;
    if(ob=currb=mem32[((h2bb+(hki<<2))|0)>>2]|0){
      curr=1;col=0;
      `+ocombound+`
      `+preexek+`
      while(currb){ 
        if ((curr|0)>(mem32[currb>>2]|0)){
          if (currb=mem32[(currb+(((hash2BucketSize+1)|0)<<2)|0)>>2]|0){
            curr=1;
            `+combound+`
          }
          else
           break;
        }else{
          `+combound+`
          curr=curr+1|0;
        }
        if (`+daConts+`){
          col=1;
          redo=1;
          break;
        }
        `+execs+`
      }
      if(col){
        //todo: handle cols
      } else {
        `+postexek+`      
      }
    }
  }
}`

 //   ret=ret+execs+'}/*execs*/';
//    ret=ret+'transpose('+sorter+');';
    ret=ret+limiter+'/*limiter*/';
    ret=ret+"return tempsptr|0;}";
    return ret;

  }
  this.build = function(){
   all=this.expandFrom();
   all=all+this.expandFilter();
   all=all+this.expandFields();
   dec=extractfrom(all,'dec');
   prepend=extractfrom(all,'pre');
//   preexek=extractfrom(all,'preexek');
   looper=extractfrom(all,'loop');
   filter=extractfrom(all,'filter');
   execs=extractfrom(all,'exec');
   postexek=extractfrom(all,'postexek');
   sorter=extractfrom(all,'sorter');
   limiter=extractfrom(all,'limit');
   ret="function runner(){"
   ret=ret+dec+'/*dec*/';
   ret=ret+prepend+'/*prepend*/';
//   ret=ret+preexek+'/*preexek*/';
   ret=ret+looper+'/*looper*/';
   ret=ret+filter+'/*filter*/';
   ret=ret+execs+'}/*execs*/';
   if (this.aggsA.length>0)
     ret=ret+postexek+'/*postexek*/';
//   ret=ret+'transpose('+sorter+');';
   ret=ret+limiter+'/*limiter*/';
   ret=ret+"return tempsptr|0;}";
    return ret;
  }
  this.badFSQL = function(where){
    console.log("Bad Fluent SQL at:"+where);
  }
//////////////////////////////////////////////////////////////////////////////
//TOSTRING
  this.toVanilla = function(){
    var ret=this.string();
    return ret.replace('\"use asm\"','');
  }
  this.toAsm = function(){
    return this.string();
  }
  this.toString = function(){
    core=this.validate();
    posts=';';
    for(var i=0;i< (this.resA.length);i++)
      posts=posts+this.resA[i];
//    posts=posts+this.resA[1];
    //debug= @extractfrom(ret,"debug")
    if(inNode){
      debug=`var t1 = process.hrtime();
        console.log(res.toStringN(100));
        console.log("time to run query:"+ (((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))) +" ms");`
      ots="var t0 = process.hrtime();";
      windowORglobal='global';
      qrunner="queryResult=require('./src/core/queryResult.js');res = new queryResult(rp);";
    } else {
      debug=`var t1 = window.performance.now();
        divcons=document.getElementById("divcons");
        clearElement(divcons);
        divcons.appendChild( res.toHTMLTableN(100));
	document.getElementById("console").innerHTML = "" +
        "time to run query:"+ (t1-t0) +" ms <br>"`
       ots="var t0 = window.performance.now();";
       windowORglobal='window';
       qrunner='res = new  queryResult(rp);';
     }
 
    code=`var asm = (function (global, env, mem){
  "use asm";
  var name=0;
  var numrows= 1;
  var numcols= 0;
  var colnamesp=-1;
  var colptrs= 0;
  var coltypesp=-1;
  var tempsptr=0;
  var temps=env.temps|0;
  var hashBitFilter=env.hashBitFilter|0;
  var h1bb=env.h1bb|0;
  var h2bb=env.h2bb|0;
  var h3bb=env.h3bb|0;
  var h1tb=env.h1tb|0;
  var h2tb=env.h2tb|0;
  var h3tb=env.h3tb|0;
  var hash1BucketSize=env.hash1BucketSize|0;
  var hash2BucketSize=env.hash2BucketSize|0;
  var hash3BucketSize=env.hash3BucketSize|0;
  var curr1NumBucks=1;
  var curr2NumBucks=1;
  var curr3NumBucks=1
  var mem32 = new global.Int32Array(mem);
  var memF32 = new global.Float32Array(mem);
  var redo=1;
  var col=0;
  var nexthcount=0;
  var h=0;
  var hki=0;
  var ob=0;
  var currb=0;
  var curr=0;
  var i=0;
  var bp=0;
  var hk=0;
  var tmp=0;
  `+core+`
  function setsize(size){
    size=size|0;
    numrows=size;
  };
  function prod(value){
    value=value|0;
    mem32[(temps+(tempsptr<<2))>>2]=value;
    tempsptr= (tempsptr + 1 )|0;
  };
//  function hash_str(strp){
//    strp=strp|0;
//    i=0;
//    hash=101;
//    for (;mem8[strp];i=(i+1)|0)
//      hash=  ((+(hash)*103)|0) + (mem8[(strp+i)|0]);
//    return (hash |0);
//  };
//  function mystrcmp(str1, str2){
//    str1=str1|0;
//    str2=str2|0;
//    var i=i|0;
//    while (
//          ( ([(str1+i)|0]==mem8[(str2+i)|0]) && mem8[(str1+i)|0 ] && mem8[(str2+i)|0])
//          ) i=((i+1)|0);
//    return ([(str1+i)|0 ]-mem8[(str2+i)|0 ]);
//  }
  return {runner:runner}
});

/*intro:*/
`+ots+`
//for (zz=0;zz<100;zz++){
env={'temps':temps,
'hashBitFilter':hashBitFilter,
'h1bb':h1bb,
'h2bb':h2bb,
'h3bb':h3bb,
'h1tb':h1tb,
'h2tb':h2tb,
'h3tb':h3tb,
'hash1BucketSize':hash1BucketSize,
'hash2BucketSize':hash2BucketSize,
'hash3BucketSize':hash3BucketSize};
  asmi = new asm(`+windowORglobal+`, env,mem);
  rp=asmi.runner();
  `+qrunner+`
  `+posts+`
  res.transpose([`+this.orderA+`]);
  res.limit(`+this.limitA+`);
//}
`
    code= code+ debug;
    return code;
  }
}
//////////////////////////////////////////////////////////////////////////////
//MISC
function extractfrom(fromtext,what,opt,filt){
  ret="";
  if (!fromtext) return ret;
  fromtext=fromtext.replace(new RegExp(what+ ":.*?"+filt+".*?::",'g'),'');
  if (!fromtext) return ret;
  lines=fromtext.match(new RegExp(what+":.*?::",'g'))
  if (lines){
    for (var i=0;i<lines.length;i++)
      ret= ret+'\n'+lines[i].replace((new RegExp(what+":|::",'g')), "");
  }
  if (!opt)
    return ret;
  else {
    lines=ret.match(new RegExp("^(?!.*"+opt+").*$",'g'))
    if (lines){
      for (var i=0;i<lines.length;i++)
        ret= ret+'\n';
    }
    return ret;
  }

    return lines;
}

function contbind(pfield) {
  ppfield= daSchema.getColPByName(pfield);
  bound= daSchema.bindCol(pfield);
  obound= daSchema.obindCol(pfield);
  type= daSchema.getColTypeByName(pfield);
  travname='trav';
  if ((type==0) || (type==1) || (type==3) || (type==4))
    return "(("+obound+"|0)-("+bound+")|0)";
  else if (type==2)
    return "(mystrcmp("+obound+","+bound+"))";
//  else throw new Error "filter does not support datatype:" + type;
}

function gbind(pfield) {
  ppfield= daSchema.getColPByName(pfield);
  type= daSchema.getColTypeByName(pfield);
  tab= daSchema.getParent(pfield);
  ret='';
  if ((type==0) || (type==1) || (type==3) || (type==4))
    ret ="(mem32[("+ppfield+"+ (trav_"+tab+"<<2)) >>2]|0 & (hashBitFilter|0) )";
  else if (type==2)
    ret ="(hash_str(mem32[("+ppfield+"+ (trav_"+tab+"<<2)) >>2]))";
  return ret;
//  else throw new Error "filter does not support datatype:" + type;
}
function gbindn(pfield) {
  ppfield= daSchema.getColPByName(pfield);
  type= daSchema.getColTypeByName(pfield);
  tab= daSchema.getParent(pfield);
  ret="";
  if ((type==0) || (type==1) || (type==3) || (type==4))
    ret= "(hash_int(mem32[("+ppfield+"+ (trav_"+tab+"<<2))>>2]),h)";
  else if (type==2)
    ret= "(hashn_strp(mem32[("+ppfield+"+ (trav_"+tab+"<<2)) >>2]),h)";
  return ret;
//  else throw new Error "filter does not support datatype:" + type;
}
//////////////////////////////////////////////////////////////////////////////
//API
function eq(p1,p2){
  return compare('==',p1,p2);
}
function leq(p1,p2){
  return compare('<=',p1,p2);
}
function geq(p1,p2){
  return compare('>=',p1,p2);
}
function lt(p1,p2){
  return compare('<',p1,p2);
}
function gt(p1,p2){
  return compare('>',p1,p2);
}
function between(p1,p2,p3){
  return '('+ geq(p1,p2) + '&' + leq(p1,p3) + ')';
}
function eqlit(p1,p2){
}
function leqlit(p1,p2){
}
function geqlit(p1,p2){
}
function ltlit(p1,p2){
}
function gtlit(p1,p2){
}
function betweenlit(p1,p2,p3){
}

function compare(op,p1,p2){
  p1b=daSchema.bindCol(p1);
  p2b=daSchema.bindCol(p2);
  p1t=daSchema.getColTypeByName(p1);
  p2t=daSchema.getColTypeByName(p2);

  if (p1b && p2b){
    return '(' +p1b+ op + p2b+')';
  } else if (p1b){
    if ((typeof p2) == 'string' && (op == '==')){
      if (p1t == 2)
        return expandStrLitComp(p1b,p2);
      else if (p1t == 4 && p2.length==1)
        return expandLitComp(op,p1t,p1b,p2.charCodeAt(0));
      else 
        this.badFSQL('@compare');
    } else {
      return expandLitComp(op,p1t,p1b,p2);  
    }
  } else if (p2b){
    if ((typeof p1) == 'string' && (op == '==')){
      if (p2t == 2)
        return expandStrLitComp(p2b,p1);
      else if (p2t == 4 && p1.length==1)
        return expandLitComp(op,p2t,p2b,p1.charCodeAt(0));
      else 
        this.badFSQL('@compare');

    } else {
      return expandLitComp(op,p2t,p2b,p1);  
    }
  }
  else{//todo: eval here 
    return '(' +p1+ op + p2+')';
  }
}
function field(){
  this.type='';
  this.att='';
  this.aggsh_str;
  this.attribute = function (){
  }
  this.aggregate = function (){
  }
}
function aggregate(){
  this.type='';
}
function min(p){
  ppfield= daSchema.getColPByName(p);
  bound= daSchema.bindCol(p);
  unique=uniqueVarCounter++;
  type= daSchema.getColTypeByName(p);
  tab= daSchema.getParent(p);
  varname="min"+unique
  return `dec:var `+varname+`=10000000000.1;::
  post:res.addCol2('min(`+p+`)',`+type+`);::
  preexek:`+varname+`=10000000000.1;::
  exec: if (`+varname+` > (`+bound+`)) {`+varname+` = `+bound+`;}::
  execg:if (`+varname+` > (`+bound+`)) {`+varname+` = `+bound+`;}::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
  
}
function max(p){
  ppfield= daSchema.getColPByName(p);
  unique=uniqueVarCounter++;
  type= daSchema.getColTypeByName(p);
  tab= daSchema.getParent(p);
  varname="max"+unique
  return `dec:var `+varname+`=-10000000000.1;::
  post:res.addCol2('max(`+p+`)',`+type+`);::
  preexek:`+varname+`=-10000000000.1;::
  exec: if (`+varname+` < (`+bound+`)) {`+varname+` = `+bound+`;}::
  execg:if (`+varname+` < (`+bound+`)) {`+varname+` = `+bound+`;}::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
}
function count(p){
  unique=uniqueVarCounter++;
  type = 0;
  varname="count"+unique;
  return `dec:var `+varname+`=0;::
  post:res.addCol2('count(`+p+`)',`+type+`);::
  preexek:`+varname+`=0;::
  exec:`+varname+`=`+varname+`+1|0;::
  execg:`+varname+`=`+varname+`+1|0;::
  postexek:mem32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
}
function sum(p){
  ppfield= daSchema.getColPByName(p);
  bound=daSchema.bindCol(p)
  unique=uniqueVarCounter++;
  type= daSchema.getColTypeByName(p);
  tab= daSchema.getParent(p);
  varname="sum"+unique
  return `dec:var `+varname+`=0.0;::
  post:res.addCol2('sum(`+p+`)',`+type+`);::
  preexek:`+varname+`=+(0);::
  exec:`+varname+`=`+varname+`+(`+bound+`);::
  execg:`+varname+`=`+varname+`+(`+bound+`);::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=+(`+varname+`);tempsptr= (tempsptr + 1 )|0;::`;
}
function avg(p){
  ppfield= daSchema.getColPByName(p);
  unique=uniqueVarCounter++;
  type= daSchema.getColTypeByName(p);
  tab= daSchema.getParent(p);
  varnamesum="avgsum"+unique
  varnamecount="avgcount"+unique
  return `dec:var `+varnamecount+`=0;::
  dec:var `+varnamesum+`=0;::
  post:res.addCol2('avg(`+p+`)',`+type+`);::
  preexek:`+varname+`=0;::
  exec:`+varnamesum+`=`+varnamesum+`+(mem32[(`+ppfield+`+ (trav_`+tab+`<<2)) >>2]|0)|0;::
  exec:`+varnamecount+`=`+varnamecount+`+1|0;::
  execg:`+varnamesum+`=`+varnamesum+`+(mem32[(`+ppfield+`+ (trav_`+tab+`<<2)) >>2]|0)|0;::
  execg:`+varnamecount+`=`+varnamecount+`+1|0;::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=+(`+(varnamesum/varnamecount)+`);tempsptr= (tempsptr + 1 )|0;::`;
}
function expandStrLitComp(strp, strlit){
  quartets=Math.ceil((strlit.length+1)/4);
  ret="";
  c=0;
  for (var i=0;i<quartets;i++){
    intval=(strlit.charCodeAt(c++)||0)+
           ((strlit.charCodeAt(c++)||0)<<8)+
           ((strlit.charCodeAt(c++)||0)<<16)+
           ((strlit.charCodeAt(c++)||0)<<24);
        ret+='((mem32[(('+strp+' + ('+i+'<<2))|0)>>2]|0)==('+intval+'|0))&';
  }
  return ret.substring(0,ret.length-1);
}
function expandLitComp(op,type,bp,lp){
  if (type==1){
    lp= '(+('+lp+'))';
  } else {
    lp= '(('+lp+')|0)';
  }
  ret= '(' + bp + '' + op + '' + lp + ')';
  return ret;
}

function date(p1){
  return strdate_to_int(p1);
}

function add(p1,p2){
}
function sub(p1,p2){
}
function mul(p1,p2){
}
function div(p1,p2){
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting afterburner');
  module.exports.Afterburner=Afterburner;
  global.count=count;
  global.sum=sum;
  global.eq=eq;
  global.lt=lt;
  global.geq=geq;
  global.leq=leq;
  global.between=between;
  global.date=date;
  global.compare=compare;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
