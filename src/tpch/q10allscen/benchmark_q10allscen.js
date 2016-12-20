//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q10allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav10a,be_mav10b;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query10a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query10a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query10b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query10b_mav @BE:"+timeA.join(','));

//  timeA=[];
//  for (var i=0; i<5; i++){
//    be_mav10a=query10a_mav();
//    be_mav10a.materialize_be();
//    t0=get_time_ms();
//    be_mav10a.materialize_fe();
//    t1=get_time_ms();
//    timeA.push(time_diff(t0,t1));
//  } 
//  console.log("time to create query10a_mav @FE:"+timeA.join(','));
}

function bench_query10_latency_q10allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav10a,be_mav10b,be_mav10c;
  be_mav10a=query10a_mav();
  be_mav10a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q10=query10_fsql(be_mav10a);
    q10.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 10 against query10a_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav10b=query10b_mav();
  be_mav10b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q10=query10_fsql(be_mav10b);
    q10.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 10 against query10b_mav@BE:"+timeA.join(','));

//  timeA=[];
//  be_mav10a=query10a_mav();
//  be_mav10a.materialize_fe();
//  for (var i=0; i<10; i++){
//    t0=get_time_ms();
//    var q10=query10_fsql(be_mav10a);
//    q10.ABI.materialize();
//    t1=get_time_ms();
//    timeA.push(time_diff(t0,t1));
//  } 
//  console.log("time to run query 10 again query10a_mav@FE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q10allscen');
  global.bench_mavs_q10allscen=bench_mavs_q10allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
