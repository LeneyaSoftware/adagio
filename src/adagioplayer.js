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
  this.currentSong = this.songs[this.playing];

  this.create();
}

//play the current selected song
AdagioPlayer.prototype.play = function(){
  var player = this.audioPlayer;
  player.load();
  player.play();
}


//switch to the previous song
AdagioPlayer.prototype.previous = function(){
  if(this.playing == 0){
    this.playing = this.songs.length - 1;
  }
  else{
    this.playing--;
  }
  this.updateSong();
}


//switch to the next song
AdagioPlayer.prototype.next = function(){
  var length = this.songs.length;
  if(this.playing+1 == length){
    this.playing = 0;
  }
  else{
    this.playing++;
  }

  this.updateSong();
}

//changes song from one song to anoher
AdagioPlayer.prototype.updateSong = function(){
    this.currentSong = this.songs[this.playing];
    var mp3 = document.getElementById('ap-mp3-source');
    var ogg = document.getElementById('ap-ogg-source');
    mp3.setAttribute('src',this.currentSong.paths.mp3);
    ogg.setAttribute('src',this.currentSong.paths.ogg);

    this.updateUI();

    var player = this.audioPlayer;
    player.pause();
    player.load();
    player.play();
}

AdagioPlayer.prototype.updateUI = function(){
    var title = document.getElementById('ap-song-title');
    var artist = document.getElementById('ap-song-artist');
    var album = document.getElementById('ap-song-album');
    var song = this.songs[this.playing].paths

    title.innerHTML = this.currentSong.title;
    artist.innerHTML = this.currentSong.artist;
    album.innerHTML = this.currentSong.album;
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
    player.pause();
    player.currentTime = 0;
}

//add a song to the playlist
AdagioPlayer.prototype.addSong = function(song){
  this.songs.push(song);
}

AdagioPlayer.prototype.create = function(){
    player = this;
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded", function() {
            player.show();
        });
    }
    else if(document.attachEvent){
        document.attachEvent("onreadystatechange", function(){
            if (document.readyState === "complete"){
                document.detachEvent( "onreadystatechange", arguments.callee );
                player.show();
            }
        });
    }
}

//append the music player to the end of the HTML body.
AdagioPlayer.prototype.show = function(){
    var markup = '<div class="ap-player">';
    markup += '<div class="ap-controls">';
    markup +=    '<span id="ap-previous"><i class="fa fa-fast-backward"></i></span>';
    markup +=    '<span id="ap-stop"><i class="fa fa-stop"></i></span>';
    markup +=    '<span id="ap-play"><i class="fa fa-play"></i></span>';
    markup +=    '<span id="ap-pause" class="hidden"><i class="fa fa-pause"></i></span>';
    markup +=    '<span id="ap-next"><i class="fa fa-fast-forward"></i></span>';
    markup += '</div>';
    markup += '<div class="ap-now-playing">' +
              '<span id="ap-song-title"></span>' +
              '<span id="ap-song-artist"></span>' +
              '<span id="ap-song-album"></span>'+
             '</div>';
    markup += '<div class="ap-volume"></div>';
    markup+=  '</div>';
    markup+= '<audio controls class="ap-audio" id="ap-audio-player">';
    markup+= '<source id="ap-mp3-source" src="" type="audio/mp3"/>';
    markup+= '<source id="ap-ogg-source" src="" type="audio/ogg" />';
    //markup for IE <= 8
    markup+= '<embed src="" width="0" height="0" loop="false" autostart="false" class="ap-audio" />';
    markup+= '</audio>';

    document.body.innerHTML = document.body.innerHTML + markup;
    this.audioPlayer = document.getElementById('ap-audio-player');
    this.attachActions();
    this.updateSong();
}


AdagioPlayer.prototype.attachActions = function(){
    var player = this;
    document.getElementById("ap-previous").addEventListener("click", function(){player.previous()});
    document.getElementById("ap-play").addEventListener("click",function(){player.play()});
    document.getElementById("ap-next").addEventListener("click",function(){player.next()});
    document.getElementById("ap-stop").addEventListener("click",function(){player.stop()});
    document.getElementById("ap-pause").addEventListener("click",function(){player.pause()});
    this.audioPlayer.addEventListener('ended',function(){player.next()});
}
