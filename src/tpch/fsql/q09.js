//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query9_fsql(noasm){
  return ABi.select()
   .from("@part","@supplier","@lineitem","@partsupp","@orders","@nation")
   .field(as("@n_name","nation"),as(toYear("@o_orderdate"),"o_year"),
          as(sum(sub(mul("@l_extendedprice", sub(1 , "@l_discount")),mul("@ps_supplycost","@l_quantity"))),"sum_profit"))
   .where(eq("@s_suppkey","@l_suppkey"),
          eq("@ps_suppkey","@l_suppkey"),
          eq("@ps_partkey","@l_partkey"),
          eq("@p_partkey","@l_partkey"),
          eq("@o_orderkey","@l_orderkey"),
          eq("@s_nationkey","@n_nationkey"),
          like("@p_name",'%green%'))
   .group("@nation","@o_year")
   .order("@nation","-@o_year")
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query9_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
