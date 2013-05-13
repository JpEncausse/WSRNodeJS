var exec  = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs    = require('fs');
var xtend = require('./extend.js');

exports.action = function(cmd, data, callback, SARAH){
  
  console.log('Fetching phantom script %s ...', cmd);
  
  // Compute script
  var script = 'script/phantom/'+cmd+'.js';
  if (fs.existsSync('plugins/'+cmd+'/'+cmd+'.js')){
    script = 'plugins/'+cmd+'/'+cmd+'.js';
    data.plugin = true;
  }
  
  // Merge Data and Options
  var options = {};
  var config = SARAH.ConfigManager.getConfig();

  if (config.phantoms && config.phantoms[cmd]){
    xtend.extend(true, options, config.phantoms[cmd]);
    options.description = undefined;
    options.version = undefined;
  }
  xtend.extend(true, options, data);
  options.directory = undefined;
  
  // Build shell path
  var json = JSON.stringify(options);
  var path = require('path');
  var soft = config.http.phantom || (__dirname + "/../../PhantomJS/phantomjs.exe");
  var proc = path.normalize(soft);
  
  console.log("Phantom: ", proc, '--proxy-type=none', script, json); 
  
  var child = spawn(proc, ['--proxy-type=none', script, json]);
  child.stderr.on('data', function (data) { 
    console.log('Error: ',getBuffer(data));
    callback({'tts' : 'Une erreur est survenue'});
  });
  
  child.stdout.on('data', function (data) { 
    var response = getBuffer(data); 
    var json = JSON.parse(response);
    console.log('Success: ', response);
    
    // Hook perfoming on results
    var module = false;
    try { module = require('../../plugins/'+cmd+'/'+cmd+'.node.js'); } 
    catch (ex) {
      try { module = require('./'+cmd+'.node.js'); } catch (ex) { }
    }
    if (module){
      console.log('Running phantom callback %s ...', cmd+'.node');
      options.directory = data.directory;  
      module.after(options, json, SARAH);
    }
    
    callback(json);
  });
  
  child.stdin.end();
}

var getBuffer = function(data){
  var buff = new Buffer(data);
  return buff.toString('utf8');
}


