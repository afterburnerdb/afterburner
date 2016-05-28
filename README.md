#Afterburner

##Web browser:
######Running from browser:
    visit: http://abdb.io
    firefox ./demo.html
    google-chrome ./demo.html

######Loading tables in browser:
To load data inside browser click [Browse] to pick a file that matches the format described in the loading tables section.

######Running queries in browser:
1. Click on [Qx Fluent] buttons, to load Fluent SQL of the four queries in the Fluent SQL text area.
2. Click [Fluent to ASM] to generate the code for the query which will appear inside the JavaScript code text area on the right.
3. Click [Run ASM] to run the query.
4. Query result shows at the bottom of the page.

##Running inside node:

    $AB_HOME=<path?>/afterburner
    $source set_env.sh
    $node
    > eval(fs.readFileSync('./src/frontend/myJS.js')+"");
    > var tabsToLoad=['<path>/data/lineitem.6001215.tbl','<path>/data/orders.1500000.tbl']; //(e.g.)
    > loadTables(tabsToLoad); // when using 1GB scale.. data loading will take minutes..
    > asmcode=ABi.select().from("orders").field(count("o_totalprice")).where(lt("o_totalprice",1500)).toString()
    > eval(asmcode)
  
##Loading tables:

  1. To load a table, prepare a file with the following format:
            \<Table name\>.\<Number of rows\>.tbl

  2. An example file is provided in the data directory (../data)
  
  3. Another example **TPCH(1GB)**
      * lineitem: https://drive.google.com/open?id=0B2CdCGGKg6SNNHlFT0VkeG9jY1U
      * orders: https://drive.google.com/open?id=0B2CdCGGKg6SNVlNJaloyX05fT1k
      * myview: https://drive.google.com/file/d/0B2CdCGGKg6SNZHFSNlZPM2xLZkU/view?usp=sharing

  4. **Note:** Currently afterburner, easily loads three tables: lineitems, orders, myview.
    Please either load (lineitem and order) or (myview) tables but not both because the schema handling is basic.

##Tested queries:

####Query-1:

    SELECT count(*) 
    FROM orders 
    WHERE o_totalprice < 1500;

    ABi.select()
    .from("orders")
    .field(count("o_totalprice"))
    .where(lt("o_totalprice",1500))
    .toString()

####Query-2: 

    SELECT SUM(o_totalprice) 
    FROM orders, lineitem 
    WHERE l_orderkey = o_orderkey;

    ABi.select()
    .from("lineitem")
    .join("orders")
    .on("l_orderkey","o_orderkey")
    .field(sum('o_totalprice'))
    .toString()

####Query-3:

    SELECT o_orderdate, count(*) 
    FROM orders 
    GROUP BY o_orderdate;

    ABi.select()
    .field("o_orderdate")
    .field(count('o_orderkey'))
    .from("orders")
    .group("o_orderdate")
    .toString()

####Query-4:

    SELECT l_orderkey, sum(l_extendedprice) as rev, o_orderdate, o_shippriority 
    FROM lineitem, orders WHERE l_orderkey= o_orderkey and o_orderdate between '1996-01-01' and '1996-01-31' 
    GROUP BY l_orderkey, o_orderdate, o_shippriority 
    ORDER BY rev desc 
    LIMIT 10;

    ABi.select()
    .from("lineitem")
    .join("orders")
    .on("l_orderkey","o_orderkey")
    .field("l_orderkey")
    .field(sum('l_extendedprice'))
    .field("o_orderdate")
    .field("o_shippriority")
    .where(between('o_orderdate', date('1996-01-01'),date('1996-01-31')))
    .group("l_orderkey")
    .group("o_orderdate")
    .group("o_shippriority")
    .order([-1])
    .limit(10)
    .toString()

####Query-Top Orders:

    SELECT l_orderkey, revenue, o_orderdate, o_shippriority 
    FROM myview 
    WHERE O_ORDERDATE = '1996-01-06' 
    ORDER BY revenue DESC 
    LIMIT 10;

    ABi.select() .from("myview").field("l_orderkey")
    .field("revenue")
    .field("o_orderdate")
    .field("o_shippriority")
    .where(eq('o_orderdate',date('1996-01-06')))
    .order([-1])
    .limit(10)
    .toString()
