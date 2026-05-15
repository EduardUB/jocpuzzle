const COLS = 4;
const ROWS = 5;
const CELL_SIZE = 90;

const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const victoryScreen = document.getElementById("victoryScreen");

const levelSelect = document.getElementById("levelSelect");

let currentLevel = 0;
let pieces = [];
let moves = 0;
let timer = 0;
let timerInterval = null;

/* ===============================
   SETUP
=============================== */

function setupLevels() {
  LEVELS.forEach((level, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = level.name;
    levelSelect.appendChild(option);
  });
}

function startGame() {
  currentLevel = Number(levelSelect.value);
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadLevel(currentLevel);
}

function loadLevel(index) {
  clearBoard();

  pieces = JSON.parse(JSON.stringify(LEVELS[index].pieces));

  moves = 0;
  movesText.textContent = moves;

  startTimer();

  pieces.forEach(createPiece);
}

/* ===============================
   BOARD
=============================== */

function clearBoard() {
  document.querySelectorAll(".piece").forEach(p => p.remove());
}

function createPiece(piece) {
  const el = document.createElement("div");

  el.classList.add("piece", piece.color);

  el.style.width = `${piece.w * CELL_SIZE}px`;
  el.style.height = `${piece.h * CELL_SIZE}px`;

  updatePiecePosition(el, piece);
  addInput(el, piece);

  board.appendChild(el);
}

function updatePiecePosition(el, piece) {
  el.style.left = `${piece.x * CELL_SIZE}px`;
  el.style.top = `${piece.y * CELL_SIZE}px`;
}

/* ===============================
   INPUT (SWIPE MILLORAT)
=============================== */

function addInput(el, piece) {
  let startX = 0;
  let startY = 0;

  el.addEventListener("pointerdown", e => {
    startX = e.clientX;
    startY = e.clientY;

    function pointerUp(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      handleSwipe(piece, el, dx, dy);

      window.removeEventListener("pointerup", pointerUp);
    }

    window.addEventListener("pointerup", pointerUp);
  });
}

/* ===============================
   MOVIMENT FLUÏT (KEY FEATURE)
=============================== */

function handleSwipe(piece, el, dx, dy) {
  const threshold = 20;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

  let dirX = 0;
  let dirY = 0;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (piece.direction === "vertical") return;
    dirX = dx > 0 ? 1 : -1;
  } else {
    if (piece.direction === "horizontal") return;
    dirY = dy > 0 ? 1 : -1;
  }

  let newX = piece.x;
  let newY = piece.y;

  // 🔥 mou fins al límit
  while (true) {
    const nextX = newX + dirX;
    const nextY = newY + dirY;

    if (!isValidMove(piece, nextX, nextY)) break;

    newX = nextX;
    newY = nextY;
  }

  // si no s’ha mogut, sortir
  if (newX === piece.x && newY === piece.y) return;

  piece.x = newX;
  piece.y = newY;

  updatePiecePosition(el, piece);

  moves++;
  movesText.textContent = moves;

  checkVictory();
}

/* ===============================
   COL·LISIONS
=============================== */

function isValidMove(currentPiece, newX, newY) {
  if (newX < 0 || newY < 0) return false;
  if (newX + currentPiece.w > COLS) return false;
  if (newY + currentPiece.h > ROWS) return false;

  for (const piece of pieces) {
    if (piece.id === currentPiece.id) continue;

    const overlap =
      newX < piece.x + piece.w &&
      newX + currentPiece.w > piece.x &&
      newY < piece.y + piece.h &&
      newY + currentPiece.h > piece.y;

    if (overlap) return false;
  }

  return true;
}

/* ===============================
   VICTÒRIA (ARREGLADA)
=============================== */

function checkVictory() {
  const red = pieces.find(p => p.color === "red");

  // 🎯 quan arriba a la sortida real
  if (red.y + red.h === ROWS) {
    clearInterval(timerInterval);
    victoryScreen.classList.remove("hidden");
  }
}

/* ===============================
   TIMER
=============================== */

function startTimer() {
  clearInterval(timerInterval);

  timer = 0;
  timerText.textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    timerText.textContent = timer;
  }, 1000);
}

/* ===============================
   BOTONS
=============================== */

resetBtn.addEventListener("click", () => {
  loadLevel(currentLevel);
});

menuBtn.addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  victoryScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

nextLevelBtn.addEventListener("click", () => {
  victoryScreen.classList.add("hidden");

  currentLevel++;
  if (currentLevel >= LEVELS.length) currentLevel = 0;

  loadLevel(currentLevel);
});

startBtn.addEventListener("click", startGame);

/* ===============================
   INIT
=============================== */

setupLevels();
