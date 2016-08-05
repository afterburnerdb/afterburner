//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
if (inNode){
  require("/u1/kelgebaly/git/afterburner/src/tpch/q01");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q02");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q03");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q04");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q05");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q06");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q07");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q08");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q09");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q10");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q11");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q12");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q13");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q14");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q15");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q16");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q17");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q18");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q19");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q20");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q21");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q22");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans1");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans2");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans3");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans4");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans5");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans6");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans7");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans8");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans9");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans10");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans11");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans12");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans13");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans14");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans15");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans16");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans17");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans18");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans19");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans20");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans21");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans22");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

queries=[query1,
query2,
query3,
query4,
query5,
query6,
query7,
query8,
query9,
query10,
query11,
query12,
query13,
query14,
query15,
query16,
query17,
query18,
query19,
query20,
query21,
query22
]

answers=[ans1,
ans2,
ans3,
ans4,
ans5,
ans6,
ans7,
ans8,
ans9,
ans10,
ans11,
ans12,
ans13,
ans14,
ans15,
ans16,
ans17,
ans18,
ans19,
ans20,
ans21,
ans22
]

function equalcell(name,num,c1,c2){
  if (c1==c2) return true;
  if ( c1<(c2*1.01) && c2<(c1*1.01) ) return true;
  console.log("qname:"+ name +"cell#"+ num + "mycell:[" + c1 + "]!=[" + c2+"]");
  return false;
}

function verify_query(qnum,q,ma){
  var mya= q().toArray2();
  var name=(qnum+1);
  if (mya.length != ma.length){
    return false;
  } else {
  }
  for (var i=0; i<ma.length;i++){
    if (!equalcell(name,i,mya[i],ma[i])){
      console.log("query "+ name + " answers dont match");
      return false;
    }
  }
  return true;
}

function verify_queries(){
  var verifiedA=[];
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    var verified= verify_query(i,query,model_answer);
    verifiedA.push(verified);
  }
  return verifiedA;
}

function verify_and_time(){
  var verifiedA=[];
  var runtimesMSA=[];
  var t0,t1;
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    if (inNode)
      t0=process.hrtime();
    else
      t0 = window.performance.now();
    var verified= verify_query(i,query,model_answer);
    if (inNode)
      t1=process.hrtime();
    else
      t1 = window.performance.now();
    verifiedA.push(verified);
    if (inNode)
      runtimesMSA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
    else 
      runtimesMSA.push(t1-t0);
  }
  return {veri:verifiedA, runt:runtimesMSA};
}
function verifyqs(){
  var verifiedA=[];
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    var verified= verify_query(i,query,model_answer);
    verifiedA.push(verified);
  }
  return verifiedA;
}
function start_collecting(){
   
  child_process.exec("perf stat -p "+process.pid + " -o tmp -B -e cache-references,cache-misses,cycles,instructions,branches,branch-misses,stalled-cycles-backend,stalled-cycles-frontend,faults,migrations sleep 5");
 // child_process.exec("sudo perf record -F 99 -p "+process.pid+"  -ag -- sleep 5");
}
function end_collecting(qnum){
  child_process.execSync("sleep 5");
  var cache_ref=parseInt(child_process.execSync("grep cache-ref tmp | cut -d \\t -f 1")+"");
  if (isNaN(cache_ref)) cache_ref=0;
  var cache_misses=parseInt(child_process.execSync("grep cache-misses tmp | cut -d \\t -f 1")+"");
  if (isNaN(cache_misses)) cache_misses=0;
  var cycles=parseInt(child_process.execSync("grep cycles.\*GH tmp | cut -d \\t -f 1")+"");
  if (isNaN(cycles)) cycles=0;
  var instructions=parseInt(child_process.execSync("grep instructions tmp | cut -d \\t -f 1")+"");
  if (isNaN(instructions)) instructions=0;
  var branches=parseInt(child_process.execSync("grep branches tmp | cut -d \\t -f 1")+"");
  if (isNaN(branches)) branches=0;
  var branch_misses=parseInt(child_process.execSync("grep branch-misses tmp | cut -d \\t -f 1")+"");
  if (isNaN(branch_misses)) branches=0;
  var stalled_cycles_backend=parseInt(child_process.execSync("grep stalled-cycles-backend tmp | cut -d \\t -f 1")+"");
  if (isNaN(stalled_cycles_backend)) stalled_cycles_backend=0;
  var stalled_cycles_frontend=parseInt(child_process.execSync("grep stalled-cycles-frontend tmp | cut -d \\t -f 1")+"");
  if (isNaN(stalled_cycles_frontend)) scf=0;
  var faults=parseInt(child_process.execSync("grep faults tmp | cut -d \\t -f 1")+"");
  if (isNaN(faults)) faults=0;
  var migrations=parseInt(child_process.execSync("grep migrations tmp | cut -d \\t -f 1")+"");
  if (isNaN(migrations)) migrations=0;
  child_process.execSync("echo q" + (qnum+1) +":"+cache_ref+","+cache_misses+","+cycles+","+ instructions +","+branches+","+branch_misses+","+stalled_cycles_backend +","+stalled_cycles_frontend+","+faults+","+migrations+" >> perfstats.out");

  child_process.execSync("rm tmp");
 // child_process.execSync("sudo perf script > q"+(qnum+1)+".cx");
  
}
function timeqs(osperf,noasm){
  var timeA=[];
  var t0,t1;
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    if (osperf) start_collecting();
    if (inNode)
      t0=process.hrtime();
    else
      t0 = window.performance.now();
    query(noasm).materialize(noasm);
    if (inNode)
      t1=process.hrtime();
    else
      t1 = window.performance.now();
    if (osperf) end_collecting(i);
    if (inNode)
      timeA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
    else 
      timeA.push(t1-t0);
  }
  return timeA;
}
function count_calls(osperf,noasm){
  var timeA=[];
  var t0,t1;
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    if (osperf) start_collecting();
    if (inNode)
      t0=process.hrtime();
    else
      t0 = window.performance.now();
    fcall_ctr=0;
    query(noasm).materialize(noasm); 
    console.log("q:"+i+" fcall_ctr"+fcall_ctr);
    if (inNode)
      t1=process.hrtime();
    else
      t1 = window.performance.now();
    if (osperf) end_collecting(i);
    if (inNode)
      timeA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
    else
      timeA.push(t1-t0);
  }
  return timeA;
}
function count_mats(osperf,noasm){
  var timeA=[];
  var t0,t1;
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    if (osperf) start_collecting();
    if (inNode)
      t0=process.hrtime();
    else
      t0 = window.performance.now();
    fcall_ctr=0;
    var mem0= malloc(0);
    var mattemps=query(noasm);
    var mem1= malloc(0);
    mattemps.materialize(noasm);
    var mem2= malloc(0);
    console.log("q:"+i+" mem-mats:"+(mem1-mem0)+ " mem-ans:"+ (mem2-mem1));
    if (inNode)
      t1=process.hrtime();
    else
      t1 = window.performance.now();
    if (osperf) end_collecting(i);
    if (inNode)
      timeA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
    else
      timeA.push(t1-t0);
  }
  return timeA;
}
function benchmark3(warmup,rounds,noasm){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];
  var osperf=true;
 // child_process.execSync("sudo echo initsudo");
  for (var w=0; w<warmup; w++){
      run=verifyqs();
      verifiedAA.push(run);
  }
  for (var r=0; r<rounds;r++){
      run=timeqs(true,noasm);
      runtimesMSAA.push(run);
  }
  for (var i=0; i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<rounds;ii++){
      tmpstr+=verifiedAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
  for (var i=0; i<verifiedAA[0].length; i++){
    tmpstr="";
    for (var ii=0; ii<rounds; ii++){
      tmpstr+=runtimesMSAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
}
function benchmark(warmup,rounds,noasm){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];
  var osperf=false;
  for (var w=0; w<warmup; w++){
      run=verifyqs();
      verifiedAA.push(run);
  }
  for (var r=0; r<rounds;r++){
      run=timeqs(osperf,noasm);
      runtimesMSAA.push(run);
  }
  for (var i=0; (typeof  verifiedAA[0] !='undefined')&& i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<rounds;ii++){
      tmpstr+=verifiedAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
  for (var i=0; (typeof  runtimesMSAA[0] !='undefined')&&i<runtimesMSAA[0].length; i++){
    tmpstr="";
    for (var ii=0; ii<rounds; ii++){
      tmpstr+=runtimesMSAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
}
function benchmark_badone_delete(warmup,rounds){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];

  for (var w=0; w<warmup; w++){
      run=verify_and_time();
      verifiedAA.push(run.veri);
  }
  for (var r=0; r<rounds;r++){
      run=verify_and_time();
      runtimesMSAA.push(run.runt);
  }
  for (var i=0; (typeof  verifiedAA[0] !='undefined')&&i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<rounds;ii++){
      tmpstr+=verifiedAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
  for (var i=0; (typeof  runtimesMSAA[0] !='undefined')&&i<runtimesMSAA[0].length; i++){
    tmpstr="";
    for (var ii=0; ii<rounds; ii++){
      tmpstr+=runtimesMSAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
}
//micro1
/*
function micro1_JSO(scale, iters){
  var o_totalpriceA=ABi.select().from('orders').field('o_totalprice').toArray();
  var count = 0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();

  for (var i=0; i< iters; i++){
    count=0;
    for (var ii=0;ii<scale;ii++){
      if (o_totalpriceA[ii] < 1500)
        count= count + 1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
function micro1_TA(scale, iters){
  var o_totalpriceOffset= daSchema.getColPByName('o_totalprice','orders');
  var AB = new ArrayBuffer(scale*4);
  var lmemF32= new Float32Array(AB);
  for (var ii=0;ii<scale;ii++){
    lmemF32[ii] = memF32[(o_totalpriceOffset + (ii*4))>>2];
  }
  var count=0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();
  for (var i=0; i< iters; i++){
    count=0;
    for (var ii=0;ii<scale;ii++){
      if (lmemF32[ii] < 1500)
        count= count + 1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;

}
var asm_m1 = (function (global, env, mem){
  "use asm";
  var scale=env.scale|0;
  var memF32 = new global.Float32Array(mem);
  function runner(){
    var count=0;
    var ii=0;
    var sscale=0;
    sscale= scale<<2;
    for (;(ii|0)<(sscale|0);ii=(ii+4)|0){
      if ( +(memF32[ii>>2]) < 1500.0)
        count= (count + 1)|0;
    }
    return count|0;
  }
  return {runner:runner}
});
function micro1_ASM(scale, iters){
  var o_totalpriceOffset= daSchema.getColPByName('o_totalprice','orders');
  var bytes=(scale*4);
  if (bytes<0x10000)
    bytes=0x10000;
  else if (bytes<0x80000)
    bytes=0x80000;
  else if (bytes<0x400000)
    bytes=0x400000;
  var AB = new ArrayBuffer(bytes*4);
  var lmemF32= new Float32Array(AB);
  for (var ii=0;ii<scale;ii++){
    lmemF32[ii] = memF32[(o_totalpriceOffset + (ii*4))>>2];
  }
  var count=0;
  var env={'scale':scale};
  var asmi = new asm_m1(window, env,AB);
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();
  for (var i=0; i< iters; i++){
    count=asmi.runner();
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
function micro1(){
  var scales= [1000,10*1000,100*1000,1000*1000];
  var runtimesJSOA=[];
  var runtimesTA=[];
  var runtimesASM=[];
  for (var i=0;i<scales.length;i++){
    daSchema.getTable('orders').numrows=scales[i];
    console.log("micro1 JSO:"+micro1_JSO(scales[i], 5)+" (ms) @scale:" + scales[i]);
    console.log("micro1 TA :"+micro1_TA (scales[i], 5)+" (ms) @scale:" + scales[i]);
    console.log("micro1 ASM :"+micro1_ASM (scales[i], 5)+" (ms) @scale:" + scales[i]);
  }
}
//micro2
function micro2_JSO(scale, iters){
  var o_shippriorityA=ABi.select().from('orders').field('o_shippriority').toArray();
  var count = 0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();

  for (var i=0; i<iters; i++){
    count= 0;
    for (var ii=0;ii<scale;ii++){
      if (o_shippriorityA[ii] == 0)
        count= count+ 1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
function micro2_TA(scale, iters){
  var o_shippriorityOffset= daSchema.getColPByName('o_shippriority','orders');
  var lmem32= new Int32Array(scale);
  for (var ii=0;ii<scale;ii++){
    lmem32[ii] = mem32[(o_shippriorityOffset + (ii*4))>>2];
  }
  var count= 0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();
  for (var i=0; i< iters; i++){
    count= 0;
    for (var ii=0;ii<scale;ii++){
      if (lmem32[ii] == 0)
        count= count+1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
var asm_m2 = (function (global, env, mem){
  "use asm";
  var scale=env.scale|0;
  var mem32 = new global.Int32Array(mem);
  function runner(){
    var count=0;
    var ii=0;
    var sscale=0;
    sscale= scale<<2;
//    for (;(ii|0)<(sscale|0);ii=(ii+4)|0){
//      if ( (mem32[ii>>2]|0) == 0)
//        count= (count + 1)|0;
//    }
    while ((ii|0)<(sscale|0)){
      if ( (mem32[ii>>2]|0) == 0)
        count= (count + 1)|0;
      ii=(ii+4)|0;
    }
    return count|0;
  }
  return {runner:runner}
});
function micro2_ASM(scale, iters){
  var o_shippriorityOffset= daSchema.getColPByName('o_shippriority','orders');
  var bytes=(scale*4);
  if (bytes<0x10000)
    bytes=0x10000;
  else if (bytes<0x80000)
    bytes=0x80000;
  else if (bytes<0x400000)
    bytes=0x400000;
  var AB = new ArrayBuffer(bytes*4);
  var lmem32= new Int32Array(AB);
  for (var ii=0;ii<scale;ii++){
    lmem32[ii] = mem32[(o_shippriorityOffset + (ii*4))>>2];
  }
  var count=0;
  var env={'scale':scale};
  var asmi = new asm_m2(window, env,AB);
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();
  for (var i=0; i< iters; i++){
    count=asmi.runner();
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
function micro2(){
  var scales= [1000,10*1000,100*1000,1000*1000];
  var runtimesJSOA=[];
  var runtimesTA=[];
  var runtimesASM=[];
  for (var i=0;i<scales.length;i++){
    daSchema.getTable('orders').numrows=scales[i];
    console.log("micro2 JSO:"+micro2_JSO(scales[i], 5)+" (ms) @scale:" + scales[i]);
    console.log("micro2 TA :"+micro2_TA (scales[i], 5)+" (ms) @scale:" + scales[i]);
    console.log("micro2 ASM :"+micro2_ASM (scales[i], 5)+" (ms) @scale:" + scales[i]);
  }
}
//micro3
function micro3_JSO(scale, iters){
  var o_shippriorityA=ABi.select().from('orders').field('o_orderpriority').toArray();
  var count = 0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();

  for (var i=0; i<iters; i++){
    count= 0;
    for (var ii=0;ii<scale;ii++){
      if (o_shippriorityA[ii] == '1-URGENT')
        count= count+ 1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}
function micro3_TA(scale, iters){
  var o_shippriorityOffset= daSchema.getColPByName('o_shippriority','orders');
  var lmem32= new Int32Array(scale);
  for (var ii=0;ii<scale;ii++){
    lmem32[ii] = mem32[(o_shippriorityOffset + (ii*4))>>2];
  }

  var count= 0;
  if (inNode)
    t0= process.hrtime();
  else
    t0= window.performance.now();
  for (var i=0; i< iters; i++){
    count= 0;
    for (var ii=0;ii<scale;ii++){
      if (lmem32[ii] < 1500)// o_orderpriority == 1-URGENT
        count= count+1;
    }
  }
  if (inNode)
    t1= process.hrtime();
  else
    t1= window.performance.now(); 
  console.log("count="+count);
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))))/iters;
  else 
    return (t1-t0)/iters;
}

function micro3(){
  var scales= [1000,10*1000,100*1000,1000*1000];
  var runtimesJSOA=[];
  var runtimesTA=[];
  var runtimesASM=[];
  for (var i=0;i<scales.length;i++){
    daSchema.getTable('orders').numrows=scales[i];
    console.log("micro3 JSO:"+micro3_JSO(scales[i], 5)+" (ms) @scale:" + scales[i]);
   // console.log("micro3 TA :"+micro3_TA (scales[i], 10)+" (ms) @scale:" + scales[i]);
  }
}
*/
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bechmark_tpch');
  global.benchmark=benchmark;
//  global.benchmark2=benchmark2;
  global.benchmark3=benchmark3;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
