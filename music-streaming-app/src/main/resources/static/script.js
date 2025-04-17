const API_URL = 'http://localhost:8080/api/songs'; // Backend API URL

// Fetch and display all songs
const fetchSongs = () => {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#songs-table tbody');
            tableBody.innerHTML = ''; // Clear previous rows

            data.forEach(song => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${song.id}</td>
                    <td>${song.title}</td>
                    <td>${song.artist}</td>
                    <td>${song.album}</td>
                    <td>${song.genre}</td>
                    <td>${song.duration}</td>
                    <td>
                        <button class="update" onclick="editSong(${song.id}, '${song.title}', '${song.artist}', '${song.album}', '${song.genre}', ${song.duration})">Edit</button>
                        <button class="delete" onclick="deleteSong(${song.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching songs:', error));
};

// Show edit form for selected song
const editSong = (id, title, artist, album, genre, duration) => {
    console.log("Edit button clicked for ID:", id); // Debug log

    const editFormHtml = `
        <h2>Edit Song</h2>
        <form id="edit-song-form">
            <input type="hidden" id="edit-song-id" value="${id}" />
            <input type="text" id="edit-song-title" value="${title}" placeholder="Title" required />
            <input type="text" id="edit-song-artist" value="${artist}" placeholder="Artist" required />
            <input type="text" id="edit-song-album" value="${album}" placeholder="Album" required />
            <input type="text" id="edit-song-genre" value="${genre}" placeholder="Genre" required />
            <input type="number" id="edit-song-duration" value="${duration}" placeholder="Duration (in seconds)" required />
            <button type="submit">Save Changes</button>
        </form>
    `;

    const editContainer = document.getElementById('edit-container');
    editContainer.innerHTML = editFormHtml; // Update the DOM with the form

    document.getElementById('edit-song-form').addEventListener('submit', saveEditedSong); // Attach event listener
};

// Save the edited song details
const saveEditedSong = (event) => {
    event.preventDefault(); // Prevent form reload

    console.log("Save Changes clicked"); // Debug log

    const id = document.getElementById('edit-song-id').value;
    const title = document.getElementById('edit-song-title').value;
    const artist = document.getElementById('edit-song-artist').value;
    const album = document.getElementById('edit-song-album').value;
    const genre = document.getElementById('edit-song-genre').value;
    const duration = document.getElementById('edit-song-duration').value;

    const updatedSong = { title, artist, album, genre, duration };

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSong),
    })
        .then(response => {
            if (response.ok) {
                console.log("Song successfully updated"); // Success log
                fetchSongs(); // Refresh the song list
                document.getElementById('edit-container').innerHTML = ''; // Clear the edit form
            } else {
                console.error("Failed to update the song");
            }
        })
        .catch(error => console.error('Error updating song:', error)); // Log errors
};

// Add a new song
const addSong = (event) => {
    event.preventDefault();

    const title = document.getElementById('song-title').value;
    const artist = document.getElementById('song-artist').value;
    const album = document.getElementById('song-album').value;
    const genre = document.getElementById('song-genre').value;
    const duration = document.getElementById('song-duration').value;

    const newSong = { title, artist, album, genre, duration };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSong)
    })
        .then(response => {
            if (response.ok) {
                fetchSongs();
            }
        })
        .catch(error => console.error('Error adding song:', error));
};

// Delete a song
const deleteSong = (id) => {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                fetchSongs();
            }
        })
        .catch(error => console.error('Error deleting song:', error));
};

// Event listener for the Add Song form
document.getElementById('add-song-form').addEventListener('submit', addSong);

// Initial fetch to display all songs
fetchSongs();