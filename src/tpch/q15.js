//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query15(noasm){

  sup_rev=abdb.select()
    .from("lineitem")
    .field(_as("l_suppkey","supplier_no"),_as(_sum(_mul("l_extendedprice", _sub(1, "l_discount"))),"total_revenue"))
    .where(_gte("l_shipdate",_date('1996-01-01')),
            _lt("l_shipdate",_date('1996-04-01')))
    .group("l_suppkey")
    .materialize(noasm);
  
  max_rev=abdb.select()
    .from(sup_rev)
    .field(_max("total_revenue"))
    .eval(noasm);
    
  return abdb.select()
    .from("supplier").join(sup_rev).on("s_suppkey","supplier_no")
    .field("s_suppkey","s_name","s_address","s_phone","total_revenue")
    .where(_eq("total_revenue",max_rev)) 
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query15;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
