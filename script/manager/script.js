var url     = require('url');
var qs      = require('querystring');
var xtend   = require('../lib/extend.js');
var winston = require('winston');

// ------------------------------------------
//  ROUTES
// ------------------------------------------

var routes = function(req, res, next){

  var cmd   = req.params.plugin;
  var data  = req.query; 
  data.body = req.body;
  
  // Dispatch to SARAH
  SARAH.run(cmd, data, res);
}

var run = function(cmd, rQs, res, cb){
  
  // Callback
  var callback = function(opts){
    var end = (new Date()).getTime();
    winston.log('info', 'Run '+cmd+': '+(end-start)+'ms');
    
    if (cb){ return cb(opts); }
    
    var options = xtend.extend(true, rQs, opts);
    SARAH.dispatch(cmd, options, res);
  }
  
  // Call script
  var start = (new Date()).getTime();
  try {
    var module = SARAH.ConfigManager.getModule(cmd);
    module.action(rQs, callback, SARAH.ConfigManager.getConfig(), SARAH);
  }
  catch(ex){ 
    winston.log('warn', 'Run '+cmd+': '+ ex.message);
    if (res){ res.end(); }
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