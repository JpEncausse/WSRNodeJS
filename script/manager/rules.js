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
//  SORTING MANAGER
// ------------------------------------------

var seek   = 1*60*3;  //  3 minutes
var scope  = 1*60*30; // 15 minutes
var moment = require('moment'); moment.lang('fr');

var log = function(action){

  var now = moment();
  var day = moment().startOf('day');
  
  action.timeOfDay  = now.diff(day) / 1000;
  action.dayOfWeek  = now.day();
  action.dayOfMonth = now.date();
  action.location   = 'house';
  action.count      = 0;
  
  // Try to find same spot within large scope
  var node = logs.find(action)
  if (node){ 
    action = node.value; action.count++;
    console.log('Found: ', action); 
  }
  
  // Then add to list
  logs.add(action);
  return action;
}

var next = function(action){ return; // See sarah.js > dispatch()
  if (!action) return;
  
  var frame = [];
  _next(action, frame, action.timeOfDay,  1);
  _next(action, frame, action.timeOfDay, -1);
  
  frame.sort(function(a, b){ return b.timeOfDay - a.timeOfDay; })
  
  for(var i = 0 ; i < frame.length ; i++){
    console.log(action.cmd + ' => ' + frame[i].cmd + ' ('+Math.abs(action.timeOfDay - frame[i].timeOfDay)+')');
    SARAH.call(frame[i].cmd, frame[i].options);
  }
}

var _next = function(action, frame, time, direction){
  if (!action){ return; }
  if (action.value){ action = action.value; }
  if (Math.abs(action.timeOfDay - time) > seek){ return; }
  
  if (action.timeOfDay != time){ // avoid root
    frame.push(action);
  }
  
  if (direction > 0) {
    _next(logs.findLeastGreaterThan(action), frame, time, direction);
  } else {
    _next(logs.findGreatestLessThan(action), frame, time, direction);
  }
}

var equals = function(x, y){
  return compare(x,y) == 0;
}

var compare = function(x, y){
  var tod = x.timeOfDay  - y.timeOfDay;
  var dow = x.dayOfWeek  - y.dayOfWeek;
  var dom = x.dayOfMonth - y.dayOfMonth;
  var cnt = x.count - y.count;
  
  // FIXME: compare the options
  
  if (tod < scope ){
    if (x.location == y.location && x.cmd == y.cmd){ return 0; }
    if (dom != 0){ return dom; }
    if (dow != 0){ return dow; }
    if (cnt != 0){ return cnt; }
    return x.cmd.localeCompare(y.cmd);
  }
  else { return tod; }
}

var SortedSet = require("collections/sorted-set");
var logs = new SortedSet([], equals, compare);

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
  'save': saveRules,
  
  // Log called command
  'log' : log,
  'next': next,
  'getLogs': function(){ return logs }
}

/**
 * EXPORTS
 */
exports.init = RuleManager.init;