
!function ($) {

  var register = function(){
    $('.ifttt SELECT.script OPTION:selected').each(function(){ setIcon(this); });
    
    $(document).on('change', '.ifttt SELECT.script' , function(event){ 
      var $e = $(event.currentTarget).find('OPTION:selected');
      setIcon($e); 
    });
    
    $(document).on('click', 'A#addRule', addRule);
    
    $('.switch').on('switch-change', function (event) {
      $(this).find('INPUT[type="hidden"]').val(!$(this).find('.swtch').prop('checked'));
    })
  }
  
  var setIcon = function(elm){
    var $e = $(elm);
    var src = $e.attr('data-icon') || 'images/script.png';
    $e.parent().prev('IMG.glyph').attr('src', src);
  }
  
  var addRule = function(event){
    var $e = $(event.currentTarget);
    var $rule = $e.parent().prev('DIV.rule');
    var $clone = $rule.clone();
    $rule.after($clone);
    event.preventDefault();
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });
  
  
}(jQuery);