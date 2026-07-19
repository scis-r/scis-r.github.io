// function randomBackgroundTile(numChoices) {
//     const number = Math.floor(Math.random() * numChoices) + 1;
//     let urlPath = "images/bg_tile";
//     const numberString = number.toString();
//     urlPath = urlPath.concat(numberString, ".png");
//     document.body.style.backgroundImage = `url(${urlPath})`;
// }

// window.onload = randomBackgroundTile(5);

// im keeping this ^^ justtt in case. leftovers from an older version of this site.

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

        switch (newLine.toLowerCase()) {

            case ('help'):
                text += '\n';
                text += "list of commands :3\n";
                text += "'help': brings up this page!\n";
                text += "'whatisthis': brings up some information about this page, along side some other commands to \"navigate\" the site!\n";
                text += "'clear': clears what you've typed.\n";
                text += "'splash': refreshes and repicks the splash text! (don't run this while the splash text is typing lmao)\n";
                text += "also, if you click on the little face above the terminal, you can go to my testing page, where i play around with more traditional HTML\n";
                
                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

            case ('whatisthis'):
                text += "\nhi! my name is scisr, and this is my little website (even though it's more of a terminal so far lolll)!\n";
                text += "i wanted to get into web development, and i've always wanted a little space where i could express myself, so i taught myself how to code for this!\n";
                text += "so, if you want to keep exploring, here are some more commands you can do to learn more about me!\n";

                text += "'music': a list of songs and artists i really enjoy listening to!\n";
                text += "'projects': a list of projects that i've made or that i'm currently working on!\n";
                text += "'scisr': more general things about myself!\n";

                text += "side note: by no means am i a good web programmer, most of this code is horrible ,_, this is just for fun!!!\n";
                // text += "'': \n";

                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

            case ('music'):
                text += "\nnot programmed yet bruh!\n";
                text += "probably a redirect to a new page? maybe more \"traditional\" html, ykwim.\n";

                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

            case ('projects'):
                text += "\n----- finished projects! -----\n";
                text += "\n";

                text += "rgb fan controller (name pending)\n";
                text += "--> a program coded in C# that changes the colors of my pc cases's fans depending on what song i'm listening to on spotify!\n";
                text += "--> it reads the pixels from the screen on my second monitor when i fullscreen spotify, going up and down to get a nice breathing effect!\n";
                text += "--> it was a fun challenge having to figure out the Corsair SDK (jk it was very not fun T_T but finished project was great)\n";
                text += "--> project link: not yet (remember to put it on github sometime lol)\n"; // TODO: publish it to github and put the link here
                text += "\n";

                text += "----- current projects! -----\n";
                text += "\n";

                text += "scisr.net (this website!!!)\n";
                text += "--> this is the site you're currently on! isn't that so cool???\n";
                text += "--> to go more in depth as to what i was talking about earlier, i've always wanted some way to express myself quote unquote \"artistically\".\n";
                text += "--> the problem is that i'm not very good at turning my creativity into something tangible. i'm not great at drawing, sadly :(\n";
                text += "--> however, i'm decent at coding, so i figured a personal website could be a good way to fill that hole!\n";
                text += "--> thus, this website was born, the brainchild of my creativity. don't worry, it won't all be like this, i have more plans for this site soon.\n";
                text += "--> project link: https://github.com/scis-r/scis-r.github.io\n";
                text += "\n";

                text += "----- planned projects! -----\n";
                text += "\n";

                text += "chess engine o_o\n";
                text += "--> i'm planning on programming my own chess engine, completely from scratch, with no outside help at all!\n";
                text += "--> that means no ai (though for me that's a given), no googling how to code one, not even watching a youtube video explaining how they work!\n";
                text += "--> this will be a huge project for me, but the plan is to program the engine in Java, then get a VPS to run it in the backend for this very website!\n";
                text += "--> it'll be fun, but very, very difficult. expect something soon(ish)!\n";
                text += "--> project link: not done yet sillyyy!\n";
                
                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

            case ('scisr'):
                text += "\nTODO: make this real!\n";
                text += "probablyyy another redirect lol\n";

                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;
            
            case ('clear'):
                text = "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;
            
            case ('splash'):
                randomSplashText(0);
                text += "\n> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

            case (''):
                break;

            default: // if there isn't a command that matches with what is typed, add error msg
                text += "\nnot a valid command :( type 'help' for a list of commands!\n";

                text += "> ";
                currentChar = 2;
                textEntry.textContent = text;
                break;

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