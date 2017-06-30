function calcPearson(vari1,vari2,covar){
  var pearson=covar / (Math.sqrt(vari1) * Math.sqrt(vari2));
  console.log("@calcPearson::vari1:"+vari1+", vari2:"+vari2+", covar:"+covar+", pearson:"+pearson);
  return pearson;
}
