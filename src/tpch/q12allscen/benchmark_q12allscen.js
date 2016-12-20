//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q12allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav12a,be_mav12b;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query12a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query12a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query12b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query12b_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav12a=query12a_mav();
    be_mav12a.materialize_be();
    t0=get_time_ms();
    be_mav12a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query12a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav12b=query12b_mav();
    be_mav12b.materialize_be();
    t0=get_time_ms();
    be_mav12b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query12b_mav @FE:"+timeA.join(','));
}

function bench_query12_latency_q12allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav12a,be_mav12b,be_mav12c;
  be_mav12a=query12a_mav();
  be_mav12a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q12=query12_fsql(be_mav12a);
    q12.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 12 against query12a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav12b=query12b_mav();
  be_mav12b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q12=query12_fsql(be_mav12b);
    q12.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 12 against query12b_mav@BE:"+timeA.join(','));

  timeA=[];

  be_mav12a=query12a_mav();
  be_mav12a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q12=query12_fsql(be_mav12a);
    q12.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 12 again query12a_mav@FE:"+timeA.join(','));
  timeA=[];

  be_mav12b=query12b_mav();
  be_mav12b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q12=query12_fsql(be_mav12b);
    q12.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 12 again query12b_mav@FE:"+timeA.join(','));
  timeA=[];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q12allscen');
  global.bench_mavs_q12allscen=bench_mavs_q12allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
