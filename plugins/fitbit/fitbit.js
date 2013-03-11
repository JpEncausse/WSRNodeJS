exports.action = function(data, callback, cfg, SARAH){

  // Retrieve config
  var config = cfg.modules.fitbit;
  if (!config.api_key || !config.api_secret){
    return callback({ 'tts' : 'Configuration FitBit invalid' });
  }

  // Buil fitbit
  var fitbit = require('./lib/fitbit_client.js')(config.api_key, config.api_secret, 'http://127.0.0.1:8080/fitbit/start');
  
  // Init an Express routes
  if (data.start){
    routesStart(fitbit, config, SARAH);
    return callback({'tts' : 'Initialisation du serveur FitBit'});
  }
  
  // Require fitbit attribute
  if (!data.fitbit){
    return callback({'tts' : "Commande inconnue"});
  }
  
  // Build date of query
  var moment = require('moment');
  moment.lang('fr');
  var date = moment().format("YYYY-MM-DD");
  
  // Query FitBit
  queryFitBit(fitbit, config, date, callback, function(json){

    if (data.fitbit == 'steps'){
      callback({'tts' : "Aujourd'hui tu as marché " + json.summary.steps + " pas"});
    } else if (data.fitbit == 'floors'){
      callback({'tts' : "Aujourd'hui tu monté " + json.summary.floors + " étages"});
    } else {
      console.log(json);
      callback({});
    }
  });
}

// -------------------------------------------
//  UTILITY
//  https://github.com/smurthas/fitbit-js/
// -------------------------------------------

/**
 * Generic code to query FitBit
 */
var queryFitBit = function(fitbit, config, date, callback, hook){
  
  if (!config.oauth_token || !config.oauth_token_secret){
    return callback({'tts' : 'Aucun FitBit enregistré'});
  }
  var token  = {oauth_token_secret: config.oauth_token_secret, oauth_token: config.oauth_token};
  var answer = 'Une erreur est survenue';
  
  fitbit.apiCall('GET', '/user/-/activities/date/'+date+'.json',
    {'token': token},
    function(err, res, json) {
      
      // Handle errors 
      if (err){ 
        return callback({'tts' : 'Une erreur est survenue' }); 
      }
      
      if (!json || !json.summary){ 
        return callback({'tts' : "Impossible d'obtenir les données de la journée" }); 
      }
      
      // Call hook
      hook(json);
    }
  );
}

/**
 * Setup an ExpressJS routes to register a FitBit Device
 */
var routesStart = function(fitbit, config, SARAH){
  console.log('Register an ExpressJS routes: /fitbit/start');
  
  SARAH.express.app.get('/fitbit/start', function(req, res, next){
    fitbit.getAccessToken(req, res, function (error, newToken) {
      if(!newToken) { return; }
      console.log(newToken);
      res.writeHead(200, {'Content-Type':'text/html'});
      res.end("<html><body>FitBit enregistré.</body></html>");
      
      // Storing oauth token
      config.oauth_token        = newToken.oauth_token;
      config.oauth_token_secret = newToken.oauth_token_secret;
      SARAH.ConfigManager.save();
      
      console.log('Register new device: ',newToken);
    });
  });
}
