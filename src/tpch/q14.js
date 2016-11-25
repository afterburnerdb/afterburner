//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query14(noasm){

  return ABi.select()
  .from("lineitem").join("part").on("l_partkey","p_partkey")
  .field(_postdiv(_sumif(_mul("l_extendedprice", _sub(1,"l_discount")),_like("p_type", 'PROMO%')), 
         _sum(_mul("l_extendedprice", _sub(1,"l_discount")))))
  .where(_gte("l_shipdate", _date('1995-09-01')),
         _lt("l_shipdate", _date('1995-10-01')));
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query14;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
