//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query3b_mav(against){

  return select(against)
    .from("@customer","@orders","@lineitem")
    .open("@o_orderdate")
    .where(eq("@c_mktsegment", 'BUILDING'),
           eq("@c_custkey", "@o_custkey"),
           eq("@l_orderkey", "@o_orderkey"),
           gt("@l_shipdate",date('1995-03-15'))
          )
    .field("@l_orderkey", as(sum( mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"),"@o_orderdate","@o_shippriority")
    .group("@l_orderkey", "@o_orderdate", "@o_shippriority")
    .order("-@revenue","@o_orderdate")
    .limit(10)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query3b_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
