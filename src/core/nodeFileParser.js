//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function nodeFileParser(fname) {
  this.fname=fname; 
  this.delim='|';
  this.eol='\n';
  this.delimCode=this.delim.charCodeAt(0);
  this.eolCode=this.eol.charCodeAt(0);
  this.actualcs=0;
  this.buffer;
  this.bptr=0;
  this.noMoreChunks=false;

  this.nextcstr =function(resPtr){
    var tmpstrStore8=require('./store.js').tmpstrStore8;
    var strSize=0;
    do{
      if(this.buffer[this.bptr+strSize] == this.delimCode ){
        tmpstrStore8[resPtr+strSize]=0;
        this.bptr=this.bptr+strSize+1;
        return strSize+1;
      }else{
        tmpstrStore8[resPtr+strSize]=this.buffer[this.bptr+strSize];
        strSize++;
      }
    }while(true);
  };

  this.nextstr =function(){
    var str="";
    do{
      if(this.buffer[this.bptr+str.length] == this.delimCode ){
        this.bptr+=str.length+1;
        return str;
      }else{
        str+=String.fromCharCode(this.buffer[this.bptr+str.length]);
      }
    }while(true);
  };

  this.nextint = function(){
    var str = this.nextstr();
    return parseInt(str);
  };
  this.nextfloat =function(){
    var str = this.nextstr();
    return parseFloat(str);
  };
  this.getFileName =function(){
    return this.fname;
  }
  //Constructor:
  var fs=require('fs');
  console.log('this.fname='+this.fname);
  var stats = fs.statSync(this.fname);
  this.actualcs= stats["size"];
  console.log('this.actualcs='+this.actualcs);
  this.buffer=fs.readFileSync(this.fname);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting nodeFileParser');
  module.exports=nodeFileParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
