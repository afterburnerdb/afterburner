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
  mav15=require("mav15");
  mav20=require("mav20");

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
  query15_fsql=require("./fsql/q15");
  query20_fsql=require("./fsql/q20");

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
  ans15=require("ans15");
  ans20=require("ans20");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
mavs=[mav1,mav3,mav4,mav5,mav6,mav7,mav8,mav10,mav12,mav14,mav15,mav20];

//queries_fsql=[query1_fsql,
//query3_fsql,
//query4_fsql,
//query5_fsql,
//query6_fsql,
//query7_fsql,
//query8_fsql,
//query10_fsql,
//query12_fsql,
//query14_fsql,
//query15_fsql,
//query20_fsql,
//]
//answers=[ans1,
//ans3,
//ans4,
//ans5,
//ans6,
//ans7,
//ans8,
//ans10,
//ans12,
//ans14,
//ans15,
//ans20,
//]

function materialize_be_mavs(){
  for (var i=0;i<mavs.length;i++)
    mavs[i]().materialize_be();
}
function benchmark_opendatescen(warmup,rounds){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  if (typeof backend == 'undefined') backend=false;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];
  var osperf=false;
  materialize_be_mavs();
  //create be view..
  //pull be view..
  //run queries be..
  //run queries be using mav
  //run queries fe using mav
  for (var w=0; w<warmup; w++){
      run=verifyqs(noasm,backend);
      verifiedAA.push(run);
  }
  for (var r=0; r<rounds;r++){
      run=timeqs(osperf,noasm,backend);
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
  console.log('exporting benchmark_opendatescen');
  global.benchmark_opendatescen=benchmark_opendatescen;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
