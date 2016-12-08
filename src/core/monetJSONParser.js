//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function monetJSONParser(pjsnA) {
  this.fname=null; 
  this.delimCode=null;
  this.eolCode=null;
  this.actualcs=0;
  this.buffer=null;
  this.pin=0;
  this.numcols=pjsnA[0].cols;
  this.currC=0;
  this.jsn=pjsnA[this.currC];
  dbgjsn=pjsnA;
  dbmg=this;
  this.currlen=this.jsn.data.length;
  if(inNode)
    tmpstrStore8=require('./store.js').tmpstrStore8;
  this.next = function(){
    var rid=(this.pin/this.numcols)|0;
    if ( rid >=  this.currlen ) {
      this.pin=0;
      delete this.jsn;
      this.jsn=pjsnA[++this.currC];
      this.currlen=this.jsn.data.length;
      rid=(this.pin/this.numcols)|0;
      console.log("working on chunk:"+this.currC);
    }
    var ret=this.jsn.data[rid][this.pin%this.numcols];
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

  this.cleanUp = function(){
    delete this.jsn;
  }

  //Constructor:
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting monetJSONParser');
  module.exports=monetJSONParser;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
