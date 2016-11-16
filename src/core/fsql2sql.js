//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
}else{ }
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var uniqueCounter=0;
//base types: relation, column, cond, litral
function fsql2sql(){
  this.fromA=[];
  this.joinA=[];
  this.ljoinA=[];
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
  this.havingA=[]
  this.orderA=[];
  this.limitA=-1;
  this.resA=[];
  this.als2tab={};
  this.tab2als={};
  this.name="STMT"+ uniqueCounter++;

  this.select = function(){
    return this;
  }
  this.from = function(rel, ...rest){
    rel=fixRel(rel);
    this.fromA.push(rel);
    if (rest.length>0)
      return this.from(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.join = function(rel){
    this.joinA.push(rel);
    return this;
  }
  this.ljoin = function(rel){
    rel=fixRel(rel);
    this.ljoinA.push(rel);
    return this;
  }
  this.infrom = function(){
    return this;
  }
  this.tabAliasif = function(){
    this.als2tab;
    this.tab2als;
    return this;
  }
  this.on = function(cond, ...rest){
    this.onA.push(cond);
    if (rest.length>0)
      return this.on(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.field = function(col, ...rest){
    console.log("field:"+col);
    col=fixCol(col);
    if (col.substring(0,2)=='as'){
      var alias=col;
      alias=col.substring(col.indexOf('~')+1, col.indexOf('}'));
      col=col.substring(col.indexOf('{')+1,col.indexOf('~'));
      col = col + " AS " + alias;
    }
    this.attsA.push(col);
    if (rest.length>0)
      return this.field(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.where = function(cond, ...rest){
    this.whereA.push(cond);
    if (rest.length>0)
      return this.where(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.group = function(col, ...rest){
    col=fixCol(col);
    this.groupA.push(col);
    if (rest.length>0)
      return this.group(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.having = function(cond, ...rest){
    this.havingA.push(cond);
    if (rest.length>0)
      return this.having(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.order = function(col, ...rest){
    console.log("order:"+col);
    if (col[0]== '-')
      col= col.substring(1) + " DESC";
    console.log("order:"+col);
    col=fixCol(col);
    console.log("order:"+col);
    this.orderA.push(col);
    if (rest.length>0)
      return this.order(rest[0], ...rest.slice(1));
    else 
      return this;
  }

  this.limit = function(lit){
    this.limitA=lit;
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

    var LJOIN_STMT="";
    if(this.ljoinA.length>0)
      LJOIN_STMT="LEFT JOIN " + this.ljoinA + " ON " + this.onA.join(' AND ');

    var WHERE_STMT="";
    if (this.whereA.length>0)
      WHERE_STMT="WHERE "+ this.whereA.join(' AND ');

    var GROUP_STMT="";
    if (this.groupA.length>0)
      GROUP_STMT="GROUP BY "+ this.groupA.join(', ');

    var HAVING_STMT="";
    if (this.havingA.length>0)
      HAVING_STMT="HAVING "+ this.havingA.join(' AND ');

    var ORDER_STMT="";
    if (this.orderA.length) 
      ORDER_STMT="ORDER BY "+ this.orderA.join(', ');

    var LIMIT_STMT="";
    if (this.limitA >0)
      LIMIT_STMT="LIMIT "+ this.limitA;

    var sqlstr= SELECT_STMT + " " +
      FROM_STMT + " " +
      LJOIN_STMT + " " +
      WHERE_STMT + " " +
      GROUP_STMT + " " +
      HAVING_STMT + " " +
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
function like(col,strlit){
  col=fixCol(col);
  return col + " LIKE '" + strlit+"'";
}
function notlike(col,strlit){
  col=fixCol(col);
  return col + " NOT LIKE '" + strlit+"'";
}

function not(cond){
  return "NOT (" + cond + ")";
}
function eq(col1,col2){
  return compare("=",col1,col2);
}
function neq(col1,col2){
  return compare("<>",col1,col2);
}
function lte(col1,col2){
  return compare("<=",col1,col2);
}
function gte(col1,col2){
  return compare(">=",col1,col2);
}
function lt(col1,col2){
  return compare("<",col1,col2);
}
function gt(col1,col2){
  return compare(">",col1,col2);
}
function between(col1,col2,col3){
  col1=fixCol(col1);
  col2=fixCol(col2);
  col3=fixCol(col3);
  return col1 + " BETWEEN " + col2 + " AND " + col3;
}
function isin(col,list){
  col=fixCol(col);
  if (list instanceof Array)
    return col + " IN (" + list.map(fixCol).join(",") + ")"
  else 
    return col + " IN (" + list.toSQL() + ")"
}
function isnotin(col,list){
  col=fixCol(col);
  if (list instanceof Array)
    return col + " NOT IN (" + list.map(fixCol).join(",") + ")"
  else 
    return col + " NOT IN (" + list.toSQL() + ")"
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
function or(cond1,cond2, ...rest){
  if (rest.length>0)
    return or(cond1, or(cond2,rest[0], ...rest.slice(1)));
  else if (cond2)
    return '((' + cond1 + ') OR (' +cond2 + '))';
  else
    return '(' + cond1 + ')';
}
function and(cond1,cond2, ...rest){
  if (rest.length>0)
    return and(cond1, and(cond2,rest[0], ...rest.slice(1)));
  else if (cond2)
    return '((' + cond1 + ') AND (' +cond2 + '))';
  else
    return '(' + cond1 + ')';
}
function compare(op,col1,col2){
  col1=fixCol(col1);
  col2=fixCol(col2);
  return col1 + op + col2;
}
function isPreBound(p1){
}
function isPreBoundString(p1){
}
function isPreBoundNumber(p1){
}
function substring(p1,n,m){
}
function toYear(col){
  col=fixCol(col);
  return "@EXTRACT(YEAR FROM "+ col + ")";
}
function field(){
}
function aggregate(){
}
function min(col){
  col=fixCol(col);
  return "@MIN("+col+")";
}
function max(col){
  col=fixCol(col);
  return "@MAX("+col+")";
}
function count(col){
  col=fixCol(col);
  return "@COUNT("+col+")";
}
function countdistinct(col){
  col=fixCol(col);
  return "@COUNT( distinct "+col+")";
}
function countif(p,cond){
}
function sum(col){
  col=fixCol(col);
  return "@SUM("+col+")";
}
function sumif(col,cond){
  col=fixCol(col);
  return "@SUM(CASE WHEN ("+cond+") THEN " + col + " ELSE 0 END)"
}
function avg(col){
  col=fixCol(col);
  return "@AVG("+col+")";
}
function expandStrLitComp(strp, strlit){
}
function expandLitComp(op,type,bp,lp){
}
function date(col){
  col=fixCol(col);
  return "DATE " + col;
}
function coerceFloat(p){
}
function coerceFloatIf(p){
}
function arith(op,c1,c2){
  c1=fixCol(c1);
  c2=fixCol(c2);
  return "@("+c1 + op + c2 + ")";
}
function add(col1,col2){
  return arith("+",col1,col2);
}
function sub(col1,col2){
  return arith("-",col1,col2);
}
function mul(col1,col2){
  return arith("*",col1,col2);
}
function div(col1,col2){
  return arith("/",col,col2);
}
function as(col,al){
  return col + " AS " + al;
}
function exists(relation){
  return 'EXISTS (' + relation.toSQL() + ')';
}
//function fixParam(param){
//  if (typeof param == 'string'){
//    if (param[0]=='@')
//      param=param.substring(1)
//    else 
//      param="'"+param+"'";
//
//  } else if (param instanceof fsql2sql){
//      param= "(" + param.toSQL() + ") AS tmpParam"+  uniqueCounter++;
//  }
//  return param;
//}
function fixCol(col){
  if (typeof col == 'string'){
    if (col[0]=='@')
      col=col.substring(1)
    else 
      col="'"+col+"'";

  } else if (col instanceof fsql2sql){
      col= "(" + col.toSQL() + ")";
  }
  return col;
}
function fixRel(rel){
  if (typeof rel == 'string'){
    if (rel[0]=='@')
      rel=rel.substring(1)
    else 
      rel="'"+rel+"'";

  } else if (rel instanceof fsql2sql){
      rel= "(" + rel.toSQL() + ") AS " + rel.name;
  }
  return rel;
}
