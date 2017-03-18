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
      return file.name;
    }
  this.cleanUp = function(){
    delete this.buffer;
  }

  _self=this;
  $("#waitForFile").modal();

  this.fr.onload = function(event) {
    console.log("@this.fr.onload.event:"+event);
    //
    var tmp = new Uint8Array(_self.fr.result);
    for (var i=0;i<tmp.byteLength;i++)
      _self.buffer[_self.rbptr++] = tmp[i];
    _self.readReady=true;
    if (_self.rbptr>= _self.actualcs){
      DEBUG('file read ready');
      console.log('file read ready');
      $("#waitForFile").modal('hide');
      funk();
    } else {
      _self.fr.readAsArrayBuffer(_self.file.slice(_self.rbptr,_self.rbptr + _self.CHUNK_SIZE));
    }
  }
  this.fr.onerror = function() {
      alert('file reading error');
  };
  this.actualcs=this.file.size;
  console.log('this.actualcs:'+this.file.size);
  this.buffer= new Uint8Array(this.file.size);
 
  this.fr.readAsArrayBuffer(file.slice(0,this.CHUNK_SIZE));
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting html5FileParser');
  module.exports=html5FileParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
