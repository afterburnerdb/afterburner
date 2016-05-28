
primes=[107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]

function hash_intp(v){
  return v;
}
function hash_int(v){
//  "use asm";
  v=v|0;
  var hash = 0;
  hash=hash|0; 
  hash=101;
  hash=  ((hash*103)|0) + (v&0x000000FF);
  hash=  ((hash*103)|0) + (v&0x0000FF00)>>8;
  hash=  ((hash*103)|0) + (v&0x00FF0000)>>16;
  hash=  ((hash*103)|0) + (v&0xFF000000)>>24;
  return (hash |0);
}
function nasty_hash_intp(v,h){
  var hash = hash|0; hash=h;
  hash=  ((hash*103)|0) + (v&0x000000FF);
  hash=  ((hash*103)|0) + (v&0x0000FF00)>>8;
  hash=  ((hash*103)|0) + (v&0x00FF0000)>>16;
  hash=  ((hash*103)|0) + (v&0xFF000000)>>24;
  return (hash |0);
}

function hash_flop(v){
  return v;
}

function nasty_hash_flop(p,h){
  var hash = hash|0; hash=h;
  hash=  ((hash*103)|0) + (v&0x000000FF);
  hash=  ((hash*103)|0) + (v&0x0000FF00)>>8;
  hash=  ((hash*103)|0) + (v&0x00FF0000)>>16;
  hash=  ((hash*103)|0) + (v&0xFF000000)>>24;
  return (hash |0);
}

function hash_strp(p){
  var hash = hash|0; hash=101;
  var i=i|0;
  while (strStore8[(p+i)|0]){
    hash=  ((hash*103)|0) + (strStore8[(p+i)|0])  ;
    i=(i+1)|0;
  }
  return (hash |0);
}
function nasty_hash_strp(p,h){
  var hash = hash|0; hash=h;
  var i=i|0;
  while (strStore8[(p+i)|0]){
    hash=  ((hash*997)|0) + (strStore8[(p+i)|0])  ;
    i=(i+1)|0;
  }
  return (hash |0);
}
function keyMeta(){
  this.numAtt;
  this.types;
}
function valMeta(){
}
function hb(){
  this.bp=-1;
  this.next=-1;
}

function hi() {
  this.bp=-1;
  this.numBuK=1000;
  this.get = function(key){
  }
  this.put = function(key, val){
  }
  this.hash_intp = function(key){
    numStore32[key] % this.numBuK ;
  }
  this.hash_floatp = function(key){
    numStore32[key] % this.numBuK ;
  }
  this.hash_strp = function(key){
    numStore32[key] % this.numBuK ;
  }
}


//function nextBuck(){
//  return  (currNumBucks++) * ((hashBucketSize+2));
//}
function next1Buck(){
  return h1tb+((curr1NumBucks++) * ((hash1BucketSize+2)<<2));
}
function next2Buck(){
  return h2tb+((curr2NumBucks++) * ((hash2BucketSize+2)<<2));
}
function next3Buck(){
  return h3tb+((curr3NumBucks++) * ((hash3BucketSize+2)<<2));
}

curr1NumBucks=1;
curr2NumBucks=1;
curr3NumBucks=1;
for (var i=0;i<hashBitFilter;i++){
  mem32[(h1bb+(i<<2))>>2]=0;
  mem32[(h2bb+(i<<2))>>2]=0;
  mem32[(h3bb+(i<<2))>>2]=0;
}
while((bp=next1Buck())<bukpool){
  mem32[bp>>2]=0;
  mem32[(bp+(hash1BucketSize+1)<<2)>>2]=0;
}
curr1NumBucks=1;
while((bp=next2Buck())<bukpool){
  mem32[bp>>2]=0;
  mem32[(bp+(hash2BucketSize+1)<<2)>>2]=0;
}
curr2NumBucks=1;
while((bp=next3Buck())<bukpool){
  mem32[bp>>2]=0;
  mem32[(bp+(hash3BucketSize+1)<<2)>>2]=0;
}
curr3NumBucks=1;

