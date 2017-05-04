//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
if (inNode){
  if (typeof tpch_f1 == 'undefined' | tpch_f1 == 1 ){
    query1 =require("./llfsql_f1/q01");
    query2 =require("./llfsql_f1/q02");
    query3 =require("./llfsql_f1/q03");
    query4 =require("./llfsql_f1/q04");
    query5 =require("./llfsql_f1/q05");
    query6 =require("./llfsql_f1/q06");
    query7 =require("./llfsql_f1/q07");
    query8 =require("./llfsql_f1/q08");
    query9 =require("./llfsql_f1/q09");
    query10=require("./llfsql_f1/q10");
    query11=require("./llfsql_f1/q11");
    query12=require("./llfsql_f1/q12");
    query13=require("./llfsql_f1/q13");
    query14=require("./llfsql_f1/q14");
    query15=require("./llfsql_f1/q15");
    query16=require("./llfsql_f1/q16");
    query17=require("./llfsql_f1/q17");
    query18=require("./llfsql_f1/q18");
    query19=require("./llfsql_f1/q19");
    query20=require("./llfsql_f1/q20");
    query21=require("./llfsql_f1/q21");
    query22=require("./llfsql_f1/q22");
  } else {
    query1 =require("./llfsql_f2/q01");
    query2 =require("./llfsql_f2/q02");
    query3 =require("./llfsql_f2/q03");
    query4 =require("./llfsql_f2/q04");
    query5 =require("./llfsql_f2/q05");
    query6 =require("./llfsql_f2/q06");
    query7 =require("./llfsql_f2/q07");
    query8 =require("./llfsql_f2/q08");
    query9 =require("./llfsql_f2/q09");
    query10=require("./llfsql_f2/q10");
    query11=require("./llfsql_f2/q11");
    query12=require("./llfsql_f2/q12");
    query13=require("./llfsql_f2/q13");
    query14=require("./llfsql_f2/q14");
    query15=require("./llfsql_f2/q15");
    query16=require("./llfsql_f2/q16");
    query17=require("./llfsql_f2/q17");
    query18=require("./llfsql_f2/q18");
    query19=require("./llfsql_f2/q19");
    query20=require("./llfsql_f2/q20");
    query21=require("./llfsql_f2/q21");
    query22=require("./llfsql_f2/q22");
  }
  query1_fsqy =require("./fsql/q01");
  query2_fsql =require("./fsql/q02");
  query3_fsql =require("./fsql/q03");
  query4_fsql =require("./fsql/q04");
  query5_fsql =require("./fsql/q05");
  query6_fsql =require("./fsql/q06");
  query7_fsql =require("./fsql/q07");
  query8_fsql =require("./fsql/q08");
  query9_fsql =require("./fsql/q09");
  query10_fsql=require("./fsql/q10");
  query11_fsql=require("./fsql/q11");
  query12_fsql=require("./fsql/q12");
  query13_fsql=require("./fsql/q13");
  query14_fsql=require("./fsql/q14");
  query15_fsql=require("./fsql/q15");
  query16_fsql=require("./fsql/q16");
  query17_fsql=require("./fsql/q17");
  query18_fsql=require("./fsql/q18");
  query19_fsql=require("./fsql/q19");
  query20_fsql=require("./fsql/q20");
  query21_fsql=require("./fsql/q21");
  query22_fsql=require("./fsql/q22");

  ans1=require("ans1");
  ans2=require("ans2");
  ans3=require("ans3");
  ans4=require("ans4");
  ans5=require("ans5");
  ans6=require("ans6");
  ans7=require("ans7");
  ans8=require("ans8");
  ans9=require("ans9");
  ans10=require("ans10");
  ans11=require("ans11");
  ans12=require("ans12");
  ans13=require("ans13");
  ans14=require("ans14");
  ans15=require("ans15");
  ans16=require("ans16");
  ans17=require("ans17");
  ans18=require("ans18");
  ans19=require("ans19");
  ans20=require("ans20");
  ans21=require("ans21");
  ans22=require("ans22");
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
if (typeof query1_fsql !== 'undefined'){
queries_fsql=[query1_fsql,
query2_fsql,
query3_fsql,
query4_fsql,
query5_fsql,
query6_fsql,
query7_fsql,
query8_fsql,
query9_fsql,
query10_fsql,
query11_fsql,
query12_fsql,
query13_fsql,
query14_fsql,
query15_fsql,
query16_fsql,
query17_fsql,
query18_fsql,
query19_fsql,
query20_fsql,
query21_fsql,
query22_fsql
]}
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

function verify_query(qnum,q,ma,noasm){
  var mya= q(noasm).toArray2();
  var name=(qnum+1);
  if (mya.length != ma.length){
    console.log("query "+ name + " answers dont match in length!!");
    console.log("model answer:"+ ma.length + " while query answer:"+mya.length);
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

//function verify_queries(){
//  var verifiedA=[];
//  for (var i=0; i<queries.length; i++){
//    var query=queries[i];
//    var model_answer=answers[i];
//    var verified= verify_query(i,query,model_answer);
//    verifiedA.push(verified);
//  }
//  return verifiedA;
//}

//function verify_and_time(){
//  var verifiedA=[];
//  var runtimesMSA=[];
//  var t0,t1;
//  for (var i=0; i<queries.length; i++){
//    var query=queries[i];
//    var model_answer=answers[i];
//    if (inNode)
//      t0=process.hrtime();
//    else
//      t0 = window.performance.now();
//    var verified= verify_query(i,query,model_answer);
//    if (inNode)
//      t1=process.hrtime();
//    else
//      t1 = window.performance.now();
//    verifiedA.push(verified);
//    if (inNode)
//      runtimesMSA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
//    else 
//      runtimesMSA.push(t1-t0);
//  }
//  return {veri:verifiedA, runt:runtimesMSA};
//}
function verifyqs(noasm,backend, against){
  var verifiedA=[];
  if (backend)
    console.log("verifying q's_fsql");
  else 
    console.log("verifying q's noasm:"+noasm);
  for (var i=0; i<queries.length; i++){
    var query;
    if (backend)
      query=queries_fsql[i];
    else 
      query=queries[i]
    var model_answer=answers[i];
    var verified= verify_query(i,query,model_answer,noasm);
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
function timeqs(osperf,noasm,backend){
  var timeA=[];
  var t0,t1;
  for (var i=0; i<queries.length; i++){
    var query;
    if (backend)
      query=queries_fsql[i];
    else 
      query=queries[i]
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
function benchmark_metrics(warmup,rounds,noasm){
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
function benchmark(warmup,rounds,noasm,backend){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  if (typeof backend == 'undefined') backend=false;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];
  var osperf=false;
  for (var w=0; w<warmup; w++){
      run=verifyqs(noasm,backend);
      verifiedAA.push(run);
  }
  for (var r=0; r<rounds;r++){
      run=timeqs(osperf,noasm,backend);
      runtimesMSAA.push(run);
  }
  for (var i=0; (typeof  verifiedAA[0] !='undefined')&& i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<warmup;ii++){
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
function bench_tpch_Q1(){
  for (var i=0;i<5;i++)
    abdb.select()
    .from('lineitem')
    .field('l_returnflag',
      'l_linestatus',
      _as(_sum('l_quantity'),'sum_qty'),
      _as(_sum('l_extendedprice'),'sum_base_price'),
      _as(_avg('l_quantity'),'avg_qty'),
      _as(_avg('l_extendedprice'),'avg_price'),
      _as(_avg('l_discount'),'avg_disc'),
      _as(_count('*'),'count_order'))
    .where(_lte('l_shipdate',_date('1998-09-02')))
    .group('l_returnflag','l_linestatus')
    .order('l_returnflag','l_linestatus')
    .materialize();

  var t0=get_time_ms();
  var repeats=10;
  for (var i=0;i<repeats;i++)
    abdb.select()
    .from('lineitem')
    .field('l_returnflag',
      'l_linestatus',
      _as(_sum('l_quantity'),'sum_qty'),
      _as(_sum('l_extendedprice'),'sum_base_price'),
      _as(_avg('l_quantity'),'avg_qty'),
      _as(_avg('l_extendedprice'),'avg_price'),
      _as(_avg('l_discount'),'avg_disc'),
      _as(_count('*'),'count_order'))
    .where(_lte('l_shipdate',_date('1998-09-02')))
    .group('l_returnflag','l_linestatus')
    .order('l_returnflag','l_linestatus')
    .materialize();
  var t1=get_time_ms();
  console.log("Time to run Q1_variant_5k * " + repeats + " times: "+time_diff(t0,t1)) + "(ms)";
}

function Query3a_no_orderby(){
  var fe_mav3a=query3a_mav();
  fe_mav3a.materialize_fe();
  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3a.mat.name)
      .field(_count("*"))
      .where(_eq("c_mktsegment", "BUILDING"))
      .materialize();
  var t1=get_time_ms();
  console.log("time filter:"+time_diff(t0,t1)/10+ "(ms)");

  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3a.mat.name)
      .field("l_orderkey",_sum("SUM((l_extendedprice*(1-l_discount)))"),"o_orderdate","o_shippriority")
      .where(_eq("c_mktsegment", "BUILDING"))
      .group("l_orderkey","o_orderdate","o_shippriority")
      .materialize();
  var t1=get_time_ms();
  console.log("time no order:"+time_diff(t0,t1)/10+ "(ms)");

  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3a.mat.name)
      .field("l_orderkey",_sum("SUM((l_extendedprice*(1-l_discount)))"),"o_orderdate","o_shippriority")
      .where(_eq("c_mktsegment", "BUILDING"))
      .group("l_orderkey","o_orderdate","o_shippriority")
      .order([0,1])
      .materialize();
  var t1=get_time_ms();
  console.log("time query3a:"+time_diff(t0,t1)/10+ "(ms)");
}
function Query3b_no_orderby(){
  var fe_mav3b=query3b_mav();
  fe_mav3b.materialize_fe();

  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3b.mat.name)
      .field(_count("*"))
      .where(_lt("o_orderdate", _date("1995-03-15")))
      .materialize();
  var t1=get_time_ms();
  console.log("time to filter:"+time_diff(t0,t1)/10+ "(ms)");

  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3b.mat.name)
      .field("l_orderkey",_sum("SUM((l_extendedprice*(1-l_discount)))"),"o_orderdate","o_shippriority")
      .where(_lt("o_orderdate", _date("1995-03-15")))
      .group("l_orderkey","o_orderdate","o_shippriority")
      .materialize();
  var t1=get_time_ms();
  console.log("time no order:"+time_diff(t0,t1)/10+ "(ms)");

  var t0=get_time_ms();
  for (var i=0;i<10;i++)
    abdb.select()
      .from(fe_mav3b.mat.name)
      .field("l_orderkey",_sum("SUM((l_extendedprice*(1-l_discount)))"),"o_orderdate","o_shippriority")
      .where(_lt("o_orderdate", _date("1995-03-15")))
      .group("l_orderkey","o_orderdate","o_shippriority")
      .order([0,1])
      .materialize();
  var t1=get_time_ms();
  console.log("time query3b:"+time_diff(t0,t1)/10+ "(ms)");
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bechmark_tpch');
  global.benchmark=benchmark;
  global.benchmark_metrics=benchmark_metrics;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
