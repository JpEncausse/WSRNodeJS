var exec = require('child_process').exec;

exports.tts = function(tts){
  var child = exec('%CD%/bin/WSRSpeak.exe "'+tts+'"',
  function (error, stdout, stderr) {
    // console.log('stdout: ' + stdout);
    // console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}