(function() {
    $controls = $(".controls");

    var scplayer = new SoundCloudPlayer([
            //"/diplo/wobble-prod-diplo",
            "/excessdubstep/sauve-moi"
        ],{
          consumer_key: "77f18cbf064903d298d34d8451c6ed3c"
        , autoplay: false
        , loop: false
        , toggle_pause: true
        , preload: true
    });
    var scwaveform = new SCWaveform(scplayer, {scrub:true});

    var waveform = new Waveform({
        container: $("#waveform").get(0),
        innerColor: function(x,y) {
            return '#' + "ffffff";
        },
        data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    });

    // var scwaveform = new SCWaveform(scplayer, {scrub:true}, {
    //       container: "#waveform"
    //     , buffer: $("#waveform").find('.buffer')
    //     , playbar: $("#waveform").find('.played')
    //     , waveform: $("#waveform").find('> img')
    // });

    $controls.on("click", 'div', function(e){
        e.preventDefault();
        var $this = $(this)
        if( $this.hasClass('play') ){ scplayer.pause(); }
        else if( $this.hasClass('pause') ){ scplayer.pause(); }
        else if( $this.hasClass('stop') ){ scplayer.stop(); }
        else if( $this.hasClass('next') ){ scplayer.next(); }
        else if( $this.hasClass('prev') ){ scplayer.prev(); }
    });

    scplayer.on("scplayer.pause", function(e, is_paused){
        if(is_paused === true){
            $controls.find('.play').addClass("pause");
        }else{
            $controls.find('.play').removeClass("pause");
        }
    });

    scplayer.on('scplayer.track.bindable', function(e, track, sound){
        //get waveform.js to pull the waveform form the track
        // waveform.dataFromSoundCloudTrack(track);
        //get the waveform update functions back, pass your sweet colors here
        var waveform_updater = waveform.optionsForSyncedStream({
              playedColor: "#9D95DF"
            , loadedColor: "#7C85CC"
            , defaultColor: "#7C85CC"
        });
        //a little slower than direct, but let the events pass down to the waveform updater
        scplayer.on('scplayer.track.whileloading', function(e){
            waveform_updater.whileloading.call(sound);
        });
        scplayer.on('scplayer.track.whileplaying', function(e){
            waveform_updater.whileplaying.call(sound);
        });
    });

    scplayer.on("scplayer.init", function(e, track, sound){
        var $pl = $("#playlist");
        $pl.empty();
        //
        var playlist = scplayer.playlist();
        for(var x=0, l=playlist.length; x<l; x++){
            var $li = $("<li/>", {"html": "loading.."}).data('index', x).appendTo($pl);
            (function(x,$li){
                //lookup the track info
                scplayer.track_info(x).done(function(track){
                    console.log(track);
                    $(".track-user").html(track.user.username);
                    $(".track-title").html(track.title);
                });
            })(x,$li);			
        }
        
        $("#playlist").find('li:first').addClass('active');
    });


    scplayer.on("scplayer.changing_track", function(e, index){
        $("#playlist").find('li').removeClass('active').eq(index).addClass('active');
    });

    //click playlist tracks
    $("li", "#playlist").on('click', function(e){
        var $this = $(this);
        scplayer.goto($this.data('index')).play();
    });
})();