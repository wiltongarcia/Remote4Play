/**
 * popup.js
 * Popup page script
 * @author Jared Sartin <jared@level2studios.com>
 * Based on work by @author Alexey Savartsov <asavartsov@gmail.com>
 * Licensed under the MIT license
 */

var reload_popup = function()
{
    /* Background page */
    currSong = bp.currentSong;
    currPlaying = bp.is_playing;


    /* Render popup when DOM is ready */

    render_popup();
    notification_autoclose();
}

function render_popup(){
    render_time();
    render_scrobble_link();
    render_options_link();
    render_miniplayer_playlist_link();
    render_toast_link();
    render_miniplayer_link();
    render_song();
    //render_playlist_links();
    //render_auth_link();
    render_playing_controls();
    render_google_rating();
    render_toast_duration_input();
    render_about_links_data();
}

/* Notification closing */

// Auto closes notification after 8 seconds, stops auto close if moused over, then starts 2 second close count after close
function notification_autoclose(){
	if($('body').hasClass('notification')){
		windowTimer = setTimeout(function(){window.close();}, bp.SETTINGS.toast_duration);
		window.onmouseout = function(e){
			windowTimer = setTimeout(function(){window.close();}, '2000');
		}
		window.onmouseover = function(e){
			clearTimeout(windowTimer);
		}
	}
}

// Closes the notification
function notification_close(){
	if($('body').hasClass('notification')){
		window.close();
	}
}

function miniplayer_close(){
    if($('body').hasClass('miniplayer')){
        window.close();
    }
}

/* Auto updating */

function auto_update(){
    render_playing_controls_states();
    render_time();
    if(currSong != bp.currentSong){
        currSong = bp.currentSong;
        render_popup();
    }
    if(currPlaying != bp.is_playing){
        currSong = bp.is_playing;
        render_playing_controls();
    }
}

/* Render functions */

/**
 * Renders current song details
 */
function render_song() {
    if(bp.player.song)
    {
        $("#artist").text(bp.player.song.artist);
        $("#track").text(bp.player.song.title);

        cover = 'img/defaultcover.png';
        if(bp.player.song.cover.indexOf('default_album_med.png') == -1)
            cover = bp.player.song.cover;
        $("#cover").attr({ src: cover, width: "60", height: "60" });
        
        // if(bp.lastfm_api.session.name && bp.lastfm_api.session.key) {
        //             render_love_button();
        //         }
        //         else {
            $("#lastfm-buttons").hide();
        // }
    }
    else {
        $("#song").addClass("nosong");
        $("#artist").text(chrome.i18n.getMessage('A8CB4D32'));
        $("#track").html('<a></a>');
        $("#track a")
        .attr({ 
            href: "http://play.google.com/music/listen",
            target: "_blank"
        })
        .text(chrome.i18n.getMessage('7719C3C8'));
        $("#cover ").attr({ src: "img/defaultcover.png" });
        $("#lastfm-buttons").hide();
    }
}

function render_time() {
  if(bp.player.has_song){
    $('#time').removeClass('hide');
    bp_pos = bp.player.song.position;
    pos_min = (bp_pos - (bp_pos % 60)) / 60;
    pos_sec = bp_pos % 60;
    if(pos_sec < 10){
      pos_string = pos_min + ":0" + pos_sec;
    }
    else{
      pos_string = pos_min + ":" + pos_sec;
    }

    bp_time = bp.player.song.time;
    time_min = (bp_time - (bp_time % 60)) / 60;
    time_sec = bp_time % 60;
    if(time_sec < 10){
      time_string = time_min + ":0" + time_sec;
    }
    else{
      time_string = time_min + ":" + time_sec;
    }

    song_percent = (bp_pos / bp_time);
    bar_pixels = song_percent * $('#timeBarHolder').width() + "px"

    $("#timeText").text(pos_string + "/" + time_string);
    $("#timeBar").css({width: bar_pixels})
  }
  else{
    $('#time').addClass('hide');
  }
}

/**
 * Renders the link to toggle the options panel
 */
function render_options_link() {
    $("#optionsButton").html('<a></a>');
    $("#optionsButton a")
    .attr({ href: "#" })
    .click(function(){
        $("#optionsPanel").toggle(0);
    })
    .text(chrome.i18n.getMessage('1F88C31B'));
}

/**
 * Renders the link to toggle the miniplayer playlist panel
 */
function render_miniplayer_playlist_link() {
    if(bp.playlists && bp.playlists.length>0){
        $("#miniPlaylist").html('<a></a>');
        $("#miniPlaylist a")
        .attr({ href: "#" })
        .click(function(){
            location.reload();
        })
        .text(chrome.i18n.getMessage('DCF793CC'));
    }
}

/**
 * Renders the link to turn on/off scrobbling
 */
function render_scrobble_link() {
    $("#scrobbling").html('<a></a>');
    $("#scrobbling a")
    .addClass('button margin')
    .attr({ href: "#" })
    .click(on_toggle_scrobble)
    .text(bp.SETTINGS.scrobble ? chrome.i18n.getMessage('632A191B') : chrome.i18n.getMessage('410827D1'));
}

/**
 * Renders the link to turn on/off toasting
 */
function render_toast_link() {
    $("#toasting").html('<a></a>');
    $("#toasting a")
    .addClass('button margin')
    .attr({ href: "#" })
    .click(on_toggle_toast)
    .text(bp.SETTINGS.toast ? chrome.i18n.getMessage('88215243') : chrome.i18n.getMessage('CFD75736'));
    // if (miniplayer_open()){
    //     $("#toasting").html($("#toasting").html() + chrome.i18n.getMessage('DBD92657'));
    // }
}

function render_toast_duration_input() {
  if (bp.SETTINGS.toast){
    target = $("#toasting_duration");
    target.html('<span></span><input type="text" /><a></a>');
    target.find('span').text("Toast duration (seconds)");
    target.find('input')
    .css({width:"30px", margin: "auto 5px", "text-align":"right"})
    .val(bp.SETTINGS.toast_duration/1000);
    target.find('a')
    .addClass('button')
    .attr({href: "#"})
    .text("Save")
    .click(on_save_duration);
  }
  else{
    $("#toasting_duration").html('');
  }
}


function render_about_links_data(){
  $('#openAbout').click(function(){$('#aboutPopup').css({display:'block'})});
  $('#closeAbout').click(function(){$('#aboutPopup').css({display:'none'})});
  $('#version').html("version " + bp.currentVersion);
}

/**
 * Renders the link to open miniplayer
 */
function render_miniplayer_link() {
    $("#miniplayer").html('<a></a>');
    $("#miniplayer a")
    .addClass('button margin')
    .attr({ href: "#" })
    .click(open_miniplayer)
    .text(chrome.i18n.getMessage('9EFC8A58'));
    // if (miniplayer_open()){
    //     $("#miniplayer a").text(chrome.i18n.getMessage('26F083AF'));
    // }
}

/**
 * Renders the links to start playlists
 */
function render_playlist_links() {
    if(bp.playlists.length>0 && $("#optionsSection").length>0){
        playlistSectionContent = chrome.i18n.getMessage('3544807A');
        $("#optionsSection").before('<div id="playlistSection"></div>');
        playlistSectionContent += build_playlist_links();
        $('#playlistSection').html(playlistSectionContent);
    }
    else if(bp.playlists.length>0 && $("#miniplayerPlaylist").length>0){
        playlistSectionContent = chrome.i18n.getMessage('3544807A');
        playlistSectionContent += build_playlist_links();
        $('#playlistHolder').html(playlistSectionContent);
        $('#closeMiniPlaylist').click(hide_playlists_miniplayer);
    }
}

/**
 * Builds playlist links and content
 */
function build_playlist_links(){
    playlists = bp.playlists;
    playlistLinks = "";
    for (var i=0;i<playlists.length; i++) {
        playlistLinks += '<a href="javascript:playlistStart(\'' + playlists[i][0] + '\');">' + playlists[i][1] + '</a><br />';
    }
    return playlistLinks;
}

/**
 * Renders authentication/profile link
 */
function render_auth_link() {
    if(bp.lastfm_api.session.name && bp.lastfm_api.session.key)
    {
        $("#lastfm-profile").html(chrome.i18n.getMessage('52FF8F1E') + "<a></a><a></a>");
        $("#lastfm-profile a:first")
        .attr({
            href: "http://last.fm/user/" + bp.lastfm_api.session.name,
            target: "_blank"
        })
        .text(bp.lastfm_api.session.name);
        
        $("#lastfm-profile a:last")
        .attr({
            href: "#",
            title: chrome.i18n.getMessage('3260F019')
        })
        .click(on_logout)
        .addClass("logout");
    }
    else {
        $("#lastfm-profile").html('<a></a>');
        $("#lastfm-profile a")
        .attr({
            href: "#" 
        })
        .click(on_auth)
        .text(chrome.i18n.getMessage('833B9F6F'));
    }
}

/**
 * Renders all the play controls
 */

function render_playing_controls(){
    $('#playing_controls').html(chrome.i18n.getMessage('5FEB6CDE'));
    render_playing_controls_states();
    $('#playPause').hover(function(){$(this).addClass('goog-flat-button-hover')},function(){$(this).removeClass('goog-flat-button-hover')}).click(playPause);
    $('#rew').hover(function(){$(this).addClass('goog-flat-button-hover')},function(){$(this).removeClass('goog-flat-button-hover')}).click(prevSong);
    $('#ff').hover(function(){$(this).addClass('goog-flat-button-hover')},function(){$(this).removeClass('goog-flat-button-hover')}).click(nextSong);
    $('#repeat_mode_button').click(toggleRepeat);
    $('#shuffle_mode_button').click(toggleShuffle);
}

function render_playing_controls_states(){
    $('#repeat_mode_button').attr({class: bp.player.repeat_mode || 'NO_REPEAT'});
    $('#shuffle_mode_button').attr({class: bp.player.shuffle});
    if(bp.player.song){
        $('#rew').removeClass('goog-flat-button-disabled');
        $('#ff').removeClass('goog-flat-button-disabled');
        if(bp.player.is_playing)
            $('#playPause').addClass('goog-flat-button-checked').attr({ title: chrome.i18n.getMessage('A3E7AECB')});
        else
            $('#playPause').removeClass('goog-flat-button-checked').attr({ title: chrome.i18n.getMessage('3035D7AC')});            
    }
    else{
        $('#rew').addClass('goog-flat-button-disabled');
        $('#ff').addClass('goog-flat-button-disabled');
    }
}

/**
 * Renders the Google
 */

function render_google_rating(){
    if(bp.player.song){
        $('#google-buttons').html('<div class="rating-container hover-button"><div class="goog-inline-block goog-flat-button thumbs-up-button hover-button" title="" role="button" style="-webkit-user-select: none; " tabindex="0"></div><div class="goog-inline-block goog-flat-button thumbs-down-button hover-button" title="" role="button" style="-webkit-user-select: none; " tabindex="0"></div></div>');
        $('.thumbs-up-button').hover(function(){
            $(this).toggleClass('goog-flat-button-hover')
        }).click(thumbsUp);
        $('.thumbs-down-button').hover(function(){
            $(this).toggleClass('goog-flat-button-hover')
        }).click(thumbsDown);
        if(bp.player.song.thumbsup == "true"){
			$('#google-buttons').addClass('rating-up');
		}
		else if(bp.player.song.thumbsdown == "true"){
			$('#google-buttons').addClass('rating-down');
		}
		else{
			$('#google-buttons').removeClass('rating-up');
			$('#google-buttons').removeClass('rating-down');
		}
    }
}

/**
 * Renders the love button
 */
function render_love_button() {    
    $("#love-button").html('<img src="img/ajax-loader.gif">');
    
    bp.lastfm_api.is_track_loved(bp.player.song.title,
            bp.player.song.artist, 
            function(result) {
                $("#love-button").html('<a href="#"></a>');
        
                if(result) {
                    $("#love-button a").attr({ title: chrome.i18n.getMessage('35454E57')})
                    .click(on_unlove)
                    .addClass("loved");
            
                }
                else {
                    $("#love-button a").attr({ title: chrome.i18n.getMessage('D86C4CF9')})
                    .click(on_love)
                    .addClass("notloved");
                }
            });
}

/* Event handlers */

/**
 * Turn on/off scrobbling link was clicked
 */
function on_toggle_scrobble() {
    bp.toggle_scrobble();
    render_scrobble_link();
}

/**
 * Turn on/off scrobbling link was clicked
 */
function on_toggle_toast() {
    bp.toggle_toast();
    render_toast_link();
    render_toast_duration_input();
}

function on_save_duration() {
  seconds = $('#toasting_duration').find('input').val();
  bp.save_toast_duration(seconds);
  render_toast_duration_input();
}

/**
 * Authentication link was clicked
 */
function on_auth() {
    bp.start_web_auth();
    window.close();
}

/**
 * Logout link was clicked
 */
function on_logout() {
    bp.clear_session();
    render_auth_link();
}

/**
 * Hides playlists window in miniplayer
 */
function hide_playlists_miniplayer() {
    $("#miniplayerPlaylist").css('display', 'none');
}

/**
 * Miniplayer link was clicked
 */
function open_miniplayer() {
    chrome.extension.getViews({type:"notification"}).forEach(function(win) {
        if(win.is_miniplayer)
            win.miniplayer_close();
    });
    var notification = webkitNotifications.createHTMLNotification('miniplayer.html');
    notification.show();
    setTimeout("render_toast_link()",150);
    setTimeout("render_miniplayer_link()",150);
}

/**
 * Love button was clicked
 */
function on_love() {
    bp.lastfm_api.love_track(bp.player.song.title, bp.player.song.artist, 
        function(result) {
            if(!result.error) {
                render_love_button();
            }
            else {
                if(result.error == 9) {
                    // Session expired
                    bp.clear_session();
                    render_auth_link();
                }
            }
        });

    $("#love-button").html('<img src="img/ajax-loader.gif">');
}

/**
 * Unlove button was clicked
 */
function on_unlove() {
    bp.lastfm_api.unlove_track(bp.player.song.title, bp.player.song.artist, 
        function(result) {
            if(!result.error) {
                render_love_button();
            }
            else {
                if(result.error == 9) {
                    // Session expired
                    bp.clear_session();
                    render_auth_link();
                }
            }
        });

    $("#love-button").html('<img src="img/ajax-loader.gif">');
}


/**
 * Send commands to control playback
 */

function playPause(){
    sendCommand("playPause");
    setTimeout("render_playing_controls()", 200);
}

function prevSong(){
    sendCommand("prevSong");
    setTimeout("render_popup()", 200);
}

function nextSong(){
    sendCommand("nextSong");
    setTimeout("render_popup()", 200);
}

function toggleRepeat(){
    sendCommand("toggleRepeat");
    setTimeout("render_playing_controls()", 100);
    setTimeout("render_playing_controls()", 500);
}

function toggleShuffle(){
    sendCommand("toggleShuffle");
    setTimeout("render_playing_controls()", 100);
    setTimeout("render_playing_controls()", 500);
}

function thumbsUp(){
    sendCommand("thumbsUp");
    setTimeout("render_google_rating()", 200);
	setTimeout("render_google_rating()", 300);
}

function thumbsDown(){
    sendCommand("thumbsDown");
    setTimeout("render_google_rating()", 200);
	setTimeout("render_google_rating()", 300);
}

function playlistStart(plsID){
    sendCommand("fullCommand", "\"playlistSelected\", this, {id: \"" + plsID + "\"}");
    sendCommand("fullCommand", "\"playlistSelected\", this, {id: \"" + plsID + "\"}");
    setTimeout(sendCommand("fullCommand", "\"playPlaylist\", null, \"1\""), 200);
    hide_playlists_miniplayer();
    setTimeout("render_popup()", 100);
}

/* Testing for instance of popup being the miniplayer, returns bool */
function is_miniplayer(){
    return $('body').hasClass('miniplayer');
}

/* Checks if miniplayer is open, returns bool */
function miniplayer_open(){
    var miniplayer_open_bool = false;
    chrome.extension.getViews({type:"notification"}).forEach(function(win) {
        if(win.is_miniplayer())
            miniplayer_open_bool = true;
    });
    return miniplayer_open_bool;
}

chrome = {};
chrome.i18n = {};

chrome.i18n.getMessage = function(key){
    text = {
    	"extDesc": {
    		"message": "A Chrome extension for Google Music to improve the experience: scrobbling, toast notifications, play controls, and more!",
    		"description": ""
    	},
    	"A8CB4D32": {
    		"message": "Nothing is playing"
    	},
    	"7719C3C8": {
    		"message": "Go to Google Music"
    	},
    	"1F88C31B": {
    		"message": "Options"
    	},
    	"DCF793CC": {
    		"message": "Reload"
    	},
    	"632A191B": {
    		"message": "Stop scrobbling"
    	},
    	"410827D1": {
    		"message": "Resume scrobbling"
    	},
    	"88215243": {
    		"message": "Stop toasting"
    	},
    	"CFD75736": {
    		"message": "Resume toasting"
    	},
    	"DBD92657": {
    		"message": " - Disabled (Miniplayer open)"
    	},
    	"9EFC8A58": {
    		"message": "Open Miniplayer"
    	},
    	"26F083AF": {
    		"message": "Re-Open Miniplayer"
    	},
    	"3544807A": {
    		"message": "<h2>Playlists</h2>"
    	},
    	"52FF8F1E": {
    		"message": "Last.FM User: "
    	},
    	"3260F019": {
    		"message": "Logout"
    	},
    	"833B9F6F": {
    		"message": "Connect to Last.fm"
    	},
    	"5FEB6CDE": {
    		"message": "<div id=\"repeat_mode_button\" title=\"Repeat songs\"></div><div id=\"shuffle_mode_button\" title=\"Shuffle songs\"></div><div id=\"rew\" class=\"goog-flat-button goog-flat-button-disabled goog-inline-block\" title=\"Previous song\" role=\"button\" style=\"-webkit-user-select: none; \"></div><div id=\"playPause\" class=\"goog-flat-button goog-inline-block\" title=\"Play\" role=\"button\" style=\"-webkit-user-select: none; \"></div><div id=\"ff\" class=\"goog-flat-button goog-flat-button-disabled goog-inline-block\" title=\"Next song\" role=\"button\" style=\"-webkit-user-select: none; \"></div>"
    	},
    	"A3E7AECB": {
    		"message": "Pause song"
    	},
    	"3035D7AC": {
    		"message": "Resume song"
    	},
    	"35454E57": {
    		"message": "Unlove this song"
    	},
    	"D86C4CF9": {
    		"message": "Love this song"
    	},
    	"_": {
    		"message": ""
    	}
    }
    return text[key]["message"];
}