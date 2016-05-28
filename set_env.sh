if [ -z "${AB_HOME}" ]; then echo AB_HOME is not defined, please point to ..../afterburner ; 

else 
  export NODE_PATH=$NODE_PATH:${AB_HOME}/src/core:${AB_HOME}/src/frontend:${AB_HOME}/src/proxy
fi

