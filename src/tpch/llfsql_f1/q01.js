//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query1(noasm){
return ABi.select()
  .from('lineitem')
  .field('l_returnflag',
    'l_linestatus',
    _sum('l_quantity'),
    _sum('l_extendedprice'),
    _sum(_mul('l_extendedprice',_sub(1.0 , 'l_discount'))),
    _sum(_mul(_mul('l_extendedprice',_sub(1.0 , 'l_discount')), _add(1.0 , 'l_tax'))),
    _avg('l_quantity'),
    _avg('l_extendedprice'),
    _avg('l_discount'),
    _count('*'))
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
