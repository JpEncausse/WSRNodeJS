!function ($) {

  // ==========================================
  //  REGISTER
  // ==========================================

  var register = function(){
  
    $('.modal').appendTo($('BODY'));
    
    $(document).on('click', 'A[data-dl]', function(event){
      event.preventDefault();
      var $e = $(event.currentTarget);
      getStats($e.attr('data-dl'), function(stat){
        $e.parent().text(stat);
      })
    });
    
    $('UL[data-feed]').each(function(){
      
      var $ul  = $(this);
      var feed = $ul.attr('data-feed');
      
      jQuery.getFeed({ url: feed,
         success: function(feed) {
           if (!feed.items) return;
           
           for (var i = 0 ; i < 10 && i < feed.items.length ; i++){
             $ul.append('<li>'+feed.item.title+'</li>');
           }
           
         }
       });
      
    });
    
    
  }
  
  // ==========================================
  //  PRIVATE
  // ==========================================
  
  var getStats = function(shorten, callback){
    if (!shorten){ return; }
    $.getJSON('https://www.googleapis.com/urlshortener/v1/url?projection=FULL&shortUrl='+shorten, function(data) {
      var stat = data.analytics.allTime.shortUrlClicks + ' (' + data.analytics.month.shortUrlClicks+')';
      callback(stat);
    });
  }
  
  // ==========================================
  //  READY
  // ==========================================

  // Plugin initialization on DOM ready
  $(document).ready(function($) {
    register();
  });

}(window.jQuery);