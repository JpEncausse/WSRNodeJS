var url   = require('url');
var qs    = require('querystring');
var xtend = require('../lib/extend.js');
var winston = require('winston');

// ------------------------------------------
//  ROUTES  PHANTOM
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
  
  // Call phantom
  var start = (new Date()).getTime();
  try {
    var phantom = require('../lib/phantom.js'); 
    phantom.action(cmd, rQs, callback, SARAH);
  } 
  catch(ex){ 
    winston.log('warn', 'Phantom '+cmd+': ', ex);
    SARAH.dispatch({ tts : 'Je ne comprends pas'}, res); 
  }
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var SARAH = false;
var PhantomManager = {

  'init': function(app){
    SARAH = app;
    return PhantomManager;
  },
  
  // Routes webapp
  'routes' : routes,
  
  // Run a phantom
  'run': run
}


/**
 * EXPORTS
 */
exports.init = PhantomManager.init;