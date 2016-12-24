//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q14allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav14a;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query14a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query14a_mav @BE:"+timeA.join(','));

  timeA=[];
  for (var i=0; i<5; i++){
    be_mav14a=query14a_mav();
    be_mav14a.materialize_be();
    t0=get_time_ms();
    be_mav14a.materialize_fe();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  }
  console.log("time to create query14a_mav @FE:"+timeA.join(','));
}

function bench_query14_latency_q14allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav14a;
  be_mav14a=query14a_mav();
  be_mav14a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q14=query14_fsql(be_mav14a);
    q14.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 14 against query14a_mav@BE:"+timeA.join(','));

  timeA=[];
  be_mav14a=query14a_mav();
  be_mav14a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    var q14=query14_fsql(be_mav14a);
    q14.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 14 against query14a_mav@FE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q14allscen');
  global.bench_mavs_q14allscen=bench_mavs_q14allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
