//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function monetJSONParser(pjsn) {
  this.fname=null; 
  this.delimCode=null;
  this.eolCode=null;
  this.actualcs=0;
  this.buffer=null;
  this.pin=0;
  this.numcols=pjsn.cols;
  this.jsn=pjsn;
  var tmpstrStore8=require('./store.js').tmpstrStore8;
  this.next = function(){
    var ret=this.jsn.data[(this.pin/this.numcols)|0][this.pin%this.numcols];
    this.pin++;
    return ret;
  };
  this.nextcstr =function(resPtr){
    var str= this.next();
    var strlen=str.length;
    for (var i=0;i<strlen;i++)
      tmpstrStore8[resPtr+i]=str.charCodeAt(i);
    tmpstrStore8[resPtr+strlen]=0;
    return strlen+1;
  };
  this.nextstr =function(){
    return this.next();
  };
  this.nextint =function(){
    return this.next();
  };
  this.nextfloat =function(){
    return this.next();
  };

  //Constructor:
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting monetJSONParser');
  module.exports=monetJSONParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
