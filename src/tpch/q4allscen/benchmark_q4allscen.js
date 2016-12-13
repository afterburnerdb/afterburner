//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q4allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav4a;

  for (var i=0; i<5; i++){
    t0=get_time_ms();
    query4a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query4a_mav @BE:"+timeA.join(','));
  timeA=[];
  be_mav4a=query4a_mav();
  be_mav4a.materialize_be();
  for (var i=0; i<5; i++){
    t0=get_time_ms();
    be_mav4a.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query4a_mav @FE:"+timeA.join(','));
}

function bench_query4_latency_q4allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav4a;
  var q4;
  be_mav4a=query4a_mav();
  be_mav4a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q4=query4_fsql(be_mav4a);
    q4.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 4 against query4a_mav@BE:"+timeA.join(','));
  timeA=[];

  //be_mav4a=query4a_mav();
  be_mav4a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q4=query4_fsql(be_mav4a);
    q4.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 4 against query4a_mav@FE:"+timeA.join(','));
  timeA=[];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting benchmark_ods');
  global.benchmark_ods=benchmark_ods;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
