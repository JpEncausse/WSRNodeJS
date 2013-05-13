
exports.action = function(data, callback, config, SARAH){
  
  // Retrieve config
  config = config.modules.meteo;
  if (!config.zip){
    console.log("Missing Eedomus config");
    return;
  }
  
  var url = 'http://mobile.meteofrance.com/france/ville/'+(data.zip || config.zip);
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
  
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }

    var tts = scrap(body, data.date || config.date);
    callback({'tts' : tts});
  });
}

var scrap = function(body, date){
  var $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
  var tts = 'Météo: ';
  tts += $('#prevision > H2').text() + ": ";       // Place
  
  var tr = $('#prevision table.prevSem1 tr');
  var td = $(tr[date]).find('td');
  
  tts += $(td[0]).text() + ', ';                   // Days 
  tts += $(td[1]).find('img').attr('alt') + ', ';  // Sun
  tts += $(td[2]).text() + ', ';                   // Temperature

  return tts;
}
