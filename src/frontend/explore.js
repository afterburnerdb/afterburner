
function Explore(tabname){
  this.tab=daSchema.getTable(tabname);
  this.tabname=this.tab.name;
  this.allColNames=this.tab.colnames.slice(0);
  this.allColNames.splice(this.allColNames.indexOf("id"),1);
  this.allColNames.splice(this.allColNames.indexOf("p"),1);
  this.selColNames=this.allColNames.slice(0);
  this.selColVals=[];
  this.selColNames.forEach((x)=>{this.selColVals.push('*')});
  this.aggA=["_count('*')","_sum('p')","_avg('p')"];
  this.valA=abdb.select().from(this.tabname).field(_count('*'),_sum('p'),_avg('p')).toArray2();
  //
  this.et= new explanationTablep1(tabname,4,16,"p");
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
             ".materialize()";

    var tt0=window.performance.now();
    console.log("qstr:"+qstr);
    var qeval=eval(qstr);
    console.log("qeval:"+qeval);
    var tt1=window.performance.now();
    var ttot=tt1-tt0;
    document.getElementById("console").innerHTML = "Query completed in " + (ttot.toFixed(2))+"ms<br>";
    printtable(res.toHTMLTableN(100))
    console.log('time to run code:'+ (ttot));

  }
//
  this.toHTMLTable=function(){
    var table = newHTMLTable({id:"exploreTab"});
    var thead = newHTMLThead(table);
    var tr = thead.insertRow(0);
    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    tr.appendChild(newHTMLTH(""));
    this.aggA.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    var body= newHTMLTBody(table);
    tr = body.insertRow(0);
    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTD('*'))});
    tr.appendChild(newHTMLTD(''));

    for (var i=0;i<this.valA.length;i++){
      tr.appendChild(newHTMLTD(this.valA[i],{id:'rcell'+i}));
    };
    tr.appendChild(newHTMLTD(''));
    return table;
  }
//Constructor:
}
