var winston = require('winston');
exports.action = function(req, res, config){
  
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end();
  
  var upload = config.http.upload;
  var name   = false;
  var path   = false;
  
  if (req.files.sendfile){
    name   = req.files.sendfile.filename;
    path   = req.files.sendfile.path;
  }
  else {
    name   = req.files.file.name;
    path   = req.files.file.path;
  }
  
  winston.log('info','Upload ' + path + ' to ' + upload+name);
    
  var fs   = require('fs');
  var util = require('util');
    
  var is = fs.createReadStream(path)
  var os = fs.createWriteStream(upload+name);
    
  util.pump(is, os, function() {
    fs.unlinkSync(path);
  });

}