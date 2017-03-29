//HTML
function setAtts(obj,opts){
  Object.keys(opts).forEach((x)=>{obj.setAttribute(x,opts[x])});
}
function newHTMLTable(opts){
  opts=opts||{};
  var table=document.createElement('table');
  opts['id']= opts['id'] || "";
  opts['class']= opts['class'] || "table table-bordered table-condensed table-nonfluid";
  setAtts(table,opts);
 // Object.keys(opts).forEach((x)=>{table.setAttribute(x,opts[x])});
  return table;
}
function newHTMLThead(table,opts){
  opts=opts||{};
  var thead = table.createTHead();
  opts['id']= opts['id'] || "";
  opts['class']= opts['class'] || "thead-default";
  //Object.keys(opts).forEach((x)=>{thead.setAttribute(x,opts[x])});
  setAtts(thead,opts);
  return thead;
}
function newHTMLTD(text,opts){
  opts=opts||{};
  var td = document.createElement('td');
  //Object.keys(opts).forEach((x)=>{td.setAttribute(x,opts[x])});
  setAtts(td,opts);
  td.appendChild(document.createTextNode(""+text));
  return td;
}
function newHTMLTBody(table,opts){
  opts=opts||{};
  var tbody = table.createTBody();
  //Object.keys(opts).forEach((x)=>{tbody.setAttribute(x,opts[x])});
  setAtts(tbody,opts);
  return tbody;
}

function newHTMLUL(opts){
  opts=opts||{};
  var ul = document.createElement('ul');
  //Object.keys(opts).forEach((x)=>{ul.setAttribute(x,opts[x])});
  setAtts(ul,opts);
  return ul;
}
function newHTMLA(text,opts){
  opts=opts||{};
  var a = document.createElement('a');
  //Object.keys(opts).forEach((x)=>{a.setAttribute(x,opts[x])});
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

function newHTMLProgressBar(pbid,opts){
  opts=opts||{};
  opts['class']='progress';
  var div = document.createElement('div');
  setAtts(div,opts);
  var opts2={id:pbid,class:'progress-bar',role:'progressbar','aria-valuenow':'0','aria-valuemin':'0','aria-valuemax':'100',style:'width:0%'};
  var div2 = document.createElement('div');
  setAtts(div2,opts2);

  div.appendChild(div2);
//  div.appendChild(newHTMLA(text));
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
//
function drawSchema(abutton){
  printSchema();
  abutton.innerText='Hide tables';
  togSchema=hideSchema;
}
function hideSchema(abutton){
  unPrintSchema();
  abutton.innerText='Show tables';
  togSchema=drawSchema;
}
function togSchema(abutton){
  drawSchema(abutton);
}

