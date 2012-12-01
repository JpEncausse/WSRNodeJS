
  // Inject helper
  phantom.injectJs("../../script/lib/scraper.js");

  // ------------------------------------------
  //  OPTIONS
  // ------------------------------------------
  
  // Merge default options
  var options = {
   'place' : 'B0099',
   'movie' : false
  };
  scraper.setOptions(options);
  
  
  // ------------------------------------------
  //  SCRAPING
  // ------------------------------------------
  
  // Scrap
  var url = 'http://iphone.allocine.fr/salle/seances_gen_csalle='+options.place+'.html';
  scraper.scrap(url, options, function(options, results){
    
    // 2. Parsing Hours of the Movie
    if (options.movie){
      var pos     = parseInt(options.movie);
      var theatre = $('DIV.titre B').text();
      var movie   = $('DIV.cell A[href^="/film"]').get(pos);
      
      if (movie){
        var hours = $(movie).closest('B').siblings('DIV').html();
            hours = hours.replace(/<br>/g,'. ').replace(/Lun[-,]* /g,'Lundi ')
                         .replace(/Mar[-,]* /g,'Mardi ').replace(/Mer[-,]* /g,'Mercredi ')
                         .replace(/Jeu[-,]* /g,'Jeudi ').replace(/Ven[-,]* /g,'Vendredi ')
                         .replace(/Sam[-,]* /g,'Samedi ').replace(/Dim[-,]* /g,'Dimanche ');
          
        var movie = $(movie).text();
        results.tts = 'Voici les horaires pour '+movie+' au '+theatre+' : '+hours;
      } else {
        results.tts = "Je n'ai pas trouvé le film au " + theatre;
      }
    }
    
    // 1. Parsing List of Movies
    else {
      results.movies = $('DIV.cell A[href^="/film"]').map(function(){ return $(this).text(); }).get();
      
      results.tts   = 'Voici la liste des films au ';
      results.tts += $('DIV.titre B').text() + ': ';
      results.tts += results.movies.join(', ');
    }
  });
