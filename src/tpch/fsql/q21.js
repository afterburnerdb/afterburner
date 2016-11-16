//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query21(noasm){
  return ABi.select()
    .from("@supplier","@lineitem l1","@orders","@nation")
    .where(eq("@s_suppkey","@l1.l_suppkey"),
           eq("@o_orderkey","@l1.l_orderkey"),
           eq("@o_orderstatus", 'F'),
           gt("@l1.l_receiptdate","@l1.l_commitdate"),
           exists(ABi.select()
                     .from("@lineitem l2")
                     .where(eq("@l2.l_orderkey","@l1.l_orderkey"),
                            neq("@l2.l_suppkey","@l1.l_suppkey"))
                     .field("@*")),
           notexists(ABi.select()
                        .from("@lineitem l3")
                        .where(eq("@l3.l_orderkey","@l1.l_orderkey"),
                               neq("@l3.l_suppkey","@l1.l_suppkey"),
                               gt("@l3.l_receiptdate","@l3.l_commitdate"))
                        .field("@*")),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_name",'SAUDI ARABIA'))
    .field("@s_name",as(count("@*"),"numwait"))
    .group("@s_name")
    .order("-@numwait","@s_name")
    .limit(100);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query21;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
