
!function ($) {

  var register = function(){
    $(document).on('click', 'A.confirm' , confirm);
    
  }
  
  var confirm = function(event){
    var $e = $(event.currentTarget);
    
    $("#modalConfirm P.msg").html($e.attr('title'));
    $("#modalConfirm A.btn-primary").attr('href', $e.attr('href'))
    $("#modalConfirm").modal();

    event.preventDefault();
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });
  
  
}(jQuery);