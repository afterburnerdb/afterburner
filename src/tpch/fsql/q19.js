//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query19_fsql(against){
  return ABi.select(against)
   .from("@lineitem","@part")
   .field(sum(mul("@l_extendedprice",sub(1,"@l_discount"))))
   .where(eq("@l_partkey","@p_partkey"),
     or(
       and(eq("@p_brand",'Brand#12'),
       isin("@p_container",['SM CASE', 'SM BOX', 'SM PACK', 'SM PKG']),
       gte("@l_quantity",1),
       lte("@l_quantity",11),
       between("@p_size",1,5),
       isin("@l_shipmode",['AIR', 'AIR REG']),
       eq("@l_shipinstruct",'DELIVER IN PERSON'))
     ,
       and(eq("@p_brand",'Brand#23'),
       isin("@p_container",['MED BAG', 'MED BOX', 'MED PKG', 'MED PACK']),
       gte("@l_quantity",10),
       lte("@l_quantity",20),
       between("@p_size",1,10),
       isin("@l_shipmode",['AIR', 'AIR REG']),
       eq("@l_shipinstruct",'DELIVER IN PERSON'))
     ,
       and(eq("@p_brand",'Brand#34'),
       isin("@p_container",['LG CASE', 'LG BOX', 'LG PACK', 'LG PKG']),
       gte("@l_quantity",20),
       lte("@l_quantity",30),
       between("@p_size",1,15),
       isin("@l_shipmode",['AIR', 'AIR REG']),
       eq("@l_shipinstruct",'DELIVER IN PERSON'))
     ))
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query19_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
