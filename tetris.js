const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const colors = ["#FF5733", "#FFBD33", "#75FF33", "#33FF57", "#33FFBD", "#3375FF", "#5733FF"];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let score = 0;
let gameOver = false;

const tetrominoes = [
  { shape: [[1, 1], [1, 1]], color: getRandomColor() }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: getRandomColor() }, // T
  { shape: [[1, 0, 0], [1, 1, 1]], color: getRandomColor() }, // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: getRandomColor() }, // J
  { shape: [[1, 1, 0], [0, 1, 1]], color: getRandomColor() }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: getRandomColor() }, // Z
  { shape: [[1, 1, 1, 1]], color: getRandomColor() }, // I
];

let currentPiece = randomTetromino();
let currentPos = { x: 4, y: 0 };

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = "#1c1c1c";
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawTetromino(piece, xOffset, yOffset) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                ctx.fillStyle = piece.color;
                ctx.fillRect((xOffset + col) * BLOCK_SIZE, (yOffset + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = "#1c1c1c";
                ctx.strokeRect((xOffset + col) * BLOCK_SIZE, (yOffset + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function collide(piece, xOffset, yOffset) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const x = xOffset + col;
                const y = yOffset + row;
                if (x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function rotate(piece) {
    const newShape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index])).reverse();
    return { shape: newShape, color: piece.color };
}

function placePiece() {
    const shape = currentPiece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                board[currentPos.y + row][currentPos.x + col] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== null)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(null));
            score += 100;
            document.getElementById("score").textContent = score;
        }
    }
}

function newPiece() {
    currentPiece = randomTetromino();
    currentPos = { x: 4, y: 0 };
    if (collide(currentPiece, currentPos.x, currentPos.y)) {
        gameOver = true;
        Swal.fire({
            title: 'Game Over',
            text: 'Your score: ' + score,
            icon: 'error',
            confirmButtonText: 'Play Again'
        }).then(() => {
            window.location.reload();
        });
    }
}

function randomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function movePiece(dir) {
    if (!gameOver) {
        const newPos = { x: currentPos.x + dir, y: currentPos.y };
        if (!collide(currentPiece, newPos.x, newPos.y)) {
            currentPos = newPos;
        }
    }
}

function dropPiece() {
    if (!gameOver) {
        const newPos = { x: currentPos.x, y: currentPos.y + 1 };
        if (collide(currentPiece, newPos.x, newPos.y)) {
            placePiece();
            clearLines();
            newPiece();
        } else {
            currentPos = newPos;
        }
    }
}

function update() {
    drawBoard();
    drawTetromino(currentPiece, currentPos.x, currentPos.y);
    if (!gameOver) {
        dropPiece();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        movePiece(-1);
    } else if (event.key === "ArrowRight") {
        movePiece(1);
    } else if (event.key === "ArrowDown") {
        dropPiece();
    } else if (event.key === "ArrowUp") {
        const rotated = rotate(currentPiece);
        if (!collide(rotated, currentPos.x, currentPos.y)) {
            currentPiece = rotated;
        }
    }
});

document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("startButton").style.display = "none";
    setInterval(update, 500);
});
