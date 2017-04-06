
function Explore(tabname){
  this.tab=daSchema.getTable(tabname);
  this.tabname=this.tab.name;
  this.allColNames=this.tab.colnames.slice(0);
  this.selColNames=this.tab.colnames.slice(0);
  this.selColVals=[];
  this.selColNames.forEach((x)=>{this.selColVals.push('*')});
  this.aggA=['_count(*)','new'];
  this.valA=[this.tab.numrows,''];

//Control panel
  this.cpAddDomCol=function(col){
    console.log("@cpAddDomCol col:"+col);
    hasaseen=col;
  }
  this.cpSetDomCol=function(col,val){
    console.log("@cpSetDomCol col:"+col);
    hasaseen=col;
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
    cell.appendChild(newHTMLDD(['ALL','*'].concat(distinct),{id:'bcellmenu'}));
    $('.dropdown-toggle').dropdown('toggle');

    $("#bcellmenu").on("click", "li a", function() {
      Ei.bcello(this,cell.cellIndex,cell,colname);
    });
    this.uncompute();
  }
  this.bcello=function(menuitem,remember,cell,colname){
    expose=menuitem;
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
    $("[id=rcell]").text('');
  }
  this.onQchange=function(){
    console.log('query changed');
    var gby=[];
    var filt=[];
    var filtp=[];
    var filtc=[];

    var gbyStr="";
    var filtStr="";

    for (var i=0;i<this.selColVals.length;i++){
      if (this.selColVals[i] == 'ALL')
        gby.push(this.selColNames[i]);
      else if (this.selColVals[i] == '*')
        var donothing;
      else {
        filt.push("_eq("+this.selColNames[i]+","+this.selColVals[i]+")");
      }
    }
    console.log("abdb.select().from("+this.tabname+").field(_count('*')).where("+filt.join(',')+").group("+gby.join(',')+").toArray()");
  }
//
  this.toHTMLTable=function(){
    var table = newHTMLTable({id:"exploreTab"});
    var thead = newHTMLThead(table);
    var tr = thead.insertRow(0);
    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTH(x))});
    this.aggA.forEach((x)=>{tr.appendChild(newHTMLTD(x))});
    var body= newHTMLTBody(table);
    tr = body.insertRow(0);
    this.selColNames.forEach((x)=>{tr.appendChild(newHTMLTD('*'))});
    this.valA.forEach((x)=>{tr.appendChild(newHTMLTD(x,{id:'rcell'}))});
    return table;
  }
//Constructor:
}
