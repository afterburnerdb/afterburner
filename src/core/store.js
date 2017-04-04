//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}//store
if (inNode)
  global.storedB=0;
//
var hipstore=null;
var confmemmax=null;
var conftmpstrStorageMB=null;
var confbufPoolMB=null;
var confhashBits=null;
var confbukpoolMB=null;
if (typeof window !== 'undefined'){
  if (window.location.search.indexOf('nothip')>-1){
    console.log("not using hip store");
    hipstore=false;
  } else {
    console.log("using hip store");
    hipstore=true;
  }
//  if (window.location.search.indexOf('sml')>-1){
//    console.log("using small store");
//    confmemmax=(512*1024*1024)-(16*1024*1024);
//    conftmpstrStorageMB=64;
//    confbufPoolMB=50;
//    //confhashBits=22;
//    confbukpoolMB=50;
//  }
//  if (window.location.search.indexOf('med')>-1){
//    console.log("using medium store");
//    confmemmax=(1*1024*1024*1024)-(32*1024*1024);
//    conftmpstrStorageMB=256;
//    confbufPoolMB=100;
//  }
//  if (window.location.search.indexOf('lrg')>-1){
//    console.log("using large store");
//    confmemmax=(2*1024*1024*1024)-(64*1024*1024);
//    conftmpstrStorageMB=512;
//    confbufPoolMB=200;
//  }
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var storeready=0;
var memmax;
var mem;
var mem8;
var mem16;
var mem32;
var memF32;
var storedB;
var storedBpct;
//input buffer
var tmpstrStorageMB;
var tmpstrStore;
var tmpstrStore8;
var tmpstrStoredB;
//bpool
var bufPoolMB;
var temps;
var storemax;
//Hash tables
var hashBits;
var hashBitFilter;
//
var hash1BucketSize;
var hash2BucketSize;
var hash3BucketSize;

var bukpoolMB;
var bukpool;
var hbbsize;
var htbsize;
var hdbsize;
var hdbsize32;

var h1tb;
var h1bb;
var h1db;
var h2tb;
var h2bb;
var h2db;
var h3tb;
var h3bb;
var h3db;
//
function store_respond(size){
  size=size.toLowerCase();
  if (size == 'small'){
    console.log("using small store");
    confmemmax=(512*1024*1024)-(16*1024*1024);
    conftmpstrStorageMB=64;
    confbufPoolMB=50;
    //confhashBits=22;
    confbukpoolMB=50;
  }
  if (size == 'medium'){
    console.log("using medium store");
    confmemmax=(1*1024*1024*1024)-(32*1024*1024);
    conftmpstrStorageMB=256;
    confbufPoolMB=100;
  }
  if (size == 'large'){
    console.log("using large store");
    confmemmax=(2*1024*1024*1024)-(64*1024*1024);
    conftmpstrStorageMB=512;
    confbufPoolMB=200;
  }

}
function init_store(size){
  if (typeof size !== 'undefined')
    store_respond(size);
  memmax=confmemmax||(2*1024*1024*1024)-(64*1024*1024);
  mem=new ArrayBuffer(memmax);
  mem8=new Int8Array(mem);
  mem16=new Int16Array(mem);
  mem32=new Int32Array(mem);
  memF32=new Float32Array(mem);
  storedB=0;
  storedBpct=0;
  //input buffer
  tmpstrStorageMB=conftmpstrStorageMB||512;
  tmpstrStore= new ArrayBuffer(tmpstrStorageMB * 1024 * 1024);
  tmpstrStore8= new Int8Array(tmpstrStore);
  tmpstrStoredB=0;
  //bpool
  bufPoolMB=confbufPoolMB||200;
  temps=memmax-(bufPoolMB*1024*1024);
  storemax=temps;
  //Hash tables
  hashBits=23;
  hashBitFilter=Math.pow(2,hashBits)-1;
  
  hash1BucketSize=5;
  hash2BucketSize=29;
  hash3BucketSize=1021;
  
  bukpoolMB=confbukpoolMB||100;
  bukpool=bukpoolMB*1024*1024;
  hbbsize=((hashBitFilter+1)*4);
  htbsize=bukpool;
  hdbsize=hashBitFilter>>3;
  hdbsize32=hashBitFilter>>5;
  
  h1tb=storemax-htbsize;
  h1bb=h1tb-hbbsize;
  h1db=h1bb-hdbsize;
  h2tb=h1db-htbsize;
  h2bb=h2tb-hbbsize;
  h2db=h2bb-hdbsize;
  h3tb=h2db-htbsize;
  h3bb=h3tb-hbbsize;
  h3db=h3bb-hdbsize;
  storemax=h2db;
  storeready=1;
  latchmem();
}
function latchmem(){
  var asm_mod= (function (global, env, mem){
    "use asm";
    var mem32 = new global.Int32Array(mem);
    function runner(){
      var i=0;
      while ((i|0)<(1024*1024|0)){
        mem32[32]
        i=(i+4)|0;
      }
      return 0;
    }
    return {runner:runner}
  });
  var asmi;
  if (inNode)
    asmi = new asm_mod(global, null, mem);
  else 
    asmi = new asm_mod(window, null, mem);
  asmi.runner();
}
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
  if(inNode)
    return malloc_v8(size);
  else
    return malloc_ff(size);
}
function malloc_ff(size){
  size=size|0;
  if (size<1) return storedB;
  size4b=((((size-1)/4)|0)+1)*4;
  ret=storedB;
  storedB= (storedB+ size4b)|0;
  return ret|0;
}
if (hipstore){
  malloc_ff = function(size){
    size=size|0;
    if (size<1) return storedB;
    size4b=((((size-1)/4)|0)+1)*4;
    ret=storedB;
    storedB= (storedB+ size4b)|0;
    var newstoreBcpt=((storedB/storemax).toFixed(2)*100)|0;
    if (newstoreBcpt>storedBpct){
      PTi.onMemTick(storedBpct=newstoreBcpt);
    }
    return ret|0;
  }  
}
function malloc_v8(size){
  size=size|0;
  if (size<1) return global.storedB;
  size4b=((((size-1)/4)|0)+1)*4;
  ret=global.storedB;
  global.storedB= (global.storedB+ size4b)|0;
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
//  module.exports.mem8=mem8;
//  module.exports.mem32=mem32;
//  module.exports.memF32= memF32;
  module.exports.tmpstrStore8=tmpstrStore8;
  global.hash1BucketSize=hash1BucketSize;
  global.temps=temps;
  global.mem=mem;
  global.hash2BucketSize=hash2BucketSize;
  global.hash3BucketSize=hash3BucketSize;
  global.hashBitFilter=hashBitFilter;
  global.h1tb=h1tb;
  global.h1bb=h1bb;
  global.h1db=h1db;
  global.h2tb=h2tb;
  global.h2bb=h2bb;
  global.h2db=h2db;
  global.h3tb=h3tb;
  global.h3bb=h3bb;
  global.h3db=h3db;
  global.deletetmpstr=deletetmpstr;
  global.storedB=storedB;
  global.mem8=mem8;
  global.mem32=mem32;
  global.memF32=memF32;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
