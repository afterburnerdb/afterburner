//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query19(noasm){
  return abdb.select()
   .from("lineitem").join("part").on("l_partkey","p_partkey")
   .field(_as(_sum(_mul("l_extendedprice",_sub(1,"l_discount"))),'revenue'))
   .where(_or(
     _and(_eq("p_brand",'Brand#12'),
     _isin("p_container",['SM CASE', 'SM BOX', 'SM PACK', 'SM PKG']),
     _gte("l_quantity",1),
     _lte("l_quantity",11),
     _between("p_size",1,5),
     _isin("l_shipmode",['AIR', 'AIR REG']),
     _eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     _and(_eq("p_brand",'Brand#23'),
     _isin("p_container",['MED BAG', 'MED BOX', 'MED PKG', 'MED PACK']),
     _gte("l_quantity",10),
     _lte("l_quantity",20),
     _between("p_size",1,10),
     _isin("l_shipmode",['AIR', 'AIR REG']),
     _eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     _and(_eq("p_partkey","l_partkey"),
     _eq("p_brand",'Brand#34'),
     _isin("p_container",['LG CASE', 'LG BOX', 'LG PACK', 'LG PKG']),
     _gte("l_quantity",20),
     _lte("l_quantity",30),
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
