//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query3(noasm){
  return ABi.select()
   .from("@customer","@orders","@lineitem")
   .where(eq("@c_mktsegment", 'BUILDING'),
          eq("@c_custkey", "@o_custkey"),
          eq("@l_orderkey", "@o_orderkey"),
          lt("@o_orderdate",'1995-03-15'),
          gt("@l_shipdate", '1995-03-15')
         )
   .field("@l_orderkey", as(sum( mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"),"@o_orderdate","@o_shippriority")
   .group("@l_orderkey", "@o_orderdate", "@o_shippriority")
   .order("-@revenue","@o_orderdate")
   .limit(10)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query3;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
