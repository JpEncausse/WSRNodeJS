!function ($) {

  var register = function(){
     $(document).on('click', 'A.edit-plugin', function(event){
       event.preventDefault();
       open(this);
     });
     
     $(document).on('click', 'A.btn-save', function(event){
       event.preventDefault();
       var $that = $(this);
       if ($that.hasClass('disabled')){ return; }
       if (!editor){ return; } editor.save();
       
       var $form  = $('#editor FORM');
       var action = $form.attr('action');
       $.ajax({ url: action, type: "POST", data: $form.serialize() }).done(function(body) {
         $that.addClass('disabled');
       });
     });
  }
  
  var change = function(){
    $('#editor .btn-save').removeClass('disabled');
  }
  
  var editor = false;
  var open = function(elm){
    var $elm = $(elm);
    var href = $elm.prop('href');
    var mode = href.indexOf('.xml') > 0 ? {name: "xml", alignCDATA: true} : 'javascript'; // kludge
    
    if (editor){ editor.toTextArea() } // Clean previous
    
    $('#editor').modal('show');
    $('#editor .btn-save').addClass('disabled');
    $.ajax({ url: href }).done(function(body) {
      $('#editor .modal-body').html(body);
      editor = CodeMirror.fromTextArea($('#codearea')[0],{ 'mode': mode, 'tabSize' : 2, 'lineNumbers': true })
      editor.on('change', change);
    });
  }
  
  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });

}(jQuery);