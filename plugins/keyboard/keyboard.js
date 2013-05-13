var exec = require('child_process').exec;

exports.action = function(data, callback, config, SARAH){
  
  // Callback with TTS
  callback({});
  
  // Run or Activate App
  if (data.run)      { SARAH.runApp(data.run); }
  if (data.activate) { SARAH.activate(data.activate); }
  
  // Send Input
       if (data.text)     { SARAH.keyText(data.text); } 
  else if (data.press)    { SARAH.keyPress(data.press, data.mod); }
  else if (data.down)     { SARAH.keyDown(data.down, data.mod); }
  else if (data.up)       { SARAH.keyUp(data.up, data.mod); }
}

// Call process local to NodeJS
/*
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
*/