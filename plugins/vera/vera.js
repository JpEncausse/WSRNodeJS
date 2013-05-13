exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.vera;
  if (!config.api_url){
    console.log("Missing Vera config");
    return;
  }
  
  // Build URL
  var url = config.api_url + '&SceneNum='+data.scene;
  console.log("Sending request to: " + url);
  
  // Send Request
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    console.log(body);
    
    // Callback with TTS
    callback({'tts': "Je m'en occupe !"});
  });
}
