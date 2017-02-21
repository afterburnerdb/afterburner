//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query12(noasm){
  return ABi.select()
	  .from("lineitem").join("orders").on("l_orderkey","o_orderkey")
	  .field("l_shipmode",
			  _as(_countif("*",_or(_eq("o_orderpriority",'1-URGENT'),_eq("o_orderpriority",'2-HIGH'))),"high_line_count"),
			  _as(_countif("*",_and(_neq("o_orderpriority",'1-URGENT'),_neq("o_orderpriority",'2-HIGH'))),"high_line_count"))
	  .where(_isin("l_shipmode",['MAIL', 'SHIP']),
	          _lt("l_commitdate","l_receiptdate"),
              _lt("l_shipdate","l_commitdate"),
             _gte("l_receiptdate",_date('1994-01-01')),
              _lt("l_receiptdate",_date('1995-01-01')))
	  .group("l_shipmode")
          .order("l_shipmode");
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query12;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
