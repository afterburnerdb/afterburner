//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query3(noasm){
  cus_ord=ABi.select()
    .from("customer").join("orders").on("c_custkey","o_custkey")
    .where(eq ("c_mktsegment", "BUILDING"),
      lt("o_orderdate", date("1995-03-15")))
    .field("o_orderkey","o_orderdate","o_shippriority")
    .materialize(noasm);
  
  return ABi.select()
   .from("lineitem").join(cus_ord).on("l_orderkey","o_orderkey")
   .where(gt ("l_shipdate", date("1995-03-15")))
   .field("l_orderkey", as(sum( mul("l_extendedprice", sub(1,"l_discount"))),"revenue"),"o_orderdate","o_shippriority")
   .group("l_orderkey", "o_orderdate", "o_shippriority")
   .order(["-revenue","o_orderdate"])
   .limit(10)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query3;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
