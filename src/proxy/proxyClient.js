//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
if (inNode){
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function proxyClient(HOST,PORT){
  //
  this.get= function(urlrel,cBack){
   var xhttp = new XMLHttpRequest();
   var async=false;
   if (typeof cback == 'function'){
     xhttp.onreadystatechange = function() {
       if (xhttp.readyState == 4 && xhttp.status == 200) 
         cBack(xhttp);
     }
     async=true;
   }
   var baseurl="http://"+HOST+":"+PORT+"";
   xhttp.open("GET", baseurl + urlrel , async);
   xhttp.send(null);
   if (!async)
     return xhttp.responseText;
   else 
     return 0;
  }
  this.getJSON= function(uri,cBack){
    var ret=$.ajax({dataType: "json", url: uri, async:false})
    return ret;
  }
  this.execSQL= function(sql){
    var uri='/query?sql='+encodeURIComponent(sql);
    uri= uri.replace('+','%2B');

    var web_resp=this.getJSON(uri);
    return web_resp.responseJSON;
  }
  this.execSQLHTMLTableN= function(sql,num){
    var web_resp=this.execSQL(sql);
    var table=document.createElement('table');
    table.setAttribute('class',"table table-bordered table-condensed table-nonfluid table-striped table-hover");

    var thead = table.createTHead();
    thead.setAttribute('class',"thead-default");
    var tr = thead.insertRow(0);

    for (var i=0;i<web_resp.structure.length;i++){
      var th = document.createElement('th');
      th.appendChild(document.createTextNode(web_resp.structure[i].column));
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    var tbody= table.createTBody();
    var alignright={0:1,1:1,4:1};
    for (var i=0;(i<web_resp.rows && i<num);i++){
      tr = document.createElement('tr');
      for (var ii=0;ii<web_resp.structure.length;ii++){
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(web_resp.data[i][ii]));
        if (alignright[monetDBTypestoAB(web_resp.structure[ii].type)])
          td.align="right";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    return table;
  }
  this.execFSQL= function(fsql){
    var uri='/query?fsql='+sql;
    return this.get(uri);
  }
  this.pullTable= function(tabname){
    var uri='/pull?table='+tabname;
    return this.get(uri);
  }
  this.pullSQL= function(sql){
    var uri='/pull?sql='+sql;
    return this.get(uri);
  }
  this.getRemoteSchema= function(){
    var uri='/getSchema';
    return this.get(uri);
  }
  this.dropBE_MAVS=function(){
    var drop_mavs=this.execSQL("SELECT 'DROP TABLE ' || tables.name  || ';'  FROM tables WHERE tables.name LIKE 'stmt%';");
    if (typeof drop_mavs.data == 'undefined')
      return;
    for (var i=0; i<drop_mavs.data.length;i++){
      console.log(drop_mavs.data[i][0]);
      this.execSQL(drop_mavs.data[i][0]);
    }
  }
  this.getRemoteTableNames= function(){
    var uri='/getTableNames';
    return this.get(uri);
  }
  //constructor:
  HOST=HOST||proxyConf.proxy.webhost;
  PORT=PORT||proxyConf.proxy.webport;
  this.HOST=(HOST!=='undefined')?'127.0.0.1':HOST;
  this.PORT=(PORT!=='undefined')?'8081':PORT;
  console.log('proxy connection exists.. pulling schema from backend');
  this.dropBE_MAVS();
  //pull/reg table names
  var be_tables_str=this.getRemoteTableNames();
  var be_tables_jsn=JSON.parse(be_tables_str);
  var be_tables=be_tables_jsn.data;
  console.log("be_tables:" + be_tables);
  
  for (var i=0;i<be_tables.length;i++){
    newTable= new aTable(null);
    newTable.name=be_tables[i][0];
    daSchema.addTable(newTable);
  }
}
//UTIL
function monetDBTypestoAB(mtype){
  var monettypes={
    'int': 0,
    'i2' : 0,
    'hugeint':0,
    'bigint':0,
    'smallint':0,
    'tinyint':0,
    'boolean':0,
    'wrd':0,
    'decimal':1,
    'real':1,
    'double':1,
    'varchar':2,
    'date':3,
    'char':4
  };
  var abtype=monettypes[mtype];
  if (typeof abtype == 'undfined'){
    console.log('unsupported data types from monetdb:i'+i);
    console.log('unsupported data types from monetdb:' + mtype );
    return;
  }else return abtype;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting proxyClient');
  module.exports=proxyClient;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
