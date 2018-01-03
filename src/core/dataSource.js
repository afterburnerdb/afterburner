//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined');
if(typeof module == 'undefined'){          
  var module={};                           
} else {                                   
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function dataSource(src,funk,n){
  this.type="";
  this.qr=null;
  this.fname="";                                 
  this.file=null;                                
  this.parser=null;
  this.name=null;
  this.numrows=-1;
  this.numcols=-1;
  this.colnames=null;
  this.coltypes=null;
  this.colptrs=null;
//
  var handyColNames={};
  var handyColTypes={};

handyColNames["nation"]=[
"N_NATIONKEY",
"N_NAME",
"N_REGIONKEY",
"N_COMMENT"];
handyColTypes["nation"]=[
0,
2,
0,
2];
handyColNames["region"]=[
"R_REGIONKEY",
"R_NAME",
"R_COMMENT"];

handyColTypes["region"]=[
0,
2,
2];
handyColNames["part"]=[
"P_PARTKEY",
"P_NAME",
"P_MFGR",
"P_BRAND",
"P_TYPE",
"P_SIZE",
"P_CONTAINER",
"P_RETAILPRICE",
"P_COMMENT"];
handyColTypes["part"]=[
0,
2,
2,
2,
2,
0,
2,
1,
2];
handyColNames["supplier"]=[
"S_SUPPKEY",
"S_NAME",
"S_ADDRESS",
"S_NATIONKEY",
"S_PHONE",
"S_ACCTBAL",
"S_COMMENT"];
handyColTypes["supplier"]=[
0,
2,
2,
0,
2,
1,
2];

handyColNames["partsupp"]=[
"PS_PARTKEY",
"PS_SUPPKEY",
"PS_AVAILQTY",
"PS_SUPPLYCOST",
"PS_COMMENT"];
handyColTypes["partsupp"]=[
0,
0,
0,
1,
2];

handyColNames["customer"]=[
"C_CUSTKEY",
"C_NAME",
"C_ADDRESS",
"C_NATIONKEY",
"C_PHONE",
"C_ACCTBAL",
"C_MKTSEGMENT",
"C_COMMENT"];
handyColTypes["customer"]=[
0,
2,
2,
0,
2,
1,
2,
2];

handyColNames["orders"]=[
"o_orderkey",
"o_custkey",
"o_orderstatus",
"o_totalprice",
"o_orderdate",
"o_orderpriority",
"o_clerk",
"o_shippriority",
"o_comment"];
handyColTypes["orders"]=[
0,
0,
4,
1,
3,
2,
2,
0,
2];
handyColNames["orders10g"]=[
"o_orderkey",
"o_custkey",
"o_orderstatus",
"o_totalprice",
"o_orderdate",
"o_orderpriority",
"o_clerk",
"o_shippriority"
];
handyColTypes["orders10g"]=[
0,
0,
4,
1,
3,
2,
2,
0];

handyColNames["lineitem"]=[
"l_orderkey",     //0
"l_partkey",      //0
"l_suppkey",      //0
"l_linenumber",   //0
"l_quantity",     //1
"l_extendedprice",//1
"l_discount",     //1
"l_tax",          //1
"l_returnflag",
"l_linestatus",
"l_shipdate",
"l_commitdate",
"l_receiptdate",
"l_shipinstruct",
"l_shipmode",
"l_comment"];
handyColTypes["lineitem"]=[
0,
0,
0,
0,
1,
1,
1,
1,
4,
4,
3,
3,
3,
2,
2,
2];

handyColNames["scen_a_100gb"]=[
"l_orderkey",     
"l_partkey",      
"l_suppkey",      
"l_linenumber",   
"l_quantity",     
"l_extendedprice",
"l_discount",     
"l_tax",          
"l_returnflag",
"l_linestatus",
"l_shipdate",
"l_commitdate",
"l_receiptdate",
];
handyColTypes["scen_a_100gb"]=[
0,
0,
0,
0,
1,
1,
1,
1,
4,
4,
3,
3,
3,
];

handyColNames["myview"]=[
"l_orderkey",
"revenue",
"o_orderdate",
"o_shippriority"];
handyColTypes["myview"]=[
0,
1,
3,
0];

handyColNames["upgrade"]=[
"id",
"p",
"origin",
"dest",
"fldate",   
"flday", 
"fltime",  
"status",
"plane", 
"bookclass"
];
handyColTypes["upgrade"]=[
0,
0,
2,
2,
2,
2,
2,
2,
2,
2
];
handyColNames["adult"]=[
"id", 
"p", 
"workclass", 
"education", 
"status", 
"occupation", 
"relationship", 
"race", 
"sex", 
"country"];
handyColTypes["adult"]=[
0,
0,
2,
2,
2,
2,
2,
2,
2,
2
];

handyColNames["postsecondary"]=["id", "p1", "workclass", "p2", "status", "occupation", "relationship", "race", "sex", "country"];
handyColTypes["postsecondary"]=[0,0,2,0,2,2,2,2,2,2];

handyColNames["income"]=[
"id", 
"p",
"nchild",
"sex",
"marst",
"race",
"bpl",
"educ",
"occ",
"ind",
"tranwork"];

handyColTypes["income"]=[
0,
0,
2,
2,
2,
2,
2,
2,
2,
2,
2
];

handyColNames["bank_et"]=["id","age","job","marital","education","default","balance","housing","loan","contact","day","month","duration","campaign","pdays","previous","poutcome","p"];
handyColTypes["bank_et"]=[0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0];
handyColNames["bank_cet"]=["id","age","job","marital","education","default","balance","housing","loan","contact","day","month","p2","campaign","pdays","previous","poutcome","p1"];
handyColTypes["bank_cet"]=[0,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,0];

handyColNames["fridge"]=["id","item","season","location","p"];
handyColTypes["fridge"]=[0,2,2,2,0];

handyColNames["alberta_salaries_bin150"]=["id","Ministry","Year","PositionTitle","PositionClass","p"];
handyColTypes["alberta_salaries_bin150"]=[0,2,2,2,2,0];

  this.useFnameHints = function(fname){
    doti=fname.indexOf('.');
    tabname=fname.substring(0,doti);
    this.name=tabname;
    fname=fname.substring(doti+1,fname.length);
    var numrowsstrends=fname.indexOf('.');
    var numrowsstr=fname.substring(0,numrowsstrends);
    this.numrows=parseInt(numrowsstr);
    this.colnames=handyColNames[tabname];
    this.coltypes=handyColTypes[tabname];
//      console.log(this.name);
//      console.log(this.numrows);
//      console.log(this.colnames);
//      console.log(this.coltypes);
//      console.log(handyColNames);
//      console.log(handyColTypes);

    if (this.name&&this.numrows&&this.colnames&&this.coltypes){
      this.numcols=this.colnames.length;
      DEBUG('found table in handy tables')
    }
    else{
      //this.name='orders';
      //this.numrows=1500000;
      //this.colnames=handyColNames[tabname];
      //this.coltypes=handyColTypes[tabname];
      //this.numcols=this.colnames.length;
      console.log(this.name);
      console.log(this.numrows);
      console.log(this.colnames);
      console.log(this.coltypes);
      console.log(handyColNames);
      console.log(handyColTypes);
      alert('un able to auto load table:'+ tabname);
    }
  }

  this.fromQuery = function(qr){
    this.type='query';
    this.qr=qr;
    var ptrcolptrs= malloc(qr.numcols<<2);
    for (var i=0;i<qr.numcols;i++){
      mem32[(ptrcolptrs+(i<<2))>>2]= src.cols[i];
    }
    this.name=qr.name;
    this.fname=null;
    this.numrows=qr.numrows;
    this.numcols=qr.numcols;
    this.colptrs=ptrcolptrs;
    this.colnames=qr.colnames;
    this.coltypes=qr.coltypes;
  }
  this.fromMonetJSON= function(srcA){
    console.log('@fromMonetJSON');
    var src=srcA[0];
    if (inNode){
      monetJSONParser= require('./monetJSONParser.js');
    }
    this.type='monetjsn';
    this.fname=null;

    this.name='monetdb_qid'+src.queryid;
    this.fname=null;
    this.numrows=0;
    for (var i=0; i<srcA.length;i++)
      this.numrows+=srcA[i].rows;
    this.numcols=src.cols;
    this.colptrs=null;
    this.colnames=Object.keys(src.col).map(peelDQIf);//.map(escapeIf);
    this.coltypes=[];
    src.structure.forEach((x)=> {this.coltypes.push(monetDBTypestoAB(x.type))})
    this.parser=new monetJSONParser(srcA);
  }
  this.fromHTML5File= function(file,funk){//firefox browser file                  
      console.log('@fromHTML5File');
      var currf;
      if (file instanceof FileList)
        currf=file[n];
      else currf=file;
      this.type='html5';
      this.fname=currf.name;                  
      this.file=currf;                        
      this.useFnameHints(this.fname);
      this.parser=new html5FileParser(file,funk,n);
  }
  this.fromURL= function(urls,funk){
    console.log('@fromURL');
    this.URL=urls.list[0];
    this.fname=this.URL;
    var lstslsh=this.fname.lastIndexOf('/') + 1;
    this.fname=this.fname.substring(lstslsh,this.fname.length);
    this.type='url';
    this.useFnameHints(this.fname);
    this.parser=new urlParser(urls,funk);
  }
  this.fromSchema = function(tabname){
      console.log('@fromSchema');
      this.type='schema'
      this.name=tabname.substring(1);
      this.numrows=0;
      this.numcols=0;
      this.colnames=[];
      this.coltypes=[];
  }
  this.fromFile = function(fname){
      var nodeFileParser= require('./nodeFileParser.js');
      this.type='realpath';
      this.fname=fname;// filename   
      this.parser=new nodeFileParser(fname);
      lstslsh=fname.lastIndexOf('/') + 1;
      fname=fname.substring(lstslsh,fname.length);
      this.useFnameHints(fname);
  }
//constructor

  if (inNode){
    queryResult=require('./queryResult.js');
  }
  if (src instanceof queryResult){
    this.fromQuery(src);
  } else if (((typeof File !=='undefined')&&(src instanceof File)) ||
             ((typeof FileList !=='undefined')&&(src instanceof FileList))){
    this.fromHTML5File(src,funk);
  } else if (src instanceof URLList){
    this.fromURL(src,funk);
  } else if (typeof src == 'string' && (src[0]=='#')){
    this.fromSchema(src);
  } else if (typeof src == 'string' && (inNode)){
    this.fromFile(src);
  } else if ((typeof src == "object" && typeof src.data == "object") ||
             (typeof src == "object" && typeof src[0] == "object" && typeof src[0].data == "object")){
    this.fromMonetJSON(src);
  } else {
    console.log('Unsupported DS type, typeof DS:'+ typeof DS);
  };
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){                              
  console.log('exporting dataSource');       
  module.exports=dataSource;  
}else delete module;                     
//////////////////////////////////////////////////////////////////////////////
