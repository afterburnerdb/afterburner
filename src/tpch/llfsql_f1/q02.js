//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query2(noasm){
  var reg_nat = abdb.select()
    .from("nation").join("region").on("n_regionkey","r_regionkey")
    .where(_eq('R_NAME','AFRICA'))
    .field('n_nationkey',"n_name")
    .materialize(noasm);
  
  var nat_sup = abdb.select()
    .from("supplier").join(reg_nat).on("s_nationkey","n_nationkey")
    .field('s_suppkey','s_acctbal',"s_name","n_name","s_address","s_phone","s_comment")
    .materialize(noasm);
  
  var sup_psup = abdb.select()
    .from("partsupp").join(nat_sup).on("ps_suppkey","s_suppkey")
    .field('ps_partkey','ps_supplycost','s_acctbal',"s_name","n_name","s_address","s_phone","s_comment")
    .materialize(noasm);
  
  var brass = abdb.select()
    .from("part").join(sup_psup).on("p_partkey","ps_partkey")
    .where(_eq('p_size',43), _like('p_type','%TIN'))
    .field('ps_partkey','ps_supplycost','s_acctbal',"s_name","n_name", "p_partkey", "p_mfgr","s_address","s_phone","s_comment")
    .materialize(noasm);
  
  var mincost = abdb.select()
    .from(brass)
    .field(_min('ps_supplycost'),_as('ps_partkey','mc_partkey'))
    .group('ps_partkey')
    .materialize(noasm);
  
  return abdb.select()
  .from(mincost).join(brass).on("min(ps_supplycost)","ps_supplycost")
  .field("s_acctbal","s_name", "n_name", "p_partkey", "p_mfgr", "s_address", "s_phone", "s_comment")
  .where(_eq("mc_partkey","ps_partkey"))
  .order("-s_acctbal","n_name","s_name","p_partkey")
  .limit(100);
  
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
//  global.query2=query2;
  module.exports=query2;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
