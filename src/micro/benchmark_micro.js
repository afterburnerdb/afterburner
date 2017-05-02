//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
if (inNode){
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function timestamp(){
  if (inNode){
    process.hrtime();
    if (typeof daSchema== 'undefined')
      daSchema=require('myJS.js').daSchema
    return process.hrtime();
  }
  else{
    window.performance.now();
    return window.performance.now();
  }
}
function timediff(t1,t0){
  if (inNode)
    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
  else 
    return (t1-t0);
}
//micro1
function micro1_JSO_(scale,jsmem,o_totalpriceOffset){
  var count = 0;
  for (var ii=0;ii<scale;ii++){
    if (jsmem[o_totalpriceOffset+ii] > 555.5)
      count= count + 1;
  }
  return count;
}
if (inNode) micro1_JSO_.toSource=micro1_JSO_.toString;
function micro1_JSO(scale,jsmem){
  var t0,t1;
  var o_totalpriceOffset=scale;
  var count = 0;
  handle=Function('scale','jsmem','o_totalpriceOffset',micro1_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale,jsmem,o_totalpriceOffset);
  t1=timestamp();
  return timediff(t1,t0);
}
function micro1_TA_(scale, memF32,o_totalpriceOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (memF32[(o_totalpriceOffset + ii)>>2] > 555.5)
      count= count + 1;
  }
  return count;
}
if (inNode) micro1_TA_.toSource=micro1_TA_.toString;
function micro1_TA(scale){
  var t0,t1;
  var o_totalpriceOffset= daSchema.getColPByName('o_totalprice','orders10g');
  var count=0;
  handle=Function('scale','memF32','o_totalpriceOffset',micro1_TA_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale, memF32, o_totalpriceOffset);
  t1=timestamp();
  return timediff(t1,t0);
}
var asm_m1 = (function (global, env, mem){
  "use asm";
  var scale=env.scale|0;
  var o_totalpriceOffset=env.o_totalpriceOffset|0;
  var memF32 = new global.Float32Array(mem);
  function runner(){
    var count=0;
    var ii=0;
    var sscale=0;
    sscale= scale<<2;
    while ((ii|0)<(sscale|0)){
      if (+(memF32[((o_totalpriceOffset + ii)|0)>>2]) > 555.5)
        count= (count + 1)|0;
      ii=(ii+4)|0;
    }
    return count|0;
  }
  return {runner:runner}
});
function micro1_ASM(scale){
  var t0,t1;
  var o_totalpriceOffset= daSchema.getColPByName('o_totalprice','orders10g');
  var count=0;
  var env={'scale':scale,
           'o_totalpriceOffset':o_totalpriceOffset};
  var asmi;
  if (inNode)
    asmi = new asm_m1(global, env, mem);
  else 
    asmi = new asm_m1(window, env, mem);
  t0=timestamp();
  count=asmi.runner();
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro1(scale,jsmem){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  for (var i=0;i<iters;i++)
    micro1_JSO(scale,jsmem);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro1_JSO(scale,jsmem));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro1_TA(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesTAA.push(micro1_TA(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro1_ASM(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesASMA.push(micro1_ASM(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  console.log("micro1 JSO:", runtimesJSOA.join(',') );  
  console.log("micro1 TA :", runtimesTAA.join(',') );  
  console.log("micro1 ASM:", runtimesASMA.join(',') );  
}
//micro2
function micro2_JSO_(scale,jsmem, o_shippriorityOffset){
  var count=0;
  for (var ii=0;ii<scale;ii++){
    if (jsmem[o_shippriorityOffset+ii] == 0)
      count= count+ 1;
  }
  return count;
}
if (inNode) micro2_JSO_.toSource=micro2_JSO_.toString;
function micro2_JSO(scale,jsmem){
  var t0,t1;
  var o_shippriorityOffset=0;
  var count = 0;
  handle=Function('scale','jsmem','o_shippriorityOffset',micro2_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale,jsmem, o_shippriorityOffset)
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2_TA_(scale, mem32,o_shippriorityOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (mem32[(o_shippriorityOffset+ii)>>2] == 0)
      count= count+1;
  }
  return count;
}
if (inNode) micro2_TA_.toSource=micro2_TA_.toString;
function micro2_TA(scale){
  var t0,t1;
  var o_shippriorityOffset= daSchema.getColPByName('o_shippriority','orders10g');
  var count=0;
  handle=Function('scale','mem32','o_shippriorityOffset',micro2_TA_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale, mem32, o_shippriorityOffset);
  t1=timestamp(); 
  return timediff(t1,t0);
}
var asm_m2 = (function (global, env, mem){
  "use asm";
  var scale=env.scale|0;
  var o_shippriorityOffset=env.o_shippriorityOffset|0;
  var mem32 = new global.Int32Array(mem);
  function runner(){
    var count=0;
    var ii=0;
    var sscale=0;
    sscale= scale<<2;
    while ((ii|0)<(sscale|0)){
      if ( (mem32[((o_shippriorityOffset + ii)|0)>>2]|0) == 0)
        count= (count + 1)|0;
      ii=(ii+4)|0;
    }
    return count|0;
  }
  return {runner:runner}
});
function micro2_ASM(scale){
  var t0,t1;
  var o_shippriorityOffset= daSchema.getColPByName('o_shippriority','orders10g');
  var count=0;
  var env={'scale':scale,
           'o_shippriorityOffset':o_shippriorityOffset};
  var asmi;
  if (inNode)
    asmi = new asm_m2(global, env, mem);
  else 
    asmi = new asm_m2(window, env, mem);
  t0=timestamp();
  count=asmi.runner();
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2(scale,jsmem){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  for (var i=0;i<iters;i++)
    micro2_JSO(scale,jsmem);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro2_JSO(scale,jsmem));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro2_TA(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesTAA.push(micro2_TA(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro2_ASM(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesASMA.push(micro2_ASM(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  console.log("micro2 JSO:", runtimesJSOA.join(',') );  
  console.log("micro2 TA :", runtimesTAA.join(',') );  
  console.log("micro2 ASM:", runtimesASMA.join(',') );  
}
//micro3
function micro3_JSO_(scale,jsmem, o_orderpriorityOffset){
  var count=0;
  for (var ii=0;ii<scale;ii++){
    if (jsmem[o_orderpriorityOffset+ii] == '1-URGENT')
      count= count+ 1;
  }
  return count;
}
if (inNode) micro3_JSO_.toSource=micro3_JSO_.toString;
function micro3_JSO(scale,jsmem){
  var t0,t1;
  var o_orderpriorityOffset=scale*2;
  var count = 0;
  handle=Function('scale','jsmem','o_orderpriorityOffset',micro3_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count= handle(scale, jsmem, o_orderpriorityOffset);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro3_TA_(scale, mem32, o_orderpriorityOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (((mem32[(mem32[(o_orderpriorityOffset +ii)>>2]    )>>2])==1381313841)&&
        ((mem32[(mem32[(o_orderpriorityOffset +ii)>>2] + 4)>>2])==1414415687)&&
        ((mem32[(mem32[(o_orderpriorityOffset +ii)>>2] + 8)>>2])==0))
          count= count+ 1;
  }
  return count;
}
if (inNode) micro3_TA_.toSource=micro3_TA_.toString;
function micro3_TA(scale){
  var t0,t1;
  var o_orderpriorityOffset= daSchema.getColPByName('o_orderpriority','orders10g');
  var count= 0;
  handle=Function('scale','mem32','o_orderpriorityOffset',micro3_TA_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale, mem32, o_orderpriorityOffset);
  t1=timestamp(); 
  return timediff(t1,t0);
}
var asm_m3 = (function (global, env, mem){
  "use asm";
  var scale=env.scale|0;
  var o_orderpriorityOffset=env.o_orderpriorityOffset|0;
  var mem32 = new global.Int32Array(mem);
  function runner(){
    var count=0;
    var ii=0;
    var sscale=0;
    sscale= scale<<2;
    while ((ii|0)<(sscale|0)){
      if ((mem32[  (mem32[((o_orderpriorityOffset +ii)|0)>>2]|0)        >>2]|0)==1381313841){
        if((mem32[(((mem32[((o_orderpriorityOffset +ii)|0)>>2]|0) + 4)|0)>>2]|0)==1414415687){
          if((mem32[(((mem32[((o_orderpriorityOffset +ii)|0)>>2]|0) + 8)|0)>>2]|0)==0        )
            count= (count + 1)|0;
        }
      }
      ii=(ii+4)|0;
    }
    return count|0;
  }
  return {runner:runner}
});
function micro3_ASM(scale){
  var t0,t1;
  var o_orderpriorityOffset= daSchema.getColPByName('o_orderpriority','orders10g');
  var count=0;
  var env={'scale':scale,
           'o_orderpriorityOffset':o_orderpriorityOffset};
  var asmi;
  if (inNode)
    asmi = new asm_m3(global, env, mem);
  else 
    asmi = new asm_m3(window, env, mem);
  t0=timestamp();
  count=asmi.runner();
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro3(scale,jsmem){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  for (var i=0;i<iters;i++)
    micro3_JSO(scale,jsmem);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro3_JSO(scale, jsmem));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro3_TA(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesTAA.push(micro3_TA(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  for (var i=0;i<iters;i++)
    micro3_ASM(scale);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesASMA.push(micro3_ASM(scale));
  t1=timestamp(); 
  console.log("subtotaltime:"+ timediff(t1,t0));

  console.log("micro3 JSO:", runtimesJSOA.join(',') );  
  console.log("micro3 TA :", runtimesTAA.join(',') );  
  console.log("micro3 ASM:", runtimesASMA.join(',') );  
}

function micro(scale){
  var t0,t1;
  if (typeof scale == 'undefined')
    scale= 15000000;

  if (typeof jsmem == 'undefined'){
    linteitemA=abdb.select().from('orders10g').field('o_totalprice','o_shippriority','o_orderpriority').toArray2();
    jsmem=[];
    for (var i=0;i<scale;i++)
      jsmem[scale+i]=linteitemA[(i*3)+0];
    for (var i=0;i<scale;i++)
      jsmem[i]=linteitemA[(i*3)+1];
    for (var i=0;i<scale;i++)
      jsmem[(scale*2)+i]=linteitemA[(i*3)+2];
  }

  console.log("///////////MICRO-1///////////");
  t0=timestamp();
  micro1(scale,jsmem);
  t1=timestamp(); 
  console.log("totaltime:"+ timediff(t1,t0));
  console.log("///////////MICRO-2///////////");
  t0=timestamp();
  micro2(scale,jsmem);
  t1=timestamp(); 
  console.log("totaltime:"+ timediff(t1,t0));
  console.log("///////////MICRO-3///////////");
  t0=timestamp();
  micro3(scale,jsmem);
  t1=timestamp(); 
  console.log("totaltime:"+ timediff(t1,t0));
}
numruns_cpu_met=500;
function micro1JSO(o_totalpriceA){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro1_JSO(scale,o_totalpriceA);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro1TA(){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro1_TA(scale);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro1ASM(){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro1_ASM(scale);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2JSO(o_shippriorityA){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro2_JSO(scale,o_shippriorityA);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2TA(){
  var scale=15000000;
  var t0,t1;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro2_TA(scale);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2ASM(){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro2_ASM(scale);
  t1=timestamp();
  return timediff(t1,t0);
}

function micro3JSO(o_orderpriorityA){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro3_JSO(scale,o_orderpriorityA);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro3TA(){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro3_TA(scale);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro3ASM(){
  var t0,t1;
  var scale=15000000;
  t0=timestamp();
  for (var i=0;i<numruns_cpu_met;i++)
    micro3_ASM(scale);
  t1=timestamp();
  return timediff(t1,t0);
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bechmark_tpch');
  global.micro=micro;
  global.micro1=micro1;
  global.micro2=micro2;
  global.micro3=micro3;
//  global.micro4=micro4;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
