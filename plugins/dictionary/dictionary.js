

exports.action = function(data, callback, config, SARAH){
  
  // Store current user
  if (data.dictation){
    console.log('Dictionary:', data.dictation);
  }
  
  // Should use Fuzzy search to improve results
  // https://github.com/mattyork/fuzzy
  
  // Callback
  return callback({});
}

/**
 * ==========================================
 * This is the old PhantomJS code no longer relevant 
 * since we receive the full sentence.
 * 
 *

// Inject helper
phantom.injectJs("../../script/lib/scraper.js");

// Merge default options
var options = {};
scraper.setOptions(options);

// Scrap
var url = 'http://fr.wiktionary.org/wiki/'+options.dictation;
scraper.scrap(url, options, function(options, results){
  var definition = $('#fr-nom').nextAll('OL:first').find('LI:first').find('UL').remove('UL').end().text().trim();
  if (definition){
    results.tts = options.dictation + ': ' + definition;
  } else {
    results.tts = 'Je ne connais pas la définition de '+options.dictation;
  }
});
*/