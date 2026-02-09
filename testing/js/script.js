// this will be a simple logic script that makes a pop-up when the button is clicked
function onClickOne() {
    alert("ouch!"); // this makes the pop-up
}

function onClickTwo() {
    new Audio('../sfx/fart.mp3').play();
}

// adding the text entry code! this code displays a message "i like (color) too!", and if possible, changes the color of the word to match!

// document.getElementById is super useful! we use the ids we assigned in the html file and we can get those objects with this method!
const input = document.getElementById("fcolor");
const colorWord = document.getElementById("colorWord");

// here is our eventListener
function textEntryListener() {
    const text = input.value.trim().toLowerCase(); // takes the value of the text entry and makes it a word ("BLue  " turns into "blue")
    const color = text.replace(/\s/g, "") // this removes all whitespace from the entry, and it's what we will use to get the color
    colorWord.textContent = text; // changes "(type your favorite color)" to whatever was typed
    colorWord.style.color = color; // changes the color of that single word to whatever was typed
}

// important! don't forget to sign up for the mailing list!
document.getElementById('fcolor').addEventListener('input', textEntryListener); // textEntryListener() is called every time an input occurs in the text box (e.g. a letter is typed or deleted)