CWD=$(pwd)
NODE_PATH=$CWD/NodeJS/node_modules/npm/node_modules:$CWD/NodeJS/node_modules/npm
NODE_PATH=$NODE_PATH:$CWD/ExpressJS/node_modules
 NODE_PATH=$NODE_PATH:$CWD/script/lib:$CWD/script/vendor
NODE_PATH=$NODE_PATH node script/wsrnode.js
