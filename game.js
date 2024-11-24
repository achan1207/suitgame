const modeSelection = document.getElementById("mode-selection");
const gameContainer = document.getElementById("game");
const playerSelection = document.getElementById("player-selection");
const resultText = document.getElementById("game-status");
const restartButton = document.getElementById("restart");

let gameMode = ""; // "npc" or "multiplayer"
let npcChoices = ["batu", "gunting", "kertas"];

const selectSound = document.getElementById("select-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const drawSound = document.getElementById("draw-sound");

document.getElementById("vs-npc").addEventListener("click", () => {
    gameMode = "npc";
    startGame();
});

function startGame() {
    modeSelection.style.display = "none";
    gameContainer.style.display = "block";
}

playerSelection.addEventListener("click", (e) => {
    const playerChoice = e.target.id;
    if (!playerChoice) return;

    // Play the selection sound
    selectSound.play();

    if (gameMode === "npc") {
        playVsNpc(playerChoice);
    }
});

function playVsNpc(playerChoice) {
    const npcChoice = npcChoices[Math.floor(Math.random() * npcChoices.length)];
    let result = "";

    if (playerChoice === npcChoice) {
        result = "Seri!";
        drawSound.play(); // Play draw sound
        Swal.fire({
            icon: "info",
            title: "Hasil Seri!",
            text: `Kamu memilih ${playerChoice}, NPC memilih ${npcChoice}.`,
        });
    } else if (
        (playerChoice === "batu" && npcChoice === "gunting") ||
        (playerChoice === "gunting" && npcChoice === "kertas") ||
        (playerChoice === "kertas" && npcChoice === "batu")
    ) {
        result = "Kamu Menang!";
        winSound.play(); // Play win sound
        Swal.fire({
            icon: "success",
            title: "Kamu Menang!",
            text: `Kamu memilih ${playerChoice}, NPC memilih ${npcChoice}.`,
        });
    } else {
        result = "Kamu Kalah!";
        loseSound.play(); // Play lose sound
        Swal.fire({
            icon: "error",
            title: "Kamu Kalah!",
            text: `Kamu memilih ${playerChoice}, NPC memilih ${npcChoice}.`,
        });
    }

    resultText.textContent = result;
    restartButton.style.display = "inline-block";
}

restartButton.addEventListener("click", () => {
    resultText.textContent = "";
    restartButton.style.display = "none";
});

function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
}

function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
}
