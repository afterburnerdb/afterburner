//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query18(noasm){
  all_sums=ABi.select()
    .from("lineitem")
    .field("l_orderkey",_as(_sum("l_quantity"),"q_sums"))
    .group("l_orderkey")
    .materialize(noasm);

  having_sum=ABi.select()
    .from(all_sums)
    .field("l_orderkey")
    .where(_gt("q_sums",300))
    .toArray(noasm)

  ord_cus=ABi.select()
     .from("orders").join("customer").on("o_custkey","c_custkey")
     .field("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice")
     .where(_isin("o_orderkey",having_sum))
     .materialize(noasm);

  return ABi.select()
    .from("lineitem").join(ord_cus).on("l_orderkey","o_orderkey")
    .field("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice",_sum("l_quantity"))
    .group("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice")
    .order("-o_totalprice","o_orderdate")
    .limit(100)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query18;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
