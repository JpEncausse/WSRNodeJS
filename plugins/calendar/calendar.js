var moment = require('moment');
moment.lang('fr');

// ------------------------------------------
//  ADD EVENT
// ------------------------------------------

var https   = require('https');
var request = require('request');
var url     = require('url');
var qs      = require('querystring');

/**
 * Parse and Store authentification data
 * @param data the body of login request
 */
var auths = {};
var setAuth = function(data){
  data.split('\n').forEach(function (dataStr) {
    var datas = dataStr.split('=');
    auths[datas[0]] = datas[1];
  });
}

/**
 * Login to google to get credential
 * @param email the google email
 * @param password the google password
 */
var login = function(email, password, callback){

  var POST = {
    accountType: "HOSTED_OR_GOOGLE",
    Email: email, 
    Passwd: password,
    service: "cl",
    source: 'WSRNodeJS',
  };
  var content = qs.stringify(POST);
  
  var LOGIN = {
    host: "www.google.com",
    path: '/accounts/ClientLogin',
    port: 443,
    method: "POST",
    headers: {
      'Content-Length': content.length,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  var data    = "";
  var request = https.request(LOGIN, function(response){
    response.on("data", function(chunk) { data = data + chunk; });
    response.on("end" , function()      { setAuth(data); callback(); });
  });
  
  request.write(content);
  request.end();
};


/**
 * Add Event to Calendar
 * @param event the event object
 * @param path the url to open
 */
var addEvent = function(event, path){
  console.log(event);
  
  var POST = {
    "data": {
      "title"        : event.title,
      "details"      : event.details,
      "transparency" : "opaque",
      "status"       : "confirmed",
      "location"     : event.location,
      "when": [{
        "start": event.start, // "2012-08-19T15:00:00.000Z"
        "end"  : event.end    // "2012-08-19T17:00:00.000Z"
      }]
    }
  };
  
  var ADD_EVENT = {
    host: "www.google.com",
    path: path ? path : "/calendar/feeds/default/private/full?alt=jsonc",
    port: 443,
    method: "POST",
    headers: {
      'Authorization': 'GoogleLogin auth=' + auths.Auth,
      'Content-Type' : 'application/json',
    }
  };
  
  var buffer  = "";
  var request = https.request(ADD_EVENT, function(response) {
    
    if (response.statusCode == 302) {
      var loc = url.parse(response.headers.location);
      var redirect = loc.pathname + "?" + loc.query;
      addEvent(event, redirect);
    } 
    else { 
      response.on("data",  function(data) { buffer += data; });
      response.on("end",   function()     { console.log(JSON.parse(buffer)); });
      response.on("close", function()     { console.log(JSON.parse(buffer)); });
    }
  });
  
  request.write(JSON.stringify(POST));
  request.end();
  request.on('error', function(ex) { console.error("Error", ex); });
};


/**
 * Helper to login / add event in a single function
 * @param email see login()
 * @param password see login()
 * @param event see addEvent()
 */
var addCalendarEvent = function(email, password, event){
  login(email, password, function(){
     addEvent(event);
  });
}



// ------------------------------------------
//  QUERY CALENDAR
// ------------------------------------------

var CACHED_EVENTS = {};

var matchEntry = function(entry, options){
  
  
  
  var startDate, endDate, reminder;
  if (!entry['gd$when']){
    console.log('Skipping gd$recurrence');
    return;
  } 
  else {
    var when  = entry['gd$when'][0];
    startDate = when.startTime;
    endDate   = when.endTime;
    reminder  = when['gd$reminder'] ? when['gd$reminder'][0] : 0;
  }  
  
  var title     = entry.title.$t;
  var url       = entry['gd$where'][0].valueString;
  var uid       = entry['gCal$uid'].value +"/"+ startDate;
  
  // Check cache
  if (options.cache && CACHED_EVENTS[uid]){ return false; }
  
  // .
  var start    = moment(startDate); 
  var start_ms = start.valueOf();
  
  
 
  // Check reminder
  if (options.reminder){
    var now_ms   = (new Date()).getTime();
    var rmdr_ms  = reminder.minutes ? 1000*60*reminder.minutes : reminder.hours ? 1000*60*60*reminder.hours : 0; 
    if (rmdr_ms == 30*60*1000){ rmdr_ms = 5*60*1000; } // Fix GCal Bug
    
    var before = (start_ms - rmdr_ms) - now_ms;
    if (before > 0){ 
      if (before < 1000*60*60*6) { console.log('[Event] '+ title +' in '+moment.duration(before).humanize()); } 
      return false; 
    }
    
    var after  = now_ms - (start_ms + 1000*60*5)
    if (after > 0) { 
      if (after < 1000*60*60*6) { console.log('[Event] '+ title +' exceed '+moment.duration(after).humanize()); }
      return false; 
    }
  }
 
  // Check event after start date
  if (options.start){
    var end_ms = moment(endDate).valueOf();
    if (end_ms < options.start){ return false; }
  }
  
  // Check event before end date
  if (options.end){
    if (start_ms > options.end){ return false; }
  }
  
  // Perform cache
  if (options.cache) { CACHED_EVENTS[uid] = true;}
  
  // Compute time
  if (options.duration){
    var now = moment();
    title += ' ' + start.from(now);
  }
  
  
  
  if (options.time){
    title += ' à ' + start.format("HH:mm");
  }
  url = url == '' ? false : url;
  return { 'tts' : title, 'url' : url } ;
}

/**
 * Check events at the given calendar URL 
 * then callback with array of events
 * https://developers.google.com/google-apps/calendar/v2/reference
 *  
 * @param url the calendar private url (full with json)
 * @param callback the function to call with event array
 * @param options a configuration object
 */
var checkCalendar = function(url, callback, options){
  
  var request = require('request');
  var now = moment();
  var url = url + '&singleevents=true' + '&start-min=' + now.subtract('days', 3).format('YYYY-MM-DD') + '&start-max=' + now.add('days', 6).format('YYYY-MM-DD');
  request({ 'uri' : url }, function (err, response, body){
    
    if (err || response.statusCode != 200) {
      return;
    }
    
    var lastModified = response.headers['last-modified'];
    
    var json = JSON.parse(body);
    if (!json || !json.feed || !json.feed.entry){
      return;
    }
    
    var events  = [];
    var entries = json.feed.entry;
    for (var i = 0 ; i < entries.length ; i++){
      var event = matchEntry(entries[i], options); // + start date
      if (event){ events.push(event); }
    }
    
    callback(events);
  });
}

// ------------------------------------------
//  EXPORTS
// ------------------------------------------

exports.cron = function(callback, task){
  if (!task.url){
    console.log("Missing Calendar URL");
    return;
  }
  
  checkCalendar(task.url, function(events){
    if (!events || events.length <= 0){ return; }
    var tts = '';
    events.forEach(function(event){
      // Send request for each URL 
      if (event.url){
        console.log('[Event] trigger: ' + event.url);
        var request = require('request'); 
        request({ 'uri' : event.url }, function (err, response, body){
          if (err || response.statusCode != 200) { console.log('Cronlendar:',err); return; }
          callback({"tts" : body});
        });
      
      } 
      // Prepare TTS
      else { tts += event.tts + '. '; }
    })
    if (tts){ callback({"tts" : 'Petit rappel: '+tts}); }
  }, { 
    "cache"    : true, 
    "duration" : true,
    "reminder" : true
  });
}


exports.action = function(data, callback, config){
  // Retrieve config
  config = config.modules.calendar;
  if (!config.url){
    console.log("Missing Calendar URL");
    return;
  }
  
  // Add calendar event
  if (data.dictation){
    
    var title    = data.dictation;
    var details  = config.details;
    var location = config.location;
    var start    = moment();
    
    console.log(data);
    // Set an other date
    if (data.Day && data.Month && data.Year){
      start.year(data.Year);
      start.month(data.Month-1);
      start.date(data.Day);
      start.hours(config.startDay);
      start.minutes(0);
      start.seconds(0);
    }
    
    // Set an other time
    if (data.Hour || data.minute){
      if (data.relativeTime){ // Relative time (in x minutes)
        start.add('hours'  ,data.AlternateHour || 0);
        start.add('minutes',data.minute || 0);
        details = 'Rappel de ' + start.fromNow(moment());
      } else {
        start.hours(data.Hour);
        start.minutes(data.minute);
      }
    }
    
    var end = start.clone(); 
    
    // Short event have hours/minute otherwise it is until the end of day
    if (data.Hour || data.minute){
      end.add('minutes', data.relativeTime ? config.endMemo : config.endShort);
    } else {
      end.hours(config.endDay);
    }
    
    addCalendarEvent(config.email, config.password,{
      'title'    : title,
      'details'  : details,
      'location' : location,
      'start'    : start.format('YYYY-MM-DDTHH:mm:ss'),
      'end'      : end.format('YYYY-MM-DDTHH:mm:ss')
    });
    
    callback({"tts" : ("J'ai rajouté " + start.calendar() + " l'évènement: " + data.dictation) }); 
  }
  
  // Check calendar
  else {
  
    var start = moment();
    var end   = moment().eod();
    var msg   = "Aujourd'hui";
     
    if (data.date == 'tomorrow'){
      start = start.add('days', 1).sod();
      end   =   end.add('days', 1);
      msg   = "Demain";
    }
    
    checkCalendar(config.url, function(events){
      if (events.length > 0){
        var tts = '';
        events.forEach(function(event){
          if (event.url){ return; }
          tts += event.tts + '. ';
        });
        callback({"tts" : msg + ": " + tts});
      } 
      else { 
        callback({"tts" : "Il n'y a aucun évènement de prévu "+msg }); 
      }
    }, { 
      "time"  : true,
      "start" : start.valueOf(),
      "end"   : end.valueOf()
    });
  
  }
}
