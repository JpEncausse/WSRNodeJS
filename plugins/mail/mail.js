exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.mail;
  if (!config || !data.text || !data.subject){
    console.log("Missing Mail config");
    callback({});
    return;
  }
  
  var email   = require("email");
  var server  = email.server.connect({
     user:     config.email, 
     password: config.password, 
     host:     config.smtp,
     ssl:      config.ssl == 'true'
  });
  
  server.send({
     text:    data.text, 
     from:    data.from || config.email, 
     to:      data.to   || config.to,
     subject: data.subject
  }, function(err, message) { console.log(err || message); });

  callback({'tts': "Message envoyé"});
}
