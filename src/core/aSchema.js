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
     //printSchema();
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
    if(tabname[0]=="@")
      tabname=tabname.substring(1);
    if (tabname.indexOf(" ")>0)
       tabname=tabname.substring(0, tabname.indexOf(" "))
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

  this.toHTMLTable = function(opts) {
    opts=opts||{};
    var pg=newHTMLDIV({class:"panel-group", id:"accordion", role:"tablist", 'aria-multiselectable':"true"});
    for (var i=0;i<this.tables.length;i++){
      var ppd=newHTMLDIV({class:"panel panel-default"});
      var ph=newHTMLDIV({class:"panel-heading"});
      var h4=newHTMLH4({class:"panel-title"});
      var a;
      if (opts['be']){
         a=newHTMLA(this.tables[i].name,{role:"button", 'data-toggle':"collapse", 'data-parent':"#accordion", 'aria-expanded':"true",href:"#schmclps"+i, 'aria-controls':"schmclps"+i});
        h4.appendChild(a);
        a=newHTMLA("@"+this.tables[i].loc,{role:"button", style:'float:right;'});
        h4.appendChild(a);
      }else{
        a=newHTMLA(this.tables[i].name+" ("+this.tables[i].numrows+" rows)",{role:"button", 'data-toggle':"collapse", 'data-parent':"#accordion", 'aria-expanded':"true",href:"#schmclps"+i, 'aria-controls':"schmclps"+i});
        h4.appendChild(a);
      }
      if (opts['exp']){
        a=newHTMLA("explore ",{role:"button", style:'float:right;', onclick:"prepExplore();exploreTable('"+this.tables[i].name+"')"});
        h4.appendChild(a);
      }
      ph.appendChild(h4);
      ppd.appendChild(ph);

      var pcc=newHTMLDIV({id:"schmclps"+i,class:"panel-collapse collapse in", role:"tabpanel",'aria-labelledby':"headingOne"});
      var pb=newHTMLDIV({class:"panel-body"});
      var htmlTab=newHTMLTable({class:"table table-bordered table-condensed table-nonfluid table-striped table-hover"});
      var thead = newHTMLThead(htmlTab);
      var tbody = newHTMLTBody(htmlTab);
      var tr = thead.insertRow(0);
      tr.appendChild(newHTMLTH("Name"));
      tr.appendChild(newHTMLTH("Type"));
      for (var ii=0;ii<this.tables[i].numcols;ii++){
        var tr = tbody.insertRow(-1);
        tr.appendChild(newHTMLTD(this.tables[i].colnames[ii]));
        if (this.tables[i].coltypes[ii]==0){
          tr.appendChild(newHTMLTD("Int"));
        } else if (this.tables[i].coltypes[ii]==1){
          tr.appendChild(newHTMLTD("Float"));
        } else if (this.tables[i].coltypes[ii]==2){
          tr.appendChild(newHTMLTD("String"));
        } else if (this.tables[i].coltypes[ii]==3){
          tr.appendChild(newHTMLTD("Date"));
        } else if (this.tables[i].coltypes[ii]==4){
          tr.appendChild(newHTMLTD("Char"));
        } else{
          td.appendChild(document.createTextNode("unknown type"));
        }
      }
      pb.appendChild(htmlTab);


      pcc.appendChild(pb);
      ppd.appendChild(pcc);
      pg.appendChild(ppd);
    }
    if (this.tables.length==0){
      var ph=newHTMLDIV({class:"panel-heading",style:"background-color: orange!important"});
      var h4=newHTMLH4({class:"panel-title"});
      var ppd=newHTMLDIV({class:"panel panel-default"});
      var a=newHTMLA("No tables loaded yet.. Load data! first..",{role:"button", 'data-toggle':"collapse", 'data-parent':"#accordion", 'aria-expanded':"true", 'aria-controls':"collapseOne"});
      h4.appendChild(a);
      ph.appendChild(h4);
      ppd.appendChild(ph);
      pg.appendChild(ppd);
    }
    return pg;
  };
};
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting aSchema');
  module.exports=aSchema;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
