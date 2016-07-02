
function query3(){
  cus_ord=ABi.select()
  .from("customer").join("orders").on("c_custkey","o_custkey")
  .where(eq ("c_mktsegment", "BUILDING"),
    lt("o_orderdate", date("1995-03-15")))
  .field("o_orderkey","o_orderdate","o_shippriority")
  .materialize();
  
  return ABi.select()
  .from("lineitem").join(cus_ord).on("l_orderkey","o_orderkey")
  .where(gt ("l_shipdate", date("1995-03-15")))
  .field("l_orderkey", sum( mul("l_extendedprice", sub(1,"l_discount"))),"o_orderdate","o_shippriority")
  .group("l_orderkey", "o_orderdate", "o_shippriority")
  .order([-1,2])
  .limit(10)
}
