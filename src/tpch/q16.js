function query16(){
  bad_sup=ABi.select()
  .from("supplier")
  .field("s_suppkey")
  .where(like("s_comment",'%Customer%Complaints%'))
  .toArray()  

  ps_par=ABi.select()
  .from("partsupp").join("part").on("ps_partkey","p_partkey")
  .field("p_brand","p_type","p_size","ps_suppkey",count("*"))
  .where(neq("p_brand",'Brand#45'),
         not(like("p_type",'MEDIUM POLISHED%')),
         isin("p_size",[49, 14, 23, 45, 19, 3, 36, 9]),
		 not(isin("ps_suppkey",bad_sup))
		)
  .group("p_brand","p_type","p_size","ps_suppkey")
  .materialize()

  return ABi.select()
  .from(ps_par)
  .field("p_brand","p_type","p_size",as(count("*"),"supplier_cnt"))
  .group("p_brand","p_type","p_size")
  .order("-supplier_cnt","p_brand","p_type","p_size")
}
