
// ------------------------------------------
//  RUN
// ------------------------------------------

var run = function(cmd, options, res){
  var config = SARAH.ConfigManager.getConfig();
  
  // Run modules script
  if (config.modules[cmd]){
    SARAH.ScriptManager.run(cmd, options, res);
    return;
  } 
  
  // Run phantoms script
  if (config.phantoms[cmd]) {
    SARAH.PhantomManager.run(cmd, options, res);
  }
}

// ------------------------------------------
//  DISPATCH
// ------------------------------------------

var dispatch = function(cmd, options, res){
  
  // Write head
  if (res){ res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});  }
  
  // Dispatch to rules
  if (SARAH.RuleManager.dispatch(cmd, options)){
    if (res){ res.end(); }
    return;
  }
  
  // console.log('Dispatch:', cmd, options);
  
  // Write end
  if (res){ res.end(options.tts); return; }
  if (options.quiet){ return; } 

  // At last try to speak
  SARAH.speak(options.tts);
}

// ------------------------------------------
//  PRIVATE
// ------------------------------------------

var callback = function (err, response, body){
  if (err || response.statusCode != 200) {
    console.log("HTTP Error: ", err, response, body);
    return;
  }
};

var remote = function(qs){
  var url = SARAH.ConfigManager.getConfig().http.remote;
  var request = require('request');
  console.log('Remote: ', url, qs);
  request({ 'uri' : url, 'qs'  : qs }, callback);
};

var _key = function(key, action, mod) {
  if (!key){ return;}
  console.log("Key:", action, key, mod);
  var param = { 'keyMod' : mod };
  param[action] = key;
  remote(param);
};

// ------------------------------------------
//  FEATURES
// ------------------------------------------

var speak = function(tts) {
  if (!tts){ return;}
  console.log("Say remote: " + tts);
  remote({ 'tts' : tts });
};

var play = function(mp3) {
  if (!mp3){ return;}
  console.log("Play remote: " + mp3);
  remote({ 'play' : mp3 });
};

var pause = function(mp3) {
  if (!mp3){ return;}
  console.log("Pause remote: " + mp3);
  remote({ 'pause' : mp3 });
};
  
var script = function(uri){
  var request = require('request');
  var url = 'http://127.0.0.1:' + SARAH.ConfigManager.getConfig().http.port + uri;
  request({ 'uri' : url }, callback);
}

var face = function(action) {
  if (!action){ return;}
  console.log("Face Recognition: " + action);
  remote({ 'face' : action });
};

var gesture = function(action) {
  if (!action){ return;}
  console.log("Gesture Recognition: " + action);
  remote({ 'gesture' : action });
};

var keyText = function(text) {
  if (!keyText){ return;}
  console.log("KeyText:", keyText);
  remote({ 'keyText' : keyText });
};

var runApp = function(app) {
  if (!app){ return;}
  console.log("Run:", app);
  remote({ 'run' : app });
}

var activate = function(app) {
  if (!app){ return;}
  console.log("Activate:", app);
  remote({ 'activate' : app });
}

// ------------------------------------------
//  RENDER WEBPAGE
// ------------------------------------------

var fs  = require('fs');
var ejs = require('ejs');
var render = function(path, options){
  var path = __dirname + '/../../' + path;
  if (!fs.existsSync(path)){ return "<h4>File not found: "+path+"</h4>"; }
  var text = fs.readFileSync(path, 'utf8');
  var options = options || { 'SARAH' : SARAH };
  return ejs.render(text, options);
};


// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var SARAH = {
  'init': function(){
  
    SARAH.ConfigManager  = require('./config.js').init(SARAH);
    SARAH.PluginManager  = require('./plugin.js').init(SARAH);
    SARAH.RuleManager    = require('./rules.js').init(SARAH);
    SARAH.PhantomManager = require('./phantom.js').init(SARAH);
    SARAH.ScriptManager  = require('./script.js').init(SARAH);
    SARAH.CRONManager    = require('./cron.js').init(SARAH);
  
    return SARAH;
  },
  
  'render': render,
  
  // Callback for all scripts / phantom / cron
  'dispatch': dispatch,
  
  // Send speak command on remote
  'speak': speak,
  
  // Send play command on remote
  'play': play,
  
  // Send pause command on remote
  'pause': pause,
  
  // Send face recognition command
  'face': face,
  
  // Send gesture recognition command
  'gesture': gesture,
  
  // Keyboard remote commands
  'runApp'  : runApp,
  'activate': activate,
  'keyPress': function(key, mod) { _key(key, 'keyPress', mod) },
  'keyDown' : function(key, mod) { _key(key, 'keyDown', mod) },
  'keyUp'   : function(key, mod) { _key(key, 'keyUp', mod) },
  'keyText' : keyText,
  
  // General purpose remote action on WSRMacro
  'remote': remote,
  
  // Run local http request on given uri 
  'script': script,
  
  // Run local module
  'run': run
}


/**
 * EXPORTS
 */
exports.init = SARAH.init;