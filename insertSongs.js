const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/vibewaves'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Song schema and model
const songSchema = new mongoose.Schema({
  id: Number,
  title: String,
  src: String,
  url: String
});
const Song = mongoose.model('Song', songSchema);

// Read songs.json and insert data
fs.readFile('songs.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading songs.json:', err);
    return;
  }

  try {
    const songs = JSON.parse(data);
    await Song.insertMany(songs);
    console.log('Songs inserted successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error inserting songs:', err);
  }
});