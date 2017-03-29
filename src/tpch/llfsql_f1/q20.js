//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query20(noasm){
  ps_part=abdb.select()
    .from("partsupp").infrom("part").isin("ps_partkey","p_partkey")
    .where(_like("p_name",'azure%'))
    .field("ps_availqty","ps_partkey","ps_suppkey")
    .materialize(noasm);
  
  ps_line=abdb.select()
    .from("lineitem").join(ps_part).on("l_partkey","ps_partkey")
    .field("l_partkey", _as(_sum("l_quantity"), "sumq"),"ps_availqty","ps_suppkey")
    .where(_gte("l_shipdate", _date('1996-01-01')),
           _lt("l_shipdate", _date('1997-01-01')),
  		 _eq("l_suppkey","ps_suppkey"))
    .group("l_partkey","ps_availqty","ps_suppkey")
    .materialize(noasm);
    
  sup_nat=abdb.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_name","s_address","s_suppkey")
    .where(_eq("n_name",'JORDAN'))
    .materialize(noasm);
    
  return abdb.select()
    .from(sup_nat).infrom(ps_line).isin("s_suppkey","ps_suppkey")
    .where(_gt("ps_availqty",_mul(0.5,"sumq")))
    .field("s_name","s_address")
    .order("s_name")
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query20;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
