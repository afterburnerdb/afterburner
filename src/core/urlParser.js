//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function urlParser(urls,funk) {
  if (urls instanceof URLList){
    if (urls.list.length == 0) return;
    this.url=urls.list[0];
    this.urllist=urls;
  }else {console.log("error @urlParser");}

  this.req = new XMLHttpRequest();
  this.delim='|';
  this.eol='\r';
  this.delimCode=this.delim.charCodeAt(0);
  this.eolCode=this.eol.charCodeAt(0);
  this.CHUNK_SIZE = 1024 *1024;
  this.actualcs=0;
  this.sought=0;
  this.readReady=false;
  this.buffer=null;
  this.rbptr=0;
  this.bptr=0;

  this.nextcstr =function(resPtr){
    var strSize=0;
    var tmpchar;
    do{
       tmpchar=this.buffer[this.bptr+strSize];
       if(this.bptr+strSize >= this.actualcs){
           return -1;
       } else if(tmpchar == this.delimCode) {
         tmpstrStore8[resPtr+strSize]=0;
         this.bptr=this.bptr+strSize+1;
         return strSize+1;
       } else{
         tmpstrStore8[resPtr+strSize]=tmpchar;
         strSize++;
       }
    }while(true);
  };

  this.nextstr =function(){
    var str="";
    var tmpchar;
    do{
       tmpchar=this.buffer[this.bptr+str.length];
       if(this.bptr+str.length >= this.actualcs){
           return "";
       }
       else if(tmpchar == this.delimCode) {
         this.bptr+=str.length+1;
         return str;
       }
       else{
         str+=String.fromCharCode(tmpchar);
       }
    }while(true);
  };

  this.nextint = function() {
    var str = this.nextstr();
    return parseInt(str);
  };
  this.nextfloat =function() {
    var str = this.nextstr();
    return parseFloat(str);
  };

  this.cleanUp = function(){
    delete this.buffer;
    this.urllist.list=this.urllist.list.slice(1);
    
    if (this.urllist.list.length>0)
      var ds= new dataSource(this.urllist, function(){newTable= new aTable(ds);});
    else
      $("#waitForFile").modal('hide');
  }

  prsSrc=this;

  this.req.open("GET", this.url, true);
  this.req.responseType = "arraybuffer";

  this.req.onerror = function() {
    console.log("Error @urlParse can't read from url:"+prsSrc.url);
    prsSrc.cleanUp();
  };

  //
  if (this.url.match("tar.gz$") || this.url.match(".gz$")){
    this.req.onload = function (event) {
      if((prsSrc.req.response.byteLength==0) || (presSrc.req.readyState == 4)){
        //console.log("Error @urlParse deadlink? url:"+prsSrc.url);
        //prsSrc.cleanUp();
        return;
      }
      prsSrc.buffer=pako.ungzip(new Uint8Array(prsSrc.req.response));
      prsSrc.actualcs=prsSrc.buffer.byteLength;
      funk();
    }
  }else{
    this.req.onload = function (event){
      if((prsSrc.req.response.byteLength==0) || (presSrc.req.readyState == 4)){
        //console.log("Error @urlParse deadlink? url:"+prsSrc.url);
        //prsSrc.cleanUp();
        return;
      }
      prsSrc.buffer=new Uint8Array(prsSrc.req.response);  
      prsSrc.actualcs=prsSrc.buffer.byteLength;
      funk();
    }
  }
  this.req.send(null);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting urlParser');
  module.exports=urlParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
