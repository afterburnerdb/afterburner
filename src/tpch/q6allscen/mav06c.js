//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query6c_mav(){

  return select()
    .open("@l_quantity")
    .from("@lineitem")
    .field(as(sum(mul("@l_extendedprice","@l_discount")),"revenue"))
    .where(gte("@l_shipdate",date('1994-01-01')),
      lt ("@l_shipdate",date('1995-01-01')),
      gte("@l_discount",0.0499999),
      lte("@l_discount",0.0700001));
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query6c_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
