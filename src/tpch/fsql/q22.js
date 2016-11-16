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
    .from("@customer")
    .field(avg("@c_acctbal"))
    .where(gt("@c_acctbal",0.00),
      isin(substring("@c_phone",1,2),['13', '31', '23', '29', '30', '18', '17'])
    )
    
  cus_ord=ABi.select()
    .from("@customer")
    .field(as(substring("@c_phone",1,2),"cntrycode"),"@c_acctbal")
    .where(isin(substring("@c_phone",1,2),['13', '31', '23', '29', '30', '18', '17']),
      gt("@c_acctbal",min_bal),
      notexists(ABi.select()
                   .from("@orders")
                   .where(eq("@o_custkey","@c_custkey"))
                   .field("@*")))
  return ABi.select()
    .from(cus_ord)
    .field("@cntrycode",
      as(count("@*"),"numcust"),
      as(sum("@c_acctbal"),"totacctbal"))
    .group("@cntrycode")
    .order("@cntrycode")
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query22;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
