//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query18_fsql(noasm){
  var subq=select()
             .from("@lineitem")
             .field("@l_orderkey")
             .group("@l_orderkey")
             .having(gt(sum("@l_quantity"),300))
  return select()
    .from("@customer","@orders","@lineitem")
    .field("@c_name","@c_custkey","@o_orderkey","@o_orderdate","@o_totalprice",sum("@l_quantity"))
    .where(eq("@c_custkey","@o_custkey"),
           eq("@o_orderkey","@l_orderkey"),
           isin("@o_orderkey",subq))
    .group("@c_name","@c_custkey","@o_orderkey","@o_orderdate","@o_totalprice")
    .order("-@o_totalprice","@o_orderdate")
    .limit(100)
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query18_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
