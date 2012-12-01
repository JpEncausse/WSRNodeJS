
exports.after = function(options, results){

  var movies = results.movies; 
  if (!movies){ return; }
  if (!options.directory){ return; }
  
  var fs = require('fs');
  var file = options.directory + '/../plugins/movie/movie.xml';
  
  var xml = fs.readFileSync(file,'utf8');
  
  var replace  = '§ -->\n';
      replace += '<rule id="ruleMovieName">\n';
      replace += '  <tag>out.place="'+options.place+'";</tag>\n';
      replace += '  <one-of>\n';
      
  for(var i = 0 ; i < movies.length ; i++){
      var movie =  movies[i]; movie = movie.indexOf(':') > 0 ? movie.substring(0,movie.indexOf(':')) : movie; // Split at ':'
      replace += '    <item>'+movie+'<tag>out.movie="'+i+'";</tag></item>\n';
  }
      replace += '  </one-of>\n';
      replace += '</rule>\n';
      replace += '<!-- §';
  
  var regexp = new RegExp('§[^§]+§','gm');
  var xml    = xml.replace(regexp,replace);
  
  fs.writeFileSync(file, xml, 'utf8');
}
