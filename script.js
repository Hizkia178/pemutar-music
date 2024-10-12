let trackList = [];
let trackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let currentTrack = document.querySelector('.track-name');
let currentArtist = document.querySelector('.track-artist');
let trackArt = document.querySelector('.track-art');
let playpauseBtn = document.querySelector('.playpause-track i');
let wave = document.getElementById('wave');
let currentTime = document.querySelector('.current-time');
let totalDuration = document.querySelector('.total-duration');
let randomBtn = document.querySelector('.random-track i');
let repeatBtn = document.querySelector('.repeat-track i');

// Fetch the JSON data
fetch('tracks.json')
    .then(response => response.json())
    .then(data => {
        trackList = data; // Assign the fetched track data
        loadTrack(trackIndex); // Load the first track after fetching
    })
    .catch(error => console.log('Error loading JSON:', error));

function loadTrack(trackIndex) {
    audio.src = trackList[trackIndex].path;
    currentTrack.innerText = trackList[trackIndex].name;
    currentArtist.innerText = trackList[trackIndex].artist;
    trackArt.style.backgroundImage = "url(" + trackList[trackIndex].cover + ")";
    audio.load();
    updateTimer();
}

function playTrack() {
    audio.play();
    isPlaying = true;
    playpauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
    wave.classList.add('active');
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playpauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
    wave.classList.remove('active');
}

playpauseBtn.addEventListener('click', function () {
    isPlaying ? pauseTrack() : playTrack();
});

function nextTrack() {
    trackIndex = (trackIndex + 1) % trackList.length;
    loadTrack(trackIndex);
    playTrack();
}

function prevTrack() {
    trackIndex = (trackIndex - 1 + trackList.length) % trackList.length;
    loadTrack(trackIndex);
    playTrack();
}

document.querySelector('.next-track').addEventListener('click', nextTrack);
document.querySelector('.prev-track').addEventListener('click', prevTrack);

function randomTrack() {
    let randomIndex = Math.floor(Math.random() * trackList.length);
    loadTrack(randomIndex);
    playTrack();
}

randomBtn.addEventListener('click', randomTrack);

function repeatTrack() {
    loadTrack(trackIndex);
    playTrack();
}

repeatBtn.addEventListener('click', repeatTrack);

audio.addEventListener('ended', function () {
    nextTrack();
});

function updateTimer() {
    audio.addEventListener('timeupdate', function () {
        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);

        currentTime.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
        totalDuration.innerText = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
    });
}


let progressSlider = document.getElementById('progress-slider');

// Update slider as the song progresses
audio.addEventListener('timeupdate', function () {
    if (!isNaN(audio.duration)) {
        let progress = (audio.currentTime / audio.duration) * 100;
        progressSlider.value = progress;

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);

        currentTime.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
        totalDuration.innerText = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
    }
});

// Allow user to change the progress by moving the slider
progressSlider.addEventListener('input', function () {
    let seekTo = (progressSlider.value / 100) * audio.duration;
    audio.currentTime = seekTo;
});
