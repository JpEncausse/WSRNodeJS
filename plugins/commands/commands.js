exports.action = function(data, callback, config, SARAH){

  // Retrieve config
  config = config.modules.commands;
  
  // Perform pause
  if (data.pause){ SARAH.pause(data.pause); }
  
  // Then perform play
  if (data.play){ SARAH.play(data.play); }
  
  // Then perform speak
  if (data.speak){ SARAH.speak(data.speak); }
  
  // Do nothing
  callback({});
}