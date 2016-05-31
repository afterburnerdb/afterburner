///////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function strdate_to_int(strdate){
  var dateA=strdate.split('-');
  return (new Date(Date.UTC(dateA[0],dateA[1]-1,dateA[2]))).getTime()/(1000*60*60*24)|0;
}
function int_to_strdate(days){
  var dte;
  (dte=new Date(0)).setUTCMilliseconds((days*24*60*60*1000))
  var strdate=dte.getUTCFullYear() +"-";
  var month=dte.getUTCMonth()+1;
  strdate= (month>9)? (strdate+month+"-"): (strdate+"0"+month+"-");
  var dayof=dte.getUTCDate();
  return (dayof>9)? (strdate+dayof): (strdate+"0"+dayof);
}
function strchar_to_int(strchar){
    return strchar.charCodeAt(0);
}
function int_to_strchar(charcode){
    return String.fromCharCode(charcode);
}
function printSchema(){
  if(inNode){
    console.log(daSchema.toString());
  } else {
    scons=document.getElementById("sconsole");
    clearElement(scons);
    scons.appendChild(daSchema.toHTMLTable());
  }
}
function strToString(str){
  str=str|0;
  ret="";
  var i = i|0;
  while (mem8[(str+i)|0]){
    ret+=String.fromCharCode(mem8[(str+i)|0]|0);
    i=(i+1)|0;
  }
  return ret;
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting common');
  module.exports.printSchema=printSchema;
  global.strdate_to_int=strdate_to_int;
  global.int_to_strdate=int_to_strdate;
  global.strchar_to_int=strchar_to_int;
  global.int_to_strchar=int_to_strchar;

}else delete module;
///////////////////////////////////////////////////////////////////////////////
