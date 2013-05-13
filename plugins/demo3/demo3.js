// Inject helper
phantom.injectJs("../../script/lib/scraper.js");

// Merge default options with querystring
var options = {};
scraper.setOptions(options);

var url = 'http://wtfismyip.com/text';

// Scrap
scraper.scrap(url, options, function(options, results) {
  // Play with jQuery and set tts
  var ip = $('*:first').text();
  ip = ip.replace(/\./g,' point ');
  results.tts = 'mon adresse IP est ' + ip;
});
