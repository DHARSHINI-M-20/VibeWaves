package com.vibewaves.music_streaming_app.repository;

import com.vibewaves.music_streaming_app.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    // Custom query methods can be added here
}