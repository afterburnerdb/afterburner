
function query10(){
  cus_nat=ABi.select()
    .from("customer").join("nation").on("c_nationkey","n_nationkey")
    .field("c_custkey","c_name","c_acctbal","n_name","c_address","c_phone","c_comment")
    .materialize();

  ord_cus=ABi.select()
    .from("orders").join(cus_nat).on("o_custkey","c_custkey")
    .field("o_orderkey","c_custkey","c_name","c_acctbal","n_name","c_address","c_phone","c_comment")
    .where(gte("o_orderdate", date("1993-10-01")),
      lt("o_orderdate", date("1994-01-01")))
    .materialize();
	
  return ABi.select()
    .from("lineitem").join(ord_cus).on("l_orderkey","o_orderkey")
    .field("c_custkey","c_name",
      as(sum(mul("l_extendedprice",sub(1,"l_discount"))), "revenue"),
        "c_acctbal","n_name","c_address","c_phone","c_comment")
    .where(eq("l_returnflag",'R'))
    .group("c_custkey","c_name","c_acctbal","c_phone","n_name","c_address","c_comment")
    .order(["revenue"])
    .limit(20);
}
