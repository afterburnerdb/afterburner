//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q7allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav7a;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query7a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query7a_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<10; i++){
    be_mav7a=query7a_mav();
    be_mav7a.materialize_be();
    t0=get_time_ms();
    be_mav7a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query7a_mav @FE:"+timeA.join(','));
}

function bench_query7_latency_q7allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav7a;
  be_mav7a=query7a_mav();
  be_mav7a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q7=query7_fsql(be_mav7a);
    q7.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 7 against query7a_mav@BE:"+timeA.join(','));
  
  timeA=[];
  be_mav7a=query7a_mav();
  be_mav7a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q7=query7_fsql(be_mav7a);
    q7.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 7 again query7a_mav@FE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q7allscen');
  global.bench_mavs_q7allscen=bench_mavs_q7allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
