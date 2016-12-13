//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q3allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav3a,be_mav3b,be_mav3c;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query3a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query3b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3b_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query3c_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3c_mav @BE:"+timeA.join(','));
}

function bench_mavs_q3allscen_a(){
  timeA=[];
  for (var i=0; i<3; i++){
    be_mav3a=query3a_mav();
    be_mav3a.materialize_be();
    t0=get_time_ms();
    be_mav3a.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3a_mav @FE:"+timeA.join(','));
}
function bench_mavs_q3allscen_b(){
  timeA=[];
  for (var i=0; i<2; i++){
    be_mav3b=query3b_mav();
    be_mav3b.materialize_be();
    t0=get_time_ms();
    be_mav3b.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3b_mav @FE:"+timeA.join(','));
}
function bench_mavs_q3allscen_c(){
  timeA=[];
  for (var i=0; i<1; i++){
    be_mav3c=query3c_mav();
    be_mav3c.materialize_be();
    t0=get_time_ms();
    be_mav3c.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query3c_mav @FE:"+timeA.join(','));
}

function bench_query3_latency_q3allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav3a,be_mav3b,be_mav3c;
  be_mav3a=query3a_mav();
  be_mav3a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q3=query3_fsql(be_mav3a);
    q3.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 3 against query3a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav3b=query3b_mav();
  be_mav3b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q3=query3_fsql(be_mav3b);
    q3.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 3 against query3b_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav3c=query3c_mav();
  be_mav3c.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q3=query3_fsql(be_mav3c);
    q3.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 3 against query3c_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav3a=query3a_mav();
  be_mav3a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q3=query3_fsql(be_mav3a);
    q3.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 3 again query3a_mav@FE:"+timeA.join(','));
  timeA=[];

  be_mav3b=query3b_mav();
  be_mav3b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q3=query3_fsql(be_mav3b);
    q3.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 3 again query3b_mav@FE:"+timeA.join(','));
  timeA=[];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q3allscen');
  global.bench_mavs_q3allscen=bench_mavs_q3allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
