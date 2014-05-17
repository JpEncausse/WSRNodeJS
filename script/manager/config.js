var fs = require('fs');
var xtend = require('../lib/extend.js');
var winston = require('winston');
var pwd = require('path');

// ------------------------------------------
//  REQUIRE - HELPER
// ------------------------------------------

/**
 * Removes a module from the cache
 */
require.uncache = function (moduleName) {
  // Run over the cache looking for the files
  // loaded by the specified module name
  require.searchCache(moduleName, function (mod) {
    delete require.cache[mod.id];
  });
};

/**
 * Runs over the cache to search for all the cached
 * files
 */
require.searchCache = function (moduleName, callback) {
  // Resolve the module identified by the specified name
  var mod = require.resolve(moduleName);

  // Check if the module has been resolved and found within
  // the cache
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // Recursively go over the results
    (function run(mod) {
      // Go over each of the module's children and
      // run over it
      mod.children.forEach(function (child) {
          run(child);
      });

      // Call the specified callback providing the
      // found module
      callback(mod);
    })(mod);
  }
};


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
      winston.log('info', 'Loading plugin properties %s ...', path);
      try {
        var json   =  fs.readFileSync(path,'utf8');
        var plugin = JSON.parse(json);
      } catch(ex){ winston.warn(ex.message); }
      xtend.extend(true, conf, plugin);
    }
  });
  return conf;
}

var getJSON = function(name){
  var path = 'plugins/'+name+'/'+name+'.prop';
  if (!fs.existsSync(path)){ return {}; }
  
  //winston.log('info', 'Loading plugin properties %s ...', path);
  try {
    var json = fs.readFileSync(path,'utf8');
    return JSON.parse(json);
  } catch(ex){ winston.warn(ex.message); }
}

/**
 * Load default properties
 */
var loadProperties = function(){
  if (!fs.existsSync('script/wsrnode.prop')) { return {}; }
  winston.info('Loading core properties...');
  var json = fs.readFileSync('script/wsrnode.prop','utf8');
  return JSON.parse(json);
}

/**
 * Load custom properties
 */
var loadCustoms = function(){
  if (!fs.existsSync('custom.prop')) { return {}; }
  winston.info('Loading custom properties...');
  var json = fs.readFileSync('custom.prop','utf8');
  var parse = {};
  try { parse = JSON.parse(json); } catch (ex){ winston.error(ex.message); }
  
  parse['modules']  = retains(parse['modules'],  config['modules']);
  parse['phantoms'] = retains(parse['phantoms'], config['phantoms']);
  parse['cron']     = retains(parse['cron'],     config['cron']);

  return parse;
}

var retains = function(source, target){
  if (typeof source != 'object') return source;
  
  var clean  = {};
  Object.keys(source).forEach(function(attr){
    if (attr == 'description' || attr == 'version'){ return false; }
    if (target[attr] === undefined
        && attr != 'x' && attr != 'y' 
        && attr != 'w' && attr != 'h'
        && attr != 'c'){ return winston.log('warn', 'Bypass config: ', attr); }
    clean[attr] = retains(source[attr], target[attr]);
  });
  
  return clean;
}

// ------------------------------------------
//  SAVE  PLUGIN
// ------------------------------------------

var saveProperties = function(cfg) {
  try {
    config = cfg || config;
    var json = JSON.stringify(config);

    //json = json.replace(/\{/g,"{\n  ").replace(/\}/g,"\n  }").replace(/,/g,",\n  ");
    fs.writeFileSync('custom.prop', json, 'utf8');
    winston.info('Properties saved successfully');
  } catch(ex) {
    winston.log('error', 'Error while saving properties:', ex.message);
  }
}

// ------------------------------------------
//  ROUTES  PLUGIN
// ------------------------------------------

var routes = function(req, res, next){

  var json = req.body.json;
  if (json){
    json = JSON.parse(json);
    xtend.extend(true, config, json);
    ConfigManager.save(config);
    res.redirect('/home');
    return; 
  }
  
  var key = req.body.key;
  if (!key){ res.redirect('/home');  return; }

  var cnf = config;
  key.split('.').forEach(function(attr){  cnf = cnf[attr]; });
  
  Object.keys(req.body).forEach(function(attr){
    if (attr == 'key') { return; }
    winston.info(key+'.'+attr+' => '+req.body[attr]);
    cnf[attr] = req.body[attr];
  });

  ConfigManager.save(config);
  res.redirect('/home');
}


// ------------------------------------------
//  GET MODULE
// ------------------------------------------

var getModule = function(name, uncache){
  var module = false;
  var path = false;

  try {
    path = pwd.normalize(__dirname+'/../../plugins/'+name+'/'+name+'.js');
    if (config.debug || uncache){ require.uncache(path); }
    module = require(path);  
  } 
  catch (ex) { 
    try { 
      path = pwd.normalize(__dirname+'/../'+name+'.js');
      if (config.debug || uncache){ require.uncache(path); } 
      module = require(path); 
    } catch (ex) { }
  }
  
  initModule(module, name); 
  if (!module){ return false;  }
  
  var modified = fs.statSync(path).mtime.getTime();
  if (!module.lastModified){
    module.lastModified = modified;
  }
  
  if (uncache){ return module; }
  
  if (module.lastModified < modified){
    winston.log('info', 'Reloading '+name);
    return getModule(name, true);
  }
  
  return module;
}

var initModule = function(module, name){
  try {
    if (!module) { return; }
    
    if (module.initialized){ return; }
    module.initialized = true;
     
    winston.log('info','initModule: ', name);
    if (!module.init){ return; }
    module.init(SARAH);
  } catch (ex) { winston.log('warn','initModule: ' + ex.message); }
}

// ------------------------------------------
//  GET TICKER
// ------------------------------------------

var ticker = '&nbsp;';
var getTicker = function(){
  var url = 'http://ticker.sarah.encausse.net';
  var request = require('request');
  request({ 
    'uri' : url, 'json' : true,
    'headers': {'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.75 Safari/537.1'} 
  }, function (err, response, json){
    if (err || response.statusCode != 200) { winston.info("Can't retrieve remote ticker");  return; }
    ticker = json.message; // delayed by 1 request
  });
  return ticker;
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var config;
var SARAH = false;
var ConfigManager = {
  
  // Constructor
  'init': function(app){
    SARAH = app; ConfigManager.getTicker();
    return ConfigManager; 
  },
  
  // Load all config
  'load': function(){
    config = { 'debug' : false };
    try       { 
      xtend.extend(true, config, loadProperties());
      xtend.extend(true, config, loadPlugins());
      xtend.extend(true, config, loadCustoms());
      config.bot.version = "3.1.5";
    } 
    catch(ex) { winston.log('error', 'Error while loding properties:', ex.message);  }
    return ConfigManager;
  },
  
  // Routes webapp
  'routes': routes,
  
  // Save custom config
  'save': saveProperties,
  
  // Require a module / plugin 
  'getModule': getModule,
  
  // Return JSON of given plugin (without custom)
  'getJSON': getJSON,
  
  // Return remote ticker message
  'getTicker': getTicker,
  
  // Get config object
  'getConfig': function(){ return config; }
}


/**
 * EXPORTS
 */
exports.init = ConfigManager.init;