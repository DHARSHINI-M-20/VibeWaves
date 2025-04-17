import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SettingsPage from './settings';
import RealTimePage from "./NowplayingPage";

console.log("App component is rendering");

const App = () => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/songs');
      console.log('Fetched songs:', response.data);
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playSong = (song) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.src; // Ensure the audio element reloads the new source
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error('Audio playback failed:', err));
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.error('Audio playback failed:', err));
      }
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const goToRealTimePage = () => {
    navigate('/realtime');
  };

  return (
    <div className="app-container">
      <span
        className="material-icons now-playing-icon"
        onClick={goToRealTimePage}
        style={{ position: "fixed", top: "10px", left: "10px", cursor: "pointer", fontSize: "30px" }}
      >
        music_note
      </span>
      <span
        className="material-icons search-icon"
        onClick={() => navigate("/")}
        style={{ position: "fixed", top: "10px", left: "50%", transform: "translateX(-50%)", cursor: "pointer", fontSize: "30px" }}
      >
        search
      </span>
      <span className="material-icons settings-icon" onClick={goToSettings}>settings</span>
      <Routes>
        <Route path="/" element={
          <>
            <h1>VibeWaves</h1>
            <input
              type="text"
              placeholder="Search for songs..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <ul className="song-list">
              {filteredSongs.map((song, index) => (
                <li key={index} onClick={() => playSong(song)}>
                  {song.title}
                </li>
              ))}
            </ul>
            {currentSong && (
              <div className="player">
                <h2>{currentSong.title}</h2>
                <audio ref={audioRef} controls />
                <button onClick={togglePlayPause}>
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
              </div>
            )}
          </>
        } />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/realtime" element={<RealTimePage />} />
      </Routes>
    </div>
  );
};

export default App;