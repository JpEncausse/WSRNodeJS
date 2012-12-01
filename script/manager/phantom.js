var url   = require('url');
var qs    = require('querystring');
var xtend = require('../lib/extend.js');

// ------------------------------------------
//  ROUTES  PHANTOM
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
  
  // Call phantom
  try {
    var phantom = require('../lib/phantom.js'); 
    phantom.action(cmd, rQs, callback, SARAH);
  } 
  catch(ex){ 
    console.log(ex);
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