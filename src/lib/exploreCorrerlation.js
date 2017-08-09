
function Explore(tabname){
  this.tab=daSchema.getTable(tabname);
  this.tabname=this.tab.name;
  this.allColNames=this.tab.colnames.slice(0);
  this.allColNames.splice(this.allColNames.indexOf("id"),1);
  this.allColNames.splice(this.allColNames.indexOf("p"),1);
  this.selColNames=this.allColNames.slice(0);
  this.selColVals=[];
  this.selColNames.forEach((x)=>{this.selColVals.push('*')});
  this.aggA=["_count('*')","_avg('p')"];
  this.valA=abdb.select().from(this.tabname).field(_count('*'),_avg('p')).toArray2();
  //
  this.et= new correlationTablep1(tabname,5,16,"p");
//Control panel
  this.cpAddDomCol=function(col){
    console.log("@cpAddDomCol col:"+col);
  }
  this.cpSetDomCol=function(col,val){
    console.log("@cpSetDomCol col:"+col);
  }
  this.cpRmvDomCol=function(col){
    console.log("@cpRmvDomCol col:"+col);
  }
  this.cpAddAggCol=function(col,val){
  }
  this.cpSetAggCol=function(col,val){
  }
  this.cpRmvAggCol=function(col){
  }
  this.colIDToType=function(colid){
  }
//Events:
  this.bcell=function(cell){
    if (cell.cellIndex>=this.selColNames.length)
      return;
    var colname=this.selColNames[cell.cellIndex];
    clearElement(cell);
    console.log("abdb.select().from("+this.tabname+").field("+colname+").group("+colname+").toArray()");
    var distinct=abdb.select().from(this.tabname).field(colname).group(colname).toArray();
    cell.appendChild(newHTMLDD('Select!',['ALL','*'].concat(distinct),{id:'bcellmenu'},'-sm'));
    $('.dropdown-toggle').dropdown('toggle');
    $("#bcellmenu").on("click", "li a", function() {
      Ei.bcello(this,cell.cellIndex,cell,colname);
    });
    this.uncompute();
  }
  this.bcello=function(menuitem,remember,cell,colname){
    console.log("menuitem:"+menuitem+" remember:"+remember);
    clearElement(cell);
    cell.appendChild(newHTMLA(menuitem.text));
    this.selColVals[remember]=menuitem.text;
    this.onQchange();
  }
  this.hcell=function(cell){
    console.log("@hcell");
    if (cell.cellIndex>=this.selColNames.length)
      return;
  }
  this.uncompute=function(){
    $("[id^=rcell]").text('');
  }
  this.compute=function(){
    $("[id^=rcell]").text('');
    for (var i=0;i<this.valA.length-1;i++){
      tr.appendChild(newHTMLTD(this.valA[i],{id:'rcell'+i}))
    };
  }
  this.onQchange=function(){
    console.log('query changed');
    var gby=[];
    var filt=[];
    var filtp=[];
    var filtc=[];

    var gbyStr="";
    var filtStr="";

    var fromstr =".from ('"+ this.tabname        +"')";


    for (var i=0;i<this.selColVals.length;i++){
      if (this.selColVals[i] == 'ALL')
        gby.push("'"+this.selColNames[i]+"'");
      else if (this.selColVals[i] == '*')
        var donothing;
      else {
        filt.push("_eq('"+this.selColNames[i]+"','"+this.selColVals[i]+"')");
        gby.push("'"+this.selColNames[i]+"'");
      }
    }

    var fieldstr=".field( "+ gby.concat(this.aggA).join(',') +" )";

    var wherestr=".where("+ filt.join(',')      +")";

    var groupstr=(gby.length>0) ? ".group( "+ gby.join(',')       +" )" : "";

    var qstr="abdb.select()"+
             fromstr+
             fieldstr+
             wherestr.replace(".where()","")+
             groupstr+
             ".toOBJ()";

    var tt0=window.performance.now();
    console.log("qstr:"+qstr);
    var qeval=eval(qstr);
    console.log("qeval:"+qeval);
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms<br>";
    //printtable(res.toHTMLTableN(100))
    this.printExploration(qeval);
  }
//
  this.toHTMLTable=function(){
    var table = newHTMLTable({id:"exploreTab"});
    var thead = newHTMLThead(table);
    var tr = thead.insertRow(0);
    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    //tr.appendChild(newHTMLTH(""));
    //tr.appendChild(newHTMLTH("Add to ET"));
    //this.aggA.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    var body= newHTMLTBody(table);
    tr = body.insertRow(0);
    this.selColVals.forEach((x)=>{tr.appendChild(newHTMLTD(x))});

    //tr.appendChild(newHTMLTD(""));
    //tr.appendChild(newHTMLTD("enh:Add to ET"));
    //for (var i=0;i<this.valA.length;i++){
    //  tr.appendChild(newHTMLTD(this.valA[i],{id:'rcell'+i}));
    //};
    this.onQchange();
    return table;
  }
  this.printExplanationTable=function(){
    this.et.explain();
    var etobj=this.et.toOBJ();
    var table = newHTMLTable({id:"explanationTab"});
    var thead = newHTMLThead(table);
    var tr = thead.insertRow(0);

    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    tr.appendChild(newHTMLTH(""));
    tr.appendChild(newHTMLTH("COUNT(*)"));
    tr.appendChild(newHTMLTH("AVG(p)"));
    tr.appendChild(newHTMLTH("distribution"));
    //tr.appendChild(newHTMLTH("EST(p)"));
    tr.appendChild(newHTMLTH(""));
    tr.appendChild(newHTMLTH("Explore"));
    //tr.appendChild(newHTMLTH("Edit ET"));

    var body= newHTMLTBody(table);
    for (var pid=etobj.pats.length-1;pid>-1;pid--){
      tr = body.insertRow(0);
      etobj.pats[pid].cols.forEach((x)=>{tr.appendChild(newHTMLTD(x))});
      tr.appendChild(newHTMLTD(""));
      tr.appendChild(newHTMLTD(etobj.pats[pid].count));
      tr.appendChild(newHTMLTD(etobj.pats[pid].avgp.toFixed(2)));
      var td = document.createElement('td');
      var pb=newHTMLProgressBarGreenRed((etobj.pats[pid].avgp.toFixed(2)*100));
      td.appendChild(pb);
      tr.appendChild(td);
      tr.appendChild(newHTMLTH(""));

      var td = document.createElement('td');
      var a=newHTMLA("explore",{onclick:"Ei.explorePat("+pid+")"});
      td.appendChild(a);
      tr.appendChild(td);

      //tr.appendChild(newHTMLTH("enh:remove"));
    } 
    printet(table);
    //return table;
  }
  this.explorePat=function(pid){
    console.log("@explorePat: "+pid);
    var econs=document.getElementById("econsole");
    clearElement(econs);
    
    this.selColVals=this.et.toOBJ().pats[pid].cols;

    econs.appendChild(this.toHTMLTable());
    $('#exploreTab tbody').on("click","td",function(e){Ei.bcell(this)});
    $('#exploreTab thead').on("click","th",function(e){Ei.hcell(this)});
  }
  this.exploreExplore=function(rid){
    console.log("@exploreExplore: "+rid);
    var econs=document.getElementById("econsole");
    clearElement(econs);
    
    this.selColVals=[];
    qscns=this.exploringQEval.colnames.slice(0,this.exploringQEval.numcols-3);
    qscvs=this.exploringQEval.array2.splice((rid*this.exploringQEval.numcols),this.exploringQEval.numcols-3);
    this.selColNames.forEach((x)=>{ qscns.indexOf(x)<0? this.selColVals.push('*') : this.selColVals.push(qscvs[qscns.indexOf(x)])});
    econs.appendChild(this.toHTMLTable());
    $('#exploreTab tbody').on("click","td",function(e){Ei.bcell(this)});
    $('#exploreTab thead').on("click","th",function(e){Ei.hcell(this)});
  }

  this.printExploration=function (qeval){
    this.exploringQEval=qeval;
    var table=document.createElement('table');
    table.setAttribute('class',"table table-bordered table-condensed table-nonfluid table-striped table-hover");

    var thead = table.createTHead();
    thead.setAttribute('class',"thead-default");
    var tr = thead.insertRow(0);

    for (var i=0;i<qeval.numcols;i++){
        if(i==qeval.numcols-3)
         tr.appendChild(newHTMLTH(""));
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(qeval.colnames[i]));
        tr.appendChild(th);
    }
    tr.appendChild(newHTMLTH("distribution"));
    tr.appendChild(newHTMLTH(""));
    tr.appendChild(newHTMLTH("explore"));

    thead.appendChild(tr);
    var tbody= table.createTBody();
    var alignright={0:1,1:1,4:1};
    for (var i=0;(i<qeval.numrows);i++){
      tr = document.createElement('tr');
      for (var ii=0;ii<qeval.numcols;ii++){
        if(ii==qeval.numcols-3)
         tr.appendChild(newHTMLTD(""));
        var td = document.createElement('td');
        if ( qeval.coltypes[ii] ==0 )
          td.appendChild(document.createTextNode(Number.parseInt(qeval.array2[(i*qeval.numcols)+ii])));
        else if (qeval.coltypes[ii] ==1 )
          td.appendChild(document.createTextNode(Number.parseFloat(qeval.array2[(i*qeval.numcols)+ii]).toFixed(2)));
        else 
          td.appendChild(document.createTextNode(qeval.array2[(i*qeval.numcols)+ii]));
        if (alignright[qeval.coltypes[ii]])
          td.align="right";
        tr.appendChild(td);
      }
      var td = document.createElement('td');
      var pb=newHTMLProgressBarGreenRed(qeval.array2[(i*qeval.numcols)+(qeval.numcols-1)].toFixed(2)*100);
      td.appendChild(pb);
      tr.appendChild(td);
      tr.appendChild(newHTMLTH(""));
      var td = document.createElement('td');
      var a=newHTMLA("explore",{onclick:"Ei.exploreExplore("+i+")"});
      td.appendChild(a);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    printtable(table)
  }
//Constructor:
  this.printExplanationTable();
}
