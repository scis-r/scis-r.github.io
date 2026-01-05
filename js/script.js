function randomBackgroundTile(numChoices) {
    const number = Math.floor(Math.random() * numChoices) + 1;
    let urlPath = "../images/bg_tile";
    const numberString = number.toString();
    urlPath = urlPath.concat(numberString, ".png");
    document.body.style.backgroundImage = `url(${urlPath})`;
}

window.onload = randomBackgroundTile(5);

