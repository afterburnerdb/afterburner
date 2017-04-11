function generate_be_views(){
  var q2mav={
    '1' :[query1a_mav()],
    '2' :[query2a_mav(),query2b_mav()],
    '3' :[query3a_mav(),query3b_mav(),query3c_mav()],
    '4' :[query4a_mav()],
    '5' :[query5a_mav(),query5b_mav()],
    '6' :[query6a_mav(),query6b_mav(),query6c_mav()],
    '7' :[query7a_mav()],
    '12':[query12a_mav(),query12b_mav()],
    '14':[query14a_mav()],
    '17':[query17a_mav(),query17b_mav()],
    '20':[query20a_mav()],
    '21':[query21a_mav(),query21b_mav()]
  }

  var queries=['1','2','3','4','5','6','7','12','14','17','20','21'];
  var abc=['a','b','c'];
  var scons=document.getElementById("sconsole");
  clearElement(scons);
  queries.forEach((x)=>{
    var i=0;
    q2mav[x].forEach((xx)=>{
      var createOne='CREATE TABLE mav'+x+ abc[i++] +' AS ' +xx.toOpenSQL() +'with data;\n\n';
      scons.appendChild(newHTMLP(createOne));
      console.log(createOne);
    })
  });
}
function generate_fe_queries(){
  var q2mav={
    '1' :[query1a_mav()],
    '2' :[query2a_mav(),query2b_mav()],
    '3' :[query3a_mav(),query3b_mav(),query3c_mav()],
    '4' :[query4a_mav()],
    '5' :[query5a_mav(),query5b_mav()],
    '6' :[query6a_mav(),query6b_mav(),query6c_mav()],
    '7' :[query7a_mav()],
    '12':[query12a_mav(),query12b_mav()],
    '14':[query14a_mav()],
    '17':[query17a_mav(),query17b_mav()],
    '20':[query20a_mav()],
    '21':[query21a_mav(),query21b_mav()]
  }
  var q2fsql={
    '1' :query1_fsql,
    '2' :query2_fsql,
    '3' :query3_fsql,
    '4' :query4_fsql,
    '5' :query5_fsql,
    '6' :query6_fsql,
    '7' :query7_fsql,
    '12':query12_fsql,
    '14':query14_fsql,
    '17':query17_fsql,
    '20':query20_fsql,
    '21':query21_fsql
  }

  var queries=['1','2','3','4','5','6','7','12','14','17','20','21'];
  var abc=['a','b','c'];
  var scons=document.getElementById("sconsole");
  clearElement(scons);
  queries.forEach((x)=>{
    var i=0;
    var qfsql=q2fsql[x];
    q2mav[x].forEach((xx)=>{
      xx.materialize_be();
      var consql=qfsql(xx).toConpensatingSQL();
      consql=consql.replace(/STMT\d+/g, 'mav'+x+abc[i]);
      consql="\n/*"+'mav'+x+abc[i++]+"*/\n"+consql+";\n";
      scons.appendChild(newHTMLP(consql));
      console.log(consql);
    });
  });
}
