// ------------------------------------------
//  ROUTES  RULES
// ------------------------------------------

var routes = function(req, res, next){
  res.render('rules', { 'nav' : 'rules' });
};

var saveRules = function(req, res, next){
  var _if     = req.param('if');
  var _then   = req.param('then');
  var _script = req.param('script');
  
  _if     = (typeof _if     === 'string') ? [_if]     : _if;
  _then   = (typeof _then   === 'string') ? [_then]   : _then;
  _script = (typeof _script === 'string') ? [_script] : _script;
  
  if (_if.length != _then.length ||  _then.length != _script.length){
    console.log('Wrong IFTTT parameters', _if, _then, _script);
    res.redirect('/rules');
    return;
  }
  
  var rules = [];
  for (var i = 0; i < _if.length ; i++){
    rules.push({
      'if': _if[i],  'then': _then[i], 'script': _script[i],
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
  var speak = false;
  var hasRule = false;

  var rules = SARAH.ConfigManager.getConfig().rules
  if (!rules){ return false; }
  
  for (var i = 0 ; i < rules.length ; i++){
    var rule = rules[i];
    if (rule['if'] != cmd){ continue; } hasRule = true;
    if (rule['script']){ eval(rule['script']); }
    if (rule['then'] == 'speak'){ speak = true; continue; }
    SARAH.run(rule['then'], options);
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