//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
if (inNode){
  require("/u1/kelgebaly/git/afterburner/src/tpch/q01");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q02");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q03");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q04");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q05");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q06");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q07");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q08");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q09");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q10");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q11");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q12");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q13");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q14");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q15");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q16");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q17");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q18");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q19");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q20");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q21");
  require("/u1/kelgebaly/git/afterburner/src/tpch/q22");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans1");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans2");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans3");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans4");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans5");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans6");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans7");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans8");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans9");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans10");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans11");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans12");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans13");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans14");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans15");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans16");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans17");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans18");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans19");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans20");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans21");
  require("/u1/kelgebaly/git/afterburner/src/tpch/answers/ans22");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

queries=[query1,
query2,
query3,
query4,
query5,
query6,
query7,
query8,
query9,
query10,
query11,
query12,
query13,
query14,
query15,
query16,
query17,
query18,
query19,
query20,
query21,
query22
]

answers=[ans1,
ans2,
ans3,
ans4,
ans5,
ans6,
ans7,
ans8,
ans9,
ans10,
ans11,
ans12,
ans13,
ans14,
ans15,
ans16,
ans17,
ans18,
ans19,
ans20,
ans21,
ans22
]

function equalcell(name,num,c1,c2){
  if (c1==c2) return true;
  if ( c1<(c2*1.01) && c2<(c1*1.01) ) return true;
  console.log("qname:"+ name +"cell#"+ num + "mycell:[" + c1 + "]!=[" + c2+"]");
  return false;
}

function verify_query(qnum,q,ma){
  var mya= q().toArray2();
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

function verify_queries(){
  var verifiedA=[];
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    var verified= verify_query(i,query,model_answer);
    verifiedA.push(verified);
  }
  return verifiedA;
}

function verify_and_time(){
  var verifiedA=[];
  var runtimesMSA=[];
  var t0;
  var t1;
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    if (inNode)
      t0=process.hrtime();
    else
      t0 = window.performance.now();
    var verified= verify_query(i,query,model_answer);
    if (inNode)
      t1=process.hrtime();
    else
      t1 = window.performance.now();
    verifiedA.push(verified);
    if (inNode)
      runtimesMSA.push((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
    else 
      runtimesMSA.push(t1-t0);
  }
  return {veri:verifiedA, runt:runtimesMSA};
}

function benchmark(warmup,rounds){
  if (typeof warmup== 'undefined') warmup =1;
  if (typeof rounds == 'undefined') rounds=5;
  var run;
  var tmpstr="";
  var verifiedAA=[];
  var runtimesMSAA=[];

  for (var w=0; w<warmup; w++){
      verify_and_time();
  }
  for (var r=0; r<rounds;r++){
      run=verify_and_time();
      verifiedAA.push(run.veri);
      runtimesMSAA.push(run.runt);
  }
  for (var i=0; i<verifiedAA[0].length; i++ ){
    tmpstr="";
    for (var ii=0; ii<rounds;ii++){
      tmpstr+=verifiedAA[ii][i] +",";
    }
    console.log("query"+(i+1) + ":" + tmpstr);
  }
  for (var i=0; i<verifiedAA[0].length; i++){
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
  console.log('exporting bechmark_tpch');
  global.benchmark=benchmark;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
