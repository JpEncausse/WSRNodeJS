


exports.action = function(data, callback, config, SARAH){

  // Retrieve config
  config = config.modules.websocket;
  if (!config){
    console.log("Missing WebSocket config");
    callback({});
    return;
  }
  
  init(SARAH);
  if (socket){
    socket.emit('sarah', data);
  }
  
  callback({});
}

// ------------------------------------------
//  SOCKET IO
// ------------------------------------------

var io = false;

var init = function(SARAH){
  if (io){ return; }
  io = require('./lib/socket.io').listen(SARAH.express.server);
  io.sockets.on('connection', connection);
}

var socket = false
var connection = function(sck){
  socket = sck;
  socket.emit('echo', { hello: 'world' });
  // socket.on('my other event', function (data) { console.log(data); });
}