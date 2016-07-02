
function query1(){
return ABi.select()
  .from('lineitem')
  .field('l_returnflag',
    'l_linestatus',
    sum('l_quantity'),
    sum('l_extendedprice'),
    sum(mul('l_extendedprice',sub(1.0 , 'l_discount'))),
    sum(mul(mul('l_extendedprice',sub(1.0 , 'l_discount')), add(1.0 , 'l_tax'))),
    avg('l_quantity'),
    avg('l_extendedprice'),
    avg('l_discount'),
    count('*'))
  .where(leq('l_shipdate',date('1998-09-02')))
  .group('l_returnflag','l_linestatus')
  .order([0,1])
}

