//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  var module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
unique_qr_id=0;
function queryResult(tempsptr) {
////
    this.name = "qr" + unique_qr_id++;
    this.numrows = -1;
    this.numcols = 0;
    this.colnames = [];
    this.colptrs = 0;
    this.cols = [];
    this.coltypes = [];
    this.tempsptr=tempsptr||0;
////  
    this.addCol3 = function(colname,col,coltype) {
      this.numcols++;
      this.colnames.push(colname);
      this.cols.push(col);
      this.coltypes.push(coltype);
    };
    this.addCol2 = function(colname,coltype) {
      this.numcols++;
      this.colnames.push(colname);
      this.coltypes.push(coltype);
    };
   
    this.setsize = function(size) {
      this.numrows=size;
    };

    this.gulp = function(value){
        value=value|0;
        mem32[(temps+(this.tempsptr<<2))>>2]=value;
        this.tempsptr= (this.tempsptr + 1 )|0;
    };

    this.transpose = function(toSort){
      this.numrows=this.tempsptr/this.numcols;
      for (c=0;c<this.numcols;c++)
        this.cols.push(malloc(this.numrows<<2));
      if (!toSort){
        for (var r=0;r<this.numrows;r++){
          for (var c=0;c<this.numcols;c++){
            mem32[(this.cols[c] + (r<<2))>>2]=
            mem32[(temps+(((r * this.numcols) + c)<<2))>>2];
          }
        }
      } else{
        var orderA=this.sort(toSort);
        for (var r=0;r<this.numrows;r++){
          for (var c=0;c<this.numcols;c++){
            mem32[(this.cols[c] + (r<<2))>>2]=
              mem32[(temps+(((orderA[r] * this.numcols) + c)<<2))>>2];

          }
        }
      }       
    };
    this.sort = function(toSort) {
        fbody="{return ";
        var orderAB32;
        if(!inNode && navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
          orderAB32= new Array(this.numrows); 
        } else {
          var orderAB= new ArrayBuffer(this.numrows<<2);
          orderAB32= new Int32Array(orderAB);
        }
        var c=c|0
        for (c=0;c<this.numrows;c++){
          orderAB32[c]=c;
        }
        var a=a|0;
        for (a=0;a<toSort.length;a++){
            sign="+";osgn="-";
            if (typeof toSort[a] == 'string'){
              if (toSort[a][0]=='-'){
                sign="-";osgn="+";
              }
              toSort[a]=toSort[a].substring(1,toSort[a].length);
              toSort[a]=this.colnames.indexOf(toSort[a]);
            }
            else{
               if (toSort[a] < 0){
                sign="-";osgn="+";
                toSort[a]=-toSort[a];
              }
            }
            if (toSort[a]<0 || toSort[a]>this.numcols)
              alert("cant sort on this colname :" +toSort[a]) ;
            last= ((a+1)==toSort.length);
             if (this.coltypes[toSort[a]] == 1) axr="(memF32"; else axr= "(mem32";
             if ((this.coltypes[toSort[a]] == 0)  ||
                (this.coltypes[toSort[a]] == 1)  ||
                (this.coltypes[toSort[a]] == 3))  {
               axr=  "(mem32";
               if (last){
                 fbody+="("+sign+axr+"[(temps + (((a*"+this.numcols+")+"+toSort[a]+")<<2))>>2])";
                 fbody+=    osgn+axr+"[(temps + (((b*"+this.numcols+")+"+toSort[a]+")<<2))>>2]))";
               }else{
                 fbody+="(tmp=("
                 fbody+=    sign+axr+"[(temps + (((a*"+this.numcols+")+"+toSort[a]+")<<2))>>2])";
                 fbody+=    osgn+axr+"[(temps + (((b*"+this.numcols+")+"+toSort[a]+")<<2))>>2])";
                 fbody+="))?tmp:"
               }
             } else if (this.coltypes[toSort[a]] == 2){
               axr=  "";
               if (last){
                  fbody+="mystrcmp(mem8[temps+ (a*"+ this.numcols+")+" +toSort[a]+"],";
                  fbody+="mem8[temps + (b*"+ this.numcols+")+" +toSort[a]+"])" ;
                }else{
                  fbody+="(tmp=("
                  fbody+="mystrcmp(mem8[temps+ (a*"+ this.numcols+")+" +toSort[a]+"],";
                  fbody+="mem8[temps + (b*"+ this.numcols+")+" +toSort[a]+"])" ;
                  fbody+="))?tmp:"
                }
              }
              else 
                alert("unkown type @qr.sort type:"+this.coltypes[toSort[a]]+" toSort[a]:"+toSort[a]);
        }
        
        qcomp=Function('a','b',fbody + "}");
        orderAB32.sort(qcomp);

        return orderAB32;
    };
    this.toHTMLTableN = function(num) {
      var table=document.createElement('table');
      table.setAttribute('class',"table table-bordered table-condensed table-nonfluid");

      var thead = table.createTHead();
      thead.setAttribute('class',"thead-default");
      var tr = thead.insertRow(0);

      for (var i=0;i<this.numcols;i++){
          var th = document.createElement('th');
          th.appendChild(document.createTextNode(this.colnames[i]));
          tr.appendChild(th);
      }
      thead.appendChild(tr);
      var tbody= table.createTBody();
      for (var i=0;(i<this.numrows && i<num);i++){
        tr = document.createElement('tr');
        for (var ii=0;ii<this.numcols;ii++){
          var td = document.createElement('td');
          if (this.coltypes[ii]==0){
            td.appendChild(document.createTextNode(""+mem32[(this.cols[ii] + (i<<2))>>2]));
          } else if (this.coltypes[ii]==1){
            td.appendChild(document.createTextNode(""+memF32[(this.cols[ii] + (i<<2))>>2]));
          } else if (this.coltypes[ii]==2){
            td.appendChild(document.createTextNode(strToString(mem32[(this.cols[ii] + (i<<2))>>2])));
          } else if (this.coltypes[ii]==3){
            td.appendChild(document.createTextNode(""+int_to_strdate(mem32[(this.cols[ii] + (i<<2))>>2])));
          } else{
            alert("unkown type");
          }
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      return table;
    };
    this.toHTMLTable = function() {
      return this.toHTMLTableN(1/0);
    };
    this.toStringN = function(num) {
      if (inNode){
        require('common.js');
      }
      var ret="";
      for (var i=0;i<this.numcols;i++){
          ret=ret+this.colnames[i] + "\t|\t"
      }
      ret=ret+"\n";
      for (var i=0;(i<this.numrows && i<num);i++){
        for (var ii=0;ii<this.numcols;ii++){
          if (this.coltypes[ii]==0){
            ret=ret+mem32[(this.cols[ii]+(i<<2))>>2]+ "\t|\t";
          } else if (this.coltypes[ii]==1){
            ret=ret+memF32[(this.cols[ii] +(i<<2))>>2]+ "\t|\t";
          } else if (this.coltypes[ii]==2){
            ret=ret+strToString(mem32[this.cols[ii]+(i<<2)])+ "\t|\t";
          } else if (this.coltypes[ii]==3){
            ret=ret+int_to_strdate(mem32[(this.cols[ii] + (i<<2))>>2])+ "\t|\t";
          } else{
            alert("unkown type");
          }
        }
        ret=ret+"\n";
      }
      return ret;
    };

    this.toString= function() {
      return this.toStringN(1/0);
    };
    this.registerTable = function(){
      var ds = new dataSource(this);
      aSchema.addTable(ds);
    };
    this.limit = function(n){
      if (n<1) return;
      this.numrows= (this.numrows>n)? n:this.numrows;
    };
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting queryResult');
  module.exports=queryResult;
}else delete module;
//////////////////////////////////////////////////////////////////////////////
