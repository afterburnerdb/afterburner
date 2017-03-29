//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query17(noasm){
  avg_q=abdb.select()
    .from("lineitem")
    .field("l_partkey",_as(_avg("l_quantity"),"avg_q"))
    .group("l_partkey")
    .materialize(noasm)
  
  par_line=abdb.select()
    .from("lineitem").join("part").on("l_partkey","p_partkey")
    .field("l_extendedprice","l_quantity","p_partkey")
    .where(_eq("p_brand",'Brand#15'),
           _eq("p_container",'MED BAG'))
  	.materialize(noasm)
  
  return abdb.select()
    .from(par_line).join(avg_q).on("p_partkey","l_partkey")
    .field(_as(_sum(_div("l_extendedprice",7.0)),"avg_yearly"))
    .where(_lt("l_quantity",_mul("avg_q",0.2)))
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query17;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
