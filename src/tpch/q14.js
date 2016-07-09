function query14(){

  return ABi.select()
  .from("lineitem").join("part").on("l_partkey","p_partkey")
  .field(sumif(mul("l_extendedprice", sub(1,"l_discount")),like("p_type", 'PROMO%')), 
         sum(mul("l_extendedprice", sub(1,"l_discount"))))
  .where(gte("l_shipdate", date('1995-09-01')),
         lt("l_shipdate", date('1995-10-01')));
}
