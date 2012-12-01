
exports.action = function(data, callback, config){
  var date = new Date();
  var text = 'il est ' + date.getHours() + ' heure ';
  if (date.getMinutes() > 0){
    text += date.getMinutes();
  }
  
  // Callback with TTS
  callback({'tts': text});
}
