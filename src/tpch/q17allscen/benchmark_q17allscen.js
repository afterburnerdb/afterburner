//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q17allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav17a,be_mav17b;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query17a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query17a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query17b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query17b_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav17a=query17a_mav();
    be_mav17a.materialize_be();
    t0=get_time_ms();
    be_mav17a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query17a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav17b=query17b_mav();
    be_mav17b.materialize_be();
    t0=get_time_ms();
    be_mav17b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query17b_mav @FE:"+timeA.join(','));

}

function bench_query17_latency_q17allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav17a,be_mav17b,be_mav17c;
  be_mav17a=query17a_mav();
  be_mav17a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q17=query17_fsql(be_mav17a);
    q17.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 17 against query17a_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav17b=query17b_mav();
  be_mav17b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q17=query17_fsql(be_mav17b);
    q17.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 17 against query17b_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav17a=query17a_mav();
  be_mav17a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q17=query17_fsql(be_mav17a);
    q17.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 17 again query17a_mav@FE:"+timeA.join(','));

  timeA=[];
  be_mav17b=query17b_mav();
  be_mav17b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q17=query17_fsql(be_mav17b);
    q17.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 17 again query17b_mav@FE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q17allscen');
  global.bench_mavs_q17allscen=bench_mavs_q17allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
