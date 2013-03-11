
!function ($) {

  $.sarah = {};
  $.sarah.websocket = {};
  $.sarah.websocket.register = function(){
    
    var logs = $('#logs');
    
    if (!window.WebSocket) {
      logs.html('Your browser does not support web sockets!');
      return;
    }
    
    // Initialize a new web socket.
    
    var address = $('#address').val();
    logs.html('Connecting to server...' + address);
    var socket = new WebSocket("ws://"+address);
  
    // Connection established.
    socket.onopen = function () {
     logs.html("Connection successful.");
     socket.send("Image updated on: " + (new Date()).toDateString() + ", " + (new Date()).toTimeString());
    };

    // Connection closed.
    socket.onclose = function () {
      logs.html("Connection closed.");
    }
    
    // var canvas = $("canvas")[0];
    // var context = canvas.getContext("2d");
    var image = $(".kinect");
    
    // Receive data FROM the server!
    socket.onmessage = function (evt) {
      logs.html("Kinect data received.");
      image.attr('src',  'data:image/jpg;base64,'+evt.data);
      socket.send("Get Image !");
    };
  }

  // Plugin initialization on DOM ready
  $(document).ready(function() {
    $.sarah.websocket.register();
  });
  
  
}(jQuery);
