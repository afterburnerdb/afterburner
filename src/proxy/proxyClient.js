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
function proxyClient(IP,PORT){
  this.IP='';
  this.PORT='';
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
   var baseurl="http://"+IP+":"+PORT+"";
   xhttp.open("GET", baseurl + urlrel , async);
   xhttp.send(null);
   
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

  //constructor:
  this.IP=(IP!=='undefined')?'127.0.0.1':IP;
  this.PORT=(PORT!=='undefined')?'8081':PORT;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting proxyClient');
  module.exports=proxyClient;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
