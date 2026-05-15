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

  pieces =
    JSON.parse(
      JSON.stringify(LEVELS[index].pieces)
    );

  moves = 0;

  movesText.textContent = moves;

  startTimer();

  pieces.forEach(createPiece);

  saveProgress();
}

function clearBoard() {

  document
    .querySelectorAll(".piece")
    .forEach(piece => piece.remove());
}

function createPiece(piece) {

  const element = document.createElement("div");

  element.classList.add("piece");

  element.classList.add(piece.color);

  element.style.width =
    `${piece.w * CELL_SIZE}px`;

  element.style.height =
    `${piece.h * CELL_SIZE}px`;

  updatePiecePosition(element, piece);

  addInput(element, piece);

  board.appendChild(element);
}

function updatePiecePosition(el, piece) {

  el.style.left =
    `${piece.x * CELL_SIZE}px`;

  el.style.top =
    `${piece.y * CELL_SIZE}px`;
}

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

      window.removeEventListener(
        "pointerup",
        pointerUp
      );
    }

    window.addEventListener(
      "pointerup",
      pointerUp
    );
  });
}

function handleSwipe(piece, el, dx, dy) {

  const threshold = 20;

  let newX = piece.x;
  let newY = piece.y;

  if (Math.abs(dx) > Math.abs(dy)) {

    if (Math.abs(dx) < threshold) return;

    if (dx > 0) {

      if (piece.direction !== "vertical") {
        newX++;
      }

    } else {

      if (piece.direction !== "vertical") {
        newX--;
      }
    }

  } else {

    if (Math.abs(dy) < threshold) return;

    if (dy > 0) {

      if (piece.direction !== "horizontal") {
        newY++;
      }

    } else {

      if (piece.direction !== "horizontal") {
        newY--;
      }
    }
  }

  if (isValidMove(piece, newX, newY)) {

    piece.x = newX;
    piece.y = newY;

    updatePiecePosition(el, piece);

    moves++;

    movesText.textContent = moves;

    checkVictory();

    saveProgress();
  }
}

function isValidMove(currentPiece, newX, newY) {

  if (newX < 0) return false;
  if (newY < 0) return false;

  if (newX + currentPiece.w > COLS)
    return false;

  if (newY + currentPiece.h > ROWS)
    return false;

  for (const piece of pieces) {

    if (piece.id === currentPiece.id)
      continue;

    const overlap =

      newX < piece.x + piece.w &&
      newX + currentPiece.w > piece.x &&
      newY < piece.y + piece.h &&
      newY + currentPiece.h > piece.y;

    if (overlap) {
      return false;
    }
  }

  return true;
}

function checkVictory() {

  const red =
    pieces.find(
      piece => piece.color === "red"
    );

  if (red.x === 1 && red.y === 3) {

    clearInterval(timerInterval);

    victoryScreen
      .classList
      .remove("hidden");

    localStorage.setItem(
      "completedLevel",
      currentLevel
    );
  }
}

function startTimer() {

  clearInterval(timerInterval);

  timer = 0;

  timerText.textContent = timer;

  timerInterval = setInterval(() => {

    timer++;

    timerText.textContent = timer;

  }, 1000);
}

function saveProgress() {

  localStorage.setItem(
    "puzzle-progress",
    JSON.stringify({
      level: currentLevel,
      moves,
      timer
    })
  );
}

resetBtn.addEventListener(
  "click",
  () => loadLevel(currentLevel)
);

menuBtn.addEventListener(
  "click",
  () => {

    gameScreen.classList.add("hidden");

    victoryScreen.classList.add("hidden");

    menuScreen.classList.remove("hidden");
  }
);

nextLevelBtn.addEventListener(
  "click",
  () => {

    victoryScreen.classList.add("hidden");

    currentLevel++;

    if (currentLevel >= LEVELS.length) {
      currentLevel = 0;
    }

    loadLevel(currentLevel);
  }
);

startBtn.addEventListener(
  "click",
  startGame
);

setupLevels();