var exec = require('child_process').exec;

exports.action = function(data, callback, config){
  console.log('sendInput:', data);
  
  // Callback with TTS
  callback({});
  
  // Send Input
       if (data.text)     { sendInput('text', data.text,  data.app, data.mod); } 
  else if (data.press)    { sendInput('press',data.press, data.app, data.mod); }
  else if (data.down)     { sendInput('down', data.down,  data.app, data.mod); }
  else if (data.up)       { sendInput('up',   data.up,    data.app, data.mod); }
  
}

var sendInput = function(param, value, app, mod){
  var process = '%CD%/plugins/keyboard/bin/Keyboard.exe';
  
  if (app){ process +=  ' -app "' + app + '"'; }
  if (mod){ process +=  ' -mod "' + mod + '"'; }
  process +=  ' -'+param+' '  +  '"'+value+'"';
  
  console.log(process);
  var child = exec(process,
  function (error, stdout, stderr) {
    if (error !== null) { console.log('exec error: ' + error);  }
  });
}