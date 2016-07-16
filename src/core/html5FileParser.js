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
    this.CHUNK_SIZE = 1024*1024 *1024;
    this.actualcs=0;
    this.sought=0;
    this.readReady=false;
    this.buffer;
    this.bptr=0;
    this.noMoreChunks=false;
    _self=this;
    $("#waitForFile").modal();

    this.fr.onload = function() {
        _self.buffer = new Uint8Array(_self.fr.result);
        _self.bptr=0;
        _self.readReady=true;
        _self.actualcs=_self.fr.result.byteLength;
        _self.noMoreChunks=(_self.actualcs <_self.CHUNK_SIZE);
        DEBUG('file read ready');
        funk();
        $("#waitForFile").modal('hide');
	}

    this.fr.onerror = function() {
        alert('file reading error');
    };

    this.nextChunk =function() {
        if (this.noMoreChunks) {
            return false;
        }
        this.readReady = false;
        this.sought+=this.bptr;
        this.fr.readAsArrayBuffer(this.file.slice(this.sought, this.sought + this.CHUNK_SIZE));
        //this.waitForRead();
        return true;
    };
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
           if (!this.noMoreChunks&& this.nextChunk()){
             this.waitForRead();
             return this.nexcstr(resPtr);
           }
           else {
             return -1;
           }
         }
         else if(tmpchar == this.delimCode) {
           tmpstrStore8[resPtr+strSize]=0;
           this.bptr=this.bptr+strSize+1;
           return strSize+1;
         }
         else{
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
           if (!this.noMoreChunks&& this.nextChunk()){
             this.waitForRead();
             return this.nexstr();
           }
           else {
             return "";
           }
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
  this.nextChunk();
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting html5FileParser');
  module.exports=html5FileParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
