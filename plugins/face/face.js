exports.action = function(data, callback, config, SARAH){
  
  // Store current user
  if (data.id){
    console.log('Face detection: ' + data.id);
    SARAH.context = SARAH.context || {};
    SARAH.context.speak = data.id;
    
    // Callback
    return callback({});
  }
  
  // Handle action
  if (data.reco){
    if (data.reco == 'start'){
      SARAH.face('start'); 
      callback({'tts' : 'Démarrage de la reconaissance faciale'});
    } else if (data.reco == 'stop'){
      SARAH.face('stop');
      callback({'tts' : 'Arrêt de la reconaissance faciale'})
    } else if (data.reco == 'train'){
      SARAH.face('train');
      callback({'tts' : 'Capture de la reconaissance faciale'})
    }
  }
}