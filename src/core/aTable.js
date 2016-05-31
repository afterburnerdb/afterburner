///////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function aTable(dSrc) {
    this.name = "";
    this.src=dSrc;
    this.numrows = -1;
    this.numcols = 0;
    this.colnames = [];
    this.colptrs=0;
    this.cols = [];
    this.coltypes = [];
//CREATE
    this.parseTable = function (){
        if(typeof malloc=='undefined'){
          malloc=require('./store.js').malloc;
          malloctmpstr=require('./store.js').malloctmpstr;
          tmpstrcpy=require('./store.js').tmpstrcpy;
          tmpstrlen=require('./store.js').tmpstrlen;
          tmptoStoreStrcpy=require('./store.js').tmptoStoreStrcpy;
          mem32=require('./store.js').mem32;
          memF32=require('./store.js').memF32;
        }
//
        var colptrs = malloc(this.numcols<<2);
        var coltypes=this.coltypes;
        this.colptrs=colptrs;
        var fp=this.src.parser;
        var nr=this.numrows;
        for (var i=0;i<this.numcols;i++){
          mem32[(this.colptrs+(i<<2))>>2]= malloc((nr+1)<<2);
        } 
        var strbuff=malloctmpstr(100*1024);
        for (var ii=0;ii<nr;ii++)	{
          for (var i=0;i<this.numcols;i++){
            if(coltypes[i]==0){
              mem32 [(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=fp.nextint();
            } else if(coltypes[i]==1){
              memF32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=fp.nextfloat();
            } else if(coltypes[i]==2){
              len=fp.nextcstr(strbuff);
              newstrptr=malloctmpstr(len);
              tmpstrcpy(strbuff,newstrptr);
              mem32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=newstrptr;
            } else if(coltypes[i]==3){
              tmps=fp.nextstr();
              tmp=strdate_to_int(tmps);
              mem32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=tmp;
            } else if(coltypes[i]==4){
              tmps=fp.nextstr();
              tmp=strchar_to_int(tmps);
              mem32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=tmp;
            } else{
              alert('cannot handle data type:' + coltypes[i])
            }
          }
	}
        for (var i=0;i<this.numcols;i++){
          if(coltypes[i]==2){
            for (var ii=0;ii<nr;ii++)	{
              var tmpP=mem32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2];
              len=tmpstrlen(tmpP);
              newstrptr=malloc(len);
              tmptoStoreStrcpy(tmpP,newstrptr);
              mem32[(mem32[(colptrs+(i<<2))>>2]+(ii<<2))>>2]=newstrptr;
            }
          }
	}
        daSchema.addTable(this);
    };
    this.setsize = function(size){
      this.numrows=size;
    };
//FUNC
  this.getColNames = function(){
    var ret=this.name+",";
    for (var i=0;i<this.numcols;i++)
      ret=ret+this.colnames[i] + ",";
    return ret.replace(/,$/, '');
  }
  this.getColTypeByName = function(colname){
    for (var i=0;i<this.numcols;i++)
      if (this.colnames[i]==colname)
        return this.coltypes[i];
    return -1;
  }
  this.getColPByName = function(colname){
    for (var i=0;i<this.numcols;i++)
      if (this.colnames[i]==colname)
        return mem32[(this.colptrs+(i<<2))>>2];
    return -1;
  }

//UTIL
    this.toHTMLTableN = function(num) {
      var table=document.createElement('table');
      table.setAttribute('border','1');
      var tr = document.createElement('tr'); 
      for (var i=0;i<this.numcols;i++){
          td = document.createElement('td');
          td.appendChild(document.createTextNode(this.colnames[i]) );
          tr.appendChild(td);
      }
      table.appendChild(tr);
      for (var i=0;(i<this.numrows && i<num);i++){
        tr = document.createElement('tr');
        for (var ii=0;ii<this.numcols;ii++){
          td = document.createElement('td');
          if (this.coltypes[ii]==0){
            td.appendChild(document.createTextNode(""+mem32[(this.cols[ii]+(i<<2))>>2]));
          } else if (this.coltypes[ii]==1){
            td.appendChild(document.createTextNode(""+memF32[(this.cols[ii] +(i<<2))>>2]));
          } else if (this.coltypes[ii]==2){
            td.appendChild(document.createTextNode(strToString(mem32[this.cols[ii]+(i<<2)])));
          } else if (this.coltypes[ii]==3){
            td.appendChild(document.createTextNode(""+mem32[(this.cols[ii] + (i<<2))>>2]));
          } else if (this.coltypes[ii]==4){
            td.appendChild(document.createTextNode(""+mem32[(this.cols[ii] + (i<<2))>>2]));
          } else{
            alert("unknown type");
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    };
    this.toHTMLTable = function() {
      return this.toHTMLTableN(1/0);
    };

    this.toStringN = function(num) {
      var ret="";
      for (var i=0;i<this.numcols;i++){
          ret=ret+this.colnames[i] + "\t|\t"
      }
      for (var i=0;(i<this.numrows && i<num);i++){
        for (var ii=0;ii<this.numcols;ii++){
          if (this.coltypes[ii]==0){
            ret=ret+mem32[(this.cols[ii]+(i<<2))>>2]+ "\t|\t";
          } else if (this.coltypes[ii]==1){
            ret=ret+memF32[(this.cols[ii] +(i<<2))>>2]+ "\t|\t";
          } else if (this.coltypes[ii]==2){
            ret=ret+strToString(mem32[this.cols[ii]+(i<<2)])+ "\t|\t";
          } else if (this.coltypes[ii]==3){
            ret=ret+int_to_strdate(mem32[(this.cols[ii] + (i<<2))>>2])+ "\t|\t";
          } else if (this.coltypes[ii]==4){
            ret=ret+int_to_strchar(mem32[(this.cols[ii] + (i<<2))>>2])+ "\t|\t";
          } else{
            alert("unknown type");
          }
        }
      }
      return ret;
    };

    this.toString= function() {
      return this.toStringN(1/0);
    };
//constructor
    this.name=dSrc.name;
    this.fname=dSrc.fname;
    this.numrows=dSrc.numrows;
    this.numcols=dSrc.numcols;
    this.colnames=dSrc.colnames;
    this.coltypes=dSrc.coltypes;

    if (this.src.parser !== 'undefined'){
      this.parseTable();
    } else if (this.src.type='query') {
      this.colptrs=src.colptrs;
    } else if (this.src.type='monetjsn') {
    } else { 
      console.log("invalid data source type");
    }
}

function broswerFileParse(file) {
    this.file=file;
    this.fr = new FileReader();
    this.delim='|';
    this.eol='\n';
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

    this.fr.onload = function() {
        _self.buffer = new Uint8Array(_self.fr.result);
        _self.bptr=0;
        _self.readReady=true;
        _self.actualcs=_self.fr.result.byteLength;
        _self.noMoreChunks=(_self.actualcs <_self.CHUNK_SIZE);
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
        this.waitForRead();
        return true;
    };
    this.waitForRead = function(){
      while(!this.readReady){
        alert("this.readReady"+this.readReady);
      }
    }

    this.nextcstr =function(resPtr){
      strSize=0;
      do{
         if(this.bptr+strSize >= this.actualcs){
           if (!this.noMoreChunks&& this.nextChunk()){
             this.waitForRead();
             return this.nexcstr(resPtr);
           }
           else {
             return -1;
           }
         }
         else if(this.buffer[this.bptr+strSize] == this.delimCode ){// || this.buffer[this.bptr+strSize] == this.eolCode ){
           tmpstrStore8[resPtr+strSize]=0;
           this.bptr=this.bptr+strSize+1;
           return strSize+1;
         }
         else{
           tmpstrStore8[resPtr+strSize]=this.buffer[this.bptr+strSize];
           strSize++;
         }
      }while(true);
    };

    this.nextstr =function(){
      str="";
      do{
         if(this.bptr+str.length >= this.actualcs){
           if (!this.noMoreChunks&& this.nextChunk()){
             this.waitForRead();
             return this.nexstr();
           }
           else {
             return "";
           }
         }
         else if(this.buffer[this.bptr+str.length] == this.delimCode ){// || this.buffer[this.bptr+str.length] == this.eolCode ){
           this.bptr+=str.length+1;
           return str;
         }
         else{
           str+=String.fromCharCode(this.buffer[this.bptr+str.length]);
         }
      }while(true);
    };

    this.nextint = function() {
      str = this.nextstr();
      return parseInt(str);
    };
    this.nextfloat =function() {
      str = this.nextstr();
      return parseFloat(str);
    };
    this.getFileName =function(){
      return file.name;
    }
    this.nextChunk();
}

function nodeFileParse(fname) {
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
    tmpstrStore8=require('./store.js').tmpstrStore8;
    strSize=0;
    do{
      if(this.buffer[this.bptr+strSize] == this.delimCode ){// || this.buffer[this.bptr+strSize] == this.eolCode ){
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
    str="";
    do{
      if(this.buffer[this.bptr+str.length] == this.delimCode ){// || this.buffer[this.bptr+str.length] == this.eolCode ){
        this.bptr+=str.length+1;
        return str;
      }else{
        str+=String.fromCharCode(this.buffer[this.bptr+str.length]);
      }
    }while(true);
  };

  this.nextint = function(){
    str = this.nextstr();
    return parseInt(str);
  };
  this.nextfloat =function(){
    str = this.nextstr();
    return parseFloat(str);
  };
  this.getFileName =function(){
    return this.fname;
  }
  //Constructor:
  fs=require('fs');
  console.log('this.fname='+this.fname);
  var stats = fs.statSync(this.fname);
  this.actualcs= stats["size"];
  console.log('this.actualcs='+this.actualcs);
  this.buffer=fs.readFileSync(this.fname);
}
//////////////////////Convenience:
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting aTable');
  module.exports=aTable;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
