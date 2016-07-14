//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function aSchema(){
  this.tables=[];
  this.addTable = function (table){
    this.tables.push(table);
     if(inNode)                                        
       printSchema=require('./common.js').printSchema; 
     printSchema();
  }
  this.toString = function(){
    ret="schema;"
    for (var i=0;i<this.tables.length;i++)
      ret=ret+this.tables[i].getColNames()+";";
    return ret;
  }
  this.getChildAttributes = function(tabname){
    tabname=tabname.toLowerCase();
    return this.getTable(tabname).getColNamesA();
  }
  this.getPeerAttributes = function(colname, qtabs){
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qtabs.indexOf(this.tables[i].name) > -1)
          return this.tables[i].getColNames();
    badFSQL("@getPeerAttributes","could not bind:" + colname);
  }
  this.getTable = function(tabname){
    tabname=tabname.toLowerCase();
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].name.toLowerCase() == tabname)
        return this.tables[i];
  }
  this.getParent = function(colname, qtabs){
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qtabs.indexOf(this.tables[i].name) > -1){
              return this.tables[i].name;
        }
    badFSQL("@getParent","could not bind:" + colname);
  }
  this.getColTypeByName = function(colname,qtabs){
    if ((colname != null) && typeof colname == 'string' && colname.indexOf('pb')==0){
      if (colname.indexOf('pb$')==0)
        return 2;
      else 
        return 1;
    }
    for (var i=0;i<this.tables.length;i++){
      var ret=this.tables[i].getColTypeByName(colname);
      if (ret > -1){
        if (qtabs.indexOf(this.tables[i].name) > -1){
          return ret;
        }
      }
    }
    badFSQL("@getColTypeByName","couldnot bind:" + colname + " qtabs:" + qtabs);
    return -1;
  }
  this.getColLenByName = function(colname,qtabs){
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qtabs.indexOf(this.tables[i].name) > -1)
          return this.tables[i].numrows;
    badFSQL("@getColLenByName","could not bind:" + colname);
  }
  this.getColPByName = function(colname,qtabs){
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColPByName(colname) > -1)
        if (qtabs.indexOf(this.tables[i].name) > -1)
          return this.tables[i].getColPByName(colname);
  }
  this.getTabSizeByName = function(tabname){
    tabname=tabname.toLowerCase();
    var table2=daSchema.getTable(tabname);
    if (typeof table2 == 'undefined'){
      badFSQL("@getTabSizeByName","could not bind:" + tabname);
    }
    return table2.numrows;
  }

  this.toHTMLTable = function() {
    var table=document.createElement('table');
    table.setAttribute('class',"table table-bordered table-condensed table-nonfluid");

    var thead = table.createTHead();
    thead.setAttribute('class',"thead-default");
    var tr = thead.insertRow(0);

    var th = document.createElement('th');
    th.appendChild(document.createTextNode('Table Name'));
    tr.appendChild(th);
    var th = document.createElement('th');
    th.appendChild(document.createTextNode('Columns'));
    th.setAttribute('colspan', 100);
    tr.appendChild(th);

    thead.appendChild(tr);
    var tbody = table.createTBody();

    for (var i=0;i<this.tables.length;i++){

      var trname = document.createElement('tr');
      var trtype = document.createElement('tr');
      
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(""+ this.tables[i].name));
      trname.appendChild(td);
 
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(""));
      trtype.appendChild(td);

      for (var ii=0;ii<this.tables[i].numcols;ii++){
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(""+this.tables[i].colnames[ii]));
        trname.appendChild(td);
      }
      tbody.appendChild(trname);

      for (var ii=0;ii<this.tables[i].numcols;ii++){
        var td = document.createElement('td');
          if (this.tables[i].coltypes[ii]==0){
            td.appendChild(document.createTextNode("Int"));
          } else if (this.tables[i].coltypes[ii]==1){
            td.appendChild(document.createTextNode("Float"));
          } else if (this.tables[i].coltypes[ii]==2){
            td.appendChild(document.createTextNode("String"));
          } else if (this.tables[i].coltypes[ii]==3){
            td.appendChild(document.createTextNode("Date"));
          } else if (this.tables[i].coltypes[ii]==4){
            td.appendChild(document.createTextNode("Char"));
          } else{
            alert("unknown type");
          }
        trtype.appendChild(td);
      }
      tbody.appendChild(trtype);

    }
    return table;
  };
};
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting aSchema');
  module.exports=aSchema;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
