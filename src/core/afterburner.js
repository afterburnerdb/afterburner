//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
}else{ require('./store.js');}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var uniqueVarCounter=0;
var funs=[];
var theGeneratingAB;
function Afterburner(){
  this.select = function(param){
    uniqueVarCounter=0;
    this.fromA=[];
    this.joinA=[];
    this.onA=[];
    this.joinP='';
    this.hasljoin=0;
    this.hasin=0;
    this.isinFlag=0;
    this.attsA=[];
    this.fstr=[];
    this.aggsA=[];
    this.whereA=[];
    this.groupA=[];
    this.orderA=[];
    this.limitA=-1;
    this.resA=[];
    this.als2tab={};
    this.tab2als={};
    funs=[];
    theGeneratingAB=this;
    return this;
  }
//////////////////////////////////////////////////////////////////////////////
//API
  this.from = function(param){
    var atab=this.tabAliasif(param);
    if (daSchema.getTable(atab.tab)){
      this.fromA.push(atab.als);
      return this;
    }
    else {
      badFSQL('@from', atab.tab +' is not a table')
    }
  }
  this.join = function(param){
    var atab=this.tabAliasif(param);
    if (daSchema.getTable(atab.tab)){
      this.joinA.push(atab.als);
      return this;
    }
    else {
      badFSQL('@join', atab.tab +' is not a table')
    }
  }
  this.ljoin = function(param){
    this.hasljoin=1;
    return this.join(param);
  }
  this.infrom = function(param){
    this.hasin=1;
    return this.join(param);
  }
  this.tabAliasif = function(param){
    if (param.substring(0,2)=='as'){
      var alias=param.substring(param.indexOf('~')+1,param.indexOf('}'));
      param=param.substring(param.indexOf('{')+1,param.indexOf('~'));
      this.als2tab[alias]=param;
      this.tab2als[alias]=param;
      return {tab:param, als:alias}
    }else{
      this.als2tab[param]=param
      this.tab2als[param]=param
      return {tab:param, als:param}
    }
  }
  this.on = function(param1, param2){
    this.onA.push(param1);
    this.onA.push(param2);
    this.joinP=eq(param1,param2);
    return this;
  }
  this.isin = function(param1,param2){
    this.isinFlag=1;
    return this.on(param1,param2)
  }
  this.isnotin = function(param1,param2){
    this.isinFlag=0;
    return this.on(param1,param2)
  }

  this.field = function(param, ...rest){
    if (param == '*'){
      var wildCard=daSchema.getChildAttributes(this.fromA[0]);
      if (this.joinA.length > 0){
        wildCard=wildCard.concat(daSchema.getChildAttributes(this.joinA[0]));
      } 
      return this.field(wildCard[0], ...wildCard.slice(1));
    }
    var alias=param;
    if (param.substring(0,2)=='as'){
      alias=param.substring(param.indexOf('~')+1,param.indexOf('}'));
    param=param.substring(param.indexOf('{')+1,param.indexOf('~'));
    }
    if (boundAtt=bindCol(param)){
    var type= typeCol(param);
    this.attsA.push(param);
    if (typeCol(param)!==1)
    this.fstr.push(`exec:mem32[(temps+(tempsptr<<2))>>2]=`+bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::
    postexek:mem32[(temps+(tempsptr<<2))>>2]=`+obindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::`);
      else 
      this.fstr.push(`exec:memF32[(temps+(tempsptr<<2))>>2]=`+bindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::
      postexek:memF32[(temps+(tempsptr<<2))>>2]=`+obindCol(param)+`;tempsptr= (tempsptr + 1 )|0;::`);

      this.resA.push("res.addCol2('"+alias+"',"+type+");");
    } else {
      this.resA.push(extractfrom(param,'post').replace(param,alias));
      this.aggsA.push(param);
      this.fstr.push(param);
    }
    if (rest.length>0)
      return this.field(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.where = function(param, ...rest){
    this.whereA.push(param);
    if (rest.length>0)
      return this.where(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.group = function(param, ...rest){
    this.groupA.push(param);
    if (this.attsA.indexOf(param)<0)
      this.attsA.push(param);
    if (rest.length>0)
      return this.group(rest[0], ...rest.slice(1));
    else 
      return this;
   }
  this.order = function(param, ...rest){
    if (typeof param == 'string'){
      param= "\'"+param+"\'";
      this.orderA.push(param);
    } else if (typeof param== 'number'){
      this.orderA.push(param);
    } else if (typeof param == 'object'){//consider removing
      for (var i=0; i<param.length; i++)
        this.order(param[i]);
    }
      
    if (rest.length>0)
      return this.order(rest[0], ...rest.slice(1));
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
  var fromTab=this.fromA[0];
  var tabLen=tabSize(fromTab);
  var filter=this.expandFilter();
  return `dec:var trav_`+fromTab+`=-1;:: 
	 loop: while(1){ trav_`+fromTab+`=trav_`+fromTab+`+1|0; if ((trav_`+fromTab+`|0) >= `+tabLen+`) break; `+filter+`  ::`;
  }
  this.expandJoin = function(){
  var jTab=this.joinA[0];
  var tabLen=tabSize(jTab);
  var pbfilter=this.expandPreBuildJFilter();
  var ppfilter=this.expandPostProbeJFilter();
  return  `
   pre:i=0;while(1){::
   pre:    mem32[((h1bb+(i<<2))|0)>>2]=0;::
   pre:    i=(i+1)|0;::
   pre:    if((i|0)>=(hashBitFilter|0)) break;::
   pre:  }::
   dec:var trav_`+jTab+`=-1;::
   pre:trav_`+jTab+`=-1; while(1){trav_`+jTab+`=trav_`+jTab+`+1|0; if((trav_`+jTab+`|0)>=`+tabLen+`) break; `+pbfilter+`;::
   pre:  hk=((`+gbind(this.onA[1])+`) & (hashBitFilter|0))|0;::
   pre:  if (obp=mem32[((h1bb+(hk<<2))|0)>>2]|0){::
   pre:    //while(mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]|0){::
   pre:      bp= mem32[((obp+(((hash1BucketSize+2)|0)<<2))|0)>>2]|0;::
   pre:    //}::
   pre:    if((mem32[bp>>2]|0) >= (hash1BucketSize|0)){//extension::
   pre:      nbp=(h1tb+((curr1NumBucks) * (((hash1BucketSize+2)|0)<<2)|0))|0;
   pre:      nbp=(h1tb+(curr1NumBucks<<5))|0;::
   pre:      curr1NumBucks=(curr1NumBucks+1)|0;::
   pre:      mem32[((bp+((hash1BucketSize+1|0)<<2))|0)>>2]=nbp;::
   pre:      mem32[((obp+((hash1BucketSize+2|0)<<2))|0)>>2]=nbp;::
   pre:      mem32[nbp>>2]=0;::
   pre:      mem32[((nbp+(((hash1BucketSize+1)|0)<<2))|0)>>2]=0;::
   pre:      bp=nbp;::
   pre:    }::
   pre:  }else{//reception::
   pre:    bp=(h1tb+(curr1NumBucks<<5))|0;::
   pre:    curr1NumBucks=(curr1NumBucks+1)|0;::
   pre:    mem32[((h1bb+(hk<<2))|0)>>2]=bp|0;::
   pre:    mem32[bp>>2]=0;::
   pre:    mem32[((bp+(((hash1BucketSize+1)|0)<<2))|0)>>2]=0;::
   pre:    mem32[((bp+(((hash1BucketSize+2)|0)<<2))|0)>>2]=bp;::
   pre:  };::
   pre:  //put one::
   pre:  tmp=(((mem32[bp>>2]|0)+1)|0);::
   pre:  mem32[bp>>2]=tmp;::
   pre:  mem32[((bp+(tmp<<2))|0)>>2]= trav_`+jTab+`|0;::
   pre:}::
       prej:hk=((`+gbind(this.onA[0])+`) & (hashBitFilter|0))|0;::
       prej:currb=-1;::
       prej:curr=0;::
       prej:currb=mem32[((h1bb+(hk<<2))|0)>>2]|0;::
       join:odidonce=0;::
       join:while(currb | (ljoin & (!odidonce)) ){ ::
       join:  if (currb){::    
       join:    if (hasin& odidonce) break;::
       join:    if ((curr|0)>=(mem32[currb>>2]|0)){::
       join:      if (currb=mem32[(currb+(((hash1BucketSize+1)|0)<<2)|0)>>2]|0){::
       join:        curr=1;::
       join:        trav_`+jTab+`=mem32[((currb+(curr<<2))|0)>>2]|0;}::
       join:      else::
       join:       break;::
       join:    }else{::
       join:      curr=curr+1|0;::
       join:      trav_`+jTab+`=mem32[((currb+(curr<<2))|0)>>2]|0;::
       join:    }::
       join:  } else trav_`+jTab+`= -666;//NULL::
       join:  if((!(`+this.joinP+`)) & (ljoin & odidonce))  continue; ::
       join:  `+ppfilter+`;::
       join:   odidonce=1;::`;
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
  this.expandPreBuildJFilter = function(){
    var toSplice=[];
    ret='if(!('
    for (var i=0;i<this.whereA.length;i++){
      if (!(this.whereA[i].match(new RegExp(".*trav_"+this.fromA[0]+".*",'g')))){
          ret=ret + '(' +this.whereA[i] + ')&';
          toSplice.push(i);
        }
    }
    toSplice.reverse();
    for (var i=0;i<toSplice.length;i++)
      this.whereA.splice(toSplice[i],1);
    if (ret=='if(!(') return '';
    return ret.substring(0,ret.length-1)+')) continue;';
  }
  this.expandPostProbeJFilter = function(){
    var toSplice=[];
    ret='if(!('
    for (var i=0;i<this.whereA.length;i++){
      if ((this.whereA[i].match(new RegExp(".*trav_"+this.joinA[0]+".*",'g')))){
          ret=ret + '(' +this.whereA[i] + ')&';
          toSplice.push(i);
        }
    }
    toSplice.reverse();
    for (var i=0;i<toSplice.length;i++)
      this.whereA.splice(toSplice[i],1);
    if (ret=='if(!(') return '';
    return ret.substring(0,ret.length-1)+')) continue;';
  }

  this.expandGroup = function(){
    DEBUG('@expandGroup');
    daTrav=this.fromA[0];
    daConts="(";
    daHash="((";
    daHashn="(hk=(";
    for(var i=0;i<this.groupA.length;i++){
      daConts+=contbind(this.groupA[i]) + "|";
      daHash+= "("+gbind(this.groupA[i]) + "<<" + (i*11)%7 + ")+";
      daHashn+= gbindn(this.groupA[i]) + "+"
    }
    daConts=daConts.substring(0,daConts.length-2);
    daConts+=")|0)";
    daHash=daHash.substring(0,daHash.length-1);
    daHash+=")|0)&hashBitFilter";
    daHashn=daHashn.substring(0,daHashn.length-1);
    daHashn+="))";

    return `
      dec:var otrav_`+this.fromA[0]+`=-1;::
      dec:var ntrav_`+this.fromA[0]+`=-1;::
      pre:i=0;while(1){::
      pre:    mem32[((h2bb+(i<<2))|0)>>2]=0;::
      pre:    i=(i+1)|0;::
      pre:    if((i|0)>=(hashBitFilter|0)) break;::
      pre:  }::
      group:  hk=`+daHash+`;::
      group:  if (obp=mem32[((h2bb+(hk<<2))|0)>>2]|0){::
      group:    //while(mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0){::
      group:      bp= mem32[((obp+(((hash2BucketSize+2)|0)<<2))|0)>>2]|0;::
      group:    //}::
      group:    if((mem32[bp>>2]|0) >= (hash2BucketSize|0)){//extension::
      group:      nbp=(h2tb+(curr2NumBucks<<7))|0;::
      group:      curr2NumBucks=(curr2NumBucks+1)|0;::
      group:      mem32[((bp+((hash2BucketSize+1|0)<<2))|0)>>2]=nbp;::
      group:      mem32[((obp+((hash2BucketSize+2|0)<<2))|0)>>2]=nbp;::
      group:      mem32[nbp>>2]=0;::
      group:      mem32[((nbp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:      bp=nbp;::
      group:    }::
      group:  }else{//reception::
      group:    //bp=(h2tb+(curr2NumBucks<<12))|0;::
      group:    bp=(h2tb+(curr2NumBucks<<7))|0;::
      group:    curr2NumBucks=(curr2NumBucks+1)|0;::
      group:    mem32[((h2bb+(hk<<2))|0)>>2]=bp|0;::
      group:    mem32[bp>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+2)|0)<<2))|0)>>2]=bp;::
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
    for(var i=0;i<this.groupA.length;i++){
      daConts+=contbind(this.groupA[i]) + "|";
      daHash+= "("+gbind(this.groupA[i]) + "<<" + (i*11)%7 + ")+";
      daHashn+= gbindn(this.groupA[i]) + "+"
    }
    daConts=daConts.substring(0,daConts.length-2) + ")|0)";
    daHash=daHash.substring(0,daHash.length-1) + ")|0)&hashBitFilter";
    daHashn=daHashn.substring(0,daHashn.length-1) + "))";

    return `
      dec:var otrav_`+this.fromA[0]+`=-1;::
      dec:var otrav_`+this.joinA[0]+`=-1;::
      dec:var ntrav_`+this.fromA[0]+`=-1;::
      dec:var ntrav_`+this.joinA[0]+`=-1;::
      pre:i=0;while(1){::
      pre:    mem32[((h2bb+(i<<2))|0)>>2]=0;::
      pre:    i=(i+1)|0;::
      pre:    if((i|0)>=(hashBitFilter|0)) break;::
      pre:  }::
      group:  hk=`+daHash+`;::
      group:  if (obp=mem32[((h2bb+(hk<<2))|0)>>2]|0){::
      group:    //while(mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]|0){::
      group:      bp= mem32[((obp+(((hash2BucketSize+2)|0)<<2))|0)>>2]|0;::
      group:    //}::
      group:    if((((mem32[bp>>2]|0)+1)|0) >= (hash2BucketSize|0)){//extension::
      group:      //nbp=(h2tb+(curr2NumBucks<<12))|0;::
      group:      nbp=(h2tb+(curr2NumBucks<<7))|0;::
      group:      curr2NumBucks=(curr2NumBucks+1)|0;::
      group:      mem32[((bp+((hash2BucketSize+1|0)<<2))|0)>>2]=nbp;::
      group:      mem32[((obp+((hash2BucketSize+2|0)<<2))|0)>>2]=nbp;::
      group:      mem32[nbp>>2]=0;::
      group:      mem32[((nbp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:      bp=nbp;::
      group:    }::
      group:  }else{//reception::
      group:    bp=(h2tb+(curr2NumBucks<<7))|0;::
      group:    curr2NumBucks=(curr2NumBucks+1)|0;::
      group:    mem32[((h2bb+(hk<<2))|0)>>2]=bp|0;::
      group:    mem32[bp>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+1)|0)<<2))|0)>>2]=0;::
      group:    mem32[((bp+(((hash2BucketSize+2)|0)<<2))|0)>>2]=bp;::
      group:  };::
      group:  //put two::
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
    if ((this.fromA.length==1) &&  (this.joinA.length==1) && (this.groupA.length>0))
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
   DEBUG('@buildGroupJoin');
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

   if (this.hasin && (this.isinFlag==0)){
     ret=ret+`} 
       if (!odidonce){ `+grouper+`}/*grouper*/
     }`;
   }
   else{
     ret=ret+grouper+`}/*grouper*/
     }`;
   }

   ret=ret+`
{
  redo=-1;
  hki=-1;
  while(1){hki=hki+1|0;if ((hki|0)>=(hashBitFilter|0)) break;
    if((currb=mem32[((h2bb+(hki<<2))|0)>>2]|0)|((redo|0)>0)){
      curr=2;producable=0; alarm=0;
        if ((redo|0)>0){
          hki=redo|0;
          otrav_`+this.fromA[0]+`=ntrav_`+this.fromA[0]+`;
          otrav_`+this.joinA[0]+`=ntrav_`+this.joinA[0]+`;
          currb=mem32[((h2bb+(hki<<2))|0)>>2]|0;
	  redo=-1;
          alarm=1;
        }else{
          `+ocombound+`
	}
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
        }
        if ((trav_`+this.fromA[0]+`|0)<0) {curr=curr+2|0; continue;} 
        if (`+daConts+`){
          ntrav_`+this.fromA[0]+`=trav_`+this.fromA[0]+`;
          ntrav_`+this.joinA[0]+`=trav_`+this.joinA[0]+`;
          if (((redo|0)<0)&(!alarm)){
            redo=hki;
            producable=0;
            break;
          }
          redo=hki;
          curr=curr+2|0;
          continue;
        }
        if (alarm){
	  mem32[((currb+(curr<<2))|0)>>2]=-1;
          mem32[((currb+(((curr+1)|0)<<2))|0)>>2]=-1;
        }
        `+execs+`
        producable=(producable+1)|0;
        curr=curr+2|0;
      }
      if(producable){
        `+postexek+`      
      }
    }
  }
}`
    ret=ret+limiter+'/*limiter*/';
    ret=ret+"return tempsptr|0;}";
    return ret;
  }
  this.buildJoin = function(){
    DEBUG('@buildJoin');
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
   if (this.hasin && (this.isinFlag==0)){
     ret=ret+`} 
       if (!odidonce){ `+execs+`}/*execs*/
     }`;
   }
   else{
     ret=ret+execs+`}/*execs*/
     }`;
   }

   if (this.aggsA.length>0)
     ret=ret+postexek+'/*postexek*/';
//   ret=ret+postexek+'/*postexek*/';
//   ret=ret+'transpose('+sorter+');';
   ret=ret+limiter+'/*limiter*/';
   ret=ret+"return tempsptr|0;}";
    return ret;
  }

  this.buildGroup = function(){
    DEBUG('@buildGroup');
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
{
  redo=-1;
  hki=-1;
  while(1){hki=hki+1|0;if ((hki|0)>=(hashBitFilter|0)) break;
    if((currb=mem32[((h2bb+(hki<<2))|0)>>2]|0)|((redo|0)>0)){
      curr=1;producable=0; alarm=0;
        if ((redo|0)>0){
          hki=redo;
          otrav_`+this.fromA[0]+`=ntrav_`+this.fromA[0]+`;
          currb=mem32[((h2bb+(hki<<2))|0)>>2]|0;
	  redo=-1;
          alarm=1;
        }else{
          `+ocombound+`
	}
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
        }
        if ((trav_`+this.fromA[0]+`|0)<0) {curr=curr+1|0; continue;} 
        if (`+daConts+`){
          ntrav_`+this.fromA[0]+`=trav_`+this.fromA[0]+`;
          if (((redo|0)<0)&(!alarm)){
            redo=hki;
            producable=0;
            break;
          }
          redo=hki;
          curr=curr+1|0;
          continue;
        }
        if (alarm){
	  mem32[((currb+(curr<<2))|0)>>2]=-1;
        }
        `+execs+`
        producable=(producable+1)|0;
        curr=curr+1|0;
      }
      if(producable){
        `+postexek+`      
      }
    }
  }
}`
    ret=ret+limiter+'/*limiter*/';
    ret=ret+"return tempsptr|0;}";
    return ret;

  }
  this.build = function(){
   DEBUG('@build');
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
//////////////////////////////////////////////////////////////////////////////
//TOSTRING
  this.toVanilla = function(purpose){
    var ret=this.toString(purpose);
    return ret.replace('\"use asm\"','');
  }
  this.toAsm = function(){
    return this.string();
  }
  this.toString = function(purpose){
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
      qrunner="/*queryResult=require('./src/core/queryResult.js');*/res = new queryResult(rp);";
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
  var storedB=env.storedB|0;
  var malloc_ctr=0;
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
  var mem8 = new global.Int8Array(mem);
  var memF32 = new global.Float32Array(mem);
  var redo=1;
  var producable=0;
  var alarm=0;
  var nexthcount=0;
  var h=0;
  var hki=0;
  var currb=0;
  var curr=0;
  var i=0;
  var obp=0;
  var bp=0;
  var nbp=0;
  var hk=0;
  var tmp=0;
  var tmpstrlen=0;
  var hash=0;
  var dtyluptr=`+dateToYearLUTab()+`;
  var dtyby=1970;
  var ljoin=`+this.hasljoin+`;
  var hasin=`+this.hasin+`;
  var odidonce=0;
  var isintmpstr=0;
  `+core+`
  function hash_str(strp){
    strp=strp|0;
    i=0;
    hash=101;
    for (;(mem8[(strp+i)|0]|0)>0;i=(i+1)|0){
      hash= (hash + (mem8[(strp+i)|0]|0))|0;
      hash= ((hash*103)|0)&hashBitFilter;
    }
    return (hash |0);
  };
  function mystrcmp(str1, str2){
    str1=str1|0;
    str2=str2|0;
    i=0;
    while (
          ( ( (mem8[(str1+i)|0]|0)==(mem8[(str2+i)|0]|0)) & mem8[(str1+i)|0 ] & mem8[(str2+i)|0])
          ) i=((i+1)|0);
    return (((mem8[(str1+i)|0]|0)-(mem8[(str2+i)|0]|0)))|0;
  };
  function strlen(str){
    str=str|0;
    var i=0;
    while(mem8[(str+i)|0]|0)
      i=(i+1)|0;
    return i|0;
  };
  function substr(str,n,m){
    str=str|0;
    n=n|0;
    m=m|0;
    var dst=0;
    var i=0;
    dst=malloc((m-n+1)|0)|0; 
  //  strncpy(dst,str+n,m-n);
    while((i|0)<((m-n)|0)){
      mem8[(dst+i)|0]=mem8[(str+n+i)|0]|0;
      i=(i+1)|0;
    }
    mem8[(dst+i)|0]=0;
    return dst|0;
  }
//  function strncpy(dst,src,n){
//    dst=dst|0;
//    src=src|0;
//    m-n
//    var i=0;
//  }
  function malloc(size){
    size=size|0;
    var size4b=0;
    var ret=0;
    if ((size|0)<1) return storedB|0;
    size4b=(((((size-1)|0)>>2)+1)|0)<<2;
    ret=storedB;
    malloc_ctr=(malloc_ctr+size4b)|0;
    storedB= (storedB+size4b)|0;
    return ret|0;
  }
  function mallocout(){
    return malloc_ctr|0;
  }
  function intDayToYear(day){
    day=day|0;
    var fg=0;
    var ret = 0;
    fg = (~~(+(day|0) / 365.0));
    if ((~~day) >= (mem32[(dtyluptr + (((fg+1)|0)<<2))>>2]|0))
      ret = (dtyby + fg + 1)|0;
    else if (~~day >= (mem32[(dtyluptr + (((fg)|0)<<2))>>2]|0))
      ret = (dtyby + fg)|0;
    else 
      ret = (dtyby + fg - 1)|0;
    return ret |0;
  };
  `+funs.join('\n')+`
  return {runner:runner,
          mallocout:mallocout}
});

/*intro:*/
`+ots+`
//for (zz=0;zz<100;zz++){
env={'temps':temps,
'storedB':storedB,
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
  malloc(asmi.mallocout());
  `+qrunner+`
  `+posts+`
  res.transpose([`+this.orderA+`]);
  res.limit(`+this.limitA+`);
//}
`
    if (purpose == 'fc')
      return code + `return res.firstCell()`;
    else if (purpose == 'array')
      return code + `return res.toArray()`;
    else if (purpose == 'array2')
      return code + `return res.toArray2()`;
    else if (purpose == 'mat')
      return code + `return res.registerTable()`;
    else 
      return code + debug;
  }
  this.toArray = function(vanilla){
    if (vanilla)
      return new Function('ignore', this.toVanilla('array'))();
    else 
      return new Function('ignore', this.toString('array'))();
  }
  this.toArray2 = function(vanilla){
    if (vanilla)
      return new Function('ignore', this.toVanilla('array2'))();
    else 
      return new Function('ignore', this.toVanilla('array2'))();
  }
  this.eval = function(vanilla){
    if (vanilla)
      return new Function('ignore', this.toVanilla('fc'))();
    else 
      return new Function('ignore', this.toString('fc'))();
  }
  this.materialize = function(vanilla){
    if (vanilla)
      return new Function('ignore', this.toVanilla('mat'))();
    else 
      return new Function('ignore', this.toString('mat'))();
  }
}
//////////////////////////////////////////////////////////////////////////////
//MISC
function resolve(colname){
    var qcontext=qc(this);
    var tabs=qcontext.tabs.slice(0);
    var alias;
    if (typeof colname == 'string'){
      if (colname.indexOf('.')>-1) {
        var maybeA= colname.split('.')[0];
        if (qc().als2tab[maybeA] != 'undefined'){
          alias=maybeA;
          tabs=[alias];
          colname=colname.split('.')[1];
          tabs=[qcontext.als2tab[alias]]
         }
      }
    }
    var ret={tabs:tabs , col:colname, als:alias};
    return ret;
  }
function pointCol(colname){
  var ocolname=colname;
  var resolved=resolve(colname);
  return daSchema.getColPByName(resolved.col, resolved.tabs)
}
function typeCol(colname){
  var resolved=resolve(colname);
  return daSchema.getColTypeByName(resolved.col, resolved.tabs)
}
function col2trav(colname){
  var ret;
  var resolved=resolve(colname);
  if (typeof resolved.als !='undefined'){
    ret=resolved.als;
  } else{
    var tabname=daSchema.getParent(colname,qt(this));
    ret= qc().tab2als[tabname];
  }
  return ret;
}
function tabSize(tabname){
  return daSchema.getTabSizeByName(qc().als2tab[tabname]);
}
function bindCol(colname){
  var ocolname=colname;
  //if (parseFloat(colname) == colname && typeof colname == 'number') return colname;
  if (typeof colname == 'number') return colname;
  if ((colname != null) && typeof colname == 'string' && colname.indexOf('pb')==0){
    if (colname.indexOf('pb$')==0)
      return colname.substring(3,colname.length);
    else 
      return colname.substring(2,colname.length);
  }

  var resolved=resolve(colname);
  var ctype=typeCol(colname)
  var cptr=pointCol(colname,qt(this))
  if (ctype==0 || ctype==2 || ctype==3 || ctype==4)
    return '(mem32[(('+cptr+' +(trav_'+col2trav(colname)+'<<2))|0)>>2]|0)';
  if (ctype==1)
    return '+(memF32[(('+cptr+' +(trav_'+col2trav(colname)+'<<2))|0)>>2])';
  badFSQL("@bindCol","could not bind:" + ocolname);
}

function obindCol(colname){
  var bound=bindCol(colname);
  return bound.replace("trav","otrav");
}

function contbind(pfield) {
  var bound= bindCol(pfield);
  var obound= obindCol(pfield);
  var type= typeCol(pfield);
  var travname='trav';
  if ((type==0) || (type==3) || (type==4))
    return "(("+obound+"|0)-("+bound+")|0)";
  else if (type==1){
    var ppfield= pointCol(pfield);
    var trav= col2trav(pfield);
    return "((mem32[("+ppfield+"+ (otrav_"+trav+"<<2)) >>2]|0)-(mem32[("+ppfield+"+ (otrav_"+trav+"<<2)) >>2]|0))"
  }
  else if (type==2)
    return "(mystrcmp("+obound+","+bound+")|0)";
//  else throw new Error "filter does not support datatype:" + type;
}

function gbind(pfield) {
  var ppfield= pointCol(pfield);
  var type= typeCol(pfield);
  var trav= col2trav(pfield);
  var ret='ERROR AT gbind';
  if ((type==0) || (type==3) || (type==4))
    ret ="((mem32[("+ppfield+"+ (trav_"+trav+"<<2)) >>2]|0))";
  else if (type==1)
    ret ="(((mem32[("+ppfield+"+ (trav_"+trav+"<<2)) >>2]|0))^(((mem32[("+ppfield+"+ (trav_"+trav+"<<2))>>2]|0)>>16)))";
  else if (type==2)
    ret ="((hash_str(mem32[("+ppfield+"+ (trav_"+trav+"<<2)) >>2]|0)|0))";
  return ret;
//  else throw new Error "filter does not support datatype:" + type;
}

function gbindn(pfield) {
  var ppfield= pointCol(pfield);
  var type= typeCol(pfield);
  var travname= col2trav(pfield);
  var ret="ERROR AT gbindn";
  if ((type==0) || (type==1) || (type==3) || (type==4))
    ret= "(hash_int(mem32[("+ppfield+"+ (trav_"+travname+"<<2))>>2]),h)";
  else if (type==2)
    ret= "(hashn_strp(mem32[("+ppfield+"+ (trav_"+travname+"<<2)) >>2]),h)";
  return ret;
//  else throw new Error "filter does not support datatype:" + type;
}



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
function buildLikeFun(strlit, likeFun){
  for (var i=0;i<strlit.length;i++){
    var currc=strlit.charCodeAt(i)
    if (currc!=33 && //!
        currc!=37 && //%
        currc!=45 && //-
        currc!=91 && //[
        currc!=93 && //]
        currc!=94 && //^
        currc!=95){   //_
     likeFun+='if ((mem8[(strp+'    + i +')|0]|0)!=('+currc+')) return 0;';
    } else if (currc == 37){
      return buildLikeFun_pct(strlit.substring(i),likeFun);
    }
  }
}

function buildLikeFun_pct(strlit, likeFun){
  for (var i=1;i<strlit.length;i++){
    var currc=strlit.charCodeAt(i)
    if (currc!=33 && //!
        currc!=37 && //%
        currc!=45 && //-
        currc!=91 && //[
        currc!=93 && //]
        currc!=94 && //^
        currc!=95){   //_
     likeFun+='if ((mem8[(strp+'    + i +')|0]|0)!=('+currc+')) return 0;';
    } else if (currc == 37){
      return buildLikeFun_(strlit,likeFun);
    }
  }
}

function defun(fbody){
  uniqueVarCounter++;
  var funname=' fun' + uniqueVarCounter;
  funs.push( 'function ' + funname + fbody );
  return funname;
}
function like_begins(strp,strlit){
  var ret="";
  var strlitlen=strlit.length;
  for (var i=0;i<strlitlen;i++){
    intval=(strlit.charCodeAt(i)||0);
    ret+='((mem8[('+strp+'+'+i+')|0]|0)==('+intval+'|0))&';
  }
  return ret.substring(0,ret.length-1);
}
function like_ends(strp, strlit){
  var ret="((tmpstrlen=(strlen("+strp+"))|0)|1)&";
  var c=0;
  var strlitlen=strlit.length;
  for (var i=0;i<strlitlen;i++){
    intval=(strlit.charCodeAt(c++)||0);
    ret+='((mem8[(('+strp+' + ( tmpstrlen - '+ (strlitlen-i)+' ))|0)]|0)==('+intval+'|0))&';
  }
  return ret.substring(0,ret.length-1);
}
function like_has(strp, strlit){
  var strlitlen=strlit.length;
  var snake="";
  for (var i=0;i<strlitlen;i++){
    var intval=(strlit.charCodeAt(i)||0);
    snake+='((mem8[((strp + ( i + '+ (i)+')|0)|0)]|0)==('+intval+'|0))&';
  }
  snake= snake.substring(0,snake.length-1);
  var fbody=`(strp){
    strp=strp|0;
    var len=0;
    var i=0;
    len=strlen(strp)|0;
    while(1){
      if (len<(`+strlitlen+`+i)) return 0;
      if (`+snake+`) return 1;
      i=(i+1)|0;
    }
  }`;
  return "("+defun(fbody)+"("+strp+")|0)";
}
function build_snake(strlit, islast){
  var strlitlen=strlit.length;
  if (strlit == 0) return "";
  var snake= "";
  for (var i=0;i<strlitlen;i++){
    var intval=(strlit.charCodeAt(i)||0);
    snake+='((mem8[((strp + ( i + '+ (i)+')|0)|0)]|0)==('+intval+'|0))&';
  }
  snake= snake.substring(0,snake.length-1);
  var fin = 'break';
  if (islast) fin='return 1';

  return `while(1){
      if ((len|0)<((`+strlitlen+`+i)|0)) return 0;
      if (`+snake+`) `+fin+`;
      i=(i+1)|0;
    }`;
  }
function like_haslist(strp, list){
  if (list.length == 0) return 0;
  var snakes="";
  for (var i=0;i<list.length;i++){
    if (list[i]=="") continue;
    snakes+=build_snake(list[i], i==(list.length-1))
  }
  var fbody=`(strp){
    strp=strp|0;
    var len=0;
    var i=0;
    len=strlen(strp)|0;
    `+snakes+`
    return 0;
  }`;
  return "("+defun(fbody)+"("+strp+")|0)";
}
function qc(it){
  //if (typeof it =='undefined')
  it=theGeneratingAB;
  var tables=[];
  for(var i=0;i<it.fromA.length;i++)
    tables.push(it.als2tab[it.fromA[i]]);
  for(var i=0;i<it.joinA.length;i++)
    tables.push(it.als2tab[it.joinA[i]]);
  return {
           tabs: tables,
           als2tab: it.als2tab,
           tab2als: it.tab2als
         }
}
function qt(it){
  return qc(it).tabs;
}
//////////////////////////////////////////////////////////////////////////////
//API
function like(p1,strlit){
  var ret="";
  var strp=bindCol(p1);
  var numpct=(strlit.match(/\%/g) || []).length;
  var begins="";
  var ends="";

  if (numpct ==0) return eq(p1,strlit);
  
  var frst_pct=strlit.indexOf('%');

  if  (frst_pct>0){
    begins=like_begins(strp,strlit.substring(0,frst_pct));
    strlit=strlit.substring(frst_pct);
  }

  var last_pct=strlit.lastIndexOf('%');
  if  (last_pct<(strlit.length-1)){
    ends=like_ends(strp,strlit.substring(last_pct+1));
    strlit=strlit.substring(0,last_pct+1);
  }
  
  var lit_list=strlit.split('%');
  var rest_list=[];
  for (var i=0;i<lit_list.length;i++)
    if (lit_list[i] != "")
      rest_list.push(lit_list[i])
  var rest=like_haslist(strp,rest_list);

  if (begins!= "") ret=begins;
  if (ends!="") ret+= '&'+ ends;
  if (rest!="") ret+= '&'+ rest;
  if (ret[0]=='&') return ret.substring(1);
  return ret;
} 


function not(p1){
  return "(!(" + p1 + "))";
}
function eq(p1,p2){
  return compare('==',p1,p2);
}
function neq(p1,p2){
  return not(compare('==',p1,p2));
}
function lte(p1,p2){
  return compare('<=',p1,p2);
}
function gte(p1,p2){
  return compare('>=',p1,p2);
}
function lt(p1,p2){
  return compare('<',p1,p2);
}
function gt(p1,p2){
  return compare('>',p1,p2);
}
function between(p1,p2,p3){
  return '('+ gte(p1,p2) + '&' + lte(p1,p3) + ')';
}
function isin(p1,list){
  var ret="";
  if (list.length==0) return "";
  if (list.length==1) return eq(p1,list[0]);
  if (isPreBoundString(p1)){
   var p1b=p1.substring(3);
   ret='((isintmpstr='+p1b+')&0)|';
   return ret+or(eq('pb$((isintmpstr))',list[0]),isin('pb$((isintmpstr))',list.slice(1))) + "";
  }
  else return or(eq(p1,list[0]),isin(p1,list.slice(1)));
}
function eqlit(p1,p2){
}
function ltelit(p1,p2){
}
function gtelit(p1,p2){
}
function ltlit(p1,p2){
}
function gtlit(p1,p2){
}
function betweenlit(p1,p2,p3){
}
function or(p1,p2, ...rest){
  if (rest.length>0)
    return or(p1, or(p2,rest[0], ...rest.slice(1)));
  else if (p2)
    return '((' + p1 + ')|(' +p2 + '))';
  else
    return '(' + p1 + ')';

}
function and(p1,p2, ...rest){
  if (rest.length>0)
    return and(p1, and(p2,rest[0], ...rest.slice(1)));
  else if (p2)
    return '((' + p1 + ')&(' +p2 + '))';
  else
    return '(' + p1 + ')';
}
function compare(op,p1,p2){
  var p1b=bindCol(p1);
  var p2b=bindCol(p2);
  var p1t=typeCol(p1);
  var p2t=typeCol(p2);

  if (p1b && p2b && p1t==2 && p2t==2 && op=='=='){
    return '(mystrcp(' +p1b+ op + p2b+')|0)';
  } else if (p1b && p2b){
    return '(' +coerceFloatIf(p1b)+ op + coerceFloatIf(p2b)+')';
  } else if (p1b){
    if ((typeof p2) == 'string' && (op == '==')){
      if ((p1t == 2) || isPreBoundString(p1))
        return expandStrLitComp(p1b,p2);
      else if (p1t == 4 && p2.length==1){
        //return expandLitComp(op,p1t,p1b,p2.charCodeAt(0));
        return expandLitComp(op,1,p1b,p2.charCodeAt(0));
      }
      else 
        badFSQL('@compare');
    } else {
      //return expandLitComp(op,p1t,p1b,p2);  
      return expandLitComp(op,1,p1b,p2);  
    }
  } else if (p2b){
    if ((typeof p1) == 'string' && (op == '==')){
      if (p2t == 2)
        return expandStrLitComp(p2b,p1);
      else if (p2t == 4 && p1.length==1)
        return expandLitComp(op,p2t,p2b,p1.charCodeAt(0));
      else 
        badFSQL('@compare');

    } else {
      //return expandLitComp(op,p2t,p2b,p1);  
      return expandLitComp(op,1,p2b,p1);  
    }
  }
  else{//todo: eval here 
    return '(' +p1+ op + p2+')';
  }
}

function isPreBound(p1){
  return isPreBoundString(p1) || isPreBoundNumber(p1) ;
}
function isPreBoundString(p1){
  if (typeof p1 != 'string') return false;
  return p1.indexOf('pb$')==0 ;
}
function isPreBoundNumber(p1){
  if (typeof p1 != 'string') return false;
  return p1.indexOf('pb$')<0 && p1.indexOf('pb')==0 ;
}


function substring(p1,n,m){
  if (inNode){
    bindCol=require("afterburner.js").bindCol;
    typeCol=require("afterburner.js").typeCol;
  }
  var p1b=bindCol(p1);
  var p1t=typeCol(p1);
  if (p1t!=2){
    badFSQL('@substring', p1 + 'is not a string')
  }else if (n>=m){
    badFSQL('@substring invalid substring range')
  } 
  else {
    return 'pb$(substr(' + p1b + ','+n+','+m+')|0)';
  }
}
function toYear(p1){
  var p1b=bindCol(p1);
  var p1t=typeCol(p1);
  if (p1t!=3){
    badFSQL('@toYear', p1 + 'is not a date')
  } else {
    return 'pb(+(intDayToYear(' + p1b + ')|0))';
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
///////////////////////////////////////////////////////////
function min(p){
  var bound="";
  if ((p != null) && typeof p == 'string' && p.indexOf('pb')>-1){
    bound=p.substring(3,str.length);
  } else {
    var ppfield= pointCol(p);
    bound=bindCol(p)
  }
  var unique=uniqueVarCounter++;
  var type= typeCol(p);
  var varname="min"+unique
  return `dec:var `+varname+`=10000000000.1;::
  post:res.addCol2('min(`+p+`)',`+type+`);::
  preexek:`+varname+`=10000000000.1;::
  exec: if (`+varname+` > (`+bound+`)) {`+varname+` = `+bound+`;}::
  execg:if (`+varname+` > (`+bound+`)) {`+varname+` = `+bound+`;}::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
  
}
function max(p){
  var bound="";
  if ((p != null) && typeof p == 'string' && p.indexOf('pb')>-1){
    bound=p.substring(3,str.length);
  } else {
    var ppfield= pointCol(p);
    bound=bindCol(p)
  }
  var unique=uniqueVarCounter++;
  var type= typeCol(p);
  var varname="max"+unique
  return `dec:var `+varname+`=-10000000000.1;::
  post:res.addCol2('max(`+p+`)',`+type+`);::
  preexek:`+varname+`=-10000000000.1;::
  exec: if (`+varname+` < (`+bound+`)) {`+varname+` = `+bound+`;}::
  execg:if (`+varname+` < (`+bound+`)) {`+varname+` = `+bound+`;}::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
}
function count(p){
  unique=uniqueVarCounter++;
  var type = 0;
  var varname="count"+unique;
  var checknull=""
  if ((theGeneratingAB.hasljoin >0) &  p!="*"){
    var trav=col2trav(p);
    if (theGeneratingAB.fromA.indexOf(trav)<0)
      checknull="if ((trav_"+trav+"|0) !=-666) "; // is not NULL
  }
  return `dec:var `+varname+`=0;::
  post:res.addCol2('count(`+p+`)',`+type+`);::
  preexek:`+varname+`=0;::
  exec: `+checknull+varname+`=`+varname+`+1|0;::
  execg:`+checknull+varname+`=`+varname+`+1|0;::
  postexek:mem32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
}
function countif(p,cond){
  unique=uniqueVarCounter++;
  type = 0;
  varname="count"+unique;
  var checknull=""
  if ((theGeneratingAB.hasljoin >0) &  p!="*"){
    var trav=col2trav(p);
    if (theGeneratingAB.fromA.indexOf(trav)<0)
      checknull="if ((trav_"+trav+"|0) !=-666) "; // is not NULL
  }
  return `dec:var `+varname+`=0;::
  post:res.addCol2('count(`+p+`)',`+type+`);::
  preexek:`+varname+`=0;::
  exec: if(`+cond+`)`+checknull+varname+`=`+varname+`+1|0;::
  execg:if(`+cond+`)`+checknull+varname+`=`+varname+`+1|0;::
  postexek:mem32[(temps+(tempsptr<<2))>>2]=`+varname+`;tempsptr= (tempsptr + 1 )|0;::`;
}
function sum(p){
  var bound=bindCol(p);
  var unique=uniqueVarCounter++;
  var type= typeCol(p);
  if ((type==0) || (type==3) || (type==4))
    bound=coerceFloat(bound);
  var trav= col2trav(p);
  var varname="sum"+unique
  return `dec:var `+varname+`=0.0;::
  post:res.addCol2('sum(`+p+`)',1);::
  preexek:`+varname+`=+(0);::
  exec:`+varname+`=`+varname+`+(`+bound+`);::
  execg:`+varname+`=`+varname+`+(`+bound+`);::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=+(`+varname+`);tempsptr= (tempsptr + 1 )|0;::`;
}
function sumif(p,cond){
  var bound=bindCol(p);
  var unique=uniqueVarCounter++;
  var type= typeCol(p);
  if ((type==0) || (type==3) || (type==4))
    bound=coerceFloat(bound);
  var trav= col2trav(p);
  var varname="sum"+unique
  return `dec:var `+varname+`=0.0;::
  post:res.addCol2('sum(`+p+`)',1);::
  preexek:`+varname+`=+(0);::
  exec: if(`+cond+`)`+varname+`=`+varname+`+(`+bound+`);::
  execg:if(`+cond+`)`+varname+`=`+varname+`+(`+bound+`);::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=+(`+varname+`);tempsptr= (tempsptr + 1 )|0;::`;
}
function avg(p){
  var bound=bindCol(p);
  var unique=uniqueVarCounter++;
  var type= typeCol(p);
  if ((type==0) || (type==3) || (type==4))
    bound=coerceFloat(bound);
  var tab= col2trav(p);
  var varnamesum="avgsum"+unique
  var varnamecount="avgcount"+unique
  return `dec:var `+varnamecount+`=0.0;::
  dec:var `+varnamesum+`=0.0;::
  post:res.addCol2('avg(`+p+`)',1);::
  preexek:`+varnamesum+`=0.0;::
  preexek:`+varnamecount+`=0.0;::
  exec:`+varnamesum+`=`+varnamesum+`+(`+bound+`);::
  execg:`+varnamesum+`=`+varnamesum+`+(`+bound+`);::
  exec:`+varnamecount+`=`+varnamecount+`+1.0;::
  execg:`+varnamecount+`=`+varnamecount+`+1.0;::
  postexek:memF32[(temps+(tempsptr<<2))>>2]=+(+(` +  varnamesum  + `)/ +(` + varnamecount + `));tempsptr= (tempsptr + 1 )|0;::`;
}
///////////////////////////////////////////////////////////
function expandStrLitComp(strp, strlit){
  quartets=Math.ceil((strlit.length+1)/4);
  ret="";
  c=0;
  for (var i=0;i<quartets;i++){
    if((c==strlit.length)){
        ret+='((mem8[(('+strp+' + ('+i+'<<2))|0)]|0)==0)&';
    }
    else{
    intval=(strlit.charCodeAt(c++)||0)+
           ((strlit.charCodeAt(c++)||0)<<8)+
           ((strlit.charCodeAt(c++)||0)<<16)+
           ((strlit.charCodeAt(c++)||0)<<24);
        ret+='((mem32[(('+strp+' + ('+i+'<<2))|0)>>2]|0)==('+intval+'|0))&';
    }
  }
  return ret.substring(0,ret.length-1);
}

function expandLitComp(op,type,bp,lp){
//  if (type==1){
//    lp= '(+('+lp+'))';
//  } else {
//    lp= '(('+lp+')|0)';
//  }
  ret= '(' + coerceFloatIf(bp) + '' + op + '' +  coerceFloatIf(lp) + ')';
  return ret;
}

function date(p1){
  return strdate_to_int(p1);
}
function coerceFloat(p){
  p = p+"";
  if (p.indexOf('.')>-1) return p;
  else if (p.indexOf('mem')>-1) return  "(+(" + p + "|0))";
  else return "(+(" + p + "))";
} 
function coerceFloatIf(p){
  p = p+"";
  if (p.indexOf('.')>-1) return p;
  else if (p.indexOf('(+(')>-1) return p;
  else if (p.indexOf('+(memF32')>-1) return p;
  else return "(+(" + p + "|0))";
} 

function arith(op,p1,p2){
  var p1b=bindCol(p1);
  var p2b=bindCol(p2);
  if (p1b && p2b)
    return 'pb((+('+p1b+'))' +op +' (+(' + p2b+')))';
  else if (p1b)
    return 'pb(('+p1b+')' +op +'(' + coerceFloat(p2)+'))';
  else if (p2b)
    return 'pb(('+coerceFloat(p1) +')' +op +'(' + p2b+'))';
  else 
    return 'pb(('+coerceFloat(p1)+')' +op +'(' + coerceFloat(p2)+'))';

}
function add(p1,p2){
  return arith('+',p1,p2);
}
function sub(p1,p2){
  return arith('-',p1,p2);
}
function mul(p1,p2){
  return arith('*',p1,p2);
}
function div(p1,p2){
  return arith('/',p1,p2);
}
function as(p1,al){
  var oNameI=p1.indexOf("'",p1.indexOf("addCol2",0));
  if (oNameI>-1){
    var oNamelI=p1.indexOf("'",oNameI+1);
    return p1.substring(0,oNameI+1) + al + p1.substring(oNamelI)
  }
  return 'as{'+p1+'~'+al+'}';
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting afterburner');
  module.exports.Afterburner=Afterburner;
  module.exports.bindCol=bindCol;
  module.exports.typeCol=typeCol;
  global.like=like;
  global.not=not;
  global.eq=eq;
  global.neq=neq;
  global.lte=lte;
  global.gte=gte;
  global.lt=lt;
  global.gt=gt;
  global.between=between;
  global.isin=isin;
  global.or=or;
  global.and=and;
  global.substring=substring;
//  global.qc=qc;
//  global.qt=qt;
  global.toYear=toYear;
  global.min=min;
  global.max=max;
  global.count=count;
  global.countif=countif;
  global.sum=sum;
  global.sumif=sumif;
  global.avg=avg;
  global.date=date;
  global.add=add;
  global.sub=sub;
  global.mul=mul;
  global.div=div;
  global.as=as;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
