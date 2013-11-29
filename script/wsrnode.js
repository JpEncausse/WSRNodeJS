
// ==========================================
//  HELPER
// ==========================================

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// ==========================================
//  LOG MANAGER
// ==========================================

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'script/wsrnode.log' });
winston.addColors({ info : 'blue' });

winston.info("==========================================");
winston.info(" STARTING WSRNodeJS ");
winston.info("==========================================");

process.on('uncaughtException', function (err) {
  winston.log('error','Caught exception: '+err.stack);
});

// ==========================================
//  SARAH MANAGER
// ==========================================

var SARAH = require('./manager/sarah.js').init();

// ==========================================
//  EXPRESS SERVER
// ==========================================
// https://github.com/RandomEtc/ejs-locals

// Init Express
var __webapp = __dirname + '/../webapp';
var express  = require('express');
var engine   = require('ejs-locals');
var routes   = require(__webapp + '/routes');

// Build App
var app = module.exports = express();
var http = require('http');
var server = http.createServer(app);

// Set EJS Engine
app.engine('ejs',  engine);
app.engine('html', engine);
app.set('views', __webapp + '/views');
app.set('view engine', 'ejs');

// Set config
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './webapp/uploads' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(__webapp  + '/static'));

// Routes
app.locals({ 'nav' : 'home', 'SARAH' : SARAH });

app.get('/',        routes.index);
app.get('/home',    routes.home);
app.get('/kinect',  routes.kinect);
app.get('/about',   routes.about);
app.get('/badge',   routes.badge);
app.get('/plugin',  routes.plugin);

// Link app
SARAH.express = { 
  'app' : app,
  'server' : server
};

// Context
app.post('/profiles', SARAH.routes);
app.get('/askme', SARAH.answerme);

// ==========================================
//  LOAD CONFIGURATION
// ==========================================

SARAH.ConfigManager.load();
app.post('/config', SARAH.ConfigManager.routes);

// ==========================================
//  PLUGIN MANAGER
// ==========================================

var webpath = __dirname + '/../plugins';
SARAH.PluginManager.load(webpath);

app.use ('/assets/',          express.static(webpath));
app.get ('/plugins',          SARAH.PluginManager.list);
app.get ('/plugins/:plugin*', SARAH.PluginManager.display);
app.get ('/store',            SARAH.PluginManager.routes);
app.get ('/editor',           SARAH.PluginManager.editorGET);
app.post('/editor',           SARAH.PluginManager.editorPOST);
app.get ('/standby',          SARAH.PluginManager.standby);

// ==========================================
//  RULE MANAGER
// ==========================================

app.get('/rules',     SARAH.RuleManager.routes);
app.post('/rules',    SARAH.RuleManager.save);

// ==========================================
//  UPLOAD SCRIPT
// ==========================================

var upload = require('./lib/upload.js');
app.post('/upload*', function(req, res, next){
  upload.action(req, res, SARAH.ConfigManager.getConfig());
});

// ==========================================
//  PHANTOM / SCRIPT
// ==========================================

app.get ('/sarah/phantom/:plugin', SARAH.PhantomManager.routes);
app.get ('/sarah/:plugin',         SARAH.ScriptManager.routes);
app.post('/sarah/:plugin',         SARAH.ScriptManager.routes);

// ==========================================
//  INIT MODULES
// ==========================================

for(var module in SARAH.ConfigManager.getConfig()['modules']){
  SARAH.ConfigManager.getModule(module);
}

// ==========================================
//  CRON MANAGER
// ==========================================

SARAH.CRONManager.startAll();

// ==========================================
//  START SERVER
// ==========================================

var webapp = server.listen(SARAH.ConfigManager.getConfig().http.port);
winston.log('info', "Express server listening on port %d", webapp.address().port);

