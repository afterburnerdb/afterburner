//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query10(noasm){
  cus_nat=ABi.select()
    .from("customer").join("nation").on("c_nationkey","n_nationkey")
    .field("c_custkey","c_name","c_acctbal","n_name","c_address","c_phone","c_comment")
    .materialize(noasm);

  ord_cus=ABi.select()
    .from("orders").join(cus_nat).on("o_custkey","c_custkey")
    .field("o_orderkey","c_custkey","c_name","c_acctbal","n_name","c_address","c_phone","c_comment")
    .where(_gte("o_orderdate", _date("1993-10-01")),
      _lt("o_orderdate", _date("1994-01-01")))
    .materialize(noasm);
	
  return ABi.select()
    .from("lineitem").join(ord_cus).on("l_orderkey","o_orderkey")
    .field("c_custkey","c_name",
      _as(_sum(_mul("l_extendedprice",_sub(1,"l_discount"))), "revenue"),
        "c_acctbal","n_name","c_address","c_phone","c_comment")
    .where(_eq("l_returnflag",'R'))
    .group("c_custkey","c_name","c_acctbal","c_phone","n_name","c_address","c_comment")
    .order("-revenue")
    .limit(20);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query10;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
