
function query17(){
  avg_q=ABi.select()
    .from("lineitem")
    .field("l_partkey",as(avg("l_quantity"),"avg_q"))
    .group("l_partkey")
    .materialize()
  
  par_line=ABi.select()
    .from("lineitem").join("part").on("l_partkey","p_partkey")
    .field("l_extendedprice","l_quantity","p_partkey")
    .where(eq("p_brand",'Brand#23'),
           eq("p_container",'MED BOX'))
  	.materialize()
  
  return ABi.select()
    .from(par_line).join(avg_q).on("p_partkey","l_partkey")
    .field(as(sum(div("l_extendedprice",7.0)),"avg_yearly"))
    .where(lt("l_quantity",mul("avg_q",0.2)))
}
