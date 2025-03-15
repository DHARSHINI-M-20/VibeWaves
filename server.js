const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Serve static files including CSS
app.use(express.static(path.join(__dirname, 'songsearch', 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'songsearch', 'public', 'index.html'));
});

// Route to serve song.html
app.get('/song.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'songsearch', 'public', 'song.html'));
});

const songsFile = path.join(__dirname, 'songs.json');

// Get all songs
app.get('/songs', (req, res) => {
  fs.readFile(songsFile, (err, data) => {
    if (err) return res.status(500).send('Error reading songs file');
    const songs = JSON.parse(data);
    songs.forEach(song => {
      song.url = `${req.protocol}://${req.get('host')}/songs/${song.src}`;
    });
    res.json(songs);
  });
});

// Add a new song (POST)
app.post('/songs', (req, res) => {
  const newSong = req.body;
  fs.readFile(songsFile, (err, data) => {
    if (err) return res.status(500).send('Error reading songs file');
    const songs = JSON.parse(data);
    newSong.id = songs.length ? songs[songs.length - 1].id + 1 : 1;
    songs.push(newSong);
    fs.writeFile(songsFile, JSON.stringify(songs, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving song');
      res.status(201).json(newSong);
    });
  });
});

// Update a song (PUT)
app.put('/songs/:id', (req, res) => {
  const { id } = req.params;
  const updatedSong = req.body;
  fs.readFile(songsFile, (err, data) => {
    if (err) return res.status(500).send('Error reading songs file');
    let songs = JSON.parse(data);
    const index = songs.findIndex(song => song.id === parseInt(id));
    if (index === -1) return res.status(404).send('Song not found');
    songs[index] = { ...songs[index], ...updatedSong };
    fs.writeFile(songsFile, JSON.stringify(songs, null, 2), err => {
      if (err) return res.status(500).send('Error updating song');
      res.json(songs[index]);
    });
  });
});

// Partially update a song (PATCH)
app.patch('/songs/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  fs.readFile(songsFile, (err, data) => {
    if (err) return res.status(500).send('Error reading songs file');
    let songs = JSON.parse(data);
    const index = songs.findIndex(song => song.id === parseInt(id));
    if (index === -1) return res.status(404).send('Song not found');
    songs[index] = { ...songs[index], ...updates };
    fs.writeFile(songsFile, JSON.stringify(songs, null, 2), (err) => {
      if (err) return res.status(500).send('Error updating song');
      res.json(songs[index]);
    });
  });
});

// Delete a song (DELETE)
app.delete('/songs/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(songsFile, (err, data) => {
    if (err) return res.status(500).send('Error reading songs file');
    let songs = JSON.parse(data);
    const filteredSongs = songs.filter(song => song.id !== parseInt(id));
    if (songs.length === filteredSongs.length) return res.status(404).send('Song not found');
    fs.writeFile(songsFile, JSON.stringify(filteredSongs, null, 2), (err) => {
      if (err) return res.status(500).send('Error deleting song');
      res.status(204).send();
    });
  });
});

// Serve audio files
app.use('/songs', express.static(path.join(__dirname, 'songsearch', 'public', 'songs')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});