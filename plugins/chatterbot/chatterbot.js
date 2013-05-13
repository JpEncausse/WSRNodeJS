exports.action = function(data, callback, config, SARAH){

  // Retrieve config
  config = config.modules.chatterbot;
  if (!config){
    console.log("Missing Chatterbot config");
    callback({'tts': 'Pas de configuration'});
    return;
  }
  
  if (!data.dictation){
    console.log("Missing Chatterbot message");
    callback({'tts': 'pas de message'});
    return;
  }
  
  // Clean question
  var question = cleanQuestion(data.dictation);

  // Setup
  setup(function(bot){
    if (!bot){ callback({'tts': 'Error while loading'}); return; }
    var reply = bot.reply("local-user", unaccetuate(question));
    callback({'tts': reply});
  });
}

var cleanQuestion = function(question){
  var rgxp1 = /ma question est (.+) Sarah/i
  var match = question.match(rgxp1);
  if (match && match.length > 1){
    return match[1];
  }
  
  var rgxp2 = /dis-moi (.+) Sarah/i
  var match = question.match(rgxp2);
  if (match && match.length > 1){
    return match[1];
  }
  
  return question;
}


var bot = false;
var setup = function(cb){
  if (bot){ return cb(bot); }
  
  var RiveScript = require('./riverscript/bin/RiveScript.js');
  bot = new RiveScript({ debug: false });

  var brain = 'plugins/chatterbot/riverscript/eg/brain';
  bot.loadFile([
    brain + "/activitepresente.rs",
    brain + "/age.rs",
    brain + "/cerveaudebase.rs",
    brain + "/depart.rs",
    brain + "/reactionbot.rs",
    brain + "/substitutions.rs",
    brain + "/variables.rs",
  ], 
  function(count){ // Success
    bot.sortReplies();
    cb(bot);
  }, 
  function(ex, count){ // Error
    console.log("Loading error: ", ex, count);
    cb(false);
  });
}

var unaccetuate = function(text) {
  text = text.replace(/[éèêë]/gi, "e");
  text = text.replace(/[àâä]/gi, "a");
  text = text.replace(/[ïî]/gi, "i");
  text = text.replace(/[üûù]/gi, "u");
  text = text.replace(/[öô]/gi, "o");
  text = text.replace(/[ç]/gi, "c");
  text = text.replace(/[']/gi, " ");
  text = text.replace(/[-]/gi, " ");
  text = text.replace(/[?]/gi, " ");
  text = text.replace(/[!]/gi, " ");
  text = text.replace(/[\s]{2,}/g," "); // Enlève les espaces doubles, triples, etc.
  text = text.trim();
  return text
}


