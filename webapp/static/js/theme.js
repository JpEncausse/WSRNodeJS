!function ($) {

  // ==========================================
  //  REGISTER
  // ==========================================


  var register = function(){
  
    $('.modal').on('show', function () {
      $(this).appendTo($('BODY'));
    })
  
   
    $(".gridster > UL").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [160, 160],
      max_size_x: 10, 
      max_size_y: 10,
      draggable: { stop: saveGrid } 
    });
    
    $(document).on('click', '.flip-container .flip', function(event){
      event.preventDefault();
      $(event.currentTarget).closest('.flip-container').toggleClass('hover');
    });
    
    $(document).on('click', '.plugin-gridster A.ajax', function(event){
      event.preventDefault();
      var $e = $(event.currentTarget);
      $.ajax({
        url:  $e.attr('href'),
        type: 'GET'
      }).done(function(msg) {  });
    });
    
    $(document).on('submit', '.plugin-gridster FORM.ajax', function(event){
      event.preventDefault();
      var $f = $(event.currentTarget);
      
      $.ajax({
        url:  $f.attr('action'),
        type: $f.attr('method'),
        data: $f.serialize()
      }).done(function(msg) {  });
      
    });
    
    $(document).on('click', 'A[data-dl]', function(event){
      event.preventDefault();
      var $e = $(event.currentTarget);
      getStats($e.attr('data-dl'), function(stat){
        $e.parent().text(stat);
      })
    });
  }
  
  // ==========================================
  //  PRIVATE
  // ==========================================
  
  var saveGrid = function(event, ui){
    var $elm   = $(event.target);
    var $ul    = $elm.closest('LI.gridster-item').parent();
    var json   = {};
    
    $ul.find('> li.gridster-item').each(function(){
      serializeGrid($(this), json)
    });
    
    json = JSON.stringify(json);

    $.ajax({
      url:  '/config',
      type: 'POST',
      data: { 'json' : json }
    }).done(function(msg) { });
  }
  
  var serializeGrid = function($li, json){
    var key  = $li.attr('data-key');
    if (!key){ return; }
    
    key.split('.').forEach(function(attr){ 
      if (!json[attr]) json[attr] = {};
      json = json[attr]; 
    });
    json['x'] = $li.attr('data-col');
    json['y'] = $li.attr('data-row');
    json['w'] = $li.attr('data-sizex');
    json['h'] = $li.attr('data-sizey');
  }

  
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