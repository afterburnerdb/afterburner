//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query20_fsql(against){
  var subq0=select()
              .from("@part")
              .field("@p_partkey")
              .where(like("@p_name",'forest%'));
  var subq1=select()
              .from("@lineitem")
              .field(mul(0.5,sum("@l_quantity")))
              .where(eq("@l_partkey","@ps_partkey"),
                     eq("@l_suppkey","@ps_suppkey"),
                     gte("@l_shipdate",date('1994-01-01')),
                     lt("@l_shipdate",date('1995-01-01')))
  var subq2=select()
    .from("@partsupp")
    .field("@ps_suppkey")
    .where(isin("@ps_partkey", subq0),
           gt("@ps_availqty", subq1 ))
  return select(against)
    .from("@supplier","@nation")
    .where(isin("@s_suppkey",subq2),
      eq("@s_nationkey","@n_nationkey"),
      eq("@n_name",'CANADA'))
    .field("@s_name","@s_address")
    .order("@s_name")


}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query20_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
