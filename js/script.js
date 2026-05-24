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

// code to load the ascii face (now separate from the anim)
const asciiFaceContainer = document.getElementById("ascii-face");
const asciiFacePath = "textfiles/face.txt";
const asciiFaceOpenPath = "textfiles/face-open.txt";
let asciiFace = "";
let asciiFaceOpen = ""

function loadFace() {

    asciiFaceContainer.textContent = asciiFace;

}

async function loadFaceFile() {

    const response1 = await fetch(asciiFacePath);
    asciiFace = await response1.text();

    const response2 = await fetch(asciiFaceOpenPath);
    asciiFaceOpen = await response2.text();

    loadFace();

}

loadFaceFile();

// code to animate the face on mouse hover

function openMouth() {

    asciiFaceContainer.textContent = asciiFaceOpen;

}

asciiFaceContainer.onmouseenter = openMouth;
asciiFaceContainer.onmouseleave = loadFace;

// code to redirect user to the test page when clicking on the face

function faceRedirect() {

    window.location.href = "testing/index.html";

}

asciiFaceContainer.onclick = faceRedirect;

// code for the blinking cursors
const blockCursor = document.getElementById("block-cursor");
const underscoreCursor = document.getElementById("underscore-cursor");
let cursorShown = true;

function toggleCursors() {

    if (cursorShown) {
        blockCursor.classList.add("hidden");
        underscoreCursor.classList.remove("hidden");
    } else {
        blockCursor.classList.remove("hidden");
        underscoreCursor.classList.add("hidden");
    }

    cursorShown = !cursorShown;

}

setInterval(toggleCursors, 500);

// code for inputting text into the "terminal" ! also don't make fun of my javadoc T_T
const textEntry = document.getElementById("text-entry");
let text = "> ";
let currentChar = 2; // this will be used so the user can't delete the "> " at the beginning of each line

/**
 * Gets characters typed by the user, and if they match a command, carry out that command.
 * 
 * @param {*} e, the "keydown" event 
 * @returns 
 */
function updateText(e) {

    e.preventDefault(); // i don't really know why, but when you press backspace, it takes you to the testing page lol. so this prevents that from happening

    const lastLineBreak = text.lastIndexOf("\n> ");

    if (e.key === 'Backspace') { // if you press backspace, it will actually delete (needed since this isn't technically an input box)

        if (currentChar == 2) return; // now, you can't delete stuff before the "> "

        text = text.slice(0, -1);
        currentChar--;
        textEntry.textContent = text;
        return;
    } else if (e.key === 'Tab') { // tab will just add four spaces (not 8, git bash D:< )
        text += "    ";
        currentChar += 4;
        textEntry.textContent = text;
        return;
    }

    if (e.key === 'Enter') { // check thru the list of "commands" to determine what to do when enter is pressed

        checkCommand(lastLineBreak);

    }

    if (e.key.length > 1) return; // without this, when you pressed something like the alt key, it would literally type out "Alt" to the terminal lmfao

    // add whatever letter you pressed down
    text += e.key;
    currentChar++;
    textEntry.textContent = text;

}

function checkCommand(lastLineBreak) {

    // this will get the most recent typed text after the latest newline
    const newLine = text.substring(lastLineBreak + 3);

        switch (newLine.toLowerCase()) { // i know it's only one case so far but switch case allows me to make more commands later down the line suuuuper easily

            case ('help'):
                text += '\n';
                text += "list of commands :3\n";
                text += "'help': brings up this page!\n";
                text += "'enter': brings you to the home page, the real heart of the site.\n";
                text += "'clear': clears what you've typed.\n";
                text += "'splash': refreshes and repicks the splash text! (don't run this while the splash text is typing lmao)\n";
                text += "> ";

                currentChar = 2;
                textEntry.textContent = text;
                return;

            case ('enter'):
                window.location.href = "home.html";
                return;
            
            case ('clear'):
                text = "> ";
                currentChar = 2;
                textEntry.textContent = text;
                return;
            
            case ('splash'):
                randomSplashText(0);
                text += "\n> ";
                currentChar = 2;
                textEntry.textContent = text;
                return;

            case (''):
                return;

            default: // if there isn't a command that matches with what is typed, just add a newline
                text += "\n> ";

                currentChar = 2;
                textEntry.textContent = text;
                return;

        }

}

document.addEventListener("keydown", updateText); // subscribeee  to the newsletter

// code for the splash text!
const splashTextFile = "textfiles/splash-text.txt";
const splashTextContainer = document.getElementById("splash-text");
let splashText = "";

/**
 * Picks a random line from textfiles/splash-text.txt, then puts it on the page.
 * 
 */
function randomSplashText(choice) {

    const numLines = numberInstancesOf(splashText, '\n') + 1; // + 1 since the file doesn't end in a new line
    
    const randomLine = Math.floor(Math.random() * numLines) + 1; // pick a random number

    if (choice > numLines || choice < 0) return; // adding a choice thing so maybe you can choose i lowk don't know how to do this yet lmfao
    if (choice != 0) randomLine = choice;

    const lineBegin = randomLine.toString() + ": "
    const beginningIndex = splashText.indexOf(lineBegin) + lineBegin.length; // gets the beginning of the splash text (after "#: ")
    
    let endIndex = splashText.length; // this won't be overwritten if we picked the very last splash text, so this index value will work

    for (let i = beginningIndex; i < splashText.length; i++) { // this will find the next '\n'
        if (splashText[i] === '\n') {
            endIndex = i;
            break;
        }
    }

    const splash = splashText.substring(beginningIndex, endIndex); // now we have the splash!

    iterateSplash(splash); // this will make it so the splash appears one by one instead of instantly

}

// helper methods for ^^
function numberInstancesOf(targetString, targetChar) {

    let count = 0;
    for (let i = 0; i < targetString.length; i++) {
        if (targetString[i] === targetChar) count++;
    }
    return count;

}

async function loadSplashText() {

    const response = await fetch(splashTextFile); // await keyword pauses the rest of the function until we get this response

    splashText = await response.text(); // this turns the txt file into the actual string

    randomSplashText(0); // now that the file is loaded, generate the random line

}

async function iterateSplash(splash) {

    const splashLength = splash.length;
    let containerText = "";

    for (let i = 0; i < splashLength; i++) {
        containerText += splash[i];
        splashTextContainer.textContent = containerText;
        await delay(100);
    }

}

function delay(ms) { // method code from sanfwin.medium.com !!!!
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = loadSplashText;