//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function query7_fsql(noasm){
 return select()
   .from("@supplier","@lineitem","@orders","@customer",as("@nation","n1"),as("@nation","n2"))
   .field(as("@n1.n_name","supp_nation"),
          as("@n2.n_name","cust_nation"),
          as(toYear("@l_shipdate"),"l_year"),
          as(sum(mul("@l_extendedprice",sub(1,"@l_discount"))),"revenue"))
   .where(eq("@s_suppkey","@l_suppkey"),
          eq("@o_orderkey","@l_orderkey"),
          eq("@c_custkey","@o_custkey"),
          eq("@s_nationkey","@n1.n_nationkey"),
          eq("@c_nationkey","@n2.n_nationkey"),
          or(and(eq("@n1.n_name",'FRANCE'),eq("@n2.n_name",'GERMANY')), 
             and(eq("@n1.n_name",'GERMANY'),eq("@n2.n_name",'FRANCE'))),
          between("@l_shipdate",date('1995-01-01'),date('1996-12-31')))
   .group("@supp_nation","@cust_nation","@l_year")
   .order("@supp_nation","@cust_nation","@l_year");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query7_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
