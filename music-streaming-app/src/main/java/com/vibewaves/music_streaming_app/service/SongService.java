package com.vibewaves.music_streaming_app.service;

import com.vibewaves.music_streaming_app.model.Song;
import com.vibewaves.music_streaming_app.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {

    @Autowired
    private SongRepository songRepository;

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }

    public Song saveSong(Song song) {
        return songRepository.save(song);
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }

    public Song updateSong(Long id, Song updatedSong) {
        return songRepository.findById(id)
                .map(existingSong -> {
                    existingSong.setTitle(updatedSong.getTitle());
                    existingSong.setArtist(updatedSong.getArtist());
                    existingSong.setAlbum(updatedSong.getAlbum());
                    existingSong.setGenre(updatedSong.getGenre());
                    existingSong.setDuration(updatedSong.getDuration());
                    return songRepository.save(existingSong);
                })
                .orElseThrow(() -> new RuntimeException("Song with id " + id + " not found"));
    }
}