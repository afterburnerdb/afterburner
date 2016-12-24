//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q21allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav21a,be_mav21b;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query21a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query21a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query21b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query21b_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav21a=query21a_mav();
    be_mav21a.materialize_be();
    t0=get_time_ms();
    be_mav21a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query21a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav21b=query21b_mav();
    be_mav21b.materialize_be();
    t0=get_time_ms();
    be_mav21b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query21b_mav @FE:"+timeA.join(','));
}

function bench_query21_latency_q21allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav21a,be_mav21b,be_mav21c;
  be_mav21a=query21a_mav();
  be_mav21a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q21=query21_fsql(be_mav21a);
    q21.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 21 against query21a_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav21b=query21b_mav();
  be_mav21b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q21=query21_fsql(be_mav21b);
    q21.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 21 against query21b_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav21a=query21a_mav();
  be_mav21a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q21=query21_fsql(be_mav21a);
    q21.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 21 against query21a_mav@FE:"+timeA.join(','));
  
  timeA=[];
  be_mav21b=query21b_mav();
  be_mav21b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q21=query21_fsql(be_mav21b);
    q21.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 21 against query21b_mav@FE:"+timeA.join(','));
  
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q21allscen');
  global.bench_mavs_q21allscen=bench_mavs_q21allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
