const nonce = `TNM4ASE1JUFD3BLC09RIHPGO!`
const puzzle = document.getElementById("puzzle");
const tiles = document.getElementsByClassName("tile");
const counter = document.getElementById("moves");
const timerDisplay = document.getElementById("time");
const size = 5;

let emptyIndex = 14;
let moves = 0;
let timerInterval;
let secondsElapsed = 0;
let timerStarted = false;


function isEmptyTileAdjacent(index) {
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    const row = Math.floor(index / size);
    const col = index % size;

    return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1);
}

function tryMove(index) {
    const isAdjacent = isEmptyTileAdjacent(index);
    if (!isAdjacent) return;

    startTimer();
    swapTiles(tiles[index], tiles[emptyIndex]);
    incrementMoves();
    emptyIndex = index;

    const {isSolved, message} = checkSolved()
    if (isSolved) {
        stopUserFromPlaying()
        showHiddenTile();
        showHiddenMessage(message);
    }
}

function swapTiles(tileA, tileB) {
    // Swap the image source
    const tempSrc = tileA.src;
    tileA.src = tileB.src;
    tileB.src = tempSrc;

    // Swap the data attributes
    const tempPiece = tileA.dataset.piece;
    tileA.dataset.piece = tileB.dataset.piece;
    tileB.dataset.piece = tempPiece;
    const tempLetter = tileA.dataset.letter;
    tileA.dataset.letter = tileB.dataset.letter;
    tileB.dataset.letter = tempLetter;

    // Swap "empty" class if needed
    tileA.classList.toggle("empty");
    tileB.classList.toggle("empty");
}

function incrementMoves() {
    moves++
    counter.textContent = `${moves}`;
}

function startTimer() {
    if (timerStarted) return; // start only once
    timerStarted = true;

    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, "0");
        const secs = (secondsElapsed % 60).toString().padStart(2, "0");
        timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}


function checkSolved() {
    const _tiles = Array.from(tiles).map((i) => ({
        piece: i.attributes["data-piece"].nodeValue,
        letter: i.attributes["data-letter"].nodeValue
    }));
    const secret = _tiles.map(tile => tile.piece).join("");
    const message = _tiles.map(tile => tile.letter).join("");

    return {isSolved: secret === nonce, message};
}

function stopUserFromPlaying() {
    clearInterval(timerInterval);
    puzzle.removeEventListener("click", onUserInput);
}

function showHiddenMessage(message) {
    const secretDiv = document.createElement("div");
    secretDiv.textContent = "🎉 Puzzle solved! 🎉";
    secretDiv.style.marginTop = "20px";
    secretDiv.style.fontSize = "1.2rem";
    secretDiv.style.fontWeight = "bold";

    const secretDiv2 = document.createElement("div");
    secretDiv2.textContent = message;
    secretDiv2.style.marginTop = "20px";
    secretDiv2.style.fontSize = "2rem";
    secretDiv2.style.fontWeight = "bold";
    secretDiv2.style.textDecoration = "underline";
    puzzle.parentNode.appendChild(secretDiv);
    puzzle.parentNode.appendChild(secretDiv2);
}

function showHiddenTile() {
    tiles[emptyIndex].classList.toggle("empty");
}

function onUserInput(e) {
    if (e.target.classList.contains("tile")) {
        const index = Array.from(tiles).indexOf(e.target);
        tryMove(index);
    }
}

puzzle.addEventListener("click", onUserInput);