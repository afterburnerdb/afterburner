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
function newHTMLTH(text,opts){
  opts=opts||{};
  var td = document.createElement('th');
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
function newHTMLH4(opts){
  opts=opts||{};
  var h4 = document.createElement('h4');
  setAtts(h4,opts);
  return h4;
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
function newHTMLDD(items, opts){
  opts=opts||{};
  opts['class']='dropdown';
  var div = document.createElement('div');
  setAtts(div,opts);
  var but=newHTMLBut('Select!',{'class':'btn-sm'});
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
  Ei= new Explore(tabname);
  var econs=document.getElementById("econsole");
  clearElement(econs);
  econs.appendChild(Ei.toHTMLTable());
  $('#exploreTab tbody').on("click","td",function(e){Ei.bcell(this)});
  $('#exploreTab thead').on("click","th",function(e){Ei.hcell(this)});
}
