var cronJob = require('../vendor/cron').CronJob;

// ------------------------------------------
//  START JOB
// ------------------------------------------

/**
 * Starting a single job for a module
 */
var startJob = function(task, module){
  if (!module){ 
    console.log('Missing CRON module');
    return; 
  }
  
  if (!task.time){
    console.log("Missing task's name or time properties");
    return;
  }
  
  console.log('Starting CRON Job for %s at %s', task.name, task.time);
  
  // Build callback
  var callback = function(options){
    SARAH.dispatch(task.name, options);
  }
  
  // Create job
  var job = new cronJob({
    cronTime: task.time,
    onTick: function() {
      console.log('Cron: %s', task.name);
      module.cron(callback, task);
    },
    start: true
  });
  
  // First call
  module.cron(callback, task);
}

/**
 * Starting all jobs from properties
 */
var startAll = function(){
  var config = SARAH.ConfigManager.getConfig();
  if (!config.cron){ return; }
  
  Object.keys(config.cron).forEach(function(key){
    var task = config.cron[key];
    var module = SARAH.ConfigManager.getModule(key);
    console.log('Starting task %s ...', key);
    CRONManager.start(task, module);
  });
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var SARAH = false;
var CRONManager = {
  
  'init': function(app){
    SARAH = app;
    return CRONManager;
  },
  
  // Start a single job
  'start': startJob,
  
  // Start all jobs
  'startAll' : startAll
}


/**
 * EXPORTS
 */
exports.init = CRONManager.init;