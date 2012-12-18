exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.gesture;
  if (!config){
    console.log("Missing Gesture config");
    callback({});
    return;
  }
  
  callback({});
}