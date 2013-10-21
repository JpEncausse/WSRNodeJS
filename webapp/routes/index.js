
exports.index = function(req, res, next){  
  res.redirect('/home');
}

exports.kinect = function(req, res, next){ 
  res.render('kinect', { 'nav' : 'kinect' }); 
};

exports.home = function(req, res, next){ 
  res.render('home', { 'nav' : 'home' }); 
};

exports.about = function(req, res, next){ 
  res.render('about', { 'nav' : 'about' }); 
};

exports.plugin = function(req, res, next){ 
  res.render('plugin', { 'nav' : 'plugin', 'name' : req.param('name') }); 
};

exports.badge = function(req, res, next){ 
  res.set('Content-Type', 'text/xml');
  res.render('badge'); 
};

