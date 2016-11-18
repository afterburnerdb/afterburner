//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query7(noasm){
  cus_nat=ABi.select()
    .from("customer").join("nation").on("c_nationkey","n_nationkey")
    .field("c_custkey",_as("n_name","cust_nation"))
    .materialize(noasm);
  
  ord_cus=ABi.select()
    .from("orders").join(cus_nat).on("o_custkey","c_custkey")
    .field("o_orderkey","cust_nation")
    .materialize(noasm);
  
  sup_nat=ABi.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_suppkey",_as("n_name","supp_nation"))
    .materialize(noasm);
  
 sup_line=ABi.select()
   .from("lineitem").join(sup_nat).on("l_suppkey","s_suppkey")
   .field("l_orderkey",_as(_toYear("l_shipdate"),"l_year"),"l_extendedprice","l_discount","supp_nation")
   .where(_between("l_shipdate",_date('1995-01-01'),_date('1996-12-31')))
   .materialize(noasm);

 return ABi.select()
   .from(sup_line).join(ord_cus).on("l_orderkey","o_orderkey")
   .field("supp_nation","cust_nation","l_year",_as(_sum(_mul("l_extendedprice",_sub(1,"l_discount"))),"volume"))
   .where(_or(
            _and(_eq("supp_nation",'FRANCE'), _eq("cust_nation",'GERMANY')),
            _and(_eq("supp_nation",'GERMANY'), _eq("cust_nation",'FRANCE'))
			)
          )
   .group("supp_nation","cust_nation","l_year")
   .order(["supp_nation","cust_nation","l_year"]);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query7;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
