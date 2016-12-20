//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}

function bench_mavs_q13allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav13a;

  for (var i=0; i<10; i++){
    t0=get_time_ms();
    query13a_mav().materialize_be();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to create query13a_mav @BE:"+timeA.join(','));
}

function bench_query13_latency_q13allscen(){
  var t0,t1, mem0,mem1;
  var timeA=[];
  var be_mav13a;
  be_mav13a=query13a_mav();
  be_mav13a.materialize_be();
  for (var i=0; i<10; i++){
    t0=get_time_ms();
    q13=query13_fsql(be_mav13a);
    q13.toArray2();
    t1=get_time_ms();
    timeA.push(time_diff(t0,t1));
  } 
  console.log("time to run query 13 against query13a_mav@BE:"+timeA.join(','));
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bench_mavs_q13allscen');
  global.bench_mavs_q13allscen=bench_mavs_q13allscen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
