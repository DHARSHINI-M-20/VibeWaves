const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/vibewaves'; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Song schema and model
const songSchema = new mongoose.Schema({
  id: Number,
  title: String,
  artist: String,
  album: String,
  src: String,
});
const Song = mongoose.model('Song', songSchema);

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

// Get all songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    songs.forEach(song => {
      song.url = `${req.protocol}://${req.get('host')}/songs/${song.src}`;
    });
    res.json(songs);
  } catch (err) {
    res.status(500).send('Error fetching songs');
  }
});

// Add a new song (POST)
app.post('/songs', async (req, res) => {
  try {
    const newSong = new Song(req.body);
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(500).send('Error saving song');
  }
});

// Update a song (PUT)
app.put('/songs/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedSong) return res.status(404).send('Song not found');
    res.json(updatedSong);
  } catch (err) {
    res.status(500).send('Error updating song');
  }
});

// Partially update a song (PATCH)
app.patch('/songs/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedSong) return res.status(404).send('Song not found');
    res.json(updatedSong);
  } catch (err) {
    res.status(500).send('Error updating song');
  }
});

// Delete a song (DELETE)
app.delete('/songs/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findOneAndDelete({ id: req.params.id });
    if (!deletedSong) return res.status(404).send('Song not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error deleting song');
  }
});

// Serve audio files
app.use('/songs', express.static(path.join(__dirname, 'songsearch', 'public', 'songs')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});