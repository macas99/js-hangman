const canvas = document.getElementById("canvas");
const keyboard = document.getElementById("mouse-input");
// in case API doesent work
const backupWords = [
    "message", "community", "game", "parent", "water", "coach", "girl", "crime", "company", "minute",
    "body", "force", "door", "line", "others", "discover", "best", "wealthy", "group", "history",
    "besides", "bench", "life", "grocery", "recommendation", "place", "morning", "child", "laboratory", "world",
    "guy", "information", "highway", "service", "father", "launch", "person", "interpret", "meanwhile", "change",
    "opening", "educator", "job", "nurse", "name", "adviser", "problem", "movement", "time", "state"
];

let gameWord = "";
let count = 0;
let gameInProgress = false;
let inputHistory = [];

async function setGameWord() {
    let reqWord = await requestWord();
    //check if hyphenated accented undefined or null
    if (/^[a-zA-Z]+$/.test(reqWord) && !(reqWord == null)) {
        gameWord = reqWord;
    } else {
        gameWord = backupWords[Math.floor(Math.random() * backupWords.length)];
    }
}

async function requestWord() {
    try {
        const resp = await fetch("https://random-words-api.vercel.app/word/noun");
        const jsonData = await resp.json();
        return jsonData[0].word;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function initiateWord() {
    let guessString = "";
    gameWord.split('').forEach(function () {
        guessString += "_";
    });
    $(".game-string").text(guessString);
}

function checkInput(char) {
    let charCap = char.toUpperCase();
    let gameWordAllCaps = gameWord.toUpperCase();
    if (gameWordAllCaps.includes(charCap)) {
        revealLetter(char);
    } else {
        punish();
    }
    disableChar(charCap);
}

function revealLetter(char) {
    let indexes = getIndexes(char);
    let gameString = String($(".game-string").text());
    let newGameString = ""

    for (let i = 0; i < gameString.length; i++) {
        if (indexes.includes(i)) {
            newGameString += char.toUpperCase();
        } else {
            newGameString += gameString.charAt(i);
        }
    }

    $(".game-string").text(newGameString);

    if (newGameString === gameWord.toUpperCase()) {
        gameWon();
    }
}

function getIndexes(char) {
    let regex = new RegExp(char, "gi")
    let result, indexes = [];
    while ((result = regex.exec(gameWord))) {
        indexes.push(result.index);
    }
    return indexes;
}

function punish() {
    Object.values(drawCanvas())[count]();
    count++;

    if (count === 10) {
        gameOver();
    }
}

function disableChar(char) {
    if (!inputHistory.includes(char)) {
        inputHistory.push(char);
    }
    $(".button-" + char).removeClass("button");
    $(".button-" + char).addClass("disabled")
    $(".button-" + char).attr("disabled", true);
}

function gameOver() {
    gameInProgress = false;
    $(".input-button").addClass("hidden");
    $(".game-string").addClass("hidden");
    $(".game-result").text("You Lost!");
    $(".result-screen").removeClass("hidden");
    $(".answer").text(gameWord);
}

function gameWon() {
    gameInProgress = false;
    $(".input-button").addClass("hidden");
    $(".game-string").addClass("hidden");
    $(".game-result").text("You Won!");
    $(".try-again").text("Play Again");
    $(".result-screen").removeClass("hidden");
    $(".answer").text(gameWord);
}

function drawCanvas() {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();

    function drawLine(x1, y1, x2, y2) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    const frame1 = () => drawLine(60, 120, 140, 120);
    const frame2 = () => drawLine(100, 120, 100, 30);
    const frame3 = () => drawLine(100, 30, 180, 30);
    const frame4 = () => drawLine(180, 30, 180, 45);

    const head = () => {
        ctx.beginPath();
        ctx.arc(180, 55, 10, 0, 2 * Math.PI);
        drawLine(174, 60, 178, 60);
        drawLine(182, 60, 186, 60);
    };

    const body = () => {
        drawLine(171, 58, 170, 90);
        drawLine(189, 58, 190, 90);
        drawLine(170, 90, 190, 90);
    };

    const arm1 = () => drawLine(175, 67, 175, 80);
    const arm2 = () => drawLine(185, 67, 185, 80);
    const leg1 = () => drawLine(171, 90, 171, 105);
    const leg2 = () => drawLine(189, 90, 189, 105);

    return { frame1, frame2, frame3, frame4, head, body, arm1, arm2, leg1, leg2 };
}

function clearCanvas() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetButtons() {
    $(".disabled").each(function () {
        $(this).removeClass("disabled");
        $(this).addClass("button");
        $(this).attr("disabled", false);
    });
}

function loadKeyboard() {
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.innerText = String.fromCharCode(i);
        button.classList.add("button");
        button.classList.add("input-button");
        button.classList.add("button-" + String.fromCharCode(i));
        button.addEventListener("click", function () {
            if (gameInProgress) {
                checkInput(String.fromCharCode(i));
            }
        });
        keyboard.append(button);
    }
}

document.addEventListener("keydown", function (event) {
    let key = event.key;

    if (gameInProgress && key.length === 1 && /[a-zA-Z]/.test(key) && !inputHistory.includes(key.toUpperCase())) {
        checkInput(key);
    }
});

$(".start-game").on("click", async function () {
    $(this).attr("hidden", true);
    $(".title-screen").attr("hidden", true);
    await setGameWord();
    initiateWord();
    $(".game").removeClass("hidden");
    gameInProgress = true;
    loadKeyboard();
});

$(".try-again").on("click", async function () {
    $("#canvas").addClass("hidden");
    $(".result-screen").addClass("hidden");
    await setGameWord();
    inputHistory = [];
    initiateWord();
    clearCanvas();
    resetButtons();
    $("#canvas").removeClass("hidden");
    $(".input-button").removeClass("hidden");
    $(".game-string").removeClass("hidden");
    count = 0;
    gameInProgress = true;
});