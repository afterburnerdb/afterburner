//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query14(noasm){

  return abdb.select()
  .from("lineitem").join("part").on("l_partkey","p_partkey")
  .field(_postdiv(_sumif(_mul("l_extendedprice", _sub(1,"l_discount")),_like("p_type", 'PROMO%')), 
         _sum(_mul("l_extendedprice", _sub(1,"l_discount")))))
  .where(_gte("l_shipdate", _date('1994-03-01')),
         _lt("l_shipdate", _date('1994-04-01')));
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query14;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
