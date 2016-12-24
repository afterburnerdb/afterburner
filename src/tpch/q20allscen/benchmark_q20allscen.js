//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q20allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav20a;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query20a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query20a_mav @BE:"+timeA.join(','));

  timeA=[];
  be_mav20a=query20a_mav();
  be_mav20a.materialize_be();
  for (var i=0; i<5; i++){
    t0=get_time_ms();
    be_mav20a.materialize_fe(true);
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query20a_mav @FE:"+timeA.join(','));
}

function bench_query20_latency_q20allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav20a;
  be_mav20a=query20a_mav();
  be_mav20a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q20=query20_fsql(be_mav20a);
    q20.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 20 against query20a_mav@BE:"+timeA.join(','));

  //be_mav1a=query1a_mav();
  be_mav20a.materialize_fe();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q20=query20_fsql(be_mav20a);
    q20.ABI.materialize();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 20 against query20a_mav@FE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q20allscen');
  global.bench_mavs_q20allscen=bench_mavs_q20allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
