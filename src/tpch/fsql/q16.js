//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query16_fsql(noasm){
ABi.select()
  .from("@partsupp","@part")
  .field("@p_brand","@p_type","@p_size", as(countdistinct("@ps_suppkey"), "supplier_cnt"))
  .where(eq("@p_partkey" ,"@ps_partkey"),
    neq("@p_brand" ,'Brand#45'),
    notlike("@p_type",'MEDIUM POLISHED%'),
    isin("@p_size",[49, 14, 23, 45, 19, 3, 36, 9]),
    isnotin("@ps_suppkey",ABi.select()
        .from("@supplier")
        .field("@s_suppkey")
        .where(like("@s_comment",'%Customer%Complaints%'))))
  .group("@p_brand","@p_type","@p_size")
  .order("-@supplier_cnt","@p_brand","@p_type","@p_size");
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query16_fsql;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
