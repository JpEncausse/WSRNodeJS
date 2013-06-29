var winston = require('winston');

// ------------------------------------------
//  ROUTES  RULES
// ------------------------------------------

var routes = function(req, res, next){
  res.render('rules', { 'nav' : 'rules' });
};

var saveRules = function(req, res, next){
  var _if       = req.param('if');
  var _then     = req.param('then');
  var _script   = req.param('script');
  var _disabled = req.param('disabled');
  
  _if       = (typeof _if       === 'string') ? [_if]       : _if;
  _then     = (typeof _then     === 'string') ? [_then]     : _then;
  _script   = (typeof _script   === 'string') ? [_script]   : _script;
  _disabled = (typeof _disabled === 'string') ? [_disabled] : _disabled;
  
  if (_if.length != _then.length ||  _then.length != _script.length){
    winston.log('info','Wrong IFTTT parameters', _if, _then, _script, _disabled);
    res.redirect('/rules');
    return;
  }
  
  var rules = [];
  for (var i = 0; i < _if.length ; i++){
    rules.push({
      'if': _if[i],  'then': _then[i], 'script': _script[i], 'disabled': _disabled[i]
    });
  }
  SARAH.ConfigManager.getConfig().rules = rules;
  SARAH.ConfigManager.save();
  res.redirect('/rules');
}

// ------------------------------------------
//  DISPATCHE  RULES
// ------------------------------------------

/**
 * Return true if dispatch has been performed otherwise false
 */
var dispatch = function(cmd, options){
  options._cmd = cmd;
  iterate('before',    options);
  var r = iterate(cmd, options);
  iterate('after',     options);
  return r;
}

var iterate = function(cmd, options){
  var speak = false;
  var hasRule = false;

  var rules = SARAH.ConfigManager.getConfig().rules
  if (!rules){ return false; }
  
  for (var i = 0 ; i < rules.length ; i++){
    try {
      var rule = rules[i];
      if (rule['disabled'] == 'true'){ continue; }
      if (rule['if'] != cmd){ continue; } hasRule = true;
      if (rule['script']){ eval(rule['script']); }
      if (rule['then'] == 'speak'){ speak = true; continue; }
      if (!rule['then']){ continue; }
      SARAH.run(rule['then'], options);
    } catch(ex) { winston.log('warn', 'Rule: ',ex); }
  }
  
  return hasRule && !speak;
}

// ------------------------------------------
//  PUBLIC
// ------------------------------------------

var SARAH = false;
var RuleManager = {
  
  // Constructor
  'init': function(app){
    SARAH = app;
    return RuleManager; 
  },
  
  // Dispatch rules
  'dispatch': dispatch,
  
  // Routes webapp to rules
  'routes' : routes,
  
  // Save custom config
  'save': saveRules
}

/**
 * EXPORTS
 */
exports.init = RuleManager.init;