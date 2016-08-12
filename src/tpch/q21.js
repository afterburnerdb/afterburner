//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query21(noasm){
  sup_nat=ABi.select()
    .from("nation").join("supplier").on("n_nationkey","s_nationkey")
    .field("s_name","s_suppkey")
    .where(eq("n_name",'SAUDI ARABIA'))
    .materialize(noasm);
  
  lin_ord=ABi.select()
    .from("lineitem").join("orders").on("l_orderkey","o_orderkey")
    .field(as("l_suppkey","l1l_suppkey"),as("l_orderkey","l1l_orderkey"))
    .where(eq("o_orderstatus",'F'),
      gt("l_receiptdate","l_commitdate"))
    .materialize(noasm);
  
  lin_sup=ABi.select()
    .from(lin_ord).join(sup_nat).on("l1l_suppkey","s_suppkey")
    .field("s_name","l1l_suppkey","l1l_orderkey")
    .materialize(noasm);
  
  lin2_ord=ABi.select()
    .from(lin_sup).infrom("lineitem").isin("l1l_orderkey","l_orderkey")
    .where(neq("l1l_suppkey","l_suppkey"))
    .field("s_name","l1l_suppkey","l1l_orderkey")
    .materialize(noasm);
  
  return ABi.select()
    .from(lin2_ord).infrom("lineitem").isnotin("l1l_orderkey","l_orderkey")
    .where(neq("l1l_suppkey","l_suppkey"),
      gt("l_receiptdate","l_commitdate"))
    .field("s_name",as(count("*"),"numwait"))
    .group("s_name")
    .order("-numwait","s_name")
    .limit(100);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query21;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
