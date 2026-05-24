const frameFiles = [
    "textfiles/frame0.txt",
    "textfiles/frame1.txt",
    "textfiles/frame2.txt",
    "textfiles/frame3.txt",
    "textfiles/frame4.txt",
    "textfiles/frame5.txt",
    "textfiles/frame6.txt",
    "textfiles/frame7.txt",
    "textfiles/frame8.txt"
]

let currIndex = 0; // the current frame we are on
const ascii = document.getElementById("ascii-anim");

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

    setInterval(loopFrames, 100);

}

animateAscii(); // don't forget to call the method once we're done!