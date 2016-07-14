
function query4(){
  distinct_orders=ABi.select()
    .from("lineitem")
    .field("l_orderkey")
    .where(lt("l_commitdate","l_receiptdate"))
    .group("l_orderkey")
    .materialize();
  
  return ABi.select()
    .from("orders").join(distinct_orders).on("o_orderkey","l_orderkey")
    .field("o_orderpriority", count("o_orderpriority"))
    .where(
      gte("o_orderdate", date("1993-07-01")),
      lt ("o_orderdate", date( "1993-10-01")))
    .group("o_orderpriority")
    .order(["o_orderpriority"]);

}
