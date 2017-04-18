//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query1_fsql(against){
return select(against)
  .from('@lineitem')
  .field('@l_returnflag','@l_linestatus',
    as(sum('@l_quantity'),'sum_qty'),
    as(sum('@l_extendedprice'),'sum_base_price'),
    as(sum(mul('@l_extendedprice',sub(1.0 , '@l_discount'))),'sum_disc_price'),
    as(sum(mul(mul('@l_extendedprice',sub(1.0 , '@l_discount')), add(1.0 , '@l_tax'))),'sum_charge'),
    as(avg('@l_quantity'),'avg_qty'),
    as(avg('@l_extendedprice'),'avg_price'),
    as(avg('@l_discount'),'avg_disc'),
    as(count('@*'),'count_order'))
  .where(lte('@l_shipdate',date('1998-09-02')))
  .group('@l_returnflag','@l_linestatus')
  .order('@l_returnflag','@l_linestatus')
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query1_fsql=query1_sql;
  module.exports=query1_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
