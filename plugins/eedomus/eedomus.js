exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.eedomus;
  if (!config.api_url || !config.api_user || !config.api_secret){
    console.log("Missing Eedomus config");
    return;
  }
  
  // Build URL
  var url = config.api_url;
  url += '&api_user='+config.api_user;
  url += '&api_secret='+config.api_secret;
  url += '&periph_id='+data.periphId;
  url += '&value='+data.periphValue;
  
  // console.log('URL:' + url);
  
  // Send Request
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    // Callback with TTS
    var answers = config.answers.split('|');
    var answer = answers[ Math.floor(Math.random() * answers.length)];
    callback({'tts': answer});
  });
}
