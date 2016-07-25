//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query22(noasm){
  min_bal=ABi.select()
    .from("customer")
    .field(avg("c_acctbal"))
    .where(gt("c_acctbal",0.00),
      isin(substring("c_phone",0,2),['13', '31', '23', '29', '30', '18', '17'])
    )
    .eval(noasm)
    
  cus_ord=ABi.select()
    .from("customer").infrom("orders").isnotin("c_custkey","o_custkey")
    .field(as(substring("c_phone",0,2),"cntrycode"),"c_acctbal")
    .where(gt("c_acctbal",min_bal),
      isin(substring("c_phone",0,2),['13', '31', '23', '29', '30', '18', '17']))
        .materialize(noasm)
  
  return ABi.select()
    .from(cus_ord)
    .field("cntrycode",
      as(count("*"),"numcust"),
      as(sum("c_acctbal"),"totacctbal"))
    .group("cntrycode")
    .order("cntrycode")

}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query22=query22;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
