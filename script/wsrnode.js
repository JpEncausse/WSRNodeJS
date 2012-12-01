
// ==========================================
//  HELPER
// ==========================================

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

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

app.use('/assets/',   express.static(webpath));
app.get('/plugins/*', SARAH.PluginManager.display);
app.get('/store',     SARAH.PluginManager.routes);

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

app.get('/sarah/phantom/*',  SARAH.PhantomManager.routes);
app.get('/sarah/*',          SARAH.ScriptManager.routes);

// ==========================================
//  CRON MANAGER
// ==========================================

SARAH.CRONManager.startAll();

// ==========================================
//  START SERVER
// ==========================================

var webapp = app.listen(SARAH.ConfigManager.getConfig().http.port);
console.log("Express server listening on port %d", webapp.address().port);

