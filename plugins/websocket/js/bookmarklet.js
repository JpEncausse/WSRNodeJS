// You create your bookmarklet by instantiating
// a new Bookmarklet function, then pass in the options like so.
// This example checks to see if the var is already defined, and makes
// sure not to overwrite it. This could happen if the user clicks on
// the bookmarklet more than once.
console.log('>>',bkurl);
var bkurl = bkurl || 'http://127.0.0.1:8080/';
var MyBookmarklet = MyBookmarklet || new Bookmarklet({
    // debug: true, // use debug to bust the cache on your resources
    css: [],
    js: [
      bkurl+'/assets/websocket/js/socket.io.js',
      bkurl+'/assets/websocket/js/bookmark.init.js'
    ],
    // jqpath: '/my/jquery.js', // defaults to google cdn-hosted jquery
    ready: function(base) { // use base to expose a public method
        base.init = function() {
          bookmarklet.init(bkurl);
        }
        base.init();
    }
});


/**
* jQuery Bookmarklet - version 2.0
* Author(s): Brett Barros, Paul Irish, Jon Jaques
* 
* Original Source: http://latentmotion.com/how-to-create-a-jquery-bookmarklet/
* Modified Source: https://gist.github.com/2897748
*/

function Bookmarklet(options) {
    // Avoid confusion when setting
    // public methods.
    var self = this;

    // Merges objects. B overwrites A.
    function extend(a, b) {
        var c = {};
        for (var key in a) {
            c[key] = a[key];
        }
        for (var key in b) {
            c[key] = b[key];
        }
        return c;
    }

    function loadCSS(sheets) {
        // Synchronous loop for css files
        jQuery.each(sheets, function(i, sheet) {
            $('<link>')
                .attr({
                href: (sheet + cachebuster),
                rel: 'stylesheet'
            })
                .appendTo('head');
        });
    }

    function loadJS(scripts) {
        // Check if we've processed all 
        // of the JS files (or if there are none).
        if (scripts.length === 0) {
            o.ready(self);
            return;
        }

        // Load the first js file in the array.
        jQuery.getScript(scripts[0] + cachebuster, function() {
            // asyncronous recursion, courtesy Paul Irish.
            loadJS(scripts.slice(1));
        });
    }

    function init(callback) {
        if (!window.jQuery) {
            // Create jQuery script element.
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = o.jqpath;
            document.body.appendChild(script);

            // exit on jQuery load.
            script.onload = function() {
                callback();
            };
            script.onreadystatechange = function() {
                if (this.readyState == 'complete') callback();
            }
        } else {
            callback();
        }
    }

    var defaults = {
        debug: false,
        css: [],
        js: [],
        jqpath: "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"
    }

    // If we don't pass options, use the defaults.
    ,
        o = extend(defaults, options)

        ,
        cachebuster = o.debug ? ('?v=' + (new Date())
            .getTime()) : '';


    // Kick it off.
    init(function() {
        loadCSS(o.css);
        loadJS(o.js);
    });

};