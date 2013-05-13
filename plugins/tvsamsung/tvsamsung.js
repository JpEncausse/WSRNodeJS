var moment = require('moment');
moment.lang('fr');

exports.action = function(data, callback, cfg, SARAH){

  var config = cfg.modules.tvsamsung;
  if (!config.tvip){
    console.log("Missing Samsung TV config");
    return;
  }
  
  var body = false;
       if (data.sms)     { body = getSMS(data.sms, new Date(), cfg.bot.name); }
  else if (data.reminder){ body = getScheduleReminder(data.subject, data.reminder, moment(data.date1 || new Date()), moment(data.date2 || new Date())); }
  else if (data.callee)  { body = getIncomingCall(new Date(), data.callee, '', data.caller, '');  }
  
  if (!body){
    callback({'tts': "Paramètres invalides"});
    return;
  }
  
  var request = require('request');
  request({ 
    'uri'     : 'http://'+config.tvip+':52235/PMR/control/MessageBoxService',
    'method'  : 'post',
    'headers' : { 
                  'Content-type'   : 'text/xml; charset="utf-8"',
                  'soapACTION'     : 'uuid:samsung.com:service:MessageBoxService:1#AddMessage'
                },
    'body'    : body
  }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      console.log(err);
      callback({'tts': "L'action a échoué"});
      return;
    }
    
    callback({});
  });
}

var getSMS = function(body, date, sender, phone2, receiver, phone1){
  var m = moment(date);
  var soap  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
      soap += "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" >"
      soap += "  <s:Body>"
      soap += "    <u:AddMessage xmlns:u=\"urn:samsung.com:service:MessageBoxService:1\">"
      soap += "      <MessageType>text/xml</MessageType>"
      soap += "      <MessageID>SARAH_1</MessageID>"
      soap += "      <Message>"
      
      soap += "&lt;Category&gt;SMS&lt;/Category&gt;"
      soap += "&lt;DisplayType&gt;Maximum&lt;/DisplayType&gt;"
      soap += "&lt;ReceiveTime&gt;"
      soap += "&lt;Date&gt;"+m.format('YYYY-MM-DD')+"&lt;/Date&gt;" // 2010-05-04
      soap += "&lt;Time&gt;"+m.format('HH:mm:ss')+"&lt;/Time&gt;"   // 01:02:03
      soap += "&lt;/ReceiveTime&gt;"
      soap += "&lt;Receiver&gt;"
      soap += "&lt;Number&gt;"+(phone1 || '')+"&lt;/Number&gt;"     // Phone
      soap += "&lt;Name&gt;"+(receiver || '')+"&lt;/Name&gt;"       // Reveiver 
      soap += "&lt;/Receiver&gt;"
      soap += "&lt;Sender&gt;"
      soap += "&lt;Number&gt;"+(phone2 || '')+"&lt;/Number&gt;"     // Phone
      soap += "&lt;Name&gt;"+(sender || 'S.A.R.A.H.')+"&lt;/Name&gt;"         // Sender
      soap += "&lt;/Sender&gt;"
      soap += "&lt;Body&gt;"+body+"&lt;/Body&gt;"                   // Body
      
      soap += "      </Message>"
      soap += "    </u:AddMessage>"
      soap += "  </s:Body>"
      soap += "</s:Envelope>"
      
  console.log('getSMS\n',soap);
  return soap;
}

var getScheduleReminder = function(subject, body, start, end, owner, phone, location){
  var s = moment(start);
  var e = moment(end);
  var soap  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
      soap += "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" >"
      soap += "  <s:Body>"
      soap += "    <u:AddMessage xmlns:u=\"urn:samsung.com:service:MessageBoxService:1\">"
      soap += "      <MessageType>text/xml</MessageType>"
      soap += "      <MessageID>SARAH_2</MessageID>"
      soap += "      <Message>"
      
      soap += "&lt;Category&gt;Schedule Reminder&lt;/Category&gt;"
      soap += "&lt;DisplayType&gt;Maximum&lt;/DisplayType&gt;"
      soap += "&lt;StartTime&gt;"
      soap += "  &lt;Date&gt;"+s.format('YYYY-MM-DD')+"&lt;/Date&gt;"       // Start Date
      soap += "  &lt;Time&gt;"+s.format('HH:mm:ss')+"&lt;/Time&gt;"         // Start Time
      soap += "&lt;/StartTime&gt;"
      soap += "&lt;Owner&gt;"
      soap += "  &lt;Number&gt;"+(phone || '')+"&lt;/Number&gt;"            // Phone
      soap += "  &lt;Name&gt;"+(owner || '')+"&lt;/Name&gt;"                // Owner
      soap += "&lt;/Owner&gt;"
      soap += "&lt;Subject&gt;"+(subject || 'Rappel')+"&lt;/Subject&gt;"    // Subject
      soap += "&lt;EndTime&gt;"
      soap += "  &lt;Date&gt;"+e.format('YYYY-MM-DD')+"&lt;/Date&gt;"       // End Date
      soap += "  &lt;Time&gt;"+e.format('HH:mm:ss')+"&lt;/Time&gt;"         // End Time
      soap += "&lt;/EndTime&gt;"
      soap += "&lt;Location&gt;"+(location || '')+"&lt;/Location&gt;"       // Location
      soap += "&lt;Body&gt;"+(body || '')+"&lt;/Body&gt;"                   // Body
      
      soap += "      </Message>"
      soap += "    </u:AddMessage>"
      soap += "  </s:Body>"
      soap += "</s:Envelope>"
      
  console.log('getSMS\n',soap);
  return soap;
}

var getIncomingCall = function(date, callee, phone1, caller, phone2){
  var m = moment(date);
  var soap  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
      soap += "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" >"
      soap += "  <s:Body>"
      soap += "    <u:AddMessage xmlns:u=\"urn:samsung.com:service:MessageBoxService:1\">"
      soap += "      <MessageType>text/xml</MessageType>"
      soap += "      <MessageID>SARAH_1</MessageID>"
      soap += "      <Message>"
      
      soap += "&lt;Category&gt;Incoming Call&lt;/Category&gt;"
      soap += "&lt;DisplayType&gt;Maximum&lt;/DisplayType&gt;"
      soap += "&lt;CallTime&gt;"
      soap += "  &lt;Date&gt;"+m.format('YYYY-MM-DD')+"&lt;/Date&gt;"
      soap += "  &lt;Time&gt;"+m.format('HH:mm:ss')+"&lt;/Time&gt;"
      soap += "&lt;/CallTime&gt;"
      soap += "&lt;Callee&gt;"
      soap += "  &lt;Number&gt;"+(phone1 || '')+"&lt;/Number&gt;"
      soap += "  &lt;Name&gt;"+(callee || '')+"&lt;/Name&gt;"
      soap += "&lt;/Callee&gt;"
      soap += "&lt;Caller&gt;"
      soap += "  &lt;Number&gt;"+(phone2 || '')+"&lt;/Number&gt;"
      soap += "  &lt;Name&gt;"+(caller || '')+"&lt;/Name&gt;"
      soap += "&lt;/Caller&gt;"
      
      soap += "      </Message>"
      soap += "    </u:AddMessage>"
      soap += "  </s:Body>"
      soap += "</s:Envelope>"
      
  console.log('getIncomingCall\n',soap);
  return soap;
}
