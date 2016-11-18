//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query2_fsql(noasm){
  return ABi.select()
  .from("@part","@supplier","@partsupp","@nation","@region")
  .field("@s_acctbal","@s_name","@n_name","@p_partkey","@p_mfgr","@s_address","@s_phone","@s_comment")
  .where(eq("@p_partkey","@ps_partkey"),
        eq("@s_suppkey","@ps_suppkey"), 
        eq("@p_size",15),
        like("@p_type",'%BRASS'),
        eq("@s_nationkey","@n_nationkey"),
        eq("@n_regionkey","@r_regionkey"),
        eq("@r_name",'EUROPE'),
	eq("@ps_supplycost",ABi.select()
                             .from("@partsupp","@supplier","@nation","@region")
                             .field(min("@ps_supplycost"))
		             .where(eq("@p_partkey","@ps_partkey"),
                                    eq("@s_suppkey","@ps_suppkey"),
                                    eq("@s_nationkey","@n_nationkey"),
                                    eq("@n_regionkey","@r_regionkey"),
                                    eq("@r_name",'EUROPE')) 
          )
        )
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
//  global.query2=query2;
  module.exports=query2_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
