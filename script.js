$(document).ready(function () {
    let songs = [];
    let currentIndex = 0;
    let audio = $("#audio-player")[0];

    // Load songs dynamically
    $.ajax({
        url: "/songs.json", // Updated path assuming 'public' is root
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data) && data.length > 0) {
                songs = data;
                loadSongs();
                const urlParams = new URLSearchParams(window.location.search);
                const songTitle = urlParams.get('song');
                if (songTitle) {
                    currentIndex = songs.findIndex(song => song.title === songTitle);
                    if (currentIndex !== -1) {
                        playSong();
                    }
                }
            } else {
                console.error("Songs JSON is empty or not an array.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading songs.json:", error);
        }
    });

    // Function to load songs into the list
    function loadSongs() {
        $("#song-list").empty();
        songs.forEach((song, index) => {
            $("#song-list").append(`<li data-index="${index}">${song.title}</li>`);
        });
    }

    // Click to play a song
    $(document).on("click", "#song-list li", function () {
        currentIndex = $(this).data("index");
        playSong();
    });

    // Play/Pause button
    $("#play-pause").click(function () {
        if (audio.paused) {
            audio.play().then(() => {
                $("#play-pause").text("⏸️ Pause");
            }).catch(err => console.error('Audio playback failed:', err));
        } else {
            audio.pause();
            $("#play-pause").text("▶️ Play");
        }
    });

    // Next song
    $("#next").click(function () {
        if (songs.length > 0) {
            currentIndex = (currentIndex + 1) % songs.length;
            playSong();
        }
    });

    // Previous song
    $("#prev").click(function () {
        if (songs.length > 0) {
            currentIndex = (currentIndex - 1 + songs.length) % songs.length;
            playSong();
        }
    });

    // Play selected song
    function playSong() {
        if (!songs || songs.length === 0) {
            console.error("No songs available.");
            return;
        }

        if (currentIndex < 0 || currentIndex >= songs.length) {
            console.error("Invalid song index:", currentIndex);
            return;
        }

        let song = songs[currentIndex];

        if (!song || !song.title || !song.src) {
            console.error("Invalid song data:", song);
            return;
        }

        let songUrl = `/${song.src}`; // Updated path for song location

        console.log("Playing:", song.title, " - ", songUrl);
        $("#song-title").text(song.title);
        audio.src = songUrl;
        audio.load();
        audio.play().then(() => {
            $("#play-pause").text("⏸️ Pause");
        }).catch(err => console.error('Audio playback failed:', err));
    }
});
