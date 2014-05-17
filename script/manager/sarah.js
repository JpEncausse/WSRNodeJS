var winston = require('winston');

// ------------------------------------------
//  RUN
// ------------------------------------------

var exists = function(cmd){
  if (config.modules[cmd] || cmd == 'time'){
    return true;
  }
  if (config.phantoms[cmd]){
    return true;
  }
  return false;
}

var call = function(cmd, data, callback){ 
  run(cmd, data, false, callback || (function(){}));
}

var run = function(cmd, options, res, callback){
  var config = SARAH.ConfigManager.getConfig();
  var xtend  = require('../lib/extend.js');
  
  // Backup last command
  if (res){ 
    var last = { 
      'cmd'    : cmd, 
      'options': xtend.extend(true, {}, options)
    };
    
    // Store and log last
    SARAH.context.last = SARAH.RuleManager.log(last); 
  }
  
  // Run modules script
  if (config.modules[cmd] || cmd == 'time'){
    SARAH.ScriptManager.run(cmd, options, res, callback);
    return;
  }
  
  // Run phantoms script
  if (config.phantoms[cmd]) {
    SARAH.PhantomManager.run(cmd, options, res, callback);
    return;
  }

  winston.log('warn', 'Module not found: '+ cmd);
  if (res){ res.end(); }
}

var last = function(res){
  if (!SARAH.context.last){ return; }
  SARAH.run(SARAH.context.last.cmd, SARAH.context.last.options, res);
}

// ------------------------------------------
//  DISPATCH
// ------------------------------------------

var dispatch = function(cmd, options, res){
  
  var skip = true;
  if (res){
    skip = res.skip;
    res.skip = true;
  }
  
  // Write head
  if (!skip){ res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});  }
  
  // Dispatch to rules
  if (SARAH.RuleManager.dispatch(cmd, options)){
    if (!skip){ res.end(); }
    return;
  }
  
  // Dispatch to rules
  if (SARAH.RuleManager.next(SARAH.context.last)){
    if (!skip){ res.end(); }
    return;
  }
  
  // Write end
  if (!skip){ 
    options.tts = SARAH.PluginManager.speak(options.tts, false);
    res.end(options.tts);
  }
  
  if (options.quiet){ return; } 

  // At last try to speak
  if (!res) SARAH.speak(options.tts);
  
}

// ------------------------------------------
//  PRIVATE
// ------------------------------------------

var callback = function (err, response, body){
  if (err || response.statusCode != 200) {
    winston.info("HTTP Error: ", err, response, body);
    return;
  }
};

var remote = function(qs, cb){
  var url = SARAH.ConfigManager.getConfig().http.remote;
  var querystring = require('querystring');
  url += '?' + querystring.stringify(qs);

  winston.info('Remote: '+ url);

  var request = require('request');
  request({ 'url' : url }, cb || callback);
};

var _key = function(key, action, mod) {
  if (!key){ return;}
  winston.info("Key:", action, key, mod);
  var param = { 'keyMod' : mod };
  param[action] = key;
  remote(param);
};

var RSSFeedCache = {};
var getRSSFeed = function(url, cache){
  
  // Use cache
  if (!cache && RSSFeedCache[url]){ return RSSFeedCache[url]; }
  
  var FeedParser = require('feedparser');
  var request = require('request');
  var ent = require('entity/node-ent');
  
  var feed = { items : [] };
  
  request(url)
  .pipe(new FeedParser())
  .on('meta', function (meta) { feed.meta = meta; })
  .on('readable', function() {
    var stream = this, item;
    while (item = stream.read()) { 
      item.description = ent.decode(item.description);
      feed.items.push(item);
    }
    RSSFeedCache[url] = feed; // Cache
  });
}

// ------------------------------------------
//  FEATURES
// ------------------------------------------
/*
var _speech = [];
var _speaking = false;
*/
var speak = function(tts, cb) {

  var callback = function(){ SARAH.PluginManager.speak(tts, false); cb(); }
  var t2s = SARAH.PluginManager.speak(tts, cb !== undefined);
  if (!t2s){ if (cb) callback(); return; }
  
  
  var qs = { 'tts' : t2s }; 
  if (cb) {
    qs.sync = true;
    winston.info("Speak remote: " + t2s + " with callback");
    return remote(qs, callback);
  }
  
  // Buffer speech async
  /*
  if (_speaking){ 
    winston.info("Push remote: " + t2s + " no callback");
    _speech.push(tts); return;
  }*/
  
  // Fake async
  /*
  _speaking = true;
  setTimeout(function(){
  */
    winston.info("Speak remote: " + t2s + " no callback");
    remote(qs /*, function(){ _speaking = false; speak(_speech.shift()); }*/);
  /*
  },1);
  */
};

var answer = function(cb) {
  var answers = SARAH.ConfigManager.getConfig().bot.answers.split('|');
  var answer = answers[ Math.floor(Math.random() * answers.length)];
  SARAH.speak(answer, cb);
}

var shutUp = function() {
  winston.info("ShutUp remote");
  remote({ 'notts' : 'true' });
};

var play = function(mp3, cb) {
  if (!mp3){ if (cb) cb(); return;}
  
  winston.info("Play remote: " + mp3);
  var qs = { 'play' : mp3 }; 
  if (cb) qs.sync = true;
  remote(qs, cb);
};

var pause = function(mp3) {
  if (!mp3){ return;}
  winston.info("Pause remote: " + mp3);
  remote({ 'pause' : mp3 });
};
  
var script = function(uri){
  var request = require('request');
  var url = 'http://127.0.0.1:' + SARAH.ConfigManager.getConfig().http.port + uri;
  request({ 'uri' : url }, callback);
}

var face = function(action) {
  if (!action){ return;}
  winston.info("Face Recognition: " + action);
  remote({ 'face' : action });
};

var gesture = function(action) {
  if (!action){ return;}
  winston.info("Gesture Recognition: " + action);
  remote({ 'gesture' : action });
};

var keyText = function(text) {
  if (!text){ return;}
  winston.info("KeyText:", text);
  remote({ 'keyText' : text });
};

var runApp = function(app, params) {
  if (!app){ return;}
  winston.info("Run:", app);
  var qs = { 'run' : app }
  if (params) { qs.runp = params; }
  remote(qs);
}

var activate = function(app) {
  if (!app){ return;}
  winston.info("Activate:", app);
  remote({ 'activate' : app });
}

var chromeless = function(url, o, w, h, x, y){
  var path  = require('path');
  var spawn = require('child_process').spawn;
  var proc  = path.normalize(__dirname + '../../../chromeless/chromeless.exe');
  
  var params  = ['-url', url]
  
  if (w !== undefined){ params.push('-w'); params.push(w); }
  if (h !== undefined){ params.push('-h'); params.push(h); }
  if (x !== undefined){ params.push('-x'); params.push(x); }
  if (y !== undefined){ params.push('-y'); params.push(y); }
  if (o !== undefined){ params.push('-opacity'); params.push(o); }
  
  console.log(proc, params);
  
  var child = spawn(proc, params);
  child.stderr.on('data', function (data) { });
  child.stdout.on('data', function (data) { });
}

// ------------------------------------------
//  EVENT
// ------------------------------------------

var events = require('events');
var ee = new events.EventEmitter();

var listen = function(event, callback){
  ee.on(event, callback);
}

var trigger = function(event, data){
  ee.emit(event, data);
}

// ------------------------------------------
//  ASKME
// ------------------------------------------

var stack = [];
var options = false;
var askme = function(tts, grammar, timeout, callback){
  if (!grammar) { return; }
  if (!callback){ return; }
  if (options)  { return stack.push(arguments); }
  
  // Build request
  console.log('AskMe', options);
  options = { 'grammar':[], 'tags':[] }
  if (tts) options.tts = tts;
  for (var g in grammar){
    options.grammar.push(g);
    options.tags.push(grammar[g]);
  }
  
  // Send request
  remote(options);
  
  // Backup
  options.rule     = grammar
  options.callback = callback;
  options.token    = setTimeout(function(){
      options = false;
      if (timeout <= 0){
        callback(false, end);
      } else {
        SARAH.askme(tts, grammar, 0, callback);
      }
  }, timeout || 16000);
}

var answerme = function(req, res, next){
  if (!options){ return; }
  if (options.token){
    clearTimeout(options.token);
  }

  res.end();
  options.callback(req.param('dictation') || req.param('tag'), end);
}

var asknext = function(){
  if (stack.length <= 0){
     remote({ 'context' : 'default' });  return; 
  }
  var args = stack.shift();
  askme(args[0], args[1], args[2], args[3])
}

var end = function(){ 
  options = false; 
  asknext(); 
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
  options.SARAH = SARAH;
  
  return ejs.render(text, options);
};

// ------------------------------------------
//  CONTEXT
// ------------------------------------------

var routes = function(req, res, next){
  var json = req.param('profiles');
  if (json){
    SARAH.context.profiles = JSON.parse(json);
    winston.info('Updating profiles... ');
  }
  res.end();
};

var getProfile = function(name){
  var profiles = SARAH.context.profiles;
  if (!profiles){ return false; }
  for(var i = 0; i < profiles.length; i++){
    if (profiles[i].Name == name){ return profiles[i]; }
  }
  console.log('Profile not found', name, profiles);
  return false;
}

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
  
  // An object to store contextual stuff
  'context' : {},
  'getProfile' : getProfile,
  
  // Routes context
  'routes' : routes,
  
  // Callback for all scripts / phantom / cron
  'dispatch': dispatch,
  
  // Send speak command on remote
  'speak' : speak,
  'answer': answer,
  
  // Send play command on remote
  'play': play,
  
  // Send pause command on remote
  'pause': pause,
  
  // Send face recognition command
  'face': face,
  
  // Send gesture recognition command
  'gesture': gesture,
  
  // AskMe
  'askme' : askme,
  'answerme' : answerme,
  
  // EventEmiter
  'listen'  : listen,
  'trigger' : trigger,
  
  // Keyboard remote commands
  'runApp'  : runApp,
  'activate': activate,
  'keyPress': function(key, mod) { _key(key, 'keyPress', mod) },
  'keyDown' : function(key, mod) { _key(key, 'keyDown', mod) },
  'keyUp'   : function(key, mod) { _key(key, 'keyUp', mod) },
  'keyText' : keyText,
  'chromeless': chromeless,
  
  // General purpose remote action on WSRMacro
  'remote': remote,
  
  // Run local http request on given uri 
  'script': script,
  
  // Run local module
  'run' : run,
  'call': call,
  
  // Run last runned module
  'last': last,
  
  // Check if module exists
  'exists' : exists,
  
  // Get RSS Feed
  'getRSSFeed' : getRSSFeed
}


/**
 * EXPORTS
 */
exports.init = SARAH.init;