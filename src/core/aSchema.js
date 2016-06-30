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
  this.getPeerAttributes = function(colname, qcontext){
    if (typeof colname == 'string') colname=colname.toLowerCase();
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qcontext.indexOf(this.tables[i].name) > -1)
          return this.tables[i].getColNames();
  }
  this.getTable = function(tabname){
    tabname=tabname.toLowerCase();
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].name.toLowerCase() == tabname)
        return this.tables[i];
  }
  this.getParent = function(colname, qcontext){
    if (typeof colname == 'string') colname=colname.toLowerCase();
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qcontext.indexOf(this.tables[i].name) > -1)
          return this.tables[i].name;
        
  }
  this.getColTypeByName = function(colname,qcontext){
    if (typeof qcontext == 'undefined'){
      console.log('qcontext is undefined');
      return -1;
    }
    if ((colname != null) && typeof colname == 'string' && colname.indexOf('pb')==0)
      return 1;
    if (typeof colname == 'string') colname=colname.toLowerCase();
    for (var i=0;i<this.tables.length;i++){
      var ret=this.tables[i].getColTypeByName(colname);
      if (ret > -1){
        if (qcontext.indexOf(this.tables[i].name) > -1){
          return ret;
        }
      }
    }
    return -1;
  }
  this.getColLenByName = function(colname,qcontext){
    if (typeof colname == 'string') colname=colname.toLowerCase();
     for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColTypeByName(colname) > -1)
        if (qcontext.indexOf(this.tables[i].name) > -1)
          return this.tables[i].numrows;
  }
  this.getColPByName = function(colname,qcontext){
    if (typeof colname == 'string') colname=colname.toLowerCase();
    for (var i=0;i<this.tables.length;i++)
      if (this.tables[i].getColPByName(colname) > -1)
        if (qcontext.indexOf(this.tables[i].name) > -1)
          return this.tables[i].getColPByName(colname);
  }
  this.getTabSizeByName = function(tabname){
    tabname=tabname.toLowerCase();
    return daSchema.getTable(tabname).numrows;
  }
  this.bindCol = function(colname,qcontext){
    if ((colname != null) && typeof colname == 'string' && colname.indexOf('pb')==0){
      console.log('@binCol..colname:'+colname);
      return colname.substring(2,colname.length);
    }
    if (typeof colname == 'string') colname=colname.toLowerCase();
    ctype=this.getColTypeByName(colname, qcontext)
    cptr=this.getColPByName(colname,qcontext)
    if (ctype==0 || ctype==2 || ctype==3 || ctype==4)
      return '(mem32[(('+cptr+' +(trav_'+this.getParent(colname,qcontext)+'<<2))|0)>>2]|0)';
    if (ctype==1)
      return '+(memF32[(('+cptr+' +(trav_'+this.getParent(colname,qcontext)+'<<2))|0)>>2])';
  }
  this.obindCol = function(colname,qcontext){
    if (typeof colname == 'string') colname=colname.toLowerCase();
    ctype=this.getColTypeByName(colname, qcontext)
    cptr=this.getColPByName(colname,qcontext)
    if (ctype==0 || ctype==2 || ctype==3 || ctype==4)
      return '(mem32[(('+cptr+' +(otrav_'+this.getParent(colname,qcontext)+'<<2))|0)>>2]|0)';
    if (ctype==1)
      return '+(memF32[(('+cptr+' +(otrav_'+this.getParent(colname,qcontext)+'<<2))|0)>>2])';
  }

  this.bindColComp = function(col1,col2,op, qcontext){
    colb1=this.bindCol(col1,qcontext);
    colb2=this.bindCol(col2,qcontext);
    ctyp1=this.getColTypeByName(col1, qcontext);
    ctyp2=this.getColTypeByName(col2, qcontext);
    if (ctyp1==0 || ctype1==1 || ctyp1==3)
      return colb1 + '==' + colb2;
    else
      return 'mystrcomp(colb1,colb2)'
  }
  this.toHTMLTable = function() {
    var table=document.createElement('table');
    table.setAttribute('class',"table");

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
      table.appendChild(trname);

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
      table.appendChild(trtype);

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
