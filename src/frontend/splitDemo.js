function query1_fsql0(against,lodate,hidate){
  lodate='1990-01-01';
  hidate='1998-09-02';
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
  .where(lte('@l_shipdate', date(hidate)),gte('@l_shipdate', date(lodate)))
  .group('@l_returnflag','@l_linestatus')
  .order('@l_returnflag','@l_linestatus')
}
//
function query2_fsql0(against,eqpsize){
  var subq=select()
             .from("@partsupp","@supplier","@nation","@region")
             .field(min("@ps_supplycost"))
             .where(eq("@p_partkey","@ps_partkey"),
                    eq("@s_suppkey","@ps_suppkey"),
                    eq("@s_nationkey","@n_nationkey"),
                    eq("@n_regionkey","@r_regionkey"),
                    eq("@r_name",'EUROPE'));

  return select(against)
  .from("@part","@supplier","@partsupp","@nation","@region")
  .field("@s_acctbal","@s_name","@n_name","@p_partkey","@p_mfgr","@s_address","@s_phone","@s_comment")
  .where(eq("@p_partkey","@ps_partkey"),
        eq("@s_suppkey","@ps_suppkey"), 
        eq("@s_nationkey","@n_nationkey"),
        eq("@n_regionkey","@r_regionkey"),
	eq("@ps_supplycost",subq))
  .where([eq("@p_size",eqpsize),
    like("@p_type",'%BRASS'),
    eq("@r_name",'EUROPE')])
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
function query2_fsql1(against,eqptype){
  var subq=select()
             .from("@partsupp","@supplier","@nation","@region")
             .field(min("@ps_supplycost"))
             .where(eq("@p_partkey","@ps_partkey"),
                    eq("@s_suppkey","@ps_suppkey"),
                    eq("@s_nationkey","@n_nationkey"),
                    eq("@n_regionkey","@r_regionkey"),
                    eq("@r_name",'EUROPE'));

  return select(against)
  .from("@part","@supplier","@partsupp","@nation","@region")
  .field("@s_acctbal","@s_name","@n_name","@p_partkey","@p_mfgr","@s_address","@s_phone","@s_comment")
  .where(eq("@p_partkey","@ps_partkey"),
        eq("@s_suppkey","@ps_suppkey"), 
        eq("@s_nationkey","@n_nationkey"),
        eq("@n_regionkey","@r_regionkey"),
	eq("@ps_supplycost",subq))
  .where([eq("@p_size",15),
    like("@p_type",eqptype),
    eq("@r_name",'EUROPE')])
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
//
function query3_fsql0(against,eqmkt){
  return select(against)
   .from("@customer","@orders","@lineitem")
   .where(eq("@c_custkey", "@o_custkey"),
          eq("@l_orderkey", "@o_orderkey"))
   .where(eq("@c_mktsegment", eqmkt),
    lt("@o_orderdate",date('1995-03-15')),
    gt("@l_shipdate",date('1995-03-15')))
   .field("@l_orderkey", as(sum( mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"),"@o_orderdate","@o_shippriority")
   .group("@l_orderkey", "@o_orderdate", "@o_shippriority")
   .order("-@revenue","@o_orderdate")
   .limit(10)
}
function query3_fsql1(against,lodate,hidate){
  return select(against)
   .from("@customer","@orders","@lineitem")
   .where(eq("@c_custkey", "@o_custkey"),
          eq("@l_orderkey", "@o_orderkey"))
   .where(eq("@c_mktsegment", 'BUILDING'),
    lt("@o_orderdate",hidate),
    gt("@l_shipdate",lodate))
   .field("@l_orderkey", as(sum( mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"),"@o_orderdate","@o_shippriority")
   .group("@l_orderkey", "@o_orderdate", "@o_shippriority")
   .order("-@revenue","@o_orderdate")
   .limit(10)
}
//
var q2fsqlE={
  '1' :[query1_fsql0],
  '2' :[query2_fsql0,query2_fsql1],
  '3' :[query3_fsql0,query3_fsql1],
//  '4' :[query4_fsql0],
//  '5' :[query5_fsql0,query5_fsql1],
//  '6' :[query6_fsql0,query6_fsql1,query6_fsql2],
//  '7' :[query7_fsql0],
//  '12':[query12_fsql0,query12_fsql1],
//  '14':[query14_fsql0],
//  '17':[query17_fsql0,query17_fsql1],
//  '20':[query20_fsql0],
//  '21':[query21_fsql0,query21_fsql1]
}
var q2mav={
  '1' :[query1a_mav()],
  '2' :[query2a_mav(),query2b_mav()],
  '3' :[query3a_mav(),query3b_mav()],
//  '4' :[query4a_mav()],
//  '5' :[query5a_mav(),query5b_mav()],
//  '6' :[query6a_mav(),query6b_mav(),query6c_mav()],
//  '7' :[query7a_mav()],
//  '12':[query12a_mav(),query12b_mav()],
//  '14':[query14a_mav()],
//  '17':[query17a_mav(),query17b_mav()],
//  '20':[query20a_mav()],
//  '21':[query21a_mav(),query21b_mav()]
}
//
function splitDemo(qnum,qscen){
  this.qnum=qnum;
  this.qcen=qscen;
  this.mav=q2mav[qnum][qscen];
  this.fsql=q2fsqlE[qnum][qscen];
//..
  var divcons=document.getElementById("divcons");
  clearElement(divcons);
  console.log('qnum:',qnum);
  console.log('qscen:',qscen);
  console.log('mav:',this.mav);
  this.mav.materialize_fe();
  console.log('fsql:',this.fsql);
  expose = this.fsql;
  q=this.fsql(this.mav);
  var tt0=window.performance.now();
  q.ABI.materialize();
  var tt1=window.performance.now();
  var ttot=tt1-tt0;
  divcons.appendChild(res.toHTMLTableN(100));
  document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms" ;
  console.log('time to run code:'+ (ttot));
}
