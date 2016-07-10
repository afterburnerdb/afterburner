
function query18(){
all_sums=ABi.select()
  .from("lineitem")
  .field("l_orderkey",as(sum("l_quantity"),"q_sums"))
  .group("l_orderkey")
  .materialize()

having_sum=ABi.select()
  .from(all_sums)
  .field("l_orderkey")
  .where(gt("q_sums",300))
  .toArray()

ord_cus=ABi.select()
   .from("orders").join("customer").on("o_custkey","c_custkey")
   .field("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice")
   .where(isin("o_orderkey",having_sum))
   .materialize()

return ABi.select()
  .from("lineitem").join(ord_cus).on("l_orderkey","o_orderkey")
  .field("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice",sum("l_quantity"))
  .group("c_name","c_custkey","o_orderkey","o_orderdate","o_totalprice")
  .order("-o_totalprice","o_orderdate")
  .limit(100)
}
