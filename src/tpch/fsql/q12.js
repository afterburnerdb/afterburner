//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query12_fsql(against){
  return select(against)
	  .from("@lineitem","@orders")
	  .field("@l_shipmode",
			  as(sumif(1,or(eq("@o_orderpriority","1-URGENT"),eq("@o_orderpriority","2-HIGH"))),"high_line_count"),
			  as(sumif(1,and(neq("@o_orderpriority","1-URGENT"),neq("@o_orderpriority","2-HIGH"))),"low_line_count"))
	  .where(eq("@l_orderkey","@o_orderkey"),
                 isin("@l_shipmode",['MAIL', 'SHIP']),
	         lt("@l_commitdate","@l_receiptdate"),
                 lt("@l_shipdate","@l_commitdate"),
                 gte("@l_receiptdate",date('1994-01-01')),
                 lt("@l_receiptdate",date('1995-01-01')))
	  .group("@l_shipmode")
          .order("@l_shipmode");

}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query12_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
