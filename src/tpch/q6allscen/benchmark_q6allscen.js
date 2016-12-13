//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q6allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav6a,be_mav6b,be_mav6c;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query6a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query6b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6b_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query6c_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6c_mav @BE:"+timeA.join(','));
}

function bench_mavs_q6allscen_a(){
  timeA=[];
  for (var i=0; i<3; i++){
    be_mav6a=query6a_mav();
    be_mav6a.materialize_be();
    t0=get_time_ms();
    be_mav6a.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6a_mav @FE:"+timeA.join(','));
}
function bench_mavs_q6allscen_b(){
  timeA=[];
  for (var i=0; i<2; i++){
    be_mav6b=query6b_mav();
    be_mav6b.materialize_be();
    t0=get_time_ms();
    be_mav6b.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6b_mav @FE:"+timeA.join(','));
}
function bench_mavs_q6allscen_c(){
  timeA=[];
  for (var i=0; i<1; i++){
    be_mav6c=query6c_mav();
    be_mav6c.materialize_be();
    t0=get_time_ms();
    be_mav6c.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query6c_mav @FE:"+timeA.join(','));
}

function bench_query6_latency_q6allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav6a,be_mav6b,be_mav6c;
  be_mav6a=query6a_mav();
  be_mav6a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q6=query6_fsql(be_mav6a);
    q6.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 6 against query6a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav6b=query6b_mav();
  be_mav6b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q6=query6_fsql(be_mav6b);
    q6.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 6 against query6b_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav6c=query6c_mav();
  be_mav6c.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q6=query6_fsql(be_mav6c);
    q6.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 6 against query6c_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav6a=query6a_mav();
  be_mav6a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q6=query6_fsql(be_mav6a);
    q6.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 6 again query6a_mav@FE:"+timeA.join(','));
  timeA=[];

  be_mav6b=query6b_mav();
  be_mav6b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q6=query6_fsql(be_mav6b);
    q6.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 6 again query6b_mav@FE:"+timeA.join(','));
  timeA=[];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q6allscen');
  global.bench_mavs_q6allscen=bench_mavs_q6allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
