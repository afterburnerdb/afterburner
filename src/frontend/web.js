//HTML
function setAtts(obj,opts){
  Object.keys(opts).forEach((x)=>{obj.setAttribute(x,opts[x])});
}
function newHTMLDIV(opts){
  opts=opts||{};
  var div = document.createElement('div');
  setAtts(div,opts);
  return div;
}
function newHTMLTable(opts){
  opts=opts||{};
  var table=document.createElement('table');
  opts['id']= opts['id'] || "";
  opts['class']= opts['class'] || "table table-bordered table-condensed table-nonfluid";
  setAtts(table,opts);
  return table;
}
function newHTMLThead(table,opts){
  opts=opts||{};
  var thead = table.createTHead();
  opts['id']= opts['id'] || "";
  opts['class']= opts['class'] || "thead-default";
  setAtts(thead,opts);
  return thead;
}
function newHTMLTD(text,opts){
  opts=opts||{};
  var td = document.createElement('td');
  setAtts(td,opts);
  td.appendChild(document.createTextNode(""+text));
  return td;
}
function newHTMLTH(text,opts){
  opts=opts||{};
  var td = document.createElement('th');
  setAtts(td,opts);
  td.appendChild(document.createTextNode(""+text));
  return td;
}
function newHTMLTBody(table,opts){
  opts=opts||{};
  var tbody = table.createTBody();
  setAtts(tbody,opts);
  return tbody;
}

function newHTMLUL(opts){
  opts=opts||{};
  var ul = document.createElement('ul');
  setAtts(ul,opts);
  return ul;
}
function newHTMLA(text,opts){
  opts=opts||{};
  var a = document.createElement('a');
  setAtts(a,opts);
  a.appendChild(document.createTextNode(""+text));
  return a;
}
function newHTMLP(text,opts){
  opts=opts||{};
  var p = document.createElement('p');
  setAtts(p,opts);
  p.appendChild(document.createTextNode(""+text));
  return p;
}
function newHTMLLabel(things,opts){
  opts=opts||{};
  var label = document.createElement('label');
  setAtts(label,opts);
  label.appendChild(things);
  return label;
}
function newHTMLProgressBar(pbid,opts){
  opts=opts||{};
  opts['class']='progress';
  var div = document.createElement('div');
  setAtts(div,opts);
  var opts2={id:pbid,class:'progress-bar',role:'progressbar','aria-valuenow':'0','aria-valuemin':'0','aria-valuemax':'100',style:'width:0%'};
  var div2 = document.createElement('div');
  setAtts(div2,opts2);

  div.appendChild(div2);
  return div;
}

function newHTMLProgressBarGreenRed(ppct,opts){
  opts=opts||{};
  opts['class']='progress';
  var div = document.createElement('div');
  setAtts(div,opts);
  var opts2={class:'progress-bar progress-bar-success',role:'progressbar','aria-valuenow':'0','aria-valuemin':'0','aria-valuemax':'100',style:'width:'+ppct+'%'};
  var div2 = document.createElement('div');
  setAtts(div2,opts2);
  div.appendChild(div2);
  var opts2={class:'progress-bar progress-bar-danger',role:'progressbar','aria-valuenow':'0','aria-valuemin':'0','aria-valuemax':'100',style:'width:'+(100-ppct)+'%'};
  var div2 = document.createElement('div');
  setAtts(div2,opts2);
  div.appendChild(div2);
  return div;
}

function newHTMLContainer(opts){
  opts=opts||{};
  opts['class']= 'container';
  var div = document.createElement('div');
  setAtts(div,opts);
  return div;
}
function newHTMLRow(opts){
  opts=opts||{};
  opts['class']= 'row';
  var div = document.createElement('div');
  setAtts(div,opts);
  return div;
}
function newHTMLCol(size,width,opts){
  opts=opts||{};
  opts['class']='col-'+size+'-'+width;
  var div = document.createElement('div');
  setAtts(div,opts);
  return div;
}
function newHTMLH4(opts){
  opts=opts||{};
  var h4 = document.createElement('h4');
  setAtts(h4,opts);
  return h4;
}
function newHTMLH5(opts){
  opts=opts||{};
  var h5 = document.createElement('h4');
  setAtts(h5,opts);
  return h5;
}
function newHTMLBut(text,opts){
  opts=opts||{};
  opts['class']="btn dropdown-toggle " + (opts['class']||"");
  opts['type']="button";
  opts['data-toggle']="dropdown";
  var but = document.createElement('button');
  but.innerHTML =text;
  setAtts(but,opts);
  return but;
}
function newHTMLDD(title,items, opts,size){
  opts=opts||{};
  size=size||"";
  opts['class']='dropdown';
  var div = document.createElement('div');
  setAtts(div,opts);
  var but=newHTMLBut(title,{'class':'btn'+size});
  div.appendChild(but); 
//
  var ul = newHTMLUL({class:'dropdown-menu', role:'menu'});
  items.forEach((x)=> {
    var li = document.createElement('li');
    li.appendChild(newHTMLA(x));
    ul.appendChild(li);
  });
  div.appendChild(ul); 
  return div;
}
function newHTMLBR(){
  var br = document.createElement('br');
  return br;
}
function newHTMLInput(opts){
  opts=opts||{};
  var input = document.createElement('input');
  setAtts(input,opts);
  return input;
}
//
function clearElement(e){
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
}
function clearElementsById(list){
  list.forEach((x)=> clearElement(document.getElementById(x)));
}
//
function drawSchema(abutton,opts){
  var scons=document.getElementById("sconsole");
  clearElement(scons);
  scons.appendChild(daSchema.toHTMLTable(opts));
  $('.panel-collapse.in').collapse('hide');
  abutton.innerText='Hide tables';
  togSchema=hideSchema;
}
function hideSchema(abutton,opts){
  if(!inNode){
    scons=document.getElementById("sconsole");
    clearElement(scons);
  }
  abutton.innerText='Show tables';
  togSchema=drawSchema;
}
function togSchema(abutton,opts){
  drawSchema(abutton,opts);
}
//Explore
function exploreTable(tabname){
  if (typeof tabname == 'undefined')
    tabname= daSchema.tables[daSchema.tables.length-1].name;
  Ei= new Explore(tabname);
  var econs=document.getElementById("econsole");
  clearElement(econs);
  econs.appendChild(Ei.toHTMLTable());
  $('#exploreTab tbody').on("click","td",function(e){Ei.bcell(this)});
  $('#exploreTab thead').on("click","th",function(e){Ei.hcell(this)});
}
function cExploreTable(tabname){
  if (typeof tabname == 'undefined')
    tabname= daSchema.tables[daSchema.tables.length-1].name;
  CEi= new CExplore(tabname);
  var econs=document.getElementById("econsole");
  clearElement(econs);
  econs.appendChild(CEi.toHTMLTable());
  $('#exploreTab tbody').on("click","td",function(e){CEi.bcell(this)});
  $('#exploreTab thead').on("click","th",function(e){CEi.hcell(this)});
}

//Prettyrint sql
function ppSQLstr(sqlstr){
  sqlstr=sqlstr.replace(/\/\*CLOSED SQL\*\//g,'');
  sqlstr=sqlstr.replace(/\/\*OPENED SQL\*\//g,'');
  sqlstr=sqlstr.replace(/,/g,',\n\t');
  sqlstr=sqlstr.replace(/,\n\s*2/g,',2');
  sqlstr=sqlstr.replace(/monetdb_qid\d*/g,'materialed');
  var keyWords=['SELECT','FROM','JOIN','WHERE','FREE','HAVING','GROUP BY','ORDER BY','LIMIT','HAVING'];
  keyWords.forEach((x)=> {sqlstr=sqlstr.replace(new RegExp(x,'g'),"\n"+x)});
  var keyWords=['AND','[\s\t]OR'];
  keyWords.forEach((x)=> {sqlstr=sqlstr.replace(new RegExp(x,'g'),"\t\n"+x)});

  sqlstr=sqlstr.replace(/^[\s\t]*[\n|\r|\r\n]/gm,'');
  return sqlstr;
}

