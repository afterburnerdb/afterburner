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
function micro1_JSO_(scale,o_totalpriceA){
  var count = 0;
  for (var ii=0;ii<scale;ii++){
    if (o_totalpriceA[ii] > 1555555.5)
      count= count + 1;
  }
  return count;
}
if (inNode) micro1_JSO_.toSource=micro1_JSO_.toString;
function micro1_JSO(scale,o_totalpriceA){
  var t0,t1;
  if (typeof o_totalpriceA == 'undefined')
   console.log("Error at micro1_JSO: o_totalpriceA == 'undefined' ---------");
  var count = 0;
  handle=Function('scale','o_totalpriceA',micro1_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale,o_totalpriceA);
  t1=timestamp();
  return timediff(t1,t0);
}
function micro1_TA_(scale, memF32,o_totalpriceOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (memF32[(o_totalpriceOffset + ii)>>2] > 1555555.5)
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
      if (+(memF32[((o_totalpriceOffset + ii)|0)>>2]) > 1555555.5)
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
function micro1(scale){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  if (typeof o_totalpriceA == 'undefined')
    o_totalpriceA=ABi.select().from('orders10g').field('o_totalprice').toArray();
//  for (var i=0;i<iters;i++){
//    micro1_JSO(scale,o_totalpriceA);
//    micro1_TA(scale);
//    micro1_ASM(scale);
//  }
//  for (var i=0;i<iters;i++){
//    runtimesJSOA.push(micro1_JSO(scale,o_totalpriceA));
//    runtimesTAA.push(micro1_TA(scale));
//    runtimesASMA.push(micro1_ASM(scale));
//  }

  for (var i=0;i<iters;i++)
    micro1_JSO(scale,o_totalpriceA);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro1_JSO(scale,o_totalpriceA));
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
function micro2_JSO_(scale, o_shippriorityA){
  var count=0;
  for (var ii=0;ii<scale;ii++){
    if (o_shippriorityA[ii] > 0)
      count= count+ 1;
  }
  return count;
}
if (inNode) micro2_JSO_.toSource=micro2_JSO_.toString;
function micro2_JSO(scale,o_shippriorityA){
  var t0,t1;
  if (typeof o_shippriorityA == 'undefined')
   console.log("Error at micro2_JSO: o_shippriorityA == 'undefined' ---------");
  var count = 0;
  handle=Function('scale','o_shippriorityA',micro2_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count=handle(scale, o_shippriorityA)
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro2_TA_(scale, mem32,o_shippriorityOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (mem32[(o_shippriorityOffset+ii)>>2] > 0)
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
      if ( (mem32[((o_shippriorityOffset + ii)|0)>>2]|0) > 0)
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
function micro2(scale){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  if (typeof o_shippriorityA == 'undefined')
    o_shippriorityA=ABi.select().from('orders10g').field('o_shippriority').toArray();

//  for (var i=0;i<iters;i++){
//    micro2_JSO(scale,o_shippriorityA);
//    micro2_TA(scale);
//    micro2_ASM(scale);
//  }
//  for (var i=0;i<iters;i++){
//    runtimesJSOA.push(micro2_JSO(scale,o_shippriorityA));
//    runtimesTAA.push(micro2_TA(scale));
//    runtimesASMA.push(micro2_ASM(scale));
//  }
  for (var i=0;i<iters;i++)
    micro2_JSO(scale,o_shippriorityA);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro2_JSO(scale,o_shippriorityA));
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
function micro3_JSO_(scale, o_orderpriorityA){
  var count=0;
  for (var ii=0;ii<scale;ii++){
    if (o_orderpriorityA[ii] == '1-URGENT')
      count= count+ 1;
  }
  return count;
}
if (inNode) micro3_JSO_.toSource=micro3_JSO_.toString;
function micro3_JSO(scale,o_orderpriorityA){
  var t0,t1;
  if (typeof o_orderpriorityA == 'undefined')
   console.log("Error at micro3_JSO: o_orderpriorityA == 'undefined' ---------");
  var count = 0;
  handle=Function('scale','o_orderpriorityA',micro3_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
  t0=timestamp();
  count= handle(scale, o_orderpriorityA);
  t1=timestamp(); 
  return timediff(t1,t0);
}
function micro3_TA_(scale, mem32, o_orderpriorityOffset){
  var count=0;
  var lastOffset=scale*4;
  for (var ii=0;ii<lastOffset;ii=ii+4){
    if (((mem32[(mem32[(o_orderpriorityOffset +ii)>>2]    )>>2])==1381313841)&
        ((mem32[(mem32[(o_orderpriorityOffset +ii)>>2] + 4)>>2])==1414415687)&
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
function micro3(scale){
  var t0,t1;
  var iters=5;
  var runtimesJSOA=[];
  var runtimesTAA=[];
  var runtimesASMA=[];
  daSchema.getTable('orders10g').numrows=scale;
  if (typeof o_orderpriorityA == 'undefined')
    o_orderpriorityA=ABi.select().from('orders10g').field('o_orderpriority').toArray();
//  for (var i=0;i<iters;i++){
//    micro3_JSO(scale,o_orderpriorityA);
//    micro3_TA(scale);
//    micro3_ASM(scale);
//  }
//  for (var i=0;i<iters;i++){
//    runtimesJSOA.push(micro3_JSO(scale,o_orderpriorityA));
//    runtimesTAA.push(micro3_TA(scale));
//    runtimesASMA.push(micro3_ASM(scale));
//  }
  for (var i=0;i<iters;i++)
    micro3_JSO(scale,o_orderpriorityA);
  t0=timestamp();
  for (var i=0;i<iters;i++)
    runtimesJSOA.push(micro3_JSO(scale,o_orderpriorityA));
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
  console.log("///////////MICRO-1///////////");
  t0=timestamp();
  micro1(scale);
  t1=timestamp(); 
  console.log("totaltime:"+ timediff(t1,t0));
  console.log("///////////MICRO-2///////////");
  t0=timestamp();
  micro2(scale);
  t1=timestamp(); 
  console.log("totaltime:"+ timediff(t1,t0));
  console.log("///////////MICRO-3///////////");
  t0=timestamp();
  micro3(scale);
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
////micro4
//function micro4_JSO_(scale, o_orders10gtatusA){
//  var count=0;
//  for (var ii=0;ii<scale;ii++){
//    if (o_orders10gtatusA[ii] == 'F')
//      count= count+ 1;
//  }
//  return count;
//}
//function micro4_JSO(scale){
//  var o_orders10gtatusA=ABi.select().from('orders').field('o_orderstatus').toArray();
//  var count = 0;
//  handle=Function('scale','o_orders10gtatusA',micro4_JSO_.toSource().replace(/function.*?\(.*?\)/i,''));
//  if (inNode)
//    t0= process.hrtime();
//  else
//    t0= window.performance.now();
//  count= handle(scale, o_orders10gtatusA);
//  if (inNode)
//    t1= process.hrtime();
//  else
//    t1= window.performance.now(); 
//  //console.log("count="+count);
//  if (inNode)
//    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
//  else 
//    return (t1-t0);
//}
//function micro4_TA_(scale, mem32, o_orders10gtatusOffset){
//  var count=0;
//  var lastOffset=scale*4;
//  for (var ii=0;ii<lastOffset;ii=ii+4){
//    if ( mem32[(o_orders10gtatusOffset +(ii))>>2]==70)
//      count= count+ 1;
//  }
//  return count;
//}
//function micro4_TA(scale){
//  var o_orders10gtatusOffset= daSchema.getColPByName('o_orderstatus','orders');
//  var count= 0;
//  handle=Function('scale','mem32','o_orders10gtatusOffset',micro4_TA_.toSource().replace(/function.*?\(.*?\)/i,''));
//  if (inNode)
//    t0= process.hrtime();
//  else
//    t0= window.performance.now();
//  count=handle(scale, mem32, o_orders10gtatusOffset);
//  if (inNode)
//    t1= process.hrtime();
//  else
//    t1= window.performance.now(); 
//  //console.log("count="+count);
//  if (inNode)
//    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
//  else 
//    return (t1-t0);
//}
//var asm_m4 = (function (global, env, mem){
//  "use asm";
//  var scale=env.scale|0;
//  var o_orders10gtatusOffset=env.o_orderstatusOffset|0;
//  var mem32 = new global.Int32Array(mem);
//  function runner(){
//    var count=0;
//    var ii=0;
//    var sscale=0;
//    sscale= scale<<2;
//    while ((ii|0)<(sscale|0)){
//      if ((mem32[((o_orders10gtatusOffset + ii)|0)>>2]|0) == 70)
//        count= (count + 1)|0;
//      ii=(ii+4)|0;
//    }
//    return count|0;
//  }
//  return {runner:runner}
//});
//function micro4_ASM(scale){
//  var o_orders10gtatusOffset= daSchema.getColPByName('o_orderstatus','orders');
//  var count=0;
//  var env={'scale':scale,
//           'o_orders10gtatusOffset':o_orderstatusOffset};
//  var asmi4 = new asm_m4(window, env, mem);
//  if (inNode)
//    t0= process.hrtime();
//  else
//    t0= window.performance.now();
//  count=asmi4.runner();
//  if (inNode)
//    t1= process.hrtime();
//  else
//    t1= window.performance.now(); 
//  //console.log("count="+count);
//  if (inNode)
//    return ((((t1[0]-t0[0])*(1000)) + ((t1[1]-t0[1])/(1000*1000))));
//  else 
//    return (t1-t0);
//}
//function micro4(){
//  var scale= 1500000;
//  var iters=5;
//  var runtimesJSOA=[];
//  var runtimesTAA=[];
//  var runtimesASMA=[];
//  daSchema.getTable('orders10g').numrows=scale;
////  for (var i=0;i<iters;i++){
//    micro4_JSO(scale);
//    micro4_TA(scale);
//    micro4_ASM(scale);
////  }
//  for (var i=0;i<iters;i++){
//    runtimesJSOA.push(micro4_JSO(scale));
//    runtimesTAA.push(micro4_TA(scale));
//    runtimesASMA.push(micro4_ASM(scale));
//  }
//  console.log("micro4 JSO:", runtimesJSOA.join(',') );  
//  console.log("micro4 TA :", runtimesTAA.join(',') );  
//  console.log("micro4 ASM:", runtimesASMA.join(',') );  
//}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  console.log('exporting bechmark_micro');
  global.micro=micro;
  global.micro1=micro1;
  global.micro2=micro2;
  global.micro3=micro3;
//  global.micro4=micro4;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
