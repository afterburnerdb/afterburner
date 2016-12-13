//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
}else{ }
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var uniqueCounter=0;
var theGeneratingFS;
//Basic types: relation, column, condition, literal
/*****
//////
Query Types:
A: Closed query
B: Open Query
C: Closed query against mav

Materialization:
I: Materialize @BE -> create a BE table based on SQL Query, return table name
II: Materialize @FE -> run SQL @BE, pull data as a new AB table, return table name

Against:
i: against mav@BE
ii: against mav@FE

///////
case  -> spit, exec, store,returns, how to run?
I*A   -> SQL , BE  , BE   ,tablename, select()...materialize_be()
I*B   -> SQL , BE  , BE   , , bemav=select().open(..)...materialize_be()
I*Ci  -> SQL , BE  , BE   , , select(bemav)....materialize_be()
I*Cii -> Not supported!   , , select(femav)....materialize_be() <- should throw an error!

II*A  -> SQL , BE  , FE   , ,  select()...[materialize_fe()|toArray()|eval()|toArray2()|materialize()]
II*B  -> SQL , BE  , FE   , ,  femav=select().open(..)...materialize_fe()
II*Ci -> SQL , BE  , FE   , ,  select(bemav)....[materialize_fe()|toArray()|eval()|toArray2()|materialize()]
II*Cii-> ABi , FE  , FE   , ,  select(femav)....[materialize_fe()|toArray()|eval()|toArray2()|materialize()]

///////
Human version:
I * A -> fsql2sql, generates closed SQL, execSQL into BE table, scenario supported (maybe useful for experiments)!
I * B -> fsql2sql, generates mav definition in closed SQL, execSQL into BE table, mav@BE used to accelerate against queries running @BE (I * C)..
I * C -> fsql2sql, (case against mav@BE) generates closed SQL, runs in against BE mav into BE tables, senario supported (but why?)! .. 
                   (case against mav@FE) scenario not supported!
II * A -> fsql2sql, generates colsed SQL, execSQL and pull results, associates with run query @BE..
II * B -> fsql2sql, generates mav definition in closed SQL, execSQL and pull result, FE materializion used to accelerate quries running against @FE (II * C)..
II * C -> fsql2sql, (case against mav@BE) generates closed SQL to run against BE mav, then pull results into FE table 
                    (case against mav@FE) generates closed ABi to run against FE mav..
///////
******/

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
  this.als2col={};
  this.col2als={};
  this.hasAVG=false;
  this.hasgroup=false;
  this.hasagg=false;
  this.name="STMT"+ uniqueCounter++;
  this.opened;
  this.openA=[];
  this.against;
  this.againstbe;
  this.againstfe;
  this.mat;
  this.matbe;
  this.matfe;
  this.ABI;
  ////
  this.select = function(against){
    theGeneratingFS=this;
    if (against instanceof fsql2sql){
      this.against=against.clone();
      if (against.matfe){
        console.log("This query is against fronend mav name:"+against.mat.name);
        this.againstfe=true;
        this.ABI=new Afterburner();
        this.ABI.select().from(against.mat.name);
        console.log("Create a ABI.. should fill that up, next");
      }
      else if (against.matbe){
        DEBUG("This query is against backend mav name:"+against.mat.name);
        this.againstbe=true;
        this.fromA.push(against.mat.name);
      }
      else 
        console.log("ERROR!!! what type of mav is this ??");
    } else {
      DEBUG("This query is against base relations!!");
    }
    return this;
  }
  this.open = function(col, ...rest){
    if(this.against){
      console.log("Does not support opened col against a mav");
      return;
    }
    col=fixCol(col);
    this.openA.push(col);
    this.opened=true;
    if (rest.length>0)
      return this.open(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.from = function(rel, ...rest){
    if(typeof this.against != 'undefined'){
      if (this.against.antiFrom(rel)){
        return this;
      }
      else{
        return;
      }
    }

    this.inheretIf(rel)
    rel=fixRel(rel);
    if (this.opened){
    }
    this.fromA.push(rel);
    if (rest.length>0)
      return this.from(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.antiFrom = function(rel){
    rel=fixRel(rel);
    var pos=this.fromA.indexOf(rel);
    if (pos<0)
      return false;
    else{
      this.fromA.splice(pos,1);
      return true;
    }
  }
  this.antiWhere = function(cond){
    var pos=this.whereA.indexOf(cond);
    if (pos<0)
      return false;
    else{
      this.whereA.splice(pos,1);
      return true;
    }
  }

  this.join = function(rel){
    this.inheretIf(rel);
    this.joinA.push(rel);
    return this;
  }
  this.ljoin = function(rel){
    this.inheretIf(rel);
    rel=fixRel(rel);
    this.ljoinA.push(rel);
    return this;
  }
  this.inheretIf = function(isitsubq, ...rest){
    if (isitsubq instanceof fsql2sql)
      this.openA=this.openA.concat(isitsubq.openA);
    if (rest.length>0)
      return this.inheretIf(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.infrom = function(){
    return this;
  }
  this.tabAliasif = function(){
//    this.als2tab;
//    this.tab2als;
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
    if (col.indexOf("@AVG")>-1){
      this.hasAVG=true;
      if (this.openA.length>0)
        col=col.replace("@AVG","@SUM");
      else if (this.againstbe)
        col=div(col.replace("@AVG","@SUM"),sum('@dacount'));
      else if (this.againstfe)
        console.log("YOU SHOULD NOT BE HERE!!!");
    }
    this.inheretIf(col);
    col=fixCol(col);
    if (col.substring(0,2)=='as'){
      var alias=col;
      alias=col.substring(col.indexOf('~')+1, col.indexOf('}'));
      col=col.substring(col.indexOf('{')+1,col.indexOf('~'));
      col = col + " AS " + alias;
    }
    if (this.opened){
      if(this.attsA.indexOf(col)<0)
        this.attsA.push(col);
    } else if (this.againstfe){
       if (col.indexOf(" AS ")>-1){
         var colname=col.substring(0,col.indexOf(" AS "));
         var alsname=col.substring(col.indexOf(" AS ")+4,col.length-1);
         col=_as(colname,alsname);
       }
       this.ABI.field(col);
    } else {
       this.attsA.push(col);
    }
    if (rest.length>0)
      return this.field(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.where = function(cond, ...rest){
    var opened=false;
    for (var i=0;i<this.openA.length;i++){
      if ((cond.indexOf(this.openA[i]) >-1)
           && (cond.indexOf('SELECT')<0))
        opened=true;
    }
     if (!opened){
       if (this.againstfe && cond!='alreadyready'){
           
           this.ABI.where(cond);
       } else if (this.againstbe){
         var cond_against_done=this.against.antiWhere(cond);
         var cond_against_opened=(this.against.openA.indexOf(cond)>-1);
         var cond_against_opened=false;
         for (var i=0;i<this.against.openA.length;i++){
           if (cond.indexOf(this.against.openA[i])>-1){
             cond_against_opened=true;
             break;
           }
         }
         if (!cond_against_done && !cond_against_opened){
           console.log("ERROR: Query with a condition not covered by the against MAV.. cond:"+cond);
           return ;
         }
         if (this.againstbe && cond_against_opened)
           this.whereA.push(cond);
       } else {
         this.whereA.push(cond);
       }
     }

    if (rest.length>0)
      return this.where(rest[0], ...rest.slice(1));
    else 
      return this;
  }
  this.group = function(col, ...rest){
    this.hasgroup=true;
    col=fixCol(col);
    if (this.againstfe){
      this.ABI.group(col);
    }
    else{
      this.groupA.push(col);
    }
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
    if (this.againstfe){
      if (col[0]== '-'){
        col="-"+fixCol(col.substring(1));
      } else {
        col=fixCol(col);
      }
      this.ABI.order(col);
    } else {
      if (col[0]== '-')
        col= col.substring(1) + " DESC";
      col=fixCol(col);
      this.orderA.push(col);
    }
    if (rest.length>0)
      return this.order(rest[0], ...rest.slice(1));
    else 
      return this;
  }

  this.limit = function(lit){
    if (this.againstfe) 
      this.ABI.limit(lit);
    else
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
    if (this.againstfe) 
      return this.ABI.toString();
    else
      return this.toSQL();
  }
  this.toSQL = function(){
    if (this.SQLstr)
      return this.SQLstr;
    if (this.againstfe)
      return "ABI";
    if (this.openA.length>0)
      return this.toOpenSQL();
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
    this.SQLstr=sqlstr;
    return sqlstr;
  }
  this.ensureOpenness= function(){
    for (var i=0;i<this.openA.length;i++){
      if (this.attsA.join('').indexOf(this.openA[i]) < 0){
        this.field("@"+this.openA[i]);
        //if (this.groupA.join('').indexOf(this.openA[i]) < 0)
        //  this.group("@"+this.openA[i]);
      }
    }
    if(!this.hasgroup && !this.hasagg){
      for (var i=0;i<this.attsA.length;i++){
        if (this.groupA.indexOf(no_alias(this.attsA[i]) == -1))
          this.groupA.push(no_alias(this.attsA[i]));
      }
    } else {
      for (var i=0;i<this.openA.length;i++){
        if (this.groupA.join('').indexOf(this.openA[i]) < 0)
          this.group("@"+this.openA[i]);
      }
    }
   
    for (var i=0;i<this.attsA.length;i++){
      var indexofAS=this.attsA[i].indexOf(' AS');
      if (indexofAS>-1){
        console.log('NOW THIS IS AN ERROR!');
      }
      this.attsA[i]=this.attsA[i] + " AS \""+ this.attsA[i]+"\"";
    }
    if (this.hasAVG){
        this.attsA.push("COUNT(*) AS dacount");
    }
  }
  this.toOpenSQL = function(){
    this.ensureOpenness();
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

    var sqlstr= SELECT_STMT + " " +
      FROM_STMT + " " +
      LJOIN_STMT + " " +
      WHERE_STMT + " " +
      GROUP_STMT + " " +
      HAVING_STMT;

    return sqlstr;
  }
//  this.toArray = function(vanilla){
//    // Type A
//    this.materialize();
//    if (this.againstfe)
//      return this.femat.toArray(vanilla);
//    else if (this.againstbe)
//      return this.bemat.toArray(vanilla);
//    else 
//
//    return this.femat.toArray();
//  }
    this.toArray2 = function(vanilla){
      if (this.opened){
        console.log("Please use materialize_be or materialize_fe to materialize an opened query (mav)!");
        return;
      }
      if (this.againstfe)
        return this.ABI.toArray2();
      else if (this.againstbe || true) 
        return [].concat.apply([], pci.execSQL(this.toSQL()).data);
    }
//  this.eval = function(vanilla){
//    if (this.againstfe)
//      return this.ABI.eval();
//    this.materialize();
//    return this.femat.eval();
//  }
  this.materialize = function(){
    if (typeof this.mat !='undefined')
      return this;

    if (this.opened){
      console.log("Please use materialize_be or materialize_fe to materialize an opened query (mav)!");
      return;
    }

    if (this.againstfe){
      console.log("running closed query.. query against fe..");
      var tabname=this.ABI.materialize();
      this.mat=daSchema.getTable(tabname);
      this.matfe=true;
      return this;
    } else if (this.againstbe) {
      console.log("running closed query.. query against be..");
      var be_jsn=pci.execSQL(this.toSQL());
      var ds= new dataSource(be_jsn);
      this.mat=new aTable(ds);
      this.matbe=true;
      return this;
    } else {
      DEBUG("running closed query.. query not against anything..");
      var be_jsn=pci.execSQL(this.toSQL());
      var ds= new dataSource(be_jsn);
      var tab=new aTable(ds);
      if (this.openA.length>0)
        tab.setMAVdef(this);
      this.mat=tab;
      return this;
    }
  }
  this.materialize_be = function(){
    if (typeof this.against != 'undefined'){
      console.log("SORRY THIS IS NOT SUPPORTED !!! <<PLUS WHY?>>");
      return ;
    }
    if (this.matbe){
      console.log("Hey, already materialized @BE, returning this");
      return this;
    }
    var mav_def="CREATE TABLE "+ this.name + " AS " + this.toSQL() + " WITH DATA;";
    var be_response=pci.execSQL(mav_def);
    newTable= new aTable(null);
    newTable.name=this.name;
    newTable.setMAVdef(this);
    daSchema.addTable(newTable);
    this.mat=newTable;
    this.matbe=true;
    return this;
  }
  this.materialize_fe = function(forceredo){
    if (typeof this.against != 'undefined'){
      console.log("SORRY THIS IS NOT SUPPORTED !!! <<PLUS WHY?>>");
      return ;
    }
    if (this.matfe && !forceredo)
      return this;
    var betab=this.materialize_be();
    var getMore=true;
    var rowChunk=1000000;
    var chunkID=0;
    var be_jsn=[]
    while(getMore){
      var curr_jsn=pci.execSQL("SELECT * FROM "+ betab.name + " LIMIT "+ rowChunk + " OFFSET " +  (chunkID*rowChunk));
      if (typeof curr_jsn.data == 'object' && curr_jsn.data.length>0){
        getMore=true;
        be_jsn.push(curr_jsn);
      }
      else {
        getMore=false;
      }
      chunkID++;
    }
    var ds= new dataSource(be_jsn);
    var tab=new aTable(ds);
    delete ds;
    if (this.openA.length>0)
      tab.setMAVdef(this);
    this.mat=tab;
    this.matfe=true;
    return this;
  }
  //this.exploreMAVOptions =function(){
  //  console.log("exploreMAVOptions:");

  //  //Explore Ones:
  //  for (var i=0;i<this.whereA.length;i++){
  //    console.log("Try opening query on:"+this.whereA[i]);
  //    var tmpMAV= new fsql2sql();
  //    var tmpFSQL= new fsql2sql();
  //  }
  //  
  //}
  this.clone = function(){
    var newi= new fsql2sql();
    newi.fromA=this.fromA.slice();
    newi.joinA=this.joinA.slice();
    newi.ljoinA=this.ljoinA.slice();
    newi.on=this.on;
    newi.joinP=this.joinP;
    newi.hasljoin=this.hasljoin;
    newi.hasin=this.hasin;
    newi.isinFlag=this.isinFlag;
    newi.attsA=this.attsA.slice();
    newi.fstr=this.fstr;
    newi.aggsA=this.aggsA.slice();
    newi.whereA=this.whereA.slice();
    newi.groupA=this.groupA.slice();
    newi.havingA=this.havingA.slice();
    newi.orderA=this.orderA.slice();
    newi.limitA=this.limitA;
    newi.resA=this.resA.slice();
    newi.als2tab=this.als2tab;
    newi.tab2als=this.tab2als;
    newi.name=this.name;
    newi.openA=this.openA.slice();
    newi.hasAVG=this.hasAVG;
    newi.against=this.against;
    newi.againstbe=this.againstbe;
    newi.againstfe=this.againstfe;
    newi.mat=this.mat;
    newi.matbe=this.matbe;
    newi.matfe=this.matfe;
    newi.ABI=this.ABI;
    return newi;
  }
}

//API
function select(param, ...rest){
  var newi= new fsql2sql();
  return newi.select(param, ...rest);
}
function like(col,strlit){
  col=fixCol(col);
  var condSQL=col + " LIKE '" + strlit+"'";
  if (theGeneratingFS.againstfe){
    if (theGeneratingFS.against.antiWhere(condSQL))
      return "alreadyready";

    return _like(col,strlit);
  }
  return col + " LIKE '" + strlit+"'";
}
function notlike(col,strlit){
  col=fixCol(col);
  if (theGeneratingFS.againstfe){
    return _notlike(col,strlit);
  }

  return col + " NOT LIKE '" + strlit+"'";
}

function not(cond){
  if (theGeneratingFS.againstfe){
    return _not(cond);
  }

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
  theGeneratingFS.inheretIf(col1,col2,col3);
  col1=fixCol(col1);
  col2=fixCol(col2);
  col3=fixCol(col3);

  if (theGeneratingFS.againstfe){
    return _between(col1,col2,col3);
  }
  return col1 + " BETWEEN " + col2 + " AND " + col3;
}
function isin(col,list){
  theGeneratingFS.inheretIf(col);
  col=fixCol(col);

  if (theGeneratingFS.againstfe){
    return _isin(col,list);
  }

  if (list instanceof Array)
    return col + " IN (" + list.map(fixCol).join(",") + ")"
  else {
    theGeneratingFS.inheretIf(list);
    return col + " IN (" + list.toSQL() + ")"
  }
}
function isnotin(col,list){
  theGeneratingFS.inheretIf(col);
  col=fixCol(col);

  if (theGeneratingFS.againstfe){
    return _isnotin(col,list);
  }

  if (list instanceof Array)
    return col + " NOT IN (" + list.map(fixCol).join(",") + ")"
  else {
    theGeneratingFS.inheretIf(list);
    return col + " NOT IN (" + list.toSQL() + ")"
  }
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
  if (theGeneratingFS.againstfe){
    return _or(cond1,cond2, ...rest)
  }
  if (rest.length>0)
    return or(cond1, or(cond2,rest[0], ...rest.slice(1)));
  else if (cond2)
    return '((' + cond1 + ') OR (' +cond2 + '))';
  else
    return '(' + cond1 + ')';
}
function and(cond1,cond2, ...rest){
  if (theGeneratingFS.againstfe){
    return _and(cond1,cond2, ...rest);
  }

  if (rest.length>0)
    return and(cond1, and(cond2,rest[0], ...rest.slice(1)));
  else if (cond2)
    return '((' + cond1 + ') AND (' +cond2 + '))';
  else
    return '(' + cond1 + ')';
}
function compare(op,col1,col2){
  theGeneratingFS.inheretIf(col1,col2);
  col1=fixCol(col1);
  col2=fixCol(col2);

  var condSQL=col1 + op + col2;

  if (theGeneratingFS.againstfe){
    if (theGeneratingFS.against.antiWhere(condSQL)){
      console.log("condSQL is already ready:"+condSQL);
      return "alreadyready";
    }else{
      console.log("condSQL is not ready.. so it has to be done against the against MAV:"+condSQL);
    }
    
    if (op== "=") op = "==";
    if (col1.indexOf("DATE")>-1){
      col1=_date(col1);
    }
    if (col2.indexOf("DATE")>-1){
      col2=_date(col2);
    }
    return _compare(op,col1,col2);
  }

  return col1 + op + col2;
}
function substring(col,n,m){
  theGeneratingFS.inheretIf(col);
  col=fixCol(col);
  if (theGeneratingFS.againstfe){
    return _substring(col,n,m);
  }
  return "@SUBSTRING("+col+" FROM "+n+" FOR "+ m+")";
}
function toYear(col){
  theGeneratingFS.inheretIf(col);
  col=fixCol(col);

  if (theGeneratingFS.againstfe){
    return _toYear(col);
  }

  return "@EXTRACT(YEAR FROM "+ col + ")";
}
function min(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  if (theGeneratingFS.againstfe){
    return _min(col);
  }
  return "@MIN("+col+")";
}
function max(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  if (theGeneratingFS.againstfe){
    return _min(col);
  }
  return "@MAX("+col+")";
}
function count(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  if (typeof theGeneratingFS.against != 'undefined'){
    if (theGeneratingFS.againstfe){
      return _sum("COUNT("+col+")");
    }
    return "@SUM(\"COUNT("+col+")\")";
  }
  return "@COUNT("+col+")";
}
function countdistinct(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  if (typeof theGeneratingFS.against != 'undefined')//not supported
    return;
  return "@COUNT( distinct "+col+")";
}
function countif(p,cond){
}
function sum(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  if (typeof theGeneratingFS.against != 'undefined'){
    if (theGeneratingFS.againstfe){
      return _sum("SUM("+col+")");
    }
    return "@SUM(\"SUM("+col+")\")";
  }
  return "@SUM("+col+")";
}
function sumif(col,cond){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  return "@SUM(CASE WHEN ("+cond+") THEN " + col + " ELSE 0 END)"
}

function avg(col){
  theGeneratingFS.hasagg=true;
  col=fixCol(col);
  theGeneratingFS.hasAVG=true;
  if (theGeneratingFS.openA.length>0){
    if (theGeneratingFS.attsA.indexOf("SUM("+col+")")<0);
      return "@SUM("+col+")";
  }
  else if (typeof theGeneratingFS.against != 'undefined'){
    if (theGeneratingFS.againstfe){
      return _postdiv(_sum("SUM("+col+")"), _sum("dacount"));
    }
    return div(mul(sum("@"+col),'@ROUND(1.0,2)'),"@SUM(dacount)");
  }
  return "@AVG("+col+")";
}

function date(col){
  //col=fixCol(col);
//  if (theGeneratingFS.againstfe){
//    return ("date " + col);
//  }
  return "@DATE \'" + col + "\'";
} 
function arith(op,c1,c2){
  theGeneratingFS.inheretIf(c1,c2);
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
  return arith("/",col1,col2);
}
function as(col,al){
 // if (theGeneratingFS.opened) 
 //   return col;// ignore aliases in mavs
  return col + " AS " + al;
}
function exists(relation){
  return ' EXISTS (' + relation.toSQL() + ')';
}
function notexists(relation){
  return ' NOT EXISTS (' + relation.toSQL() + ')';
}

function fixCol(col){
  if (typeof col == 'string'){
    if (col[0]=='@')
      col=col.substring(1)
    else 
      col="'"+col+"'";
    var indexofAS=col.indexOf(' AS');
    if (theGeneratingFS.opened && indexofAS>-1){
      var colname=col.substring(0,indexofAS);
      var alsname=col.substring(indexofAS+4);
      theGeneratingFS.col2als[colname]=alsname;
      theGeneratingFS.als2col[alsname]=colname;
      col=colname;      
    }
  } else if (col instanceof fsql2sql){
      col= "(" + col.toSQL() + ")";
  }
  //
  if (typeof theGeneratingFS.als2col[col] !='undefined'){
    col="\"" + theGeneratingFS.als2col[col] + "\"";
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
function no_alias(namewithalias){
  var asi=namewithalias.indexOf(" AS");
  if (asi<0) return namewithalias;
  else return namewithalias.substring(0,asi);
}

