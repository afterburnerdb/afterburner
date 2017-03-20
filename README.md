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

