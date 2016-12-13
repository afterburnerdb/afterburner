//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query5b_mav(){

  return select()
    .open("@o_orderdate")
    .from("@customer","@orders","@lineitem","@supplier","@nation","@region")
    .where(eq("@c_custkey","@o_custkey"),
           eq("@l_orderkey","@o_orderkey"),
           eq("@l_suppkey","@s_suppkey"),
           eq("@c_nationkey","@s_nationkey"),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_regionkey","@r_regionkey"),
           eq("@r_name",'ASIA'))
    .field("@n_name",as(sum(mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"))
    .group("@n_name")
    .order("-@revenue");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query5b_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
