function AdagioPlayer(options){
    if(!options)
        options = {};
  //styles
  this.styles = {
    position : options.position || 'top',
    background: options.background || 'default',
    controlColors: options.controlColors || 'default'
  };

  //songs
  this.songs = options.songs || {};

  // player state settings
  this.playing = options.playing || 0; // the current position in the array of songs
  this.elapsed = options.elapsed || 0; // the current time elapsed in the current song
  this.volume = options.volume || 50;
  this.audioPlayer = '';
}

AdagioPlayer.prototype.getSrc = function(){
    var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];

    if (script.getAttribute.length !== undefined) {
        return script.src
    }

    return script.getAttribute('src', -1)
}

//play the current selected song
AdagioPlayer.prototype.play = function(){
  var player = this.audioPlayer;
  player.load();
  player.play();
}


//switch to the previous song
AdagioPlayer.prototype.previous = function(){
  if(this.playing == 0)
    this.playing = this.songs.length - 1;
  else
    this.playing--;
  this.updateSong();
}


//switch to the next song
AdagioPlayer.prototype.next = function(){
  var length = this.songs.length;
  if(this.playing+1 == length)
    this.playing = 0;
  else
    this.playing++;

  this.updateSong();
}

//changes song from one song to anoher
AdagioPlayer.prototype.updateSong = function(){
    var mp3 = document.getElementById('ap-mp3-source');
    var ogg = document.getElementById('ap-ogg-source');
    mp3.setAttribute('src',this.songs[this.playing].paths.mp3);
    ogg.setAttribute('src',this.songs[this.playing].paths.ogg);

    var player = this.audioPlayer;

    player.pause();
    player.load();
    player.play();
}


//adjust the volume of a song
AdagioPlayer.prototype.adjustVolume = function(volume){
  var player = this.audioPlayer;
  player.volume = volume;
}


//pause the player at current position
AdagioPlayer.prototype.pause = function(){
    var player = this.audioPlayer;
    player.pause();
}

//stop the player all together
AdagioPlayer.prototype.stop = function(){
    var player = this.audioPlayer;
    player.stop();
}

//add a song to the playlist
AdagioPlayer.prototype.addSong = function(song){
  this.songs.push(song);
}

//append the music player to the end of the HTML body.
AdagioPlayer.prototype.show = function(){
    var xmlhttp;
    var player = this;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
           if(xmlhttp.status == 200){
               document.body.innerHTML = document.body.innerHTML + xmlhttp.responseText;
               player.audioPlayer = document.getElementById('ap-audio-player');
               player.attachActions();
               player.updateSong();
           }
           else if(xmlhttp.status == 400) {
              alert('There was an error 400')
           }
           else {
               alert('something else other than 200 was returned')
           }
        }
    }

    console.log(player.getSrc());
    xmlhttp.open("GET", player.getSrc()+"adagioplayer.html", true);
    xmlhttp.send();
}

AdagioPlayer.prototype.attachActions = function(){
    var player = this;
    document.getElementById("ap-previous").addEventListener("click", function(){player.previous()});
    document.getElementById("ap-play").addEventListener("click",function(){player.play()});
    document.getElementById("ap-next").addEventListener("click",function(){player.next()});
    document.getElementById("ap-stop").addEventListener("click",function(){player.stop()});
    document.getElementById("ap-pause").addEventListener("click",function(){player.pause()});
}
