//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query19(noasm){
  return ABi.select()
   .from("part").join("lineitem").on("p_partkey","l_partkey")
   .field(_sum(_mul("l_extendedprice",_sub(1,"l_discount"))))
   .where(_or(
     _and(_eq("p_brand",'Brand#31'),
     _isin("p_container",['SM CASE', 'SM BOX', 'SM PACK', 'SM PKG']),
     _gte("l_quantity",4),
     _lte("l_quantity",14),
     _between("p_size",1,5),
     _isin("l_shipmode",['AIR', 'AIR REG']),
     _eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     _and(_eq("p_brand",'Brand#43'),
     _isin("p_container",['MED BAG', 'MED BOX', 'MED PKG', 'MED PACK']),
     _gte("l_quantity",15),
     _lte("l_quantity",25),
     _between("p_size",1,10),
     _isin("l_shipmode",['AIR', 'AIR REG']),
     _eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     _and(_eq("p_partkey","l_partkey"),
     _eq("p_brand",'Brand#43'),
     _isin("p_container",['LG CASE', 'LG BOX', 'LG PACK', 'LG PKG']),
     _gte("l_quantity",26),
     _lte("l_quantity",36),
     _between("p_size",1,15),
     _isin("l_shipmode",['AIR', 'AIR REG']),
     _eq("l_shipinstruct",'DELIVER IN PERSON'))
   ))
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query19;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
