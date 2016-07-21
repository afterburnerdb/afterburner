//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query20(){
  ps_part=ABi.select()
    .from("partsupp").infrom("part").isin("ps_partkey","p_partkey")
    .where(like("p_name",'forest%'))
    .field("ps_availqty","ps_partkey","ps_suppkey")
    .materialize()
  
  ps_line=ABi.select()
    .from("lineitem").join(ps_part).on("l_partkey","ps_partkey")
    .field("l_partkey", as(sum("l_quantity"), "sumq"),"ps_availqty","ps_suppkey")
    .where(gte("l_shipdate", date('1994-01-01')),
           lt("l_shipdate", date('1995-01-01')),
  		 eq("l_suppkey","ps_suppkey"))
    .group("l_partkey","ps_availqty","ps_suppkey")
    .materialize()
    
  sup_nat=ABi.select()
    .from("supplier").join("nation").on("s_nationkey","n_nationkey")
    .field("s_name","s_address","s_suppkey")
    .where(eq("n_name",'CANADA'))
    .materialize()
    
  return ABi.select()
    .from(sup_nat).infrom(ps_line).isin("s_suppkey","ps_suppkey")
    .where(gt("ps_availqty",mul(0.5,"sumq")))
    .field("s_name","s_address")
    .order("s_name")
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query20=query20;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
