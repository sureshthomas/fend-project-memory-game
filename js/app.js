/*
 * Create a list that holds all of your cards
 */

/****
 * tile => One of those rectange card is called tile. I like the name tile rather than card of deck
 *
 *
 */
/***collection of all tiles****/
let tileCollection;
// Lock the game board until system is checking the match and executing time out. This will avoid continous clicking. just boolean bypass
let lockGameBoard = false;
//These are the first 2 tiles
let firstTile, secondTile;
let hasFlippedTile = false;
const displayTimeOut = 1500;
let  numOfMoves=0;



//List of all symbols/tiles - they are font-awesome classes. This is the only magic string
const tiles = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];

// Number of tiles - this is derived dynamically to make sure that we don't hardcode the number of tiles
//Removing magic strings
const tileCollectionIndices = Array.apply(null, {length: tiles.length}).map(Number.call, Number);
//Double up the array to make sure that there are pair of each tile
tileCollectionIndices.push.apply(tileCollectionIndices, tileCollectionIndices);
const numberOfTiles = tileCollectionIndices.length;
/***********
 * Entry point Paint the Game Board with tile collection
 * This is called once automatically when user open the page
 *
 */
paintGameGameBoard();

/*************
 * This create dom fragment of virtual tile array
 *
 * @returns {DocumentFragment}
 */
function createTileAssemby() {
    let fragment = document.createDocumentFragment();
    let list = document.createElement('ul');
    list.className = "deck";
    for (i = 0; i < numberOfTiles; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('card');
        let indexNumber = tileCollectionIndices[i];
        //HtML 5 capability to set data* custom attributes
        listItem.dataset.indexNumber = indexNumber;
        textItem = document.createElement('i');
        textItem.classList.add('fa', tiles[indexNumber]);
        listItem.appendChild(textItem);
        list.appendChild(listItem);
    }
    fragment.appendChild(list);
    return fragment;
}

//Shuffle deck
//This inserts within the div
function layTilesOnGameBoard(frag) {
    //Get the container inside which we will draw the game tile board
    // There could be more div elements , setting an ID may be the best way to uniquely identify the div
    const container = document.getElementById('mosaic');

    // When tiles are laid first time, the below while loop will not have anything in it.
    // When it is replainted by the user
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    resetGameBoard();
    // Build the entire board on fragment as per Udacity performance section
    container.appendChild(frag);
}

function clearTimer() {
   gametimer.stop();
   gametimer.reset();

}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *
 * set up the event listener for a card. If a card is clicked:
 */
function paintGameGameBoard() {

    numOfMoves=0;
    window.requestAnimationFrame(setMoves);
    shuffle(tileCollectionIndices);
    clearTimer();
    var tileAssembly = createTileAssemby();
    layTilesOnGameBoard(tileAssembly);
    //select tiles into array
    tileCollection = document.querySelectorAll('.card');
    // set up the event listener for a card. If a card is clicked:
    tileCollection.forEach(tile => tile.addEventListener('click', toggleTile));
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*********
 * This is the event target executed when you click on button
 */
function toggleTile() {
    if (lockGameBoard) return;
    if (this === firstTile) return;
    gametimer.start();
    numOfMoves++;
    this.classList.add('show');
    this.classList.add('open');
    if (!hasFlippedTile) {
        hasFlippedTile = true;
        firstTile = this;
        return;
    }
    secondTile = this;
    doTheOpenedPairOfTilesMatch()?disableUserinteractionOnMatchedTiles() : unToggleTiles();
}

/**- if the list already has another card, check to see if the two cards match
 * if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 */
function doTheOpenedPairOfTilesMatch() {
    //I have set an html5 data*** custom attribute to element
    return firstTile.dataset.indexNumber === secondTile.dataset.indexNumber;
}

/******
 * Remove listener from the cars which are matched
 *************/
function disableUserinteractionOnMatchedTiles() {
    firstTile.removeEventListener('click', toggleTile);
    firstTile.className = 'card match';
    secondTile.removeEventListener('click', toggleTile);
    secondTile.className = 'card match';
    //Reset temp variable

    resetGameBoard();
}
///Fold the tile with - but on a times for user to review
function unToggleTiles() {
    lockGameBoard = true;
    setTimeout(() => {
        firstTile.classList.remove('show');
        firstTile.classList.remove('open');
        secondTile.classList.remove('show');
        secondTile.classList.remove('open');
        resetGameBoard();
    }, displayTimeOut);
}
//Number of clicks
function resetGameBoard() {
    [hasFlippedTile, lockGameBoard] = [false, false];
    [firstTile, secondTile] = [null, null];
}

function setMoves() {
    document.getElementById('moveCounter').innerHTML=numOfMoves;
    window.requestAnimationFrame(setMoves);
}
//window.requestAnimationFrame(setMoves);
/*******
function clickCounter() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount)+1;
        } else {
            localStorage.clickcount = 1;
        }
        document.getElementById("result").innerHTML = "You have clicked the button " + localStorage.clickcount + " time(s).";
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
}
*************/

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + TODO increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + TODO if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
