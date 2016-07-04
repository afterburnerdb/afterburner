
function query5(){
reg_nat = ABi.select()
.from("nation").join("region").on("n_regionkey","r_regionkey")
.where(eq('R_NAME','ASIA'))
.field('n_nationkey',"n_name")
.materialize();

nat_sup = ABi.select()
.from("supplier").join(reg_nat).on("s_nationkey","n_nationkey")
.field("s_nationkey","s_suppkey","n_name")
.materialize();
//select n_nationkey,n_name from nation,region,supplier where n_regionkey=r_regionkey and r_name='ASIA' and n_nationkey = s_nationkey;   
//2003

sup_line = ABi.select()
.from("lineitem").join(nat_sup).on("l_suppkey","s_suppkey")
.field("l_orderkey","l_extendedprice","l_discount","s_nationkey")
.materialize();
//select count(*) from nation,region,supplier,lineitem where n_regionkey=r_regionkey and r_name='ASIA' and n_nationkey = s_nationkey and l_suppkey=s_suppkey;
//1201113

cus_ord = ABi.select()
.from("orders").join("customer").on("o_custkey","c_custkey")
.field("o_orderkey","n_name","c_nationkey")
.where(gte("o_orderdate",date('1994-01-01')),
	  lt("o_orderdate", date('1995-01-01')))
.materialize();
//select count(*) from orders,customer where o_custkey=c_custkey and o_orderdate >= date '1994-01-01' and o_orderdate < date '1995-01-01'
//227597

ABi.select()
.from(sup_line).join(cus_ord).on("l_orderkey","o_orderkey")
.where(eq("s_nationkey","c_nationkey"))
.field(count ("*"))
.toString();   
   
query5=ABi.select()
.from(sup_line).join(cus_ord).on("l_orderkey","o_orderkey")
.where(eq("s_nationkey","c_nationkey"))
.field("n_name", mul("l_extendedprice", sub(1,"l_discount")))
.group("n_name")
.materialize();

 
}
