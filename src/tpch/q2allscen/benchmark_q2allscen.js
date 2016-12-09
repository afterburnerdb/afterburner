//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q2allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav2a,be_mav2b,be_mav2c;

  for (var i=0; i<5; i++){
    t0=get_time_ms();
    query2a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    t0=get_time_ms();
    query2b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2b_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    t0=get_time_ms();
    query2c_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2c_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<0; i++){
    be_mav2a=query2a_mav();
    be_mav2a.materialize_be();
    t0=get_time_ms();
    be_mav2a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav2b=query2b_mav();
    be_mav2b.materialize_be();
    t0=get_time_ms();
    be_mav2b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2b_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<0; i++){
    be_mav2c=query2c_mav();
    be_mav2c.materialize_be();
    t0=get_time_ms();
    be_mav2c.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2c_mav @FE:"+timeA.join(','));
}


function handle_large_mavfe(){
  timeA=[];
  for (var i=0; i<3; i++){
    be_mav2a=query2a_mav();
    be_mav2a.materialize_be();
    t0=get_time_ms();
    be_mav2a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query2a_mav @FE:"+timeA.join(','));
}

function bench_query2_latency_q2allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav2a,be_mav2b,be_mav2c;
  be_mav2a=query2a_mav();
  be_mav2a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q2=query2_fsql(be_mav2a);
    q2.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 2 again query2a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav2b=query2b_mav();
  be_mav2b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q2=query2_fsql(be_mav2b);
    q2.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 2 again query2b_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav2c=query2c_mav();
  be_mav2c.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q2=query2_fsql(be_mav2c);
    q2.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 2 again query2c_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav2a=query2a_mav();
  be_mav2a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q2=query2_fsql(be_mav2a);
    q2.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 2 again query2a_mav@FE:"+timeA.join(','));
  timeA=[];

  be_mav2b=query2b_mav();
  be_mav2b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q2=query2_fsql(be_mav2b);
    q2.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 2 again query2b_mav@FE:"+timeA.join(','));
  timeA=[];
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting benchmark_ods');
  global.benchmark_ods=benchmark_ods;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
