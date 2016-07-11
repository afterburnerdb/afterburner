
function query7(){
  cus_nat=ABi.select()
    .from("customer").join("nation").on("c_nationkey","n_nationkey")
    .field("c_custkey",as("n_name","cust_nation"))
    .materialize();
  
  ord_cus=ABi.select()
    .from("orders").join(cus_nat).on("o_custkey","c_custkey")
    .field("o_orderkey","cust_nation")
    .materialize();
  
  sup_nat=ABi.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_suppkey",as("n_name","supp_nation"))
    .materialize();
  
 sup_line=ABi.select()
   .from("lineitem").join(sup_nat).on("l_suppkey","s_suppkey")
   .field("l_orderkey",as(toYear("l_shipdate"),"l_year"),"l_extendedprice","l_discount","supp_nation")
   .where(between("l_shipdate",date('1995-01-01'),date('1996-12-31')))
   .materialize();

 return ABi.select()
   .from(sup_line).join(ord_cus).on("l_orderkey","o_orderkey")
   .field("supp_nation","cust_nation","l_year",as(sum(mul("l_extendedprice",sub(1,"l_discount"))),"volume"))
   .where(or(
            and(eq("supp_nation",'FRANCE'), eq("cust_nation",'GERMANY')),
            and(eq("supp_nation",'GERMANY'), eq("cust_nation",'FRANCE'))
			)
          )
   .group("supp_nation","cust_nation","l_year")
   .order(["supp_nation","cust_nation","l_year"]);
}
