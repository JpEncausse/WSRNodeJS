
!function ($) {

  var register = function(){
     $(document).on('click', 'A.script', modaRule);
  }
  
  var modaRule = function(event){
    var $e = $(event.currentTarget);
    var $modal = $("#modalRules");
    var $input = $e.parent().next('INPUT');
    var cm = $modal.data('CodeMirror');
    
    if (!cm) {
      cm = CodeMirror.fromTextArea($('#codearea')[0],{ mode: 'javascript', tabSize : 2, lineNumbers: true });
      $modal.data('CodeMirror', cm);
      $modal.modal().on('shown.bs.modal', function () { cm.refresh(); });
      $modal.find('.btn-blue').on('click', function(){ $modal.data('script').val(cm.getValue()) })
    }
    
    cm.setValue($input.val());
    $modal.data('script', $input);
    $modal.modal('show');
    event.preventDefault();
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });
  
  
}(jQuery);