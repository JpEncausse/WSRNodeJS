

exports.action = function(data, callback, config, SARAH){
  
  // Store current user
  if (!data.dictation){
    return callback({'tts': "Je ne comprends pas"});
  }
  var search = data.dictation;
  
  // Clean question
  var rgxp = /Sarah recherche (.+) (sur)* Wikipedia/i
  var match = search.match(rgxp);
  if (!match || match.length <= 1){
    return callback({'tts': "Je ne comprends pas"});
  }
  search = match[1];

 
  // Perform search
  var url = 'http://dictionnaire.reverso.net/francais-definition/'+search+'/';
  var request = require('request');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    var answer = parse(body, search);
    callback({'tts': clean(answer) });
  });
}

/**
 * Parse the HTML of the request
 */
var parse = function(html, word){
  var $ = require('cheerio').load(html);
  var ok = false;
  
  $('#TableHTMLResult .ldcomIN').each(function(){
    var value = $(this).text().trim();
    var match = matcher(value); 
    
    // console.log('['+value+']', 'match=', match, 'ok=', ok);
    if (ok && !match){ ok = value;   return false; } // Break loop
    if (match){        ok = value; // Will take next value 
      if (value.indexOf(word) == 0){ return false; }
    }
  });
  return ok;
}

/**
 * Match a given regexp
 */
var matcher = function(search){
  var match = search.match(/(nm)|(nf)/i);
  return match && match.length >= 0;
}

/**
 * Clean the matching String
 */
var clean = function(match){
  if (match.indexOf('1') == 0) match = match.substring(1).trim();
  match = match.replace(/.*(nm)|(nf)/i,'');
  return match;
}