//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q9allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav9a;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query9a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query9a_mav @BE:"+timeA.join(','));
}

function bench_query9_latency_q9allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav9a;
  be_mav9a=query9a_mav();
  be_mav9a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q9=query9_fsql(be_mav9a);
    q9.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 9 against query9a_mav@BE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q9allscen');
  global.bench_mavs_q9allscen=bench_mavs_q9allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
