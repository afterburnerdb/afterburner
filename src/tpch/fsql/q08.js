//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query8_fsql(noasm){
  return ABi.select()
	.from("@part","@supplier","@lineitem","@orders","@customer","@nation n1","@nation n2","@region")
        .where(eq("@p_partkey","@l_partkey"),
               eq("@s_suppkey","@l_suppkey"),
               eq("@l_orderkey","@o_orderkey"),
               eq("@o_custkey","@c_custkey"),
               eq("@c_nationkey","@n1.n_nationkey"),
               eq("@n1.n_regionkey","@r_regionkey"),
               eq("@r_name",'AMERICA'),
               eq("@s_nationkey","@n2.n_nationkey"),
               between("@o_orderdate",'1995-01-01','1996-12-31'),
               eq("@p_type",'ECONOMY ANODIZED STEEL'))
	.field(as(toYear("@o_orderdate"),"o_year"),div(sumif(mul("@l_extendedprice", sub(1,"@l_discount")),eq("@n2.n_name",'BRAZIL')),
	sum(mul("@l_extendedprice", sub(1,"@l_discount"))),'mkt_share'))
	.group('@o_year')
	.order('@o_year');
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query8_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
