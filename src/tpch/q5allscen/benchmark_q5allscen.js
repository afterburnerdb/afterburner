//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q5allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav5a,be_mav5b;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query5a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query5a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query5b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query5b_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav5a=query5a_mav();
    be_mav5a.materialize_be();
    t0=get_time_ms();
    be_mav5a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query5a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav5b=query5b_mav();
    be_mav5b.materialize_be();
    t0=get_time_ms();
    be_mav5b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query5b_mav @FE:"+timeA.join(','));
}

function bench_query5_latency_q5allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav5a,be_mav5b,be_mav5c;
  be_mav5a=query5a_mav();
  be_mav5a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q5=query5_fsql(be_mav5a);
    q5.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 5 against query5a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav5b=query5b_mav();
  be_mav5b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q5=query5_fsql(be_mav5b);
    q5.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 5 against query5b_mav@BE:"+timeA.join(','));

  timeA=[];

  be_mav5a=query5a_mav();
  be_mav5a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q5=query5_fsql(be_mav5a);
    q5.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 5 again query5a_mav@FE:"+timeA.join(','));
  timeA=[];

  be_mav5b=query5b_mav();
  be_mav5b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q5=query5_fsql(be_mav5b);
    q5.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 5 again query5b_mav@FE:"+timeA.join(','));
  timeA=[];
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q5allscen');
  global.bench_mavs_q5allscen=bench_mavs_q5allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
