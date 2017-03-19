//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function html5FileParser(file,funk) {
    this.file=file;
    this.fname=null;
    this.fr = new FileReader();
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
    this.noMoreChunks=false;

    //this.nextChunk =function() {
    //    if (this.noMoreChunks) {
    //        return false;
    //    }
    //    this.readReady = false;
    //    this.sought+=this.bptr;
    //    //this.waitForRead();
    //    return true;
    //};
    this.waitForRead = function(){
      while(!this.readReady){
        alert("this.readReady"+this.readReady);
      }
    }

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
    this.getFileName =function(){
      return this.fname;
    }
  this.cleanUp = function(){
    delete this.buffer;
  }

  prsSrc=this;
  $("#waitForFile").modal();

  this.fr.onerror = function() {
      alert('file reading error');
  };
  this.actualcs=this.file.size;
  this.buffer= new Uint8Array(this.file.size);
 
  this.fr.readAsArrayBuffer(file.slice(0,this.CHUNK_SIZE));
  //
  this.fname=this.file.name;
  if (this.fname.match("tar.gz$") || this.fname.match(".gz$")){
    this.fname=this.fname.replace(/.tar.gz$/,""); 
    this.fname=this.fname.replace(/.gz$/,"");
    this.fr.onload = function(event) {
      //
      var tmp = new Uint8Array(prsSrc.fr.result);
      for (var i=0;i<tmp.byteLength;i++)
        prsSrc.buffer[prsSrc.rbptr++] = tmp[i];
        prsSrc.readReady=true;
      if (prsSrc.rbptr>= prsSrc.actualcs){
        $("#waitForFile").modal('hide');
        prsSrc.buffer=pako.ungzip(prsSrc.buffer);
        prsSrc.actualcs=prsSrc.buffer.byteLength;
        funk();
      } else {
        prsSrc.fr.readAsArrayBuffer(prsSrc.file.slice(prsSrc.rbptr,prsSrc.rbptr + prsSrc.CHUNK_SIZE));
      }
    }
  }else{
    this.fr.onload = function(event) {
      //
      var tmp = new Uint8Array(prsSrc.fr.result);
      for (var i=0;i<tmp.byteLength;i++)
        prsSrc.buffer[prsSrc.rbptr++] = tmp[i];
        prsSrc.readReady=true;
      if (prsSrc.rbptr>= prsSrc.actualcs){
        DEBUG('file read ready');
        $("#waitForFile").modal('hide');
        funk();
      } else {
        prsSrc.fr.readAsArrayBuffer(prsSrc.file.slice(prsSrc.rbptr,prsSrc.rbptr + prsSrc.CHUNK_SIZE));
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting html5FileParser');
  module.exports=html5FileParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
