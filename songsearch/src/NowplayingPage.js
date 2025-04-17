import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const NowPlayingPage = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs();

    // Simulate new songs being added to the queue every 5 seconds
    const interval = setInterval(() => {
      setQueue((prevQueue) => [
        ...prevQueue,
        { title: `New Song ${prevQueue.length + 1}`, artist: "Random Artist", src: "/path/to/song.mp3" }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/songs");
      if (response.data.length > 0) {
        setCurrentSong(response.data[0]); 
        setQueue(response.data.slice(1)); 
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  const handleNextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue((prevQueue) => prevQueue.slice(1));
  
      if (audioRef.current) {
        audioRef.current.src = nextSong.src;
        audioRef.current.load(); // Ensure the new song is loaded
  
        // Wait for the loaded metadata before playing
        audioRef.current.onloadedmetadata = () => {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(err => console.error("Playback failed:", err));
        };
      }
    }
  };
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Now Playing</h1>
      {currentSong ? (
        <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "10px", background: "#f4f4f9" }}>
          <h2>{currentSong.title}</h2>
          <p>{currentSong.artist || "Unknown Artist"}</p>
          <audio ref={audioRef} src={currentSong.src} />
          <button
            onClick={togglePlayPause}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button
            onClick={handleNextSong}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              marginLeft: "10px",
              backgroundColor: "#ff6a88",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Next Song
          </button>
        </div>
      ) : (
        <p>No song is currently playing.</p>
      )}
      <h2 style={{ marginTop: "20px" }}>Up Next</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {queue.map((song, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              margin: "5px 0",
              background: "#fff",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {song.title} - {song.artist || "Unknown Artist"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NowPlayingPage;