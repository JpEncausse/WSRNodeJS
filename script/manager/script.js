var url   = require('url');
var qs    = require('querystring');
var xtend = require('../lib/extend.js');

// ------------------------------------------
//  ROUTES
// ------------------------------------------

var routes = function(req, res, next){

  // Parse URL & QueryString
  var rUrl = url.parse(req.url);
  var rQs  = qs.parse(rUrl.query);
  
  // Parse Command
  var cmd = rUrl.pathname;
  cmd = cmd.substring(cmd.lastIndexOf('/')+1);
  
  // Run command
  run(cmd, rQs, res);
}

var run = function(cmd, rQs, res){
  
  // Callback
  var callback = function(opts){
    var options = xtend.extend(true, rQs, opts);
    SARAH.dispatch(cmd, options, res);
  }
  
  // Call script
  try {
    var module = SARAH.ConfigManager.getModule(cmd);
    module.action(rQs, callback, SARAH.ConfigManager.getConfig(), SARAH);
  } 
  catch(e){ 
    console.log(e);
    callback('Je ne comprends pas');  
  }
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var SARAH = false;
var ScriptManager = {

  'init': function(app){
    SARAH = app;
    return ScriptManager;
  },
  
  // Routes webapp
  'routes': routes,
  
  // Run a script
  'run': run
}


/**
 * EXPORTS
 */
exports.init = ScriptManager.init;