var sendCommand = function(command, options) {
    sendMessage('https://ws-music.appspot.com/commands/send_command',"command="+command);
}

var sendMessage = function(path, opt_param) {
    path += '?k=' + user_key;
    if (opt_param) {
      path += '&' + opt_param;
    }
    console.log(path);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.send();
};
  
var onOpened = function() {     
    sendMessage('https://ws-music.appspot.com/commands/connect');
};
  
var onMessage = function(m) {
    newState = JSON.parse(m.data);
    console.log(newState);
    if(!newState.command)
    {   
        var loadg = document.getElementById("loading");
        if(!loadg.style.display || loadg.style.display == "block" )
        {
            var lfmc = document.getElementById("lastfmContainer");
            lfmc.style.display = "block";
            loadg.style.display = "none";
            var cover = document.getElementById("cover");
            cover.style.height = cover.offsetWidth + "px";
        }

        bp.playlists = newState.music_data.playlists;
        bp.player = newState.music_data;
        bp.SETTINGS = {};
        bp.SETTINGS.scrobble = false;
        reload_popup();
    }
}
  
var openChannel = function() {
    var channel = new goog.appengine.Channel(token);
    var handler = {
        'onopen': onOpened,
        'onmessage': onMessage,
        'onerror': function() {},
        'onclose': function() {}
    };
    var socket = channel.open(handler);
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
}

var checkConnect = function() {
    var x = setInterval(function(){
        onOpened();
    },(1000*120));
}

var initialize = function() {
    openChannel();
    checkConnect();
    //adMob();
}      
setTimeout(initialize, 1000);
