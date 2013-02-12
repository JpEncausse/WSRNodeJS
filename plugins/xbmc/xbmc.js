exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.xbmc;
  if (!config.api_url || !config.api_user){
    console.log("Missing XBMC config");
    return;
  }
  
  // Doc: http://wiki.xbmc.org/index.php?title=JSON-RPC_API
  
  var areWePlayingAudio = {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}
  sendJSONRPC(config, areWePlayingAudio, function(json){
    
    if (json.result[0].type == 'audio'){ // Yes we are
      var whatSong = {"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 0 }, "id": "AudioGetItem"}
      sendJSONRPC(config, whatSong, function(json){
        console.log('Album:', json.result.item.album);
        console.log('Artist:', json.result.item.artist);
      });
    }
  });
  
  callback({});
}


var sendJSONRPC = function(config, reqJSON, callback){
  var request = require('request');
  request({
    'uri' : config.api_url,
    'method' : 'POST',
    'json': reqJSON
  },
  
  function (err, response, body){  
    if (err || response.statusCode != 200) {
      callback({});
      return;
    }
    
    // Log the response
    console.log(body);
    
    // Return the response
    callback(body);
  });
}