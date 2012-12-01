var exec  = require('child_process').exec;
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
  var options = {}
  var config = SARAH.ConfigManager.getConfig();

  if (config.phantoms && config.phantoms[cmd]){
    xtend.extend(true, options, config.phantoms[cmd]);
    options.description = undefined;
    options.version = undefined;
  }
  xtend.extend(true, options, data);
  options.directory = undefined;
  
  // Build shell path
  var json   = JSON.stringify(options).replace(/"/g, '\\"');
  var path   = '%CD%/PhantomJS/phantomjs.exe "%CD%/'+script+'" "' + json + '"';
  
  console.log("Phantom: "+path); 
  var child  = exec(path, function (error, stdout, stderr) {
    if (stdout){ console.log('Stdout: ' + stdout); }
    if (stderr){ console.log('Stderr: ' + stderr); }
    if (error) { console.log('Exec error: ' + error); }
    
    // Parse results
    var json = JSON.parse(stdout);
    
    // Hook perfoming on results
    var module = false;
    try { module = require('../../plugins/'+cmd+'/'+cmd+'.node.js'); } 
    catch (ex) {
      try { module = require('./'+cmd+'.node.js'); } catch (ex) { }
    }
    if (module){
      console.log('Running phantom callback %s ...', cmd+'.node');
      options.directory = data.directory;  
      module.after(options, json);
    }
    
    // Finish with callback
    callback(json);
  });
}