//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query18(noasm){
  return ABi.select()
    .from("@customer","@orders","@lineitem")
    .field("@c_name","@c_custkey","@o_orderkey","@o_orderdate","@o_totalprice",sum("@l_quantity"))
    .where(eq("@c_custkey","@o_custkey"),
           eq("@o_orderkey","@l_orderkey"),
           isin("@o_orderkey",ABi.select()
                                 .from("@lineitem")
                                 .field("@l_orderkey")
                                 .group("@l_orderkey")
                                 .having(gt(sum("@l_quantity"),300))))
    .group("@c_name","@c_custkey","@o_orderkey","@o_orderdate","@o_totalprice")
    .order("-@o_totalprice","@o_orderdate")
    .limit(100)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query18;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
