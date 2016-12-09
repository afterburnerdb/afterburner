//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query1a_mav(){
return select()
  .open("@l_shipdate")
  .from('@lineitem')
  .field('@l_returnflag','@l_linestatus',
    sum('@l_quantity'),
    sum('@l_extendedprice'),
    sum(mul('@l_extendedprice',sub(1.0 , '@l_discount'))),
    sum(mul(mul('@l_extendedprice',sub(1.0 , '@l_discount')), add(1.0 , '@l_tax'))),
    avg('@l_quantity'),
    avg('@l_extendedprice'),
    avg('@l_discount'),
    count('@*'))
  .where(lte('@l_shipdate',date('1998-09-02')))
  .group('@l_returnflag','@l_linestatus')
  .order('@l_returnflag','@l_linestatus')
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query1a_mav=query1a_mav;
  module.exports=query1a_mav;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
