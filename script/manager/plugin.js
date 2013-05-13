// ------------------------------------------
//  ROUTES  PLUGIN
// ------------------------------------------

var routes = function(req, res, next){
  
  if (req.param('delete')){
    var name = req.param('delete');
    PluginManager.remove(name, function(){
      res.redirect('/store');
    });
    return;
  }
  
  if (req.param('install')){
    var name = req.param('install');
    PluginManager.install(name, function(){
      res.redirect('/store');
    });
    return;
  }
  
  res.render('store', { 'nav' : 'store' });
};

// ------------------------------------------
//  INSTALL PLUGIN
// ------------------------------------------

var fs = require('fs');
var AdmZip = require('adm-zip');

var installPlugin = function(name, cb){
  
  if (fs.existsSync('plugins/'+name)){ console.log("Can't install plugin already installed"); cb(); return;}
  if (!fs.existsSync('./tmp')){ fs.mkdirSync('./tmp'); }
  if (fs.existsSync('./tmp/'+name+'.zip')){ fs.unlinkSync('./tmp/'+name+'.zip'); }

  var path = 'https://dl.dropbox.com/u/255810/Encausse.net/Sarah/plugins/'+name+'.zip';
  var plugin = PluginManager.remote[name];
  if (plugin && plugin.dl){ path = plugin.dl; }
  
  console.log('Download plugin: ', name, path);
  var request = require('request');
  request({
      'uri': path,
      'headers': {'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.75 Safari/537.1'}
    }, function (error, response, body) {
    
    console.log('Unzip plugin: ' + name);
    fs.mkdirSync('plugins/'+name);
    
    var zip = new AdmZip('tmp/'+name+'.zip');
    zip.extractAllTo('plugins/'+name, false);
    
    cb();
    
  }).pipe(fs.createWriteStream('tmp/'+name+'.zip'))
}

// ------------------------------------------
//  DELETE PLUGIN
// ------------------------------------------

var removePlugin = function(name, cb){
  var path = 'plugins/'+name;
  if (!fs.existsSync(path)){ cb(); return; }
  console.log('Delete plugin: ' + path);
  rmdirSyncRecursive(path);
  cb();
}

var rmdirSyncRecursive = function(path){
  var stat = fs.statSync(path);
  if (stat.isFile()){
    fs.unlinkSync(path);
    return;
  }
  
  var files = fs.readdirSync(path)
  for (var i = 0 ; files && i < files.length ; i++){
    rmdirSyncRecursive(path+'/'+files[i]);
  }
  fs.rmdirSync(path);
}

// ------------------------------------------
//  EDITOR
// ------------------------------------------

var editorGET = function(req, res, next){ 
  res.render('ajax/editor.ejs', { 
    'key' : req.param('key'),
    'type': req.param('type'),
    'file': req.param('file')
  });
};

var editorPOST = function(req, res, next){
  saveFile(
    req.param('key'),
    req.param('file'),
    req.param('code')
  );
  res.end();
}

var getFiles = function(name){
  var list = [];
  var path = 'plugins/'+name+'/'+name;
  if (fs.existsSync(path+'.js'))  { list.push(name+'.js');  }
  if (fs.existsSync(path+'.xml')) { list.push(name+'.xml'); }
  if (fs.existsSync(path+'.prop')){ list.push(name+'.prop');}
  
  return list;
}

var loadFile = function(name, file){
  if (!name || !file){ return ''; }
  var path = 'plugins/'+name+'/'+file;
  var text = fs.readFileSync(path,'utf8');
  return text;
}

var saveFile = function(name, file, content){
  if (!name || !file){ return; }
  var path = 'plugins/'+name+'/'+file;
  fs.writeFileSync(path, content, 'utf8');
  SARAH.ConfigManager.getModule(name, true);
}

// ------------------------------------------
//  LIST PLUGINS
// ------------------------------------------

/**
 * Retrive remote plugins information from main server
 */
var  getRemotePlugins = function(){
  var url = 'https://dl.dropbox.com/u/255810/Encausse.net/Sarah/plugins/plugins.json';
  var request = require('request');
  request({ 'uri' : url, json : true }, function (err, response, json){
    
    if (err || response.statusCode != 200) {
      console.log("Can't retrieve remote plugins");
      return;
    }

    PluginManager.remote = json;
  });
}

/**
 * Build information for local plugins
 */
var  getLocalPlugins = function(){

  var local   = fs.readdirSync('./plugins');
  var config  = SARAH.ConfigManager.getConfig();
  var plugins = {};
  
  for (var i  = 0 ; i < local.length ; i++){
    var name  = local[i];
    var conf  = (config.modules[name] || config.phantoms[name] || config.cron[name]);
    var rmot  = PluginManager.remote[name];
    plugins[name] = {
      'name'       : name,
      'url'        : rmot ? rmot.url : false,
      'v'          : (conf ? conf.version || '-' : '-') + ' / ' + (rmot ? rmot.v : '-'),
      'author'     : rmot ? rmot.author : '-', 
      'tags'       : rmot ? rmot.tags : '',
      'description': conf ? conf.description : (rmot ? rmot.description : ''),
      'installed'  : true,
      'remote'     : rmot ? true : false
    };
  }
  return plugins;
}

/**
 * Build information for local and remote plugins
 */
var getAllPlugins = function(){
    
  // Local plugins
  var plugins = PluginManager.getLocals();

  // Remote remaining plugins
  for (var name in PluginManager.remote){
    if (plugins[name]){ continue; }
    var rmot  = PluginManager.remote[name]; 
    plugins[name] = {
      'name'       : name,
      'url'        : rmot ? rmot.url : false,
      'v'          : '- / ' + rmot ? rmot.v : '-',
      'author'     : rmot ? rmot.author : '-', 
      'tags'       : rmot ? rmot.tags : '',
      'description': rmot ? rmot.description : '',
      'installed'  : false,
      'remote'     : true
    }
  }
  
  return plugins;
}

// ------------------------------------------
//  PLUGINS WEBPAGES
// ------------------------------------------
// EJS Hack to retrieve content from plugin directory

var ejs = require('ejs')

/**
 * Render plugin page with EJS
 */
var render = function(path, options){
  path = 'plugins/' + path;
  return SARAH.render(path, options);
};


/**
 * Displays generic plugin page
 */
var display = function(req, res, next){
  var rgxplugin = /\/plugins\/(\w+)\/*/g;
  var plugin = rgxplugin.exec(req.path);
  if (!plugin || plugin.length != 2){ res.send(404); return; }

  res.render('plugins', { 
    'plugins' : render,
    'plugin'  : plugin[1]
  });
}

/**
 * Check if plugin have index.html
 */
var hasWebPage = function(name){
  path = webpath + '/' + name + "/index.html";
  return fs.existsSync(path);
}

/**
 * Check if plugin have icon.png
 */
var hasIcon = function(name){
  path = webpath + '/' + name + '/' + name + '.png';
  return fs.existsSync(path);
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------


var webpath = false;
var SARAH = false;
var PluginManager = {
  
  remote: {},
  
  // Constructor
  'init': function(app){
    SARAH = app;
    return PluginManager; 
  },
  
  // Initialize stuff
  'load': function(path){ 
    webpath = path;
    getRemotePlugins();  
    return PluginManager; 
  },
  
  'hasPlugins' : function(){ 
    var loc = PluginManager.getLocals();
    if (!loc) return false;
    for (var name in loc){ return true;}
    return false;
  },
  
  // Check if there is index.html
  'hasWebPage' : hasWebPage,
  
  // Check if there is an icon
  'hasIcon' : hasIcon,
  
  // Routes webapp to plugins
  'display' : display,
  
  // Routes webapp to store
  'routes' : routes,
  
  // Routes Editor
  'editorGET':  editorGET,
  'editorPOST': editorPOST,
  
  // Download and install
  'install' : installPlugin,
  
  // Delete deep plugin's folder
  'remove': removePlugin,
  
  // Retrieve information of local plugins
  'getLocals': getLocalPlugins,

  // Retrieve information of all plugins
  'getPlugins': getAllPlugins,
  
  // Retrieve files for given plugin
  'getFiles': getFiles,
  
  // Retrieve file content
  'loadFile': loadFile
}

/**
 * EXPORTS
 */
exports.init = PluginManager.init;
