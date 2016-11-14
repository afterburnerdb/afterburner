//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
if (inNode){
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}
pci= new proxyClient(proxyConf.proxy.webhost,proxyConf.proxy.webport);
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function proxyClient(HOST,PORT){
  this.HOST=HOST;
  this.PORT=PORT;
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
   console.log( ""+baseurl + urlrel );
   if (!async)
     return xhttp.responseText;
   else 
     return 0;
  }
  this.execSQL= function(sql){
    var uri='/query?sql='+sql;
    console.log(uri);
    return this.get(uri);
  }
  this.execFSQL= function(fsql){
    var uri='/query?fsql='+sql;
    console.log(uri);
    return this.get(uri);
  }
  this.pullTable= function(tabname){
    var uri='/pull?table='+tabname;
    console.log(uri);
    return this.get(uri);
  }
  this.pullSQL= function(sql){
    var uri='/pull?sql='+sql;
    console.log(uri);
    return this.get(uri);
  }
  this.getRemoteSchema= function(){
    var uri='/getSchema';
    console.log(uri);
    return this.get(uri);
  }
  this.getRemoteTableNames= function(){
    var uri='/getTableNames';
    console.log(uri);
    return this.get(uri);
  }
  //constructor:
  this.HOST=(HOST!=='undefined')?'127.0.0.1':HOST;
  this.PORT=(PORT!=='undefined')?'8081':PORT;
  console.log('proxy connection exists.. pulling schema from backend');
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
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting proxyClient');
  module.exports=proxyClient;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
