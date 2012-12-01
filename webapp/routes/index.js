
exports.index = function(req, res, next){  
  res.redirect('/home');
}

exports.kinect = function(req, res, next){ 
  res.render('kinect'); 
};

exports.home = function(req, res, next){ 
  res.render('home'); 
};

exports.about = function(req, res, next){ 
  res.render('about', { 'nav' : 'about' }); 
};