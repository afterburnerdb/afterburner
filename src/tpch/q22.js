//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query22(noasm){
  min_bal=abdb.select()
    .from("customer")
    .field(_avg("c_acctbal"))
    .where(_gt("c_acctbal",0.00),
      _isin(_substring("c_phone",0,2),['13', '31', '23', '29', '30', '18', '17'])
    )
    .eval(noasm)
    
  cus_ord=abdb.select()
    .from("customer").infrom("orders").isnotin("c_custkey","o_custkey")
    .field(_as(_substring("c_phone",0,2),"cntrycode"),"c_acctbal")
    .where(_gt("c_acctbal",min_bal),
      _isin(_substring("c_phone",0,2),['13', '31', '23', '29', '30', '18', '17']))
        .materialize(noasm)
  
  return abdb.select()
    .from(cus_ord)
    .field("cntrycode",
      _as(_count("*"),"numcust"),
      _as(_sum("c_acctbal"),"totacctbal"))
    .group("cntrycode")
    .order("cntrycode")
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query22;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
