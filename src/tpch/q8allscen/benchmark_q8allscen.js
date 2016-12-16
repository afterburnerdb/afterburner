//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q8allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav8a,be_mav8b,be_mav8c;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query8a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8a_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query8b_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8b_mav @BE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query8c_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8c_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav8a=query8a_mav();
    be_mav8a.materialize_be();
    t0=get_time_ms();
    be_mav8a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8a_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav8b=query8b_mav();
    be_mav8b.materialize_be();
    t0=get_time_ms();
    be_mav8b.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8b_mav @FE:"+timeA.join(','));
  timeA=[];
  for (var i=0; i<5; i++){
    be_mav8c=query8c_mav();
    be_mav8c.materialize_be();
    t0=get_time_ms();
    be_mav8c.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query8c_mav @FE:"+timeA.join(','));

}

function bench_query8_latency_q8allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav8a,be_mav8b,be_mav8c;
  be_mav8a=query8a_mav();
  be_mav8a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q8=query8_fsql(be_mav8a);
    q8.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8a_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav8b=query8b_mav();
  be_mav8b.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q8=query8_fsql(be_mav8b);
    q8.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8b_mav@BE:"+timeA.join(','));
  timeA=[];

  be_mav8c=query8c_mav();
  be_mav8c.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q8=query8_fsql(be_mav8c);
    q8.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8c_mav@BE:"+timeA.join(','));
  
  timeA=[];
  be_mav8a=query8a_mav();
  be_mav8a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q8=query8_fsql(be_mav8a);
    q8.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8a_mav@FE:"+timeA.join(','));
  
  timeA=[];
  be_mav8b=query8b_mav();
  be_mav8b.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q8=query8_fsql(be_mav8b);
    q8.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8b_mav@FE:"+timeA.join(','));
  
  timeA=[];
  be_mav8c=query8c_mav();
  be_mav8c.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q8=query8_fsql(be_mav8c);
    q8.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 8 against query8c_mav@FE:"+timeA.join(','));

}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q8allscen');
  global.bench_mavs_q8allscen=bench_mavs_q8allscen;
} else delete module;
///////////////////////////////////////////////////////////////////////////////
