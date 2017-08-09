function calcPearson(vari1,vari2,covar){
  var pearson=covar / (Math.sqrt(vari1) * Math.sqrt(vari2));
  return pearson;
}
