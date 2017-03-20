var inNode=(typeof window == 'undefined' );
var inBrowser=!inNode;
var newTable;
var indices;
var orders;
var ABi;
var ptr2srt = ptr2srt |0;


if (inNode){
  console.log('Running in Node');
  var aSchema=require('aSchema');
  var Afterburner=require('afterburner.js').Afterburner;
  global.queryResult=require('queryResult.js');
  ABi = new Afterburner();
  FSi = new fsql2sql();
  global.daSchema = new aSchema();
  global.ABi=ABi;
  printSchema=require('common.js').printSchema;
  alert=function(x){console.log(x);};
}else{

  daSchema = new aSchema();
  console.log('Running in Browser');
}

function runMyAdhocCode(code){
    new Function('ignore', code)();
}

function showVal(val) {
    document.getElementById("console").innerHTML = "slider val:" + val + "";
}

function createTableControls(schemaDefT)
{
    var schemaDefA=schemaDefT.split(';');
    var tableControl=document.createElement("div");
    schemaNameLabel = document.createElement("label");
    schemaNameLabel.innerHTML=schemaDefA[0];

    tableControl.appendChild(schemaNameLabel);
    for( var i=1; i<(schemaDefA.length-1); i++) {
         tableControl.appendChild(createTableControl(schemaDefA[i]));
    }
   return tableControl;
}

function createTableControl(tableDefT)
{
    var tableControl=document.createElement("div");
    tabNameLabel = document.createElement("label");
    tabNameLabel.innerHTML=tableDefT;

    tableControl.appendChild(tabNameLabel);

    pickTableN = document.createElement("input");
    pickTableN.setAttribute('type', 'radio');
    pickTableN.setAttribute('id', 'tabNorth');
    pickTableN.setAttribute('name', 'pickTableN');
    pickTableN.setAttribute('onchange','addTableToQ(0,\''+tableDefT+'\')');

    pickTableS = document.createElement("input");
    pickTableS.setAttribute('type', 'radio');
    pickTableS.setAttribute('id', 'tabWest');
    pickTableS.setAttribute('name', 'pickTableS');
    pickTableS.setAttribute('onchange','addTableToQ(1,\''+tableDefT+'\')');


    tableControl.appendChild(pickTableN);
    tableControl.appendChild(pickTableS);

    return tableControl;
}
function clearElement(e){
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
}

function addTableToQ(orientation,tableDefT){
    var element;
    if (orientation === 0){
      elementa = document.getElementById("divNorth");
      elementb = document.getElementById("divSouth");
    }
    else{ 
      elementa = document.getElementById("divWest");
      elementb = document.getElementById("divEast");
    }

    clearElement(elementa);
    clearElement(elementb);
    elementa.appendChild(createFilterControls(tableDefT));
    elementb.appendChild(createSelectControls(tableDefT));
}

function createSchemaControl(schemaDefT)
{
    var schemaDefA=schemaDefT.split(';');
    var schemaControl=document.createElement("div");
    schemaNameLabel = document.createElement("label");
    schemaNameLabel.innerHTML=schemaDefA[0];

    schemaControl.appendChild(schemaNameLabel);
    for( var i=1; i<schemaDefA.length; i++) {
       schemaControl.appendChild(createTabControl(schemaDefA[i]));
    }
   return schemaControl;
}

function createSelectControls(tableDefT){
    var tabDefA=tableDefT.split(',');
    var tableControl=document.createElement("div");
    tabNameLabel = document.createElement("label");
    tabNameLabel.innerHTML=tabDefA[0];

    tableControl.appendChild(tabNameLabel);
    for( var i=1; i<tabDefA.length; i++){
       tableControl.appendChild(createSelectControl(tabDefA[i]));
    }
   return tableControl;
}

function createFilterControls(tableDefT){
    var tabDefA=tableDefT.split(',');
    var tableControl=document.createElement("div");
    tabNameLabel = document.createElement("label");
    tabNameLabel.innerHTML=tabDefA[0];

    tableControl.appendChild(tabNameLabel);
    for( var i=1; i<tabDefA.length; i++){
       tableControl.appendChild(createFilterControl(tabDefA[i]));
    }
    return tableControl;
}
function createSelectControl(attrDefT){

    var selectControl=document.createElement("div");
    attrNameLabel = document.createElement("label");
    attrNameLabel.innerHTML=attrDefT;
    selectControl.appendChild(attrNameLabel);

    var attributes = [];

    elem = document.createElement("label");
    elem.innerHTML='min';
    selectControl.appendChild(elem);

    elem = document.createElement("input");
    elem.setAttribute('type', 'radio');
    elem.setAttribute('id', 'min');
    elem.setAttribute('name', 'filter'+attrDefT);
    elem.setAttribute('onchange','showVal(this.value);');
    selectControl.appendChild(elem);

    elem = document.createElement("label");
    elem.innerHTML='max';
    selectControl.appendChild(elem);

    elem = document.createElement("input");
    elem.setAttribute('type', 'radio');
    elem.setAttribute('name', 'filter'+attrDefT);
    elem.setAttribute('id', 'max');
    elem.setAttribute('onchange','showVal(this.value);');
    selectControl.appendChild(elem);

    elem = document.createElement("label");
    elem.innerHTML='count';
    selectControl.appendChild(elem);

    elem = document.createElement("input");
    elem.setAttribute('type', 'radio');
    elem.setAttribute('name', 'filter'+attrDefT);
    elem.setAttribute('id', 'count');
    elem.setAttribute('onchange','showVal(this.value);');
    selectControl.appendChild(elem);

    elem = document.createElement("label");
    elem.innerHTML='sum';
    selectControl.appendChild(elem);

    elem = document.createElement("input");
    elem.setAttribute('type', 'radio');
    elem.setAttribute('name', 'filter'+attrDefT);
    elem.setAttribute('id', 'sum');
    elem.setAttribute('onchange','showVal(this.value);');
    selectControl.appendChild(elem);

    elem = document.createElement("label");
    elem.innerHTML='avg';
    selectControl.appendChild(elem);

    elem = document.createElement("input");
    elem.setAttribute('type', 'radio');
    elem.setAttribute('name', 'filter'+attrDefT);
    elem.setAttribute('id', 'avg');
    elem.setAttribute('onchange','showVal(this.value);');
    selectControl.appendChild(elem);

    selectControl.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      this.remove();
      return false;
      }, false);

    return selectControl; 
}

function createFilterControl(attrDefT){
    var filterControl=document.createElement("div");
    attrNameLabel = document.createElement("label");
    attrNameLabel.innerHTML=attrDefT;

    var attributes = [];

    attributes[0] = document.createElement("input");
    attributes[0].setAttribute('type', 'range');
    attributes[0].setAttribute('min', 0);
    attributes[0].setAttribute('max', 10000);
    attributes[0].setAttribute('oninput','tempFluent(this.value);');
 
    attributes[1] = document.createElement("label");
    attributes[1].innerHTML='&gt';

    attributes[2] = document.createElement("input");
    attributes[2].setAttribute('type', 'radio');
    attributes[2].setAttribute('id', 'gt');
    attributes[2].setAttribute('name', 'filter'+attrDefT);
    attributes[2].setAttribute('onchange','showVal(this.value);');

    attributes[3] = document.createElement("label");
    attributes[3].innerHTML='&lt';

    attributes[4] = document.createElement("input");
    attributes[4].setAttribute('type', 'radio');
    attributes[4].setAttribute('name', 'filter'+attrDefT);
    attributes[4].setAttribute('id', 'lt');
    attributes[4].setAttribute('onchange','showVal(this.value);');

    attributes[5] = document.createElement("label");
    attributes[5].innerHTML='=';

    attributes[6] = document.createElement("input");
    attributes[6].setAttribute('type', 'radio');
    attributes[6].setAttribute('name', 'filter'+attrDefT);
    attributes[6].setAttribute('id', 'eq');
    attributes[6].setAttribute('onchange','showVal(this.value);');

    attributes[7] = document.createElement("label");
    attributes[7].innerHTML='join';

    attributes[8] = document.createElement("input");
    attributes[8].setAttribute('type', 'radio');
    attributes[8].setAttribute('name', 'filter'+attrDefT);
    attributes[8].setAttribute('id', 'join');
    attributes[8].setAttribute('onchange','showVal(this.value);');

    filterControl.appendChild(attrNameLabel);
    filterControl.appendChild(attributes[0]);
    filterControl.appendChild(attributes[1]);
    filterControl.appendChild(attributes[2]);
    filterControl.appendChild(attributes[3]);
    filterControl.appendChild(attributes[4]);
    filterControl.appendChild(attributes[5]);
    filterControl.appendChild(attributes[6]);
    filterControl.appendChild(attributes[7]);
    filterControl.appendChild(attributes[8]);

    filterControl.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      this.remove();
      return false;
      }, false);

    return filterControl; 
}


function get_index(colname){
  var ret=indices[colname];
  if (!ret){
    return (indices[colname]=create_index(colname));
  } else{
    return ret;
  }
}

function create_index(colname, tabname){
  var len = len|0;
  ptr=daSchema.getColPByName(colname,[tabname]);
  type=daSchema.getColTypeByName(colname,[tabname]);
  len=daSchema.getColLenByName(colname,[tabname]);
  ht=new Map();
  if (type ==0 || type==3 || type==4){
    for (var i=0|0;i<len;i++){
      if (tmp=ht.get( numStore32[(ptr+i)|0] )){
        tmp.push(i);
      } else{
       ht.set(numStore32[(ptr+i)|0],[i]);
      }
    }
  }
  else if (type==1){
    for (var i=0|0;i<len;i++){
      if (tmp=ht.get( numStoreF32[(ptr+i)|0] )){
        tmp.push(i);
      } else {
       ht.set(numStoreF32[(ptr+i)|0],[i]);
      }
    }
  }
  else if (type==2){
    for (var i=0|0;i<len;i++){
      if (tmp=ht.get(strToString(numStoreF32[(ptr+i)|0]) )){
        tmp.push(i);
      } else {
        ht.set(strToString(numStoreF32[(ptr+i)|0]),[i]);
      }
    }
  } else {
    alert("unknown type cannot build ht");
  }
  return ht;
}

function get_order(colname){
  var ret=orders[colname];
  if (!ret)  {
    return (orders[colname]=create_order(colname));
  } else {
    return ret;
  }
}
function mycomp(a,b){
  a=a|0;
  b=b|0;
  return numStore32[(ptr2srt+a)|0] - numStore32[(ptr2srt+b)|0];
}
function mycompF(a,b){
  a=+(a);
  b=+(b);
  return numStoreF32[(ptr2srt+a)|0] - numStoreF32[(ptr2srt+b)|0];
}
function mycompstr(str1,str2){
  var i=i|0;
  var str1=str1|0;
  var str2=str2|0;
  var str1=numStore32[(ptr2srt+a)|0];
  var str2=numStore32[(ptr2srt+b)|0];
  while (
        ((mem8[(str1+i)|0]==mem8[(str2+i)|0]) && mem8[(str1+i)|0 ] && mem8[(str2+i)|0])
        ) i=(i+1)|0;
  return (mem8[(str1+i)|0]-mem8[(str2+i)|0]);
 }

function create_order(colname,tabname){
  ptr=daSchema.getColPByName(colname,[tabname]);
  type=daSchema.getColTypByName(colname,[tabname]);
  len=daSchema.getColLenByName(colname,[tabname]);
  order= new Array(len);
  
  fbody=" function mycomp(a,b) {return ";
  for (c=0;c<len;c++){
    order[c]=c;
  }
  ptr2srt=ptr;
  if (type ==0) 
    order.sort(mycomp);
  else if (type == 1)
    order.sort(mycompF);
  else if (type == 2)
    order.sort(mycompstr);
  else 
    alert("unknown type @create_order" + type);
  return order;
}





function mystrcmplit( str1 , str2){
  var i= i|0;
  do{
     if (mem8[(str1+i)]!=str2.charCodeAt(i) )
        return ( mem8[(str1+i)] == 0) && isNaN(str2.charCodeAt(i)) ;
     i++;
  }while (true);
}

function loadTables(tabToLoad){
if (inNode){
  var aTable=require('aTable.js');
  var dataSource=require('dataSource.js');
  for (var i=0;i<tabToLoad.length;i++){
    var ds = new dataSource(tabToLoad[i]);
    newTable= new aTable(ds);
  }
  printSchema();
}
}

if(inNode){
  module.exports.daSchema=daSchema;
}
