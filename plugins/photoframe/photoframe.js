var moment    = require('moment');
moment.lang('fr');
  
exports.cron = function(callback, task){
  if (!task.feed){
    console.log("Missing Feed Name");
    return;
  }
  
  if (!task.folder){
    console.log("Missing Feed Folder");
    return;
  }
  
  var fs = require('fs');

  // List directory
  fs.readdir(task.folder, function(err, files){
    if (!files){ return; }
    var buffer = '';
    files.filter(function(file) { return file.substr(-4) == '.jpg'; })
         .forEach(function(file){
         
      var date = fs.statSync(task.folder+file).mtime;
      date = moment(date);
      
      // Build RSS for each item
      buffer +=  getFeedItem(task.url, file, date.format('ddd, DD MMM YYYY HH:mm:ss ZZ')); // Mon, 07 Feb 2011 18:18:18 -0500
      
    });
    
    // Wrap RSS with required XML
    buffer = getFeedBuffer(buffer);
    
    // Write to file
    fs.writeFile(task.folder + task.feed, buffer, function (err) { if (err) console.log(err); });
  });
}

var getFeedItem = function(url, file, date){

  var item = '';
  
  item += '<item>\n';
  item += '  <title>'+file+'</title>\n';
  item += '  <link>'+url+file+'</link>\n';
  item += '  <category>Photo</category>\n';
  item += '  <pubDate>'+date+'</pubDate>\n';
  item += '  <description>\n';
  item += '  &lt;img src=&quot;'+url+file+'&quot; width=&quot;800&quot; height=&quot;480&quot; /&gt;\n';
  item += '  </description>\n';
  item += '  <media:content url="'+url+file+'" type="image/jpeg" height="480" width="800" duration="10" />\n';
  item += '  <media:thumbnail  url="" height="60" width="60" />\n';
  item += '</item>\n';
  
  return item;
}

var getFeedBuffer = function(items){

  var buffer = '';
  
  buffer += '<?xml version="1.0" encoding="utf-8" ?>\n';
  buffer += '<rss version="2.0"  xmlns:media="http://search.yahoo.com/mrss/"  xmlns:frameuserinfo="http://www.framechannel.com/feeds/frameuserinfo/" xmlns:tsmx="http://www.thinkingscreenmedia.com/tsmx/" >\n';
  buffer += '  <channel>\n';
  buffer += '    <title>NodeJS</title>\n';
  buffer += '    <link>http://www.encausse.net</link>\n';
  buffer += '    <description>Satic NodeJS Feed of PhotoFrame</description>\n';
  buffer += items;
  buffer += '  </channel>\n';
  buffer += '</rss>\n';
  
  return buffer;
}