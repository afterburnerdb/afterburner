//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query9(noasm){
  sup_nat=abdb.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_suppkey",_as("n_name","nation"))
    .materialize(noasm);

  par_line=abdb.select()
    .from("lineitem").join("part").on("l_partkey","p_partkey")
    .field("l_suppkey","l_orderkey","l_extendedprice","l_discount","l_quantity","l_partkey")
    .where(_like("p_name", '%green%'))
    .materialize(noasm);

  par_line_sup=abdb.select()
    .from(par_line).join(sup_nat).on("l_suppkey","s_suppkey")
    .field("nation","l_orderkey","l_extendedprice","l_discount","l_quantity","l_suppkey","l_partkey")
    .materialize(noasm);

  par_line_sup_ps=abdb.select()
    .from("partsupp").join(par_line_sup).on("ps_partkey","l_partkey")
    .field("nation","l_orderkey","l_extendedprice","l_discount","l_quantity","ps_supplycost")
    .where(_eq("ps_suppkey","l_suppkey"))
    .materialize(noasm);

  profit=abdb.select()
    .from("orders").join(par_line_sup_ps).on("o_orderkey","l_orderkey")
    .field("nation",_as(_toYear("o_orderdate"),"o_year"),
      _as(_sub(_mul("l_extendedprice", _sub(1 , "l_discount")),_mul("ps_supplycost","l_quantity")),"amount"))
    .materialize(noasm);
  
  return abdb.select()
   .from(profit)
   .field("nation","o_year",_as(_sum("amount"),'sum_profit'))
   .group("nation","o_year")
   .order("nation","-o_year")
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query9;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
