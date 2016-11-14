function fsql2sql(){
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

  this.select = function(param){
    return this;
  }
  this.from = function(param, ...rest){
    console.log("from:"+param)
    if (typeof param == 'string' && param[0]=="@")
      param=param.substring(1);
    this.fromA.push(param);
    if (rest.length>0)
      return this.from(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.join = function(param){
    this.joinA.push(param);
    return this;
  }
  this.ljoin = function(param){
    this.ljoinA.push(param);
    return this;
  }
  this.infrom = function(param){
    return this;
  }
  this.tabAliasif = function(param){
    this.als2tab;
    this.tab2als;
    return this;
  }
  this.on = function(param1, param2){
    return this;
  }
  this.isin = function(param1,param2){
    return this;
  }
  this.isnotin = function(param1,param2){
    return this;
  }
  this.field = function(param, ...rest){
    console.log("field:"+param);
    param=fixParam(param);
    if (param.substring(0,2)=='as'){
      var alias=param;
      alias=param.substring(param.indexOf('~')+1,param.indexOf('}'));
      param=param.substring(param.indexOf('{')+1,param.indexOf('~'));
      param = param + " AS " + alias;
    }
    this.attsA.push(param);
    if (rest.length>0)
      return this.field(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.where = function(param, ...rest){
    //param=fixParam(param);
    this.whereA.push(param);
    if (rest.length>0)
      return this.where(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.group = function(param, ...rest){
    param=fixParam(param);
    this.groupA.push(param);
    if (this.attsA.indexOf(param)<0)
      this.attsA.push(param);
    if (rest.length>0)
      return this.group(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.order = function(param, ...rest){
    console.log("order:"+param);
    if (param[0]== '-')
      param= param.substring(1) + " DESC";
    console.log("order:"+param);
    param=fixParam(param);
    console.log("order:"+param);
    this.orderA.push(param);
    if (rest.length>0)
      return this.order(rest[0], ...rest.slice(1));
    else 
      return this;
  }

  this.limit = function(param){
    this.limitA=param;
    return this;
  }
  this.expandFrom = function(){
    return this;
  }
  this.expandJoin = function(){
    return this;
  }
  this.expandFields = function(){
    return this;
  }
  this.expandFilter = function(){
    return this;
  }
  this.expandPreBuildJFilter = function(){
    return this;
  }
  this.expandPostProbeJFilter = function(){
    return this;
  }
  this.expandGroup = function(){
    return this;
  }
  this.expandGroupJoinKey = function(){
    return this;
  }
  this.validate = function(){
    return this;
  }
  this.buildGroupJoin = function(){
    return this;
  }
  this.buildJoin = function(){
    return this;
  }
  this.buildGroup = function(){
    return this;
  }
  this.build = function(){
    return this;
  }
  this.toVanilla = function(purpose){
    return this;
  }
  this.toAsm = function(){
    return this;
  }
  this.toString = function(purpose){
    return this.toSQL();
  }
  this.toSQL = function(){
    var SELECT_STMT="SELECT " + this.attsA.join(', ');
    var FROM_STMT="FROM " + this.fromA.join(', ');

    var WHERE_STMT="";
    if (this.whereA.length>0)
      WHERE_STMT="WHERE "+ this.whereA.join(' AND ');

    var GROUP_STMT="";
    if (this.groupA.length>0)
      GROUP_STMT="GROUP BY "+ this.groupA.join(', ');

    var ORDER_STMT="";
    if (this.orderA.length) 
      ORDER_STMT="ORDER BY "+ this.orderA.join(', ');

    var LIMIT_STMT="";
    if (this.limitA >0)
      LIMIT_STMT="LIMIT "+ this.limitA;

    var sqlstr= SELECT_STMT + " " +
      FROM_STMT + " " +
      WHERE_STMT + " " +
      GROUP_STMT + " " +
      ORDER_STMT + " " +
      LIMIT_STMT;
    return sqlstr;
  }
  console.log("new fsql2sql()");
}
function hash_str(strp){
}
function mystrcmp(str1, str2){
}
function strlen(str){
}
function substr(str,n,m){
}
function malloc(size){
}
function mallocout(){
}
function intDayToYear(day){
}
this.toArray = function(vanilla){
}
this.toArray2 = function(vanilla){
}
this.eval = function(vanilla){
}
this.materialize = function(vanilla){
}
function resolve(colname){
}
function pointCol(colname){
}
function typeCol(colname){
}
function col2trav(colname){
}
function tabSize(tabname){
}
function bindCol(colname){
}
function obindCol(colname){
}
function contbind(pfield){
}
function gbind(pfield){
}
function gbindn(pfield){
}
function extractfrom(fromtext,what,opt,filt){
}
function buildLikeFun(strlit, likeFun){
}
function buildLikeFun_pct(strlit, likeFun){
}
function defun(fbody){
}
function like_begins(strp,strlit){
}
function like_ends(strp, strlit){
}
function like_has(strp, strlit){
}
function build_snake(strlit, islast){
}
function like_haslist(strp, list){
}
function qc(it){
}
function qt(it){
}
function like(p,strlit){
  p=fixParam(p);
  return p + " LIKE '" + strlit+"'";
}
function not(p1){
}
function eq(p1,p2){
  return compare("=",p1,p2);
}
function neq(p1,p2){
  return compare("<>",p1,p2);
}
function lte(p1,p2){
  return compare("<=",p1,p2);
}
function gte(p1,p2){
  return compare(">=",p1,p2);
}
function lt(p1,p2){
  return compare("<",p1,p2);
}
function gt(p1,p2){
  return compare(">",p1,p2);
}
function between(p1,p2,p3){
  return p1 + " BETWEEN " + p2 + " AND " + p3;
}
function isin(p1,list){
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
}
function and(p1,p2, ...rest){
}
function compare(op,p1,p2){
  p1=fixParam(p1);
  p2=fixParam(p2);
  return p1 + op + p2;
}
function isPreBound(p1){
}
function isPreBoundString(p1){
}
function isPreBoundNumber(p1){
}
function substring(p1,n,m){
}
function toYear(p1){
}
function field(){
}
function aggregate(){
}
function min(p){
  p=fixParam(p);
  return "@MIN("+p+")";
}
function max(p){
  p=fixParam(p);
  return "@MAX("+p+")";
}
function count(p){
  p=fixParam(p);
  return "@COUNT("+p+")";
}
function countif(p,cond){
}
function sum(p){
  p=fixParam(p);
  return "@SUM("+p+")";
}
function sumif(p,cond){
}
function avg(p){
  p=fixParam(p);
  return "@AVG("+p+")";
}
function expandStrLitComp(strp, strlit){
}
function expandLitComp(op,type,bp,lp){
}
function date(p){
  p=fixParam(p);
  return "DATE '" + p1 + "'";
}
function coerceFloat(p){
}
function coerceFloatIf(p){
}
function arith(op,p1,p2){
  p1=fixParam(p1);
  p2=fixParam(p2);
  return "@("+p1 + op + p2 + ")";
}
function add(p1,p2){
  return arith("+",p1,p2);
}
function sub(p1,p2){
  return arith("-",p1,p2);
}
function mul(p1,p2){
  return arith("*",p1,p2);
}
function div(p1,p2){
  return arith("/",p1,p2);
}
function as(p1,al){
  return p1 + " AS " + al;
}
function exists(param){
  return 'EXISTS (' + param.toSQL() + ')';
}
function fixParam(param){
  if (typeof param == 'string'){
    if (param[0]=='@')
      param=param.substring(1)
    else 
      param="'"+param+"'";

  } else if (param instanceof fsql2sql){
      param= "(" + param.toSQL() + ")";
  }
  return param;
}
