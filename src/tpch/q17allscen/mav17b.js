//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query17b_mav(){
  var subq=select()
             .from("@lineitem")
             .field(mul(0.2,(avg("@l_quantity"))))
             .where(eq("@l_partkey","@p_partkey"))
  return select()
    .open("@p_container")
    .from("@lineitem","@part")
    .field(as(div(sum("@l_extendedprice"),7.0),"avg_yearly"))
    .where(eq("@p_partkey","@l_partkey"),
           eq("@p_brand",'Brand#23'),
           lt("@l_quantity",subq))
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query17b_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////