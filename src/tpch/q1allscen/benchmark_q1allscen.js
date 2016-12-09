//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q1allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav1a;

  for (var i=0; i<5; i++){
    t0=get_time_ms();
    query1a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query1a_mav @BE:"+timeA.join(','));
  timeA=[];
  be_mav1a=query1a_mav();
  be_mav1a.materialize_be();
  for (var i=0; i<5; i++){
    t0=get_time_ms();
    be_mav1a.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query1a_mav @FE:"+timeA.join(','));
}

function bench_query1_latency_q1allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav1a;
  var q1;
  be_mav1a=query1a_mav();
  be_mav1a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q1=query1_fsql(be_mav1a);
    q1.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 1 against query1a_mav@BE:"+timeA.join(','));
  timeA=[];

  //be_mav1a=query1a_mav();
  be_mav1a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q1=query1_fsql(be_mav1a);
    q1.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 1 against query1a_mav@FE:"+timeA.join(','));
  timeA=[];
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting benchmark_ods');
  global.benchmark_ods=benchmark_ods;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
