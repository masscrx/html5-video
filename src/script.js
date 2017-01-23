$(window).on('load', function() {

  'use strict';
  // Core elements
  var $playlistElem = $('#playlist');
  var videoPlayer = document.getElementById('videoarea');

  // Buttons
  var playButton = document.getElementById('play-pause');
  var stopButton = document.getElementById('stop');
  var muteButton = document.getElementById('mute');
  var fullScreenButton = document.getElementById("full-screen");

  // Sliders
  var seekBar = document.getElementById("seek-bar");
  var volumeBar = document.getElementById("volume-bar");

  var curVideo = 0;
  var playlist;

  function CreatePlaylist(movies) {
    // Create list
    for (var i = 0; i < movies.length; i++) {
      $( '<li />', {
        text: movies[i].name,
        movieid: movies[i].id
      })
      .appendTo($playlistElem);
    }
    // Bind Events
    $("#playlist li").on("click", function(ev) {
      var movieId = parseInt($(ev.target).attr('movieid'));
      var movie = movies.find( (el) => {
        return el.id === movieId;
      });

      LoadMovieIntoPlayer(movie);
    });
  }

  function LoadMovieIntoPlayer(movie) {
    $(videoPlayer).attr({
      'src': movie.url,
      'poster': movie.poster
      //'autoplay': 'autoplay'
    });

    curVideo = movie.id;
    seekBar.value = 0;

    $('ul#playlist').find('li.active').removeClass('active');
    $('ul#playlist').find('li[movieid="' + movie.id + '"]').addClass('active');
  }

  function PlayNext() {
    var nextMovie = playlist.find( (el) => {
      return el.id === curVideo + 1;
    });

    if (nextMovie) {
      LoadMovieIntoPlayer(nextMovie);
      videoPlayer.play();
    }
  }
  
  // Run player
  $.get('movies.json', (result) => {
    playlist = result.data;
    CreatePlaylist(playlist);
    LoadMovieIntoPlayer(playlist[0]);
  });


  $(videoPlayer).on('ended', () => {
    $('#autoplay').is(':checked') && PlayNext();
  });

  // Event listener for the play/pause button
  playButton.addEventListener('click', function() {
    if (videoPlayer.paused === true) {
      // Play the video
      videoPlayer.play();

      // Update the button to 'Pause' icon
      playButton.innerHTML = '<i class="fa fa-pause"></i>';
    } else {
      // Pause the video
      videoPlayer.pause();

      // Update the button to 'Play' icon
      playButton.innerHTML = '<i class="fa fa-play"></i>';
    }
  });

  // Event listener for the play/pause button
  stopButton.addEventListener('click', function() {
    LoadMovieIntoPlayer(playlist[0]);
  });

  // Event listener for the mute button
  muteButton.addEventListener('click', function() {
    if (videoPlayer.muted === false) {
      // Mute the video
      videoPlayer.muted = true;

      // Update the button
      muteButton.innerHTML = '<i class="fa fa-volume-up"></i>';
    } else {
      // Unmute the video
      videoPlayer.muted = false;

      // Update the button
      muteButton.innerHTML = '<i class="fa fa-volume-off"></i>';
    }
  });

  // Event listener for the full-screen button
  fullScreenButton.addEventListener('click', function() {
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) {
      videoPlayer.mozRequestFullScreen(); // Firefox
    } else if (videoPlayer.webkitRequestFullscreen) {
      videoPlayer.webkitRequestFullscreen(); // Chrome and Safari
    }
  });

  // Event listener for the seek bar
  seekBar.addEventListener('change', function() {
    // Calculate the new time
    var time = videoPlayer.duration * (seekBar.value / 100);

    // Update the video time
    videoPlayer.currentTime = time;
  });

  // Pause the video when the slider handle is being dragged
  seekBar.addEventListener('mousedown', function() {
    videoPlayer.pause();
  });

  // Play the video when the slider handle is dropped
  seekBar.addEventListener('mouseup', function() {
    videoPlayer.play();
  });

  // Update the seek bar as the video plays
  videoPlayer.addEventListener('timeupdate', function() {
    // Calculate the slider value
    var value = (100 / videoPlayer.duration) * videoPlayer.currentTime;

    // Update the slider value
    seekBar.value = value;
  });

  // Event listener for the volume bar
  volumeBar.addEventListener('change', function() {
    // Update the video volume
    videoPlayer.volume = volumeBar.value;
  });

});