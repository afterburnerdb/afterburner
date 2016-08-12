//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query5(noasm){
  reg_nat = ABi.select()
    .from("nation").join("region").on("n_regionkey","r_regionkey")
    .where(eq('R_NAME','ASIA'))
    .field('n_nationkey',"n_name")
    .materialize(noasm);
  
  nat_sup = ABi.select()
    .from("supplier").join(reg_nat).on("s_nationkey","n_nationkey")
    .field("s_nationkey","s_suppkey","n_name")
    .materialize(noasm);
  
  sup_line = ABi.select()
    .from("lineitem").join(nat_sup).on("l_suppkey","s_suppkey")
    .field("l_orderkey","l_extendedprice","l_discount","s_nationkey","n_name")
    .materialize(noasm);
  
  cus_ord = ABi.select()
    .from("orders").join("customer").on("o_custkey","c_custkey")
    .field("o_orderkey","c_nationkey")
    .where(gte("o_orderdate",date('1994-01-01')),
      lt("o_orderdate", date('1995-01-01')))
    .materialize(noasm);
  
  return ABi.select()
    .from(sup_line).join(cus_ord).on("l_orderkey","o_orderkey")
    .where(eq("s_nationkey","c_nationkey"))
    .field("n_name",as(sum(mul("l_extendedprice", sub(1,"l_discount"))),"revenue") )
    .group("n_name")
    .order(["-revenue"]);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query5;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
