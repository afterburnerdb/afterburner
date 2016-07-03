//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}//store
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var memmax=(2*1024*1024*1024)-(64*1024*1024);
var mem=new ArrayBuffer(memmax);
var mem8=new Int8Array(mem);
var mem16=new Int16Array(mem);
var mem32=new Int32Array(mem);
var memF32=new Float32Array(mem);
var storedB=0;
//input buffer
var tmpstrStorageMB=512;
var tmpstrStore= new ArrayBuffer(tmpstrStorageMB * 1024 * 1024);
var tmpstrStore8= new Int8Array(tmpstrStore);
var tmpstrStoredB=0;
//bpool
var bufPoolMB=200;
var temps;  
var storemax=temps=memmax-(bufPoolMB*1024*1024);
//Hash tables
var hashBits=23;
var hash1BucketSize=5;

//var hash2BucketSize=1021;
var hash2BucketSize=29;
var hash3BucketSize=1021;
var hashBitFilter=Math.pow(2,hashBits)-1;
var bukpool=100*1024*1024;
var hbbsize=((hashBitFilter+1)*4);
var htbsize=bukpool;
var h1tb=storemax-htbsize;
var h1bb=h1tb-hbbsize;
var h2tb=h1bb-htbsize;
var h2bb=h2tb-hbbsize;
var h3tb=h2bb-htbsize;
var h3bb=h3tb-hbbsize;
storemax=h3bb;
//
function malloctmpstr(size){
  size=size|0;
  if (size<1) return tmpstrStoredB;
  size4b=((((size-1)/4)|0)+1)*4;
  ret=tmpstrStoredB;
  tmpstrStoredB= (tmpstrStoredB+ size4b)|0;
  return ret|0;
}
function deletetmpstr(){
  tmpstrStoredB=0;
}
function malloc(size){
  size=size|0;
  if (size<1) return storedB;
  size4b=((((size-1)/4)|0)+1)*4;
  ret=storedB;
  storedB= (storedB+ size4b)|0;
  return ret|0;
}

function strcpy(strsrc, strdest){
  strsrc=strsrc|0;
  strdest=strdest|0;
  var i=0;
  while(mem8[strdest+i]=mem8[strsrc+i]) 
    i=(i+1)|0;
}

function tmpstrcpy(strsrc, strdest){
  strsrc=strsrc|0;
  strdest=strdest|0;
  var i=0;
  while(tmpstrStore8[strdest+i]=tmpstrStore8[strsrc+i]) 
    i=(i+1)|0;
}
function tmptoStoreStrcpy(strsrc, strdest){
  strsrc=strsrc|0;
  strdest=strdest|0;
  var i=0;
  while(mem8[strdest+i]=tmpstrStore8[strsrc+i]) 
    i=(i+1)|0;
}
function strlen(str){
  str=str|0;
  var i=0;
  while(mem8[str+i])
    i=(i+1)|0;
  return i|0;
}

function tmpstrlen(str){
  str=str|0;
  var i=0;
  while(tmpstrStore8[str+i])
    i=(i+1)|0;
  return (i+1)|0;
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting store');
  module.exports.malloc= malloc;
  module.exports.malloctmpstr=malloctmpstr;
  module.exports.tmpstrcpy=tmpstrcpy;
  module.exports.tmpstrlen=tmpstrlen;
  module.exports.tmptoStoreStrcpy=tmptoStoreStrcpy; 
  module.exports.mem32= mem32;
  module.exports.memF32= memF32;
  module.exports.tmpstrStore8=tmpstrStore8;
  global.hash1BucketSize=hash1BucketSize;
  global.temps=temps;
  global.mem=mem;
  global.hash2BucketSize=hash2BucketSize;
  global.hash3BucketSize=hash3BucketSize;
  global.hashBitFilter=hashBitFilter;
  global.h1tb=h1tb;
  global.h1bb=h1bb;
  global.h2tb=h2tb;
  global.h2bb=h2bb;
  global.h3tb=h3tb;
  global.h3bb=h3bb;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
