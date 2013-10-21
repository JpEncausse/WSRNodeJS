!function ($) {

  // ==========================================
  //  REGISTER
  // ==========================================
  
    var register = function(){
      
      $(".gridster > UL").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [160, 160],
        max_size_x: 7, 
        max_size_y: 10,
        draggable: { stop: saveGrid } 
      });
      
      if (jQuery.browser.msie){  $(document.body).addClass('ie'); }
  
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
    
  // ==========================================
  //  READY
  // ==========================================

  // Plugin initialization on DOM ready
  $(document).ready(function($) {
    register();
  });

}(window.jQuery);