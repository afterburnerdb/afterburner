//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query11(){
  sup_nat=ABi.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_suppkey")
    .where(eq("n_name",'GERMANY'))
    .materialize();

  ps_sup=ABi.select()
    .from("partsupp").join(sup_nat).on("ps_suppkey","s_suppkey")
    .field("ps_partkey",as(sum(mul("ps_supplycost","ps_availqty")),"value"))
    .group("ps_partkey")
    .materialize();

  thresh=ABi.select()
    .from(ps_sup)
    .field(sum("value")).eval();

  return ABi.select()
    .from(ps_sup)
    .field("ps_partkey","value")
    .where(gt("value",thresh*0.0001))
    .order(["-value"]);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query11=query11;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
