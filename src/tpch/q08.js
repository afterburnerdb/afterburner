//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query8(noasm){
  nat_region=ABi.select()
	.from("nation").join("region").on("n_regionkey","r_regionkey")
	.field(_as("n_nationkey","cust_nationkey"))
	.where(_eq("r_name",'AMERICA'))
	.materialize(noasm);
	
  cus_nat=ABi.select()
	.from("customer").join(nat_region).on("c_nationkey","cust_nationkey")
	.field("c_custkey")
	.materialize(noasm);
	
  ord_cus=ABi.select()
	.from("orders").join(cus_nat).on("o_custkey","c_custkey")
	.field("o_orderkey",_as(_toYear("o_orderdate"),"o_year"))
	.where(_between("o_orderdate",_date('1995-01-01'),_date('1996-12-31')))
	.materialize(noasm);

  par_line=ABi.select()
	.from("lineitem").join("part").on("l_partkey","p_partkey")
	.field("l_suppkey","l_orderkey","l_extendedprice","l_discount")
	.where(_eq("p_type", 'ECONOMY ANODIZED STEEL'))
	.materialize(noasm);

  sup_nat=ABi.select()
	.from("supplier").join("nation").on("s_nationkey","n_nationkey")
	.field("s_suppkey",_as("n_name","nation"))
	.materialize(noasm);

  par_line_sup=ABi.select()
    .from(par_line).join(sup_nat).on("l_suppkey","s_suppkey")
	.field("nation","l_orderkey","l_extendedprice","l_discount")
	.materialize(noasm);
  
  return par_line_sup_ord=ABi.select()
	.from(ord_cus).join(par_line_sup).on("o_orderkey","l_orderkey")
	.field("o_year",_as(_sumif(_mul("l_extendedprice", _sub(1,"l_discount")),_eq("nation",'BRAZIL')),'share'),
	_as(_sum(_mul("l_extendedprice", _sub(1,"l_discount"))),'share'))
	.group('o_year')
	.order([0]);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query8;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
