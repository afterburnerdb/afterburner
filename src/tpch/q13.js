
function query13(){
  c_orders=ABi.select()
    .from("customer").ljoin("orders").on("c_custkey","o_custkey")
    .field("c_custkey",as(count("o_orderkey"),"c_count"))
    .where(not(like("o_comment",'%special%requests%')))
    .group("c_custkey")
    .materialize()

  return ABi.select()
   .from(c_orders)
   .field("c_count",as(count("*"),"custdist"))
   .group("c_count")
   .order("-custdist","-c_count")
}