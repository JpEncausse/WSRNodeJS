var trigger = document;
var bookmarklet = {
  init : function(url){
    jQuery(document).on('click', function(event){
      trigger = event.currentTarget;
      console.log('Trigger:',trigger);
    });
  
    console.log('Initialize Socket.IO');
    var socket = io.connect(url);
    socket.on('echo', function (data) {
      console.log(data);
      // socket.emit('my other event', { my: 'data' });
    });
    socket.on('sarah', function (data) {
      console.log(data);
      
      // Trigger an event
      if (data.keydown){
        KeyBoard.keydown(parseInt(data.keydown));
      }
      
    });
  }
}

KeyBoard = {};
KeyBoard.keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
      get: function() { return this.keyCodeVal; }
    });     
    Object.defineProperty(oEvent, 'which', {
      get: function() { return this.keyCodeVal; }
    });     

    if (oEvent.initKeyboardEvent) {
      oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
    } else {
      oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;

    if (oEvent.keyCode !== k) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }

    document.dispatchEvent(oEvent);
}


