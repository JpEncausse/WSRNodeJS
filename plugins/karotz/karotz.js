

exports.action = function(data, callback, config){
  
  // Callback with TTS
  callback({});
  
  
  // Text to speech
  if (data.tts){
    sendKarotz(config, '-tts "'+data.tts+'" -timeout '+ (data.timeout || 5000));
  }
  
  // Take photos
  else if (data.photo){
    var upload = 'http://'+config.http.ip+':'+config.http.port+'/upload';
    console.log('Upload To', upload);
    sendKarotz(config, '-photo "'+upload+'" -timeout '+ (data.timeout || 5000));
  }
  
  // Play music
  else if (data.play){
    sendKarotz(config, '-play "'+data.play+'" -timeout '+ (data.timeout || 5000));
  }
}


var exec = require('child_process').exec;
var sendKarotz = function(config, args){
  // %CD%/jre/bin/java -jar karotzjava.jar 192.168.0.20 -tts "Bonjour le monde"
  var path = require('path');
  var proc = path.normalize(__dirname + "/java/jre/bin/java"); 
  var jar  = path.normalize(__dirname + "/java/karotzjava.jar");
  var process = proc + ' -jar '+jar+' '+config.modules.karotz.ip+' '+args;
  console.log(process);
  var child = exec(process,
  function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}