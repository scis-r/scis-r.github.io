// function randomBackgroundTile(numChoices) {
//     const number = Math.floor(Math.random() * numChoices) + 1;
//     let urlPath = "images/bg_tile";
//     const numberString = number.toString();
//     urlPath = urlPath.concat(numberString, ".png");
//     document.body.style.backgroundImage = `url(${urlPath})`;
// }

// window.onload = randomBackgroundTile(5);

// im keeping this ^^ justtt in case.

const frameFiles = [
    "ascii-frames/frame0.txt",
    "ascii-frames/frame1.txt",
    "ascii-frames/frame2.txt",
    "ascii-frames/frame3.txt",
    "ascii-frames/frame4.txt",
    "ascii-frames/frame5.txt",
    "ascii-frames/frame6.txt",
    "ascii-frames/frame7.txt",
    "ascii-frames/frame8.txt",
]

let currIndex = 0; // the current frame we are on
const ascii = document.getElementById("ascii-art");

/**
 * Animates the ASCII art on the homepage.
 * 
 * Frames stored under ascii-frames/
 */
async function animateAscii() {
    // this loads all the frames at the same time (hence the async keyword)
    const frames = await Promise.all( // so, when the webpage loads, the animation won't play until all frames are loaded

        frameFiles.map(file => // this maps each file to it's text content (turns "hello".txt -> "hello")
            fetch(file).then(res => res.text()) // ofc assuming "hello".txt contains "hello"
        )

    );

    function loopFrames() { // this will load the frame at the current index, then increment the index
        ascii.textContent = frames[currIndex];
        currIndex = (currIndex + 1) % 9; // mod 9 because we have 9 frames
    }

    loopFrames(); // call this once by itself so the art automatically loads!

    setInterval(loopFrames, 50);

}

animateAscii(); // don't forget to call the method once we're done!

// when you click on the ascii, get redirected to the testing page
function asciiClick() {

    window.location.href = "testing/index.html";

}

ascii.onclick = asciiClick;
