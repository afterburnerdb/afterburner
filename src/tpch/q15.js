
function query15(){

  sup_rev=ABi.select()
    .from("lineitem")
    .field(as("l_suppkey","supplier_no"),as(sum(mul("l_extendedprice", sub(1, "l_discount"))),"total_revenue"))
    .where(gte("l_shipdate",date('1996-01-01')),
            lt("l_shipdate",date('1996-04-01')))
    .group("l_suppkey")
    .materialize()
  
  max_rev=ABi.select()
    .from(sup_rev)
    .field(max("total_revenue"))
    .eval()
    
  return ABi.select()
    .from("supplier").join(sup_rev).on("s_suppkey","supplier_no")
    .field("s_suppkey","s_name","s_address","s_phone","total_revenue")
    .where(eq("total_revenue",max_rev)) 
}
