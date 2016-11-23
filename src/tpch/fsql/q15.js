//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query15_fsql(noasm){
  revenue0=select()
    .from("@lineitem")
    .field(as("@l_suppkey","supplier_no"),as(sum(mul("@l_extendedprice", sub(1, "@l_discount"))),"total_revenue"))
    .where(gte("@l_shipdate",date('1996-01-01')),
            lt("@l_shipdate",date('1996-04-01')))
    .group("@l_suppkey");

  subq1=select().from(revenue0).field(max("@total_revenue"));
    
  return select()
    .from("@supplier",revenue0)
    .field("@s_suppkey","@s_name","@s_address","@s_phone","@total_revenue")
    .where(eq("@s_suppkey","@supplier_no"),
           eq("@total_revenue", subq1))
    .order("@s_suppkey");
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query15_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
