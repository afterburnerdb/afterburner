function generate_be_views(){
  var q2mav={
    '1' :[query1a_mav()],
    '2' :[query2a_mav(),query2b_mav()],
    '3' :[query3a_mav(),query3b_mav(),query3c_mav()],
    '4' :[query4a_mav()],
    '5' :[query5a_mav(),query5b_mav()],
    '6' :[query6a_mav(),query6b_mav(),query6c_mav()],
    '7' :[query7a_mav()],
    '12':[query12a_mav(),query12b_mav()],
    '14':[query14a_mav()],
    '17':[query17a_mav(),query17b_mav()],
    '20':[query20a_mav()],
    '21':[query21a_mav(),query21b_mav()]
  }

  var queries=['1','2','3','4','5','6','7','12','14','17','20','21'];
  var abc=['a','b','c'];
  var scons=document.getElementById("sconsole");
  clearElement(scons);
  queries.forEach((x)=>{
    var i=0;
    q2mav[x].forEach((xx)=>{
      var createOne='CREATE TABLE mav'+x+ abc[i++] +' AS ' +xx.toOpenSQL() +'with data;\n\n';
      scons.appendChild(newHTMLP(createOne));
      console.log(createOne);
    })
  });
}
function generate_fe_queries(){
  var q2mav={
    '1' :[query1a_mav()],
    '2' :[query2a_mav(),query2b_mav()],
    '3' :[query3a_mav(),query3b_mav(),query3c_mav()],
    '4' :[query4a_mav()],
    '5' :[query5a_mav(),query5b_mav()],
    '6' :[query6a_mav(),query6b_mav(),query6c_mav()],
    '7' :[query7a_mav()],
    '12':[query12a_mav(),query12b_mav()],
    '14':[query14a_mav()],
    '17':[query17a_mav(),query17b_mav()],
    '20':[query20a_mav()],
    '21':[query21a_mav(),query21b_mav()]
  }
  var q2fsql={
    '1' :query1_fsql,
    '2' :query2_fsql,
    '3' :query3_fsql,
    '4' :query4_fsql,
    '5' :query5_fsql,
    '6' :query6_fsql,
    '7' :query7_fsql,
    '12':query12_fsql,
    '14':query14_fsql,
    '17':query17_fsql,
    '20':query20_fsql,
    '21':query21_fsql
  }

  var queries=['1','2','3','4','5','6','7','12','14','17','20','21'];
  var abc=['a','b','c'];
  var scons=document.getElementById("sconsole");
  clearElement(scons);
  queries.forEach((x)=>{
    var i=0;
    var qfsql=q2fsql[x];
    q2mav[x].forEach((xx)=>{
      xx.materialize_be();
      var consql=qfsql(xx).toConpensatingSQL();
      consql=consql.replace(/STMT\d+/g, 'mav'+x+abc[i]);
      consql="\n/*"+'mav'+x+abc[i++]+"*/\n"+consql+";\n";
      scons.appendChild(newHTMLP(consql));
      console.log(consql);
    });
  });
}
function benchmark_scernarioC(){
  var qC1a= `SELECT l_returnflag, l_linestatus, SUM("SUM(l_quantity)"), SUM("SUM(l_extendedprice)"), SUM("SUM((l_extendedprice*(1-l_discount)))"), SUM("SUM(((l_extendedprice*(1-l_discount))*(1+l_tax)))"), ((SUM("SUM(l_quantity)")*ROUND(1.0,2))/SUM(dacount)), ((SUM("SUM(l_extendedprice)")*ROUND(1.0,2))/SUM(dacount)), ((SUM("SUM(l_discount)")*ROUND(1.0,2))/SUM(dacount)), SUM("COUNT(*)") FROM mav1a GROUP BY l_returnflag, l_linestatus ORDER BY l_returnflag, l_linestatus ;`
  var qC2a= `SELECT s_acctbal, s_name, n_name, p_partkey, p_mfgr, s_address, s_phone, s_comment FROM mav2a WHERE p_size=15 ORDER BY s_acctbal DESC, n_name, s_name, p_partkey LIMIT 100;`
  var qC2b= `SELECT s_acctbal, s_name, n_name, p_partkey, p_mfgr, s_address, s_phone, s_comment FROM mav2b WHERE p_type LIKE '%BRASS' ORDER BY s_acctbal DESC, n_name, s_name, p_partkey LIMIT 100;`
  var qC3a= `SELECT l_orderkey, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue, o_orderdate, o_shippriority FROM mav3a WHERE c_mktsegment='BUILDING' GROUP BY l_orderkey, o_orderdate, o_shippriority ORDER BY revenue DESC, o_orderdate LIMIT 10;`
  var qC3b= `SELECT l_orderkey, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue, o_orderdate, o_shippriority FROM mav3b WHERE o_orderdate<DATE '1995-03-15' GROUP BY l_orderkey, o_orderdate, o_shippriority ORDER BY revenue DESC, o_orderdate LIMIT 10;`
  var qC3c= `SELECT l_orderkey, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue, o_orderdate, o_shippriority FROM mav3c WHERE l_shipdate>DATE '1995-03-15' GROUP BY l_orderkey, o_orderdate, o_shippriority ORDER BY revenue DESC, o_orderdate LIMIT 10;`
  var qC4a= `SELECT o_orderpriority, SUM("COUNT(o_orderpriority)") AS order_count FROM mav4a WHERE o_orderdate>=DATE '1993-07-01' AND o_orderdate<DATE '1993-10-01' GROUP BY o_orderpriority ORDER BY o_orderpriority;`
  var qC5a= `SELECT n_name, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue FROM mav5a WHERE r_name='ASIA' GROUP BY n_name ORDER BY revenue DESC;`
  var qC5b=`SELECT n_name, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue FROM mav5b WHERE o_orderdate>=DATE '1994-01-01' AND o_orderdate<DATE '1995-01-01' GROUP BY n_name ORDER BY revenue DESC;`
  var qC6a=`SELECT SUM("SUM((l_extendedprice*l_discount))") AS revenue FROM mav6a WHERE l_shipdate>=DATE '1994-01-01' AND l_shipdate<DATE '1995-01-01';`
  var qC6b=`SELECT SUM("SUM((l_extendedprice*l_discount))") AS revenue FROM mav6b WHERE l_discount>=0.0499999 AND l_discount<=0.0700001;`
  var qC6c=`SELECT SUM("SUM((l_extendedprice*l_discount))") AS revenue FROM mav6c WHERE l_quantity<24;`
  var qC7a=`SELECT "n1.n_name" AS supp_nation, "n2.n_name" AS cust_nation, "EXTRACT(YEAR FROM l_shipdate)" AS l_year, SUM("SUM((l_extendedprice*(1-l_discount)))") AS revenue FROM mav7a GROUP BY supp_nation, cust_nation, l_year ORDER BY supp_nation, cust_nation, l_year;`
  var qC12a=`SELECT l_shipmode, SUM("SUM(CASE WHEN (((o_orderpriority='1-URGENT') OR (o_orderpriority='2-HIGH'))) THEN 1 ELSE 0 END)") AS high_line_count, SUM("SUM(CASE WHEN (((o_orderpriority<>'1-URGENT') AND (o_orderpriority<>'2-HIGH'))) THEN 1 ELSE 0 END)") AS low_line_count FROM mav12a WHERE l_shipmode IN ('MAIL','SHIP') GROUP BY l_shipmode ORDER BY l_shipmode;`
  var qC12b=`SELECT l_shipmode, SUM("SUM(CASE WHEN (((o_orderpriority='1-URGENT') OR (o_orderpriority='2-HIGH'))) THEN 1 ELSE 0 END)") AS high_line_count, SUM("SUM(CASE WHEN (((o_orderpriority<>'1-URGENT') AND (o_orderpriority<>'2-HIGH'))) THEN 1 ELSE 0 END)") AS low_line_count FROM mav12b WHERE l_receiptdate>=DATE '1994-01-01' AND l_receiptdate<DATE '1995-01-01' GROUP BY l_shipmode ORDER BY l_shipmode;`
  var qC14a=`SELECT (100*(SUM("SUM(CASE WHEN (p_type LIKE 'PROMO%') THEN (l_extendedprice*(1-l_discount)) ELSE 0 END)")/SUM("SUM((l_extendedprice*(1-l_discount)))"))) AS promo_revenue FROM mav14a WHERE l_shipdate>=DATE '1995-09-01' AND l_shipdate<DATE '1995-10-01';`
  var qC17a=`SELECT (SUM("SUM(l_extendedprice)")/7) AS avg_yearly FROM mav17a WHERE p_brand='Brand#23';`
  var qC17b=`SELECT (SUM("SUM(l_extendedprice)")/7) AS avg_yearly FROM mav17b WHERE p_container='MED BOX';`
  var qC20a=`SELECT s_name, s_address FROM mav20a WHERE n_name='CANADA' ORDER BY s_name;`
  var qC21a=`SELECT s_name, SUM("COUNT(*)") AS numwait FROM mav21a WHERE o_orderstatus='F' GROUP BY s_name ORDER BY numwait DESC, s_name LIMIT 100;`
  var qC21b=`SELECT s_name, SUM("COUNT(*)") AS numwait FROM mav21b WHERE n_name='SAUDI ARABIA' GROUP BY s_name ORDER BY numwait DESC, s_name LIMIT 100;`
  benchmark_scenarioC_query('qC1a',qC1a); 
  benchmark_scenarioC_query('qC2a',qC2a); 
  benchmark_scenarioC_query('qC2b',qC2b); 
  benchmark_scenarioC_query('qC3a',qC3a); 
  benchmark_scenarioC_query('qC3b',qC3b); 
  benchmark_scenarioC_query('qC3c',qC3c); 
  benchmark_scenarioC_query('qC4a',qC4a); 
  benchmark_scenarioC_query('qC5a',qC5a); 
  benchmark_scenarioC_query('qC5b',qC5b); 
  benchmark_scenarioC_query('qC6a',qC6a); 
  benchmark_scenarioC_query('qC6b',qC6b); 
  benchmark_scenarioC_query('qC6c',qC6c); 
  benchmark_scenarioC_query('qC7a',qC7a); 
  benchmark_scenarioC_query('qC12a',qC12a); 
  benchmark_scenarioC_query('qC12b',qC12b); 
  benchmark_scenarioC_query('qC14a',qC14a); 
  benchmark_scenarioC_query('qC17a',qC17a); 
  benchmark_scenarioC_query('qC17b',qC17b); 
  benchmark_scenarioC_query('qC20a',qC20a); 
  benchmark_scenarioC_query('qC21a',qC21a); 
  benchmark_scenarioC_query('qC21b',qC21b); 
}

function benchmark_scenarioC_query(qname,qsql){
  var tmp_jsn;
  var timeA,t0,t1,ttot;

  var timeA=[];
  for (var i=0;i<5;i++)
    tmp_jsn=pci.execSQL(qsql);
  for (var i=0;i<5;i++){
    t0=get_time_ms();
    tmp_jsn=pci.execSQL(qsql);
    t1=get_time_ms();
    timeA.push(timediff(t1,t0));
  }
  console.log(qname+":"+timeA.join(','));
//  console.log(tmp_jsn);
}
