
!function ($) {

  var register = function(){
    $(document).on('click', 'A.confirm' , modalConfirm);
    
  }
  
  var modalConfirm = function(event){
    var $e = $(event.currentTarget);
    
    $("#modalConfirm P.msg").html($e.attr('title'));
    $("#modalConfirm A.btn-blue").attr('href', $e.attr('href'))
    $("#modalConfirm").modal();

    event.preventDefault();
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });
  
  
}(jQuery);