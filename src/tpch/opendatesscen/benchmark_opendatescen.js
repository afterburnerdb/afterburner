//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
if (inNode){
  mav1 =require("mav01");
  mav3 =require("mav03");
  mav4 =require("mav04");
  mav5 =require("mav05");
  mav6 =require("mav06");
  mav7 =require("mav07");
  mav8 =require("mav08");
  mav10=require("mav10");
  mav12=require("mav12");
  mav14=require("mav14");
//  mav15=require("mav15");
//  mav20=require("mav20");

  query1_fsql =require("./fsql/q01");
  query3_fsql =require("./fsql/q03");
  query4_fsql =require("./fsql/q04");
  query5_fsql =require("./fsql/q05");
  query6_fsql =require("./fsql/q06");
  query7_fsql =require("./fsql/q07");
  query8_fsql =require("./fsql/q08");
  query10_fsql=require("./fsql/q10");
  query12_fsql=require("./fsql/q12");
  query14_fsql=require("./fsql/q14");
//  query15_fsql=require("./fsql/q15");
//  query20_fsql=require("./fsql/q20");

  ans1=require("ans1");
  ans3=require("ans3");
  ans4=require("ans4");
  ans5=require("ans5");
  ans6=require("ans6");
  ans7=require("ans7");
  ans8=require("ans8");
  ans10=require("ans10");
  ans12=require("ans12");
  ans14=require("ans14");
//  ans15=require("ans15");
//  ans20=require("ans20");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
mavs_ods=[mav1,mav3,mav4,mav5,mav6,mav7,mav8,mav10,mav12,mav14,mav15,mav20];

queries_fsql_ods=[query1_fsql,
query3_fsql,
query4_fsql,
query5_fsql,
query6_fsql,
query7_fsql,
query8_fsql,
query10_fsql,
query12_fsql,
query14_fsql,
//query15_fsql,
//query20_fsql,
]
answers_ods=[ans1,
ans3,
ans4,
ans5,
ans6,
ans7,
ans8,
ans10,
ans12,
ans14,
//ans15,
//ans20,
]

function timeqs_fsql_ods(osperf,noasm,mats){
  var timeA=[];
  var t0,t1;
  for (var i=0; i<queries_fsql_ods.length; i++){
    var query=queries_fsql_ods[i];
    if (osperf) start_collecting();
    t0=get_time_ms();
    query(mats[i]).toArray2(noasm);
    t1=get_time_ms();
    if (osperf) end_collecting(i);
    timeA.push(time_diff(t0,t1));
  }
  return timeA;
}
function verify_query_fsql(qnum,q,ma,noasm){
  var mya= q.toArray2();
  var name=(qnum+1);
  if (mya.length != ma.length){
    return false;
  } else {
  }
  for (var i=0; i<ma.length;i++){
    if (!equalcell(name,i,mya[i],ma[i])){
      console.log("query "+ name + " answers dont match");
      return false;
    }
  }
  return true;
}
function verifyqs_ods(noasm,mats){
  var verifiedA=[];
  for (var i=0; i<queries_fsql_ods.length; i++){
    var query=queries_fsql_ods[i];
    var model_answer=answers_ods[i];
    var verified= verify_query_fsql(i,query(mats[i]),model_answer,noasm);
    verifiedA.push(verified);
  }
  return verifiedA;
}
function materialize_mavs(who){
  var mats=[];
  for (var i=0;i<mavs_ods.length;i++){
    if (who == 'backend')
      mats.push(mavs_ods[i]().materialize_be());
    else if (who == 'frontend')
      mats.push(mavs_ods[i]().materialize_fe());
    else
      mats.push(undefined);
  }
  return mats;
}
function benchmark_ods(warmup,rounds,noasm,against){
  //input:
  //int warmup; warmup rounds are verrified
  //int rounds; round are testing only
  //bool noasm; if running Afterburner, use asm or vanilla
  //string against; undefined -> run query at backend without help
  //                'backend' -> run query against backed mav
  //                'frontend'-> run query against frontend mav
  //output:
  //prints runtimes and verification results
  //examples:
  //benchmark_ods(5,5,false); 
  //benchmark_ods(5,5,false,'backend');
  //benchmark_ods(5,5,false,'frontend');
  //benchmark_ods(5,5,true,'frontend');
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];
  var osperf=false;
  var mats=materialize_mavs(against);
  for (var w=0; w<warmup; w++){
      run=verifyqs_ods(noasm,mats);
      verifiedAA.push(run);
  }
  for (var r=0; r<rounds;r++){
      run=timeqs_fsql_ods(osperf,noasm,mats);
      runtimesMSAA.push(run);
  }
  for (var i=0; (typeof  verifiedAA[0] !='undefined')&& i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<rounds;ii++){
      tmpstr+=verifiedAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
  for (var i=0; (typeof  runtimesMSAA[0] !='undefined')&&i<runtimesMSAA[0].length; i++){
    tmpstr="";
    for (var ii=0; ii<rounds; ii++){
      tmpstr+=runtimesMSAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting benchmark_ods');
  global.benchmark_ods=benchmark_ods;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
