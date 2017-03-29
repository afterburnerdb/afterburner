//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query1(noasm){
return abdb.select()
  .from('lineitem')
  .field('l_returnflag',
    'l_linestatus',
    _as(_sum('l_quantity'),'sum_qty'),
    _as(_sum('l_extendedprice'),'sum_base_price'),
    _as(_sum(_mul('l_extendedprice',_sub(1.0 , 'l_discount'))),'sum_disc_price'),
    _as(_sum(_mul(_mul('l_extendedprice',_sub(1.0 , 'l_discount')), _add(1.0 , 'l_tax'))),'sum_charge'),
    _as(_avg('l_quantity'),'avg_qty'),
    _as(_avg('l_extendedprice'),'avg_price'),
    _as(_avg('l_discount'),'avg_disc'),
    _as(_count('*'),'count_order'))
  .where(_lte('l_shipdate',_date('1998-09-02')))
  .group('l_returnflag','l_linestatus')
  .order('l_returnflag','l_linestatus')
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  global.query1=query1;
  module.exports=query1;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
