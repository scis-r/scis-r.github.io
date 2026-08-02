let Track = {
    name: 'name',
    artist: 'artist',
    url: 'url'
};

/**
 * Calls the backend and receives a JSON about the current track playing on Spotify,
 * then reconstructs the important data into a Track object
 */
async function getCurrentTrack() {

    const response = await fetch (
        "http://127.0.0.1:8080/api/spotify/get-current-track"
    );

    // if spotify isn't playing anything right now
    if (response.status === 204) {
        updateTrack('Not listening to anything at the moment :( ', 'nobody', '');
        displayTrack();
        return;
    }

    const currentTrack = await response.json();

    const songName = currentTrack.item.name;
    const songArtist = currentTrack.item.artists[0].name;
    const songURL = currentTrack.item.album.images[0].url;

    updateTrack(songName, songArtist, songURL);

    displayTrack();

}

/**
 * Updates the Track object with the relevant information.
 */
function updateTrack(name, artist, url) {
    Track.name = name;
    Track.artist = artist;
    Track.url = url;
}

/**
 * Displays the current track on the site.
 */
async function displayTrack() {
    const currentName = document.getElementById("current-name");
    const currentArtist = document.getElementById("current-artist");
    const currentURL = document.getElementById("current-url");

    currentName.textContent = Track.name;
    currentArtist.textContent = 'by ' + Track.artist;
    currentURL.src = Track.url;

    // load the image BEFORE getting the color
    await new Promise(resolve => {
        currentURL.onload = resolve;
    });

    updateColor();
}

/**
 * Updates the current track displayed on the site every five seconds.
 */
function loopCurrentTrack() {
    getCurrentTrack(); // call it once here so it loads on the site instantly
    setInterval(getCurrentTrack, 1000);
}

loopCurrentTrack();

const cover = document.getElementById("current-url");

/**
 * Uses ColorThief to get the "Vibrant" color of the cover, then uses it for styling.
 * Defaults to the .getColor or black for some objects if Vibrant is null.
 */
async function updateColor() {
    const colors = await ColorThief.getSwatches(cover);
    const currentName = document.getElementById("current-name");
    const currentArtist = document.getElementById("current-artist");

    var albumColor = colors.LightVibrant;

    // some of the swatches can be null depending on the image, so default to getColor if that's the case
    if (albumColor == null) {
        albumColor = await ColorThief.getColor(cover);
    } else {
        albumColor = albumColor.color;
    }

    albumColor = checkBrightness(albumColor);

    currentName.style.color = albumColor;
    currentArtist.style.color = albumColor;
}

/**
 * Gets the average value of the RGB values of albumColor.
 * If the average is below a certain threshold, the RGB is inverted.
 * This makes sure that dark text colors don't appear on the black background.
 */
function checkBrightness(albumColor) {
    const r = albumColor._r;
    const g = albumColor._g;
    const b = albumColor._b;

    const avg = (r + g + b) / 3;

    if (avg <= 20) {

        const rInv = 255 - r;
        const gInv = 255 - g;
        const bInv = 255 - b;

        albumColor._r = rInv;
        albumColor._g = gInv;
        albumColor._b = bInv;
        
    }

    return albumColor;

}

const flairs = document.getElementsByClassName("flair");

const flairFiles = [
    "textfiles/flair0.txt",
    "textfiles/flair1.txt",
    "textfiles/flair2.txt",
    "textfiles/flair3.txt"
]

const colors = [
    "rgb(198, 245, 219)",
    "rgb(234, 196, 251)",
    "rgb(255, 255, 255)",
    "rgb(238, 236, 140)",
    "rgb(67, 76, 232)",
    "rgb(167, 248, 246)"
]

let flairCurrIndex = 0;
let lastColorIndex = 0;

/**
 * Animates the flair in the currently playing song section.
 * Changes the text every frame, along with guaranteeing a new color for it each rotation.
 */
async function animateFlair() {

    const frames = await Promise.all(

        flairFiles.map(file =>
            fetch(file).then(res => res.text())
        )

    );

    function loopFrames() {

        let randomColorIndex = Math.floor(Math.random() * colors.length);

        while (lastColorIndex == randomColorIndex) {
            randomColorIndex = Math.floor(Math.random() * colors.length);
        }

        lastColorIndex = randomColorIndex;

        for (const flair of flairs) {
            flair.textContent = frames[flairCurrIndex];
            flair.style.color = colors[randomColorIndex];
        }

        flairCurrIndex = (flairCurrIndex + 1) % flairFiles.length;
    }

    loopFrames();

    setInterval(loopFrames, 500);

}

animateFlair();

const currentTrackToggle = document.getElementById("current-song-toggle");
var currentTrackShown = true;
const currentTrackSection = document.getElementById("current-song");
currentTrackSection.classList.add("flex");

function toggleCurrentTrack() {

    if (currentTrackShown) {

        currentTrackSection.classList.remove("flex");
        currentTrackSection.classList.add("hidden");
        
    } else {

        currentTrackSection.classList.remove("hidden");
        currentTrackSection.classList.add("flex");

    }

    currentTrackShown = !currentTrackShown;

}

currentTrackToggle.onclick = toggleCurrentTrack;