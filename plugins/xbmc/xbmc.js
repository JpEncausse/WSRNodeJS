exports.action = function(data, callback, config, SARAH){

  // Retrieve config
  config = config.modules.xbmc;
  if (!config.api_url){
    return callback({ 'tts' : 'Configuration XBMC invalide' });
  }
  
  if (data.action == 'introspect'){
    doAction(introspect, config, callback);
  }
  else if (data.action == 'playlist'){
    var filter = {"and":[]};
    if (data.genre) { filter.and.push({"field": "genre",  "operator": "contains", "value": data.genre  }); }
    if (data.artist){ filter.and.push({"field": "artist", "operator": "contains", "value": data.artist }); }
    if (data.title) { filter.and.push({"field": "title",  "operator": "contains", "value": data.title  }); }
    
    if (data.dictation){
      var regexp = /sarah\srecherche\s(\w+)/gi 
      var match  = regexp.exec(data.dictation);
      if (match){
        filter = {"or":[]};
        filter.or.push({"field": "title",   "operator": "contains", "value": match[1] });
        filter.or.push({"field": "artist",  "operator": "contains", "value": match[1] });
        console.log("Match: ", match[1]);
      }
    }
    
    doPlaylist(filter, config, callback);
  }
  else if (data.action == 'play'){
    doAction(play, config, callback);
  }
  else if (data.action == 'next'){
    doAction(next, config, callback);
  }
  else if (data.action == 'prev'){
    doAction(prev, config, callback);
  }
  else if (data.action == 'player'){
    doAction(player, config, callback);
  }
  else {
    callback({});
  }
}

// -------------------------------------------
//  QUERIES
//  Doc: http://wiki.xbmc.org/index.php?title=JSON-RPC_API
// -------------------------------------------

// Introspect
var introspect = { "jsonrpc": "2.0", "method": "JSONRPC.Introspect", "params": { "filter": { "id": "AudioLibrary.GetSongs", "type": "method" } }, "id": 1 }

// Toggle play / pause in current player
var play = {"jsonrpc": "2.0", "method": "Player.PlayPause",  "params": { "playerid": 0 }, "id": 1}
var player = {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1}

// Previous / Next item in current player
var next = {"jsonrpc": "2.0", "method": "Player.GoTo",     "params": { "playerid": 0, "to" : "next" }, "id": 1}
var prev = {"jsonrpc": "2.0", "method": "Player.GoTo",     "params": { "playerid": 0, "to" : "previous" }, "id": 1}

// Query library
var genres = {"jsonrpc": "2.0", "method": "AudioLibrary.GetGenres", "params": {"properties": ["title"], "limits": { "start" : 0, "end" : 20 }, "sort": { "method" : "label", "order" : "ascending" }}, "id": "AudioLibrary.GetGenres"}
var albums = {"jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": {"properties": ["artist","artistid","albumlabel","year","thumbnail","genre"], "limits": { "start" : 0, "end" : 20 }, "sort": { "method" : "label", "order" : "ascending" }}, "id": "AudioLibrary.GetAlbumsByGenre"}
var songs  = {"jsonrpc": "2.0", "method": "AudioLibrary.GetSongs",  "params": {"properties": ["title", "genre", "artist", "duration", "album", "track" ], "limits": { "start" : 0, "end": 25 }, "sort": { "order": "ascending", "method": "track", "ignorearticle": true } }, "id": "libSongs"}

// Playlist
var playlist  = {"jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration"], "playlistid": 0 }, "id": 1}
var clearlist = {"jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": {"playlistid": 0}}
var addtolist = {"jsonrpc": "2.0", "id": 1, "method": "Playlist.Add",   "params": {"playlistid": 0, "item": {"songid": 10}}}
var runlist   = {"jsonrpc": "2.0", "id": 2, "method": "Player.Open",    "params": {"item": {"playlistid": 0}}}


var doPlaylist = function(filter, config, callback){
  // Apply filter
  songs.params['filter'] = filter;
  
  // Search songs
  doAction(songs, config, callback, function(json){
    
    // No results 
    if (!json.result.songs){
      callback({ 'tts' : "Je n'ai pas trouvé de résultats" }) 
      return false; 
    }
    
    // Clear playlist
    doAction(clearlist, config);
    
    // Iterate
    json.result.songs.forEach(function(song){
      console.log(song.title);
      addtolist.params.item.songid = song.songid;
      doAction(addtolist, config);
    });
    
    doAction(runlist, config);
    return true; // call callback
  })
}

var doAction = function(req, config, callback, hook){

  // Send a simple JSON request
  sendJSONRequest(config.api_url, req, function(res){
  
    // Common response
    if (!handleJSONResponse(res, callback)){ return; }
    
    // Do stuff
    if (hook){
      try { if (!hook(res)){ return; }} catch(ex){ console.log(res); }
    }
    
    // Otherwise
    if (callback){ callback({}) };
  });
} 


// -------------------------------------------
//  JSON
// -------------------------------------------

var sendJSONRequest = function(url, reqJSON, callback){
  var request = require('request');
  request({
    'uri' : url,
    'method' : 'POST',
    'json': reqJSON
  },
  function (err, response, json){ 
    
    if (err || response.statusCode != 200) {  return callback(false);  }
    
    // Log the response
    // console.log(json);
    
    // Return the response
    callback(json);
  });
}

// config.api_url
var handleJSONResponse = function(res, callback){

  // Request error
  if (!res){ return callback({ 'tts' : "Je n'ai pas pu contacter le serveur" }); }
  
  // XBMC error
  if (res.error){
    return callback({ 'tts' : "Je n'ai pas pu executer l'action" }); 
  }
  
  return true;
} 

