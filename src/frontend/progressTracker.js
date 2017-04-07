function progressTracker(){
  this.mmJQ=$("#waitForPT");
  this.mh=this.mmJQ.find('div.modal-header')[0];
  this.mb=this.mmJQ.find('div.modal-body')[0];
  this.mf=this.mmJQ.find('div.modal-footer')[0];
  this.mg=$('#modalgate');
  if (hipstore){
    var row=newHTMLRow();
    var col1=newHTMLCol('md',6,{'style':'background-color:#e8fcf9'});
    var p=newHTMLP('Stored/Total (memory):'+((storedB/(1024*1024))|0)+'/'+((storemax/(1024*1024))|0)+" (mb)",{'style':'font-size:16px font-weight:bold',id:'trkmemtxt'});
    col1.appendChild(p);
    var pb=newHTMLProgressBar('trkmempb');
    var col2=newHTMLCol('md',5);
    col2.appendChild(pb);
    row.appendChild(col1);
    row.appendChild(col2);
    this.mb.appendChild(row);
  }

  this.trackFiles = function(flist){
    var tmplist=[];
    for (var i=0;i<flist.length;i++)
     tmplist.push(flist[i].name);
    this.trackURLs(tmplist,true);
  }
  this.trackURLs = function(ulist,local){
    this.list=ulist;
    clearElement(this.mh);
    $("#waitForPT").modal();
    this.disableModalGate();

    var row=newHTMLRow();
    var col1=newHTMLCol('md',6,{'style':'background-color:#e8fcf9'});
    var a=newHTMLP('File/URL',{'style':'font-size:16px font-weight:bold'});
    col1.appendChild(a);
    var col2=newHTMLCol('md',2);
    var a=newHTMLP("state",{'style':'font-size:16px font-weight:bold'});
    col2.appendChild(a);
    var col3=newHTMLCol('md',4);
    var a=newHTMLP("progress",{'style':'font-size:16px font-weight:bold'});
    col3.appendChild(a);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    this.mh.appendChild(row);

    for (var i=0;i<ulist.length;i++){
      var row=newHTMLRow();
      var col1=newHTMLCol('md',6,{'style':'background-color:#e8fcf9'});
      var a=newHTMLA(ulist[i],{'style':'font-size:12px'});
      col1.appendChild(a);
      var col2=newHTMLCol('md',2);
      var a;
      if(local)
        a=newHTMLP("loading..",{id:'trkurlcol1'+i});
      else
        a=newHTMLP("downloading..",{id:'trkurlcol1'+i});

      col2.appendChild(a);
      var col3=newHTMLCol('md',4,{id:'trkurlcol3'+i});
      var pb=newHTMLProgressBar('trkurlpb'+i);
      col3.appendChild(pb);
      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      this.mh.appendChild(row);
    }
    this.startTimes=[get_time_ms()];
  }
  this.onFileLoad=function(done){
    var fid=this.list.indexOf(done);
    $('#trkurlcol1'+fid).text('uncompress..');
    $('#trkurlpb'+fid)[0].setAttribute('style','width:10%');
    console.log("@onFileLoad:"+done);
  }
  this.onFileUncompress=function(done){
    console.log("@onFileUncompress:"+done);
    var fid=this.list.indexOf(done);
    $('#trkurlcol1'+fid).text('storing..');
    $('#trkurlpb'+fid)[0].setAttribute('style','width:20%');
  }
  this.onTableLoad=function(done){
    expose=done;
    if ((typeof File !== 'undefined') && (done instanceof File)) done = done.name;
    console.log("@onTableLoad:"+done);
    var fid=this.list.indexOf(done);
    if (fid == (this.list.length-1))
      this.enableModalGate();

    if (fid != (this.list.length-1)){
      this.startTimes.push(get_time_ms());
    }
    $('#trkurlcol1'+fid).text('done..');
    clearElement($('#trkurlcol3'+fid)[0]);
    var ttloadms=(get_time_ms()-this.startTimes[fid]).toFixed(0);
    var ttloads=(ttloadms/1000).toFixed(0);
    var a;
    if (ttloads==0)
      a=newHTMLP('time to load: '+ttloadms+' (ms)');
    else
      a=newHTMLP('time to load: '+ttloads+' (s)');
    $('#trkurlcol3'+fid)[0].appendChild(a);

  }
  this.onMemTick=function(memusgpct){
    $('#trkmempb')[0].setAttribute('style','width:'+memusgpct+"%");
    $('#trkmempb').text(memusgpct+"%");
    $('#trkmemtxt').text('Stored/Total (memory):'+((storedB/(1024*1024))|0)+'/'+((storemax/(1024*1024))|0)+" (mb)");
  }
  this.disableModalGate=function(){
    this.mg.prop('disabled',true);
  }
  this.enableModalGate=function(){
    this.mg.prop('disabled',false);
    this.mg.addClass('btn-success');
  }
}
PTi = new progressTracker();
