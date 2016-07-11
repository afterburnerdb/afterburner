
function query6(){
  return  ABi.select()
    .from("lineitem")
    .field(as(sum(mul("l_extendedprice","l_discount")),"revenue"))
    .where(gte("l_shipdate",date('1994-01-01')),
      lt ("l_shipdate",date('1995-01-01')),
      gte("l_discount",0.0499999),
      lte("l_discount",0.0700001),
      lt ("l_quantity",24))
}
