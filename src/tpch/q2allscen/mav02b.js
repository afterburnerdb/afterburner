//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query2b_mav(against){
  var subq=select()
             .from("@partsupp","@supplier","@nation","@region")
             .field(min("@ps_supplycost"))
             .where(eq("@p_partkey","@ps_partkey"),
                    eq("@s_suppkey","@ps_suppkey"),
                    eq("@s_nationkey","@n_nationkey"),
                    eq("@n_regionkey","@r_regionkey"),
                    eq("@r_name",'EUROPE'));

  return select(against)
  .open("@p_type")
  .from("@part","@supplier","@partsupp","@nation","@region")
  .field("@s_acctbal","@s_name","@n_name","@p_partkey","@p_mfgr","@s_address","@s_phone","@s_comment")
  .where(eq("@p_partkey","@ps_partkey"),
        eq("@s_suppkey","@ps_suppkey"), 
        eq("@p_size",15),
        eq("@s_nationkey","@n_nationkey"),
        eq("@n_regionkey","@r_regionkey"),
        eq("@r_name",'EUROPE'),
	eq("@ps_supplycost",subq))
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query2b_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
