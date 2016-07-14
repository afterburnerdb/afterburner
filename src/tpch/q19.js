
function query19(){
  return ABi.select()
   .from("lineitem").join("part").on("l_partkey","p_partkey")
   .field(sum(mul("l_extendedprice",sub(1,"l_discount"))))
   .where(or(
     and(eq("p_brand",'Brand#12'),
     isin("p_container",['SM CASE', 'SM BOX', 'SM PACK', 'SM PKG']),
     gte("l_quantity",1),
     lte("l_quantity",11),
     between("p_size",1,5),
     isin("l_shipmode",['AIR', 'AIR REG']),
     eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     and(eq("p_brand",'Brand#23'),
     isin("p_container",['MED BAG', 'MED BOX', 'MED PKG', 'MED PACK']),
     gte("l_quantity",10),
     lte("l_quantity",20),
     between("p_size",1,10),
     isin("l_shipmode",['AIR', 'AIR REG']),
     eq("l_shipinstruct",'DELIVER IN PERSON'))
   ,
     and(eq("p_partkey","l_partkey"),
     eq("p_brand",'Brand#34'),
     isin("p_container",['LG CASE', 'LG BOX', 'LG PACK', 'LG PKG']),
     gte("l_quantity",20),
     lte("l_quantity",30),
     between("p_size",1,15),
     isin("l_shipmode",['AIR', 'AIR REG']),
     eq("l_shipinstruct",'DELIVER IN PERSON'))
   ))
}
