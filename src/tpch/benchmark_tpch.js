
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
  for (var i=0; i<queries.length; i++){
    var query=queries[i];
    var model_answer=answers[i];
    var t0 = window.performance.now();
    var verified= verify_query(i,query,model_answer);
    var t1 = window.performance.now();
    verifiedA.push(verified);
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

