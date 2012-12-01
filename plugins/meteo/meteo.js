

// Inject helper
phantom.injectJs("../../script/lib/scraper.js");

// Merge default options
var options = {};
scraper.setOptions(options);

// Scrap
var url = 'http://mobile.meteofrance.com/france/ville/'+options.zip;
scraper.scrap(url, options, function(options, results){
  results.tts = 'Météo: ';
  results.tts += $('DIV#prevision > H2').text() + ": ";             // Place
  var tr = $('DIV#prevision TABLE.prevSem1 TR:nth-child('+options.date+')');
  results.tts += tr.find('TD:nth-child(1)').text() + ', ';          // Days 
  results.tts += tr.find('TD:nth-child(2) IMG').attr('alt') + ', '; // Sun 
  results.tts += tr.find('TD:nth-child(3)').text();                 // Temperature
});
