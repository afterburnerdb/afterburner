function query1_fsql0(against,lodate,hidate){
  lodate= lodate||'1990-01-01';
  hidate= hidate||'1998-09-02';
  console.log('lodate:',lodate);
  console.log('hidate:',hidate);
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
var q2viztype={
  '1' :['slider'],
  '2' :['slider','liker'],
  '3' :['menu','slider'],
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
function splitDemo(qnum,qscen,opencol){
  this.qnum=qnum;
  this.qcen=qscen;
  this.mav=q2mav[qnum][qscen];
  this.fsql=q2fsqlE[qnum][qscen];
  this.vizt=q2viztype[qnum][qscen];
  console.log('qnum:',qnum);
  console.log('qscen:',qscen);
  console.log('mav:',this.mav);
  console.log('fsql:',this.fsql);
//..
  this.drawviz=function(){
    var tt0=window.performance.now();
    this.mav.materialize_fe();
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    if (ttot>5)
      document.getElementById("console").innerHTML = "Materialized View pulled in " + (ttot.toFixed(2))+"ms";
    if (this.vizt == 'slider'){
      this.drawslider();
    } else if (this.vizt=='liker'){
      this.drawliker();
    } else if (this.vizt=='menu'){
      this.drawmenu();
    }

  }
//Slider
  this.runSliderQuery=function(loval,hival,firsttime){
    var q=this.fsql(this.mav,loval,hival);
    var tt0=window.performance.now();
    q.ABI.materialize();
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    if(!firsttime)
      document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms" ;
    console.log('time to run code:'+ (ttot));
  }
  this.drawslider=function(){
    var divcons=document.getElementById("divcons");
    clearElement(divcons);
    var coltype=daSchema.getColTypeByName(opencol,[this.mav.mat.name])
    var minval=abdb.select().from(this.mav.mat.name).field(_min(opencol)).eval();//'1998-01-01';
    //var minval='1998-01-01';
    var maxval=abdb.select().from(this.mav.mat.name).field(_max(opencol)).eval();

    var row1=newHTMLDIV();
    var slider=newHTMLDIV();
    //row1.appendChild(newHTMLBR());
    row1.appendChild(newHTMLP(''));
    row1.appendChild(slider);
    row1.appendChild(newHTMLBR());

    var row2=newHTMLDIV();
    var col1=newHTMLCol('md',4,{id:'loval'});
    col1.innerHTML=minval;
    var col2=newHTMLCol('md',4,{id:'label',align:'center'});
    col2.innerHTML=opencol;
    var col3=newHTMLCol('md',4,{id:'hival',class:'pull-right',align:'right'});
    col3.innerHTML=maxval;
    row2.appendChild(col1);
    row2.appendChild(col2);
    row2.appendChild(col3);

    this.runSliderQuery(minval,maxval,'firsttime');

    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row1);
    //divcons.appendChild(newHTMLBR());
    divcons.appendChild(row2);
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row3);

    if (coltype==3){
      noUiSlider.create(slider, {
      	start: [strdate_to_int(minval), strdate_to_int(maxval)],
      	connect: true,
      	range: {
      		'min': strdate_to_int(minval),
      		'max': strdate_to_int(maxval)
      	},
        step:1
      });
      sliderValues = [
      	document.getElementById('loval'),
      	document.getElementById('hival')
      ];
      slider.noUiSlider.on('change', function( values, handle ){
        if (typeof SDi !='undefined')
          SDi.runSliderQuery(int_to_strdate(values[0]), int_to_strdate(values[1]));
          var splittable=document.getElementById("splittable");
          clearElement(splittable);
          splittable.appendChild(res.toHTMLTableN(100));
      });
      slider.noUiSlider.on('update', function( values, handle ) {
        sliderValues[handle].innerHTML = int_to_strdate(+values[handle]);
      });
    }else{
      noUiSlider.create(slider, {
      	start:[minval, maxval],
      	connect:true,
      	range:{'min': minval,'max': maxval},
        step:1
      });
      sliderValues = [
      	document.getElementById('loval'),
      	document.getElementById('hival')
      ];
      slider.noUiSlider.on('change', function( values, handle ){
        if (typeof SDi !='undefined')
          SDi.runSliderQuery(values[0],values[1]);
        var splittable=document.getElementById("splittable");
        clearElement(splittable);
        splittable.appendChild(res.toHTMLTableN(100));
      });
      slider.noUiSlider.on('update', function( values, handle ) {
        sliderValues[handle].innerHTML = +values[handle];
      });
    }
  }
//Menu
  this.runMenuQuery=function(eqval,firsttime){
    var q=this.fsql(this.mav,eqval);
    var tt0=window.performance.now();
    q.ABI.materialize();
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    if(!firsttime)
      document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms" ;
    console.log('time to run code:'+ (ttot));
  }
  this.drawmenu=function(){
    var divcons=document.getElementById("divcons");
    clearElement(divcons);
    var coltype=daSchema.getColTypeByName(opencol,[this.mav.mat.name])
    var allval=abdb.select().from(this.mav.mat.name).field(opencol).group(opencol).toArray();//'1998-01-01';
    console.log("allval:"+allval);

    var row1=newHTMLDIV();
    var menu=newHTMLDIV();
    
    row1.appendChild(newHTMLP(opencol,{style:"float:left; margin:0 10px 10px 0;"}));
    row1.appendChild(menu);
    row1.appendChild(newHTMLBR());
    this.runMenuQuery(allval[0],'firsttime');

    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row1);
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row3);

    menu.appendChild(newHTMLDD('Select!',[].concat(allval),{id:'bcellmenu'},'-sm'));
    $('.dropdown-toggle').dropdown('toggle');

    $("#bcellmenu").on("click", "li a", function() {
      expose=this;
      $("#bcellmenu button").text(this.text);
      if (typeof SDi !='undefined')
        SDi.runMenuQuery(this.text);
      var splittable=document.getElementById("splittable");
      clearElement(splittable);
      splittable.appendChild(res.toHTMLTableN(100));
    });
  }
//Liker
  this.runLikerQuery=function(likeqstr,firsttime){
    var q=this.fsql(this.mav,likeqstr);
    var tt0=window.performance.now();
    q.ABI.materialize();
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    if(!firsttime)
      document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms" ;
    console.log('time to run code:'+ (ttot));
  }
  this.drawliker=function(){
    var divcons=document.getElementById("divcons");
    clearElement(divcons);
    var coltype=daSchema.getColTypeByName(opencol,[this.mav.mat.name])

    var row1=newHTMLDIV();
    var liker=newHTMLDIV();
    
    row1.appendChild(newHTMLP(opencol,{style:"float:left; margin:0 10px 10px 0;"}));
    row1.appendChild(liker);
    row1.appendChild(newHTMLBR());
    this.runLikerQuery("",'firsttime');

    var row3=newHTMLDIV({id:'splittable'});
    row3.appendChild(res.toHTMLTableN(100));
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row1);
    divcons.appendChild(newHTMLBR());
    divcons.appendChild(row3);

    liker.appendChild(newHTMLInput({id:'likebegins',type:'text'}));
    liker.appendChild(newHTMLInput({id:'likehas',type:'text'}));
    liker.appendChild(newHTMLInput({id:'likeends',type:'text'}));

    $("[id^=like]").on("click","", function() {
      expose=this;
      console.log('liker');
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
      console.log('likeQstr'+likeQstr);
      if (typeof SDi !='undefined')
        SDi.runLikerQuery(likeQstr);
      var splittable=document.getElementById("splittable");
      clearElement(splittable);
      splittable.appendChild(res.toHTMLTableN(100));
    });
  }

//..
  this.drawviz();
}
