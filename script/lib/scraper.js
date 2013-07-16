// ------------------------------------------
//  EVALUATE
// ------------------------------------------

var evaluate = function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
  return page.evaluate(fn);
};


var scraper = {

  // ------------------------------------------
  //  ARGUMENTS
  // ------------------------------------------
  
  setOptions: function(options){
    var system  = require('system');
    if (system.args.length > 1){

      // Parse JSON
      var json = system.args[1];
      var params = json ? JSON.parse(json) : {};
      
      // Merge with defaults
      for (var property in params){
        options[property] = params[property];
      }
    }
  },

  // ------------------------------------------
  //  PAGE.OPEN
  // ------------------------------------------
  
  /**
   * @param url utl to the page
   * @param options the options for the callback
   * @param callback the callback in the evaluated page
   */
  scrap: function(url, options, callback){
    var page    = require('webpage').create();
    page.open(encodeURI(url), function (status) { 
      
      var results = { tts : "Impossible d'accèder au site" }
      
      // Check for page load success
      if (status !== "success") {
        console.log('info',JSON.stringify(results));
        //phantom.exit();
        return;
      }
      
      var jquery = options.plugin ? "../../script/vendor/jquery.min.js" : "../vendor/jquery.min.js";
      
      // Load jQuery
      if (!page.injectJs(jquery)){
        console.log('info',JSON.stringify(results));
        phantom.exit();
        return;
      }
      
      // Scrapping
      results = page.evaluate(function(callback, options) {
        results = {};
        callback(options, results);
        return results; 
      }, callback, options);
      
      // Write answer back
      console.log(JSON.stringify(results));
      phantom.exit();
    });
  }
}