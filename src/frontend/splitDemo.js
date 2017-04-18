function query1_fsql0(against,lodate,hidate){
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
function query2_fsql0(against,loval,hival){
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
  .where(
    gte("@p_size",loval),
    lte("@p_size",hival),
    like("@p_type",'%BRASS'),
    eq("@r_name",'EUROPE'))
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
function query2_fsql1(against,likeqstr){
  var subq=select()
             .from("@partsupp","@supplier","@nation","@region")
             .field(min("@ps_supplycost"))
             .where(eq("@p_partkey","@ps_partkey"),
                    eq("@s_suppkey","@ps_suppkey"),
                    eq("@s_nationkey","@n_nationkey"),
                    eq("@n_regionkey","@r_regionkey"),
                    eq("@r_name",'EUROPE'));

  var tmpq=select(against)
  .from("@part","@supplier","@partsupp","@nation","@region")
  .field("@s_acctbal","@s_name","@n_name","@p_partkey","@p_mfgr","@s_address","@s_phone","@s_comment")
  .where(eq("@p_partkey","@ps_partkey"),
        eq("@s_suppkey","@ps_suppkey"), 
        eq("@s_nationkey","@n_nationkey"),
        eq("@n_regionkey","@r_regionkey"),
	eq("@ps_supplycost",subq))
  .where(eq("@p_size",15),
    eq("@r_name",'EUROPE'))
  if (likeqstr!="")
    tmpq=tmpq.where(like("@p_type",likeqstr));
  return tmpq
  .order("-@s_acctbal","@n_name","@s_name","@p_partkey")
  .limit(100); 
}
//
function query3_fsql0(against,eqval){
  return select(against)
   .from("@customer","@orders","@lineitem")
   .where(eq("@c_custkey", "@o_custkey"),
          eq("@l_orderkey", "@o_orderkey"))
   .where(eq("@c_mktsegment", eqval),
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
    lte("@o_orderdate",date(hidate)),
    gte("@o_orderdate",date(lodate)),
    gt("@l_shipdate",date('1995-03-15')))
   .field("@l_orderkey", as(sum( mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"),"@o_orderdate","@o_shippriority")
   .group("@l_orderkey", "@o_orderdate", "@o_shippriority")
   .order("-@revenue","@o_orderdate")
   .limit(10)
}
function query4_fsql0(against,lodate,hidate){
  var subq=select()
             .from("@lineitem")
             .field("@*")
             .where(eq("@l_orderkey","@o_orderkey"),
                    lt("@l_commitdate","@l_receiptdate"));
  return select(against)
    .from("@orders")
    .field("@o_orderpriority", as(count("@o_orderpriority"),"order_count"))
    .where(gte("@o_orderdate",date(lodate)),
           lte("@o_orderdate",date(hidate)),
           exists(subq))
    .group("@o_orderpriority")
    .order("@o_orderpriority");
}
function query5_fsql0(against,eqval){
  return select(against)
    .from("@customer","@orders","@lineitem","@supplier","@nation","@region")
    .where(eq("@c_custkey","@o_custkey"),
           eq("@l_orderkey","@o_orderkey"),
           eq("@l_suppkey","@s_suppkey"),
           eq("@c_nationkey","@s_nationkey"),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_regionkey","@r_regionkey"),
           eq("@r_name",eqval),
           gte("@o_orderdate",date('1994-01-01')),
           lt("@o_orderdate",date('1995-01-01')))
    .field("@n_name",as(sum(mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"))
    .group("@n_name")
    .order("-@revenue");
}
function query5_fsql1(against,lodate,hidate){
  return select(against)
    .from("@customer","@orders","@lineitem","@supplier","@nation","@region")
    .where(eq("@c_custkey","@o_custkey"),
           eq("@l_orderkey","@o_orderkey"),
           eq("@l_suppkey","@s_suppkey"),
           eq("@c_nationkey","@s_nationkey"),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_regionkey","@r_regionkey"),
           eq("@r_name",'ASIA'),
           gte("@o_orderdate",date(lodate)),
           lte("@o_orderdate",date(hidate)))
    .field("@n_name",as(sum(mul("@l_extendedprice", sub(1,"@l_discount"))),"revenue"))
    .group("@n_name")
    .order("-@revenue");
}
function query6_fsql0(against,lodate,hidate){
  return  select(against)
    .from("@lineitem")
    .field(as(sum(mul("@l_extendedprice","@l_discount")),"revenue"))
    .where(gte("@l_shipdate",date(lodate)),
      lte ("@l_shipdate",date(hidate)),
      gte("@l_discount",0.0499999),
      lte("@l_discount",0.0700001),
      lt ("@l_quantity",24))
}
function query6_fsql1(against,loval,hival){
  return  select(against)
    .from("@lineitem")
    .field(as(sum(mul("@l_extendedprice","@l_discount")),"revenue"))
    .where(gte("@l_shipdate",date('1994-01-01')),
      lt ("@l_shipdate",date('1995-01-01')),
      gte("@l_discount",loval*.99999999),
      lte("@l_discount",hival*1.0000001),
      lt ("@l_quantity",24))
}
function query6_fsql2(against,loval,hival){
  return  select(against)
    .from("@lineitem")
    .field(as(sum(mul("@l_extendedprice","@l_discount")),"revenue"))
    .where(gte("@l_shipdate",date('1994-01-01')),
      lt ("@l_shipdate",date('1995-01-01')),
      gte("@l_discount",0.0499999),
      lte("@l_discount",0.0700001),
      lte ("@l_quantity",hival),
      gte ("@l_quantity",loval)
      )
}
function query7_fsql0(against,lodate,hidate){
 return select(against)
   .from("@supplier","@lineitem","@orders","@customer","@nation n1","@nation n2")
   .field(as("@n1.n_name","supp_nation"),
          as("@n2.n_name","cust_nation"),
          as(toYear("@l_shipdate"),"l_year"),
          as(sum(mul("@l_extendedprice",sub(1,"@l_discount"))),"revenue"))
   .where(eq("@s_suppkey","@l_suppkey"),
          eq("@o_orderkey","@l_orderkey"),
          eq("@c_custkey","@o_custkey"),
          eq("@s_nationkey","@n1.n_nationkey"),
          eq("@c_nationkey","@n2.n_nationkey"),
          or(and(eq("@n1.n_name",'FRANCE'),eq("@n2.n_name",'GERMANY')), 
             and(eq("@n1.n_name",'GERMANY'),eq("@n2.n_name",'FRANCE'))),
          lte("@l_shipdate",date(hidate)),
          gte("@l_shipdate",date(lodate))
     )
   .group("@supp_nation","@cust_nation","@l_year")
   .order("@supp_nation","@cust_nation","@l_year");
}
function query12_fsql0(against,eqval){
  return select(against)
	  .from("@lineitem","@orders")
	  .field("@l_shipmode",
			  as(sumif(1,or(eq("@o_orderpriority","1-URGENT"),eq("@o_orderpriority","2-HIGH"))),"high_line_count"),
			  as(sumif(1,and(neq("@o_orderpriority","1-URGENT"),neq("@o_orderpriority","2-HIGH"))),"low_line_count"))
	  .where(eq("@l_orderkey","@o_orderkey"),
                 eq("@l_shipmode",eqval),
	         lt("@l_commitdate","@l_receiptdate"),
                 lt("@l_shipdate","@l_commitdate"),
                 gte("@l_receiptdate",date('1994-01-01')),
                 lt("@l_receiptdate",date('1995-01-01')))
	  .group("@l_shipmode")
          .order("@l_shipmode");

}
function query12_fsql1(against,lodate,hidate){
  return select(against)
	  .from("@lineitem","@orders")
	  .field("@l_shipmode",
			  as(sumif(1,or(eq("@o_orderpriority","1-URGENT"),eq("@o_orderpriority","2-HIGH"))),"high_line_count"),
			  as(sumif(1,and(neq("@o_orderpriority","1-URGENT"),neq("@o_orderpriority","2-HIGH"))),"low_line_count"))
	  .where(eq("@l_orderkey","@o_orderkey"),
                 isin("@l_shipmode",['MAIL', 'SHIP']),
	         lt("@l_commitdate","@l_receiptdate"),
                 lt("@l_shipdate","@l_commitdate"),
                 gte("@l_receiptdate",date(lodate)),
                 lte("@l_receiptdate",date(hidate)))
	  .group("@l_shipmode")
          .order("@l_shipmode");
}
function query14_fsql0(against,lodate,hidate){
  return select(against)
  .from("@lineitem","@part")
  .field(as(mul(100.00,div(sumif(mul("@l_extendedprice", sub(1,"@l_discount")),like("@p_type", 'PROMO%')), 
         sum(mul("@l_extendedprice", sub(1,"@l_discount"))))),"promo_revenue"))
  .where(eq("@l_partkey","@p_partkey"),
         gte("@l_shipdate", date(lodate)),
         lte("@l_shipdate", date(hidate)));
}
function query17_fsql0(against,eqval){
  var subq=select()
             .from("@lineitem")
             .field(mul(0.2,(avg("@l_quantity"))))
             .where(eq("@l_partkey","@p_partkey"))
  return select(against)
    .from("@lineitem","@part")
    .field(as(div(sum("@l_extendedprice"),7.0),"avg_yearly"))
    .where(eq("@p_partkey","@l_partkey"),
           eq("@p_brand",eqval),
           eq("@p_container",'MED BOX'),
           lt("@l_quantity",subq))
}
function query17_fsql1(against,eqval){
  var subq=select()
             .from("@lineitem")
             .field(mul(0.2,(avg("@l_quantity"))))
             .where(eq("@l_partkey","@p_partkey"))
  return select(against)
    .from("@lineitem","@part")
    .field(as(div(sum("@l_extendedprice"),7.0),"avg_yearly"))
    .where(eq("@p_partkey","@l_partkey"),
           eq("@p_brand",'Brand#23'),
           eq("@p_container",eqval),
           lt("@l_quantity",subq))
}
function query20_fsql0(against,eqval){
  var subq0=select()
              .from("@part")
              .field("@p_partkey")
              .where(like("@p_name",'forest%'));
  var subq1=select()
              .from("@lineitem")
              .field(mul(0.5,sum("@l_quantity")))
              .where(eq("@l_partkey","@ps_partkey"),
                     eq("@l_suppkey","@ps_suppkey"),
                     gte("@l_shipdate",date('1994-01-01')),
                     lt("@l_shipdate",date('1995-01-01')))
  var subq2=select()
    .from("@partsupp")
    .field("@ps_suppkey")
    .where(isin("@ps_partkey", subq0),
           gt("@ps_availqty", subq1 ))
  return select(against)
    .from("@supplier","@nation")
    .where(isin("@s_suppkey",subq2),
      eq("@s_nationkey","@n_nationkey"),
      eq("@n_name",eqval))
    .field("@s_name","@s_address")
    .order("@s_name")
}
function query21_fsql0(against,eqval){
  var subq0=select()
              .from("@lineitem l2")
              .where(eq("@l2.l_orderkey","@l1.l_orderkey"),
                     neq("@l2.l_suppkey","@l1.l_suppkey"))
              .field("@*")
  var subq1=select()
              .from("@lineitem l3")
              .where(eq("@l3.l_orderkey","@l1.l_orderkey"),
                     neq("@l3.l_suppkey","@l1.l_suppkey"),
                     gt("@l3.l_receiptdate","@l3.l_commitdate"))
              .field("@*")
  return select(against)
    .from("@supplier","@lineitem l1","@orders","@nation")
    .where(eq("@s_suppkey","@l1.l_suppkey"),
           eq("@o_orderkey","@l1.l_orderkey"),
           eq("@o_orderstatus", eqval),
           gt("@l1.l_receiptdate","@l1.l_commitdate"),
           exists(subq0),
           notexists(subq1),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_name",'SAUDI ARABIA'))
    .field("@s_name",as(count("@*"),"numwait"))
    .group("@s_name")
    .order("-@numwait","@s_name")
    .limit(100);
}
function query21_fsql1(against,eqval){
  var subq0=select()
              .from("@lineitem l2")
              .where(eq("@l2.l_orderkey","@l1.l_orderkey"),
                     neq("@l2.l_suppkey","@l1.l_suppkey"))
              .field("@*")
  var subq1=select()
              .from("@lineitem l3")
              .where(eq("@l3.l_orderkey","@l1.l_orderkey"),
                     neq("@l3.l_suppkey","@l1.l_suppkey"),
                     gt("@l3.l_receiptdate","@l3.l_commitdate"))
              .field("@*")
  return select(against)
    .from("@supplier","@lineitem l1","@orders","@nation")
    .where(eq("@s_suppkey","@l1.l_suppkey"),
           eq("@o_orderkey","@l1.l_orderkey"),
           eq("@o_orderstatus", 'F'),
           gt("@l1.l_receiptdate","@l1.l_commitdate"),
           exists(subq0),
           notexists(subq1),
           eq("@s_nationkey","@n_nationkey"),
           eq("@n_name",eqval))
    .field("@s_name",as(count("@*"),"numwait"))
    .group("@s_name")
    .order("-@numwait","@s_name")
    .limit(100);
}
//
var q2fsqlE={
  '1' :[query1_fsql0],
  '2' :[query2_fsql0,query2_fsql1],
  '3' :[query3_fsql0,query3_fsql1],
  '4' :[query4_fsql0],
  '5' :[query5_fsql0,query5_fsql1],
  '6' :[query6_fsql0,query6_fsql1,query6_fsql2],
  '7' :[query7_fsql0],
  '12':[query12_fsql0,query12_fsql1],
  '14':[query14_fsql0],
  '17':[query17_fsql0,query17_fsql1],
  '20':[query20_fsql0],
  '21':[query21_fsql0,query21_fsql1]
}
var q2mav={
  '1' :[query1a_mav()],
  '2' :[query2a_mav(),query2b_mav()],
  '3' :[query3a_mav(),query3b_mav()],
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
var q2viztype={
  '1' :['slider'],
  '2' :['slider','liker'],
  '3' :['menu','slider'],
  '4' :['slider'],
  '5' :['menu','slider'],
  '6' :['slider','slider','slider'],
  '7' :['slider'],
  '12':['menu','slider'],
  '14':['slider'],
  '17':['menu','menu'],
  '20':['menu'],
  '21':['menu','menu']
}
//
function splitDemo(qnum,qscen,opencol){
  this.qnum=qnum;
  this.qcen=qscen;
  this.mav=q2mav[qnum][qscen];
  this.fsql=q2fsqlE[qnum][qscen];
  this.vizt=q2viztype[qnum][qscen];
//..
  this.drawviz=function(){
    var hadtomat=false;
    if (this.mav.matfe)
      document.getElementById("console").innerHTML = "Materialized view already in browser!";
    else {
      var tt0=window.performance.now();
      this.mav.materialize_be();
      var tt1=window.performance.now();
      this.mav.materialize_fe();
      var tt2=window.performance.now();
      var ttotmatbe=tt1-tt0;
      var ttotmetfe=tt2-tt1;
        document.getElementById("console").innerHTML = "Time to create materialized view @backend:"+ttotmatbe.toFixed(2)+"<br> Time to load materialized view into browser: " + (ttotmetfe.toFixed(2))+"ms";
    }
    var divcons=document.getElementById("divcons");
    var dashcons=document.getElementById("dashcons");
    clearElementsById(["divcons","dashcons"]);

    var coltype=daSchema.getColTypeByName(opencol,[this.mav.mat.name]);

    if (this.vizt == 'slider'){
      this.drawslider(divcons,dashcons,coltype);
    } else if (this.vizt=='liker'){
      this.drawliker(divcons,dashcons,coltype);
    } else if (this.vizt=='menu'){
      this.drawmenu(divcons,dashcons,coltype);
    }
  }
  this.runQuery=function(params,firsttime){
    var q=this.fsql(this.mav, ...params);
    var tt0=window.performance.now();
    q.ABI.materialize();
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    if(!firsttime)
      document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms" ;
    console.log('time to run code:'+ (ttot));
  }
//Slider
  this.drawslider=function(divcons,dashcons,coltype){
    var minval=abdb.select().from(this.mav.mat.name).field(_min(opencol)).eval();
    var maxval=abdb.select().from(this.mav.mat.name).field(_max(opencol)).eval();
    if (coltype==1){ 
      minval=Number.parseFloat(minval.toFixed(2))
      maxval=Number.parseFloat(maxval.toFixed(2))
    }
    var row1=newHTMLDIV();
    var slider=newHTMLDIV({id:'slider'});
    row1.appendChild(newHTMLP(''));
    row1.appendChild(slider);
    row1.appendChild(newHTMLBR());

    var row2=newHTMLDIV();
    var col1=newHTMLCol('md',4,{id:'loval'});
    col1.innerHTML=minval;
    var col2=newHTMLCol('md',4,{id:'label', align:'center'});
    col2.appendChild(newHTMLBut(opencol,{class:"btn btn-primary",style:"float:center;"}));
    var col3=newHTMLCol('md',4,{id:'hival',class:'pull-right',align:'right'});
    col3.innerHTML=maxval;
    row2.appendChild(col1);
    row2.appendChild(col2);
    row2.appendChild(col3);
    dashcons.appendChild(newHTMLBR());
    dashcons.appendChild(row1);
    dashcons.appendChild(row2);
    dashcons.appendChild(newHTMLBR());

    this.runQuery([minval,maxval],'firsttime');
    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(row3);
    sliderValues = [document.getElementById('loval'), document.getElementById('hival')];

    if (coltype==3){
      $('#slider').slider({
        range: true,
        min: strdate_to_int(minval),
	max: strdate_to_int(maxval),
        values: [strdate_to_int(minval), strdate_to_int(maxval)],
        change: function(event,ui) {
          if (typeof SDi !='undefined')
            SDi.runQuery(ui.values.map(int_to_strdate));
          var splittable=document.getElementById("splittable");
          clearElement(splittable);
          splittable.appendChild(res.toHTMLTableN(100));
        },
        slide: function( event, ui ) {
          sliderValues[ui.handleIndex].innerHTML = int_to_strdate(+ui.values[ui.handleIndex]);
        }
      });
    }else if (coltype==1){
      $('#slider').slider({
        range: true,
        step: 0.01,
        min: minval,
	max: maxval,
        values: [minval, maxval],
        change: function(event,ui) {
          if (typeof SDi !='undefined')
            SDi.runQuery(ui.values);
          var splittable=document.getElementById("splittable");
          clearElement(splittable);
          splittable.appendChild(res.toHTMLTableN(100));
        },
        slide: function( event, ui ) {
          console.log("ui.handleIndex"+ui.handleIndex);
          console.log("ui.values[ui.handleIndex]"+ui.values[ui.handleIndex]);

          sliderValues[ui.handleIndex].innerHTML = ui.values[ui.handleIndex];
        }
      });
    }else{
      $('#slider').slider({
        range: true,
        min: minval,
	max: maxval,
        values: [minval, maxval],
        change: function(event,ui) {
          if (typeof SDi !='undefined')
            SDi.runQuery(ui.values);
          var splittable=document.getElementById("splittable");
          clearElement(splittable);
          splittable.appendChild(res.toHTMLTableN(100));
        },
        slide: function( event, ui ) {
          sliderValues[ui.handleIndex].innerHTML = ui.values[ui.handleIndex];
        }
      });
    }
  }
//Menu
  this.drawmenu=function(divcons,dashcons,coltype){
    var allval=abdb.select().from(this.mav.mat.name).field(opencol).group(opencol).toArray();//'1998-01-01';
    var row1=newHTMLDIV();
    var menu=newHTMLDIV();
    row1.appendChild(newHTMLBut(opencol,{class:"btn btn-primary",style:"float:left; margin:0 10px 10px 0;"}));
    row1.appendChild(menu);
    row1.appendChild(newHTMLBR());
    dashcons.appendChild(newHTMLBR());
    dashcons.appendChild(row1);
    dashcons.appendChild(newHTMLBR());

    this.runQuery([allval[0]],'firsttime');
    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(row3);
    menu.appendChild(newHTMLDD('Select!',[].concat(allval),{id:'bcellmenu'},'-sm'));
    $('.dropdown-toggle').dropdown('toggle');

    $("#bcellmenu").on("click", "li a", function() {
      $("#bcellmenu button").text(this.text);
      if (typeof SDi !='undefined')
        SDi.runQuery([this.text]);
      var splittable=document.getElementById("splittable");
      clearElement(splittable);
      splittable.appendChild(res.toHTMLTableN(100));
    });
  }
//Liker
  this.drawliker=function(divcons,dashcons,coltype){
    var row1=newHTMLDIV();
    var liker=newHTMLDIV();
    row1.appendChild(newHTMLBut(opencol,{class:"btn btn-primary",style:"float:left; margin:0 10px 10px 0;"}));
    row1.appendChild(liker);
    row1.appendChild(newHTMLBR());
    dashcons.appendChild(newHTMLBR());
    dashcons.appendChild(row1);
    dashcons.appendChild(newHTMLBR());

    this.runQuery('firsttime',[""]);
    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(row3);

    liker.appendChild(newHTMLInput({id:'likebegins',type:'text',placeholder:'Begins with?'}));
    liker.appendChild(newHTMLInput({id:'likehas',type:'text',placeholder:'Has?'}));
    liker.appendChild(newHTMLInput({id:'likeends',type:'text',placeholder:'Ends with?'}));

    $("[id^=like]").on("change","", function() {
      var begins=$('#likebegins').val().replace(/\s/g,'');
      var has=$('#likehas').val().replace(/\s/g,'');
      var ends=$('#likeends').val().replace(/\s/g,'');
      var likeQstr="";
      if (begins && begins!=="")
        likeQstr=likeQstr+begins+"%";
      if (has && has!=="")
        likeQstr=likeQstr+"%"+has+"%";
      if (ends && ends!=="")
        likeQstr=likeQstr+"%"+ends;
      likeQstr=likeQstr.replace(/\%\%/g,'%');
      if (typeof SDi !='undefined')
        SDi.runQuery([likeQstr]);
      var splittable=document.getElementById("splittable");
      clearElement(splittable);
      splittable.appendChild(res.toHTMLTableN(100));
    });
  }
//..
  this.drawviz();
}
