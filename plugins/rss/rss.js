var fs  = require('fs');
var FeedParser = require('feedparser');
var RSS = require('rssparser');

exports.action = function(data, callback, config){

  // Retrieve config
  config = config.modules.rss;
  if (!config.path){
    console.log("Missing RSS config");
    callback({});
    return;
  }
  
  if (!data.title){
    console.log("Missing Item title");
  }
    
  // RSS to JSON File
  parseFeed(config, data, function(feed){
  
    // JSON to RSS File
    fs.writeFileSync(config.path, feed.xml());
  });
  
  // Callback
  callback({});
}


var parseFeed = function(config, data, callback){

  if (!fs.existsSync(config.path)){
    callback(json);
    return;
  }
  
  var parser = new FeedParser();
  parser.parseFile(config.path, function(error, meta, articles){
    
    if (error){ return console.error(error); }

    // Build feed
    if (!meta.title){
      feed = new RSS({
        'title': 'S.A.R.A.H. Feed',
        'description': 'Generated Feed by S.A.R.A.H. for Automation',
        'author': 'S.A.R.A.H.',
        'feed_url': 'http://127.0.0.1:8080/',
        'site_url': 'http://127.0.0.1:8080/',
        'image_url': 'http://127.0.0.1:8080/'
      });
    } 
    else { feed = new RSS(meta); }
    
    // Add Item first 
    feed.item({
      title:  data.title,
      description: data.description || '',
      url: data.url || 'http://127.0.0.1:8080/', // link to the item
      guid: data.guid || '', // optional - defaults to url
      author: 'S.A.R.A.H.', // optional - defaults to feed author property
      date: data.date || new Date() // any format that js Date can parse.
    });
    
    // Fill articles
    if (!articles){ callback(feed); }
    var max = config.buffer || 20;
    for (var i = 0 ; i < max && i < articles.length ; i++){
      feed.item(articles[i]);
    }
    
    // Callback
    callback(feed);
  });
}