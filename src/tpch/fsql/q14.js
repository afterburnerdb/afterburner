//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query14_fsql(noasm){

  return select()
  .from("@lineitem","@part")
  .field(as(mul(100.00,div(sumif(mul("@l_extendedprice", sub(1,"@l_discount")),like("@p_type", 'PROMO%')), 
         sum(mul("@l_extendedprice", sub(1,"@l_discount"))))),"promo_revenue"))
  .where(eq("@l_partkey","@p_partkey"),
         gte("@l_shipdate", '1995-09-01'),
         lt("@l_shipdate", '1995-10-01'));
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query14_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
