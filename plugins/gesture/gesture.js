exports.action = function(data, callback, config, SARAH){
  
  // Store current user
  if (data.g){
    console.log('Gesture detection: ' + data.g);
    SARAH.context = SARAH.context || {};
    
    // Callback
    return callback({});
  }

  // Handle action
  if (!data.reco){
    return callback({});
  }
  
  if (data.reco == 'start'){
    SARAH.gesture('start'); 
    callback({'tts' : 'Démarrage de la reconaissance gestuelle'});
  } else if (data.reco == 'stop'){
    SARAH.gesture('stop');
    callback({'tts' : 'Arrêt de la reconaissance gestuelle'})
  }
}