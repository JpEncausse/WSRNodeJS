
!function ($) {

  var register = function(){
   
    if (!window.WebSocket) {
      console.log('Your browser does not support web sockets!');
      return;
    }
    
    // Initialize a new web socket.
    console.log('Connecting to server...');
    var socket = new WebSocket("ws://127.0.0.1:7777");
  
  
    // Connection established.
    socket.onopen = function () {
     console.log("Connection successful.");
     socket.send("Image updated on: " + (new Date()).toDateString() + ", " + (new Date()).toTimeString());
    };

    // Connection closed.
    socket.onclose = function () {
      console.log("Connection closed.");
    }
    
    // var canvas = $("canvas")[0];
    // var context = canvas.getContext("2d");
    var image = $("#image");
    
    // Receive data FROM the server!
    socket.onmessage = function (evt) {
      console.log("Kinect data received.");
      image.attr('src',  'data:image/jpg;base64,'+evt.data);
      socket.send("Get Image !");
    };

  }

  // Plugin initialization on DOM ready
  $(document).ready(function() {
    register();
  });
  
  
}(jQuery);
