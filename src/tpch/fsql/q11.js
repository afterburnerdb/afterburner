//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query11_fsql(against){
  var subq=select()
           .from("@partsupp","@supplier","@nation")
           .field(mul(sum(mul("@ps_supplycost","@ps_availqty")),0.0001))
           .where(eq("@ps_suppkey","@s_suppkey"),
                  eq("@s_nationkey","@n_nationkey"),
                  eq("@n_name",'GERMANY'))
  return select(against)
    .from("@partsupp","@supplier","@nation")
    .field("@ps_partkey",as(sum(mul("@ps_supplycost","@ps_availqty")),"value"))
    .where(eq("@ps_suppkey","@s_suppkey"),
                         eq("@s_nationkey","@n_nationkey"),
                         eq("@n_name",'GERMANY'))
    .group("@ps_partkey")
    .having(gt(sum(mul("@ps_supplycost","@ps_availqty")), subq))
    .order("-@value");
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query11_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
