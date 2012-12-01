var fs = require('fs');
var xtend = require('../lib/extend.js');

// ------------------------------------------
//  LOAD  PLUGIN
// ------------------------------------------

/**
 * Load plugin properties recursively
 */
var loadPlugins = function(folder, conf){ 
  var conf = conf || {};
  var folder = folder || 'plugins';
  
  if (!fs.existsSync(folder)) { return conf; }
  
  fs.readdirSync(folder).forEach(function(file){
    var path = folder+'/'+file;
    
    // Directory
    if (fs.statSync(path).isDirectory()){
      loadPlugins(path, conf);
      return conf;
    }
    
    // Ends with .prop
    if (file.endsWith('.prop')){
      console.log('Loading plugin properties %s ...', path);
      var json   =  fs.readFileSync(path,'utf8');
      var plugin = JSON.parse(json);
      xtend.extend(true, conf, plugin);
    }
  });
  return conf;
}

/**
 * Load default properties
 */
var loadProperties = function(){
  if (!fs.existsSync('script/wsrnode.prop')) { return {}; }
  console.log('Loading core properties...');
  var json = fs.readFileSync('script/wsrnode.prop','utf8');
  return JSON.parse(json);
}

/**
 * Load custom properties
 */
var loadCustoms = function(){
  if (!fs.existsSync('script/custom.prop')) { return {}; }
  console.log('Loading custom properties...');
  var json = fs.readFileSync('script/custom.prop','utf8');
  return JSON.parse(json);
}

// ------------------------------------------
//  SAVE  PLUGIN
// ------------------------------------------

var saveProperties = function(cfg) {
  try {
    config = cfg || config;
    var json = JSON.stringify(config);

    json = json.replace(/\{/g,"{\n  ").replace(/\}/g,"\n  }").replace(/,/g,",\n  ");
    fs.writeFileSync('script/custom.prop', json, 'utf8');
    console.log('Properties saved successfully');
  } catch(ex) {
    console.log('Error while saving properties:', ex.message);
  }
}

// ------------------------------------------
//  ROUTES  PLUGIN
// ------------------------------------------

var routes = function(req, res, next){

  var key = req.body.key;
  if (!key){ res.redirect('/home');  return; }

  var cnf = config;
  key.split('.').forEach(function(attr){  cnf = cnf[attr]; });
  
  Object.keys(req.body).forEach(function(attr){
    if (attr == 'key') { return; }
    console.log(key+'.'+attr+' => '+req.body[attr]);
    cnf[attr] = req.body[attr];
  });

  ConfigManager.save(config);
  res.redirect('/home');
}


// ------------------------------------------
//  GET MODULE
// ------------------------------------------

var getModule = function(name){
  var module = false;
  try { module = require('../../plugins/'+name+'/'+name+'.js'); } 
  catch (ex) { 
    try { module = require('../'+name+'.js'); } catch (ex) { }
  }
  return module;
}

// ------------------------------------------
//  GET TICKER
// ------------------------------------------

var ticker = '&nbsp;';
var getTicker = function(){
  var url = 'https://dl.dropbox.com/u/255810/Encausse.net/Sarah/plugins/ticker.json';
  var request = require('request');
  request({ 'uri' : url, json : true }, function (err, response, json){
    if (err || response.statusCode != 200) { console.log("Can't retrieve remote ticker");  return; }
    ticker = json.message; // delayed by 1 request
  });
  return ticker;
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var config = {};
var SARAH = false;
var ConfigManager = {
  
  // Constructor
  'init': function(app){
    SARAH = app; ConfigManager.getTicker();
    return ConfigManager; 
  },
  
  // Load all config
  'load': function(){
    try       { 
      xtend.extend(true, config, loadProperties());
      xtend.extend(true, config, loadPlugins());
      xtend.extend(true, config, loadCustoms());
    } 
    catch(ex) { console.log('Error while loding properties:', ex.message);  }
    return ConfigManager;
  },
  
  // Routes webapp
  'routes': routes,
  
  // Save custom config
  'save': saveProperties,
  
  // Require a module / plugin 
  'getModule': getModule,
  
  // Return remote ticker message
  'getTicker': getTicker,
  
  // Get config object
  'getConfig': function(){ return config; }
}


/**
 * EXPORTS
 */
exports.init = ConfigManager.init;