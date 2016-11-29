//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query4_fsql(against){
  var subq=select()
             .from("@lineitem")
             .field("@*")
             .where(eq("@l_orderkey","@o_orderkey"),
                    lt("@l_commitdate","@l_receiptdate"));
  return ABi.select(against)
    .from("@orders")
    .field("@o_orderpriority", as(count("@o_orderpriority"),"order_count"))
    .where(gte("@o_orderdate",date("1993-07-01")),
           lt("@o_orderdate",date( "1993-10-01")),
           exists(subq))
    .group("@o_orderpriority")
    .order("@o_orderpriority");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query4_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
