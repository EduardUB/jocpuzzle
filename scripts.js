const COLS = 4;
const ROWS = 5;
const CELL = 80;

const board = document.getElementById("board");
const movesText = document.getElementById("moves");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const victoryScreen = document.getElementById("victoryScreen");

const levelSelect = document.getElementById("levelSelect");

let pieces = [];
let currentLevel = 0;
let moves = 0;

function setupLevels() {
  LEVELS.forEach((l, i) => {
    let opt = document.createElement("option");
    opt.value = i;
    opt.textContent = l.name;
    levelSelect.appendChild(opt);
  });
}

function startGame() {
  currentLevel = Number(levelSelect.value);
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadLevel();
}

function loadLevel() {
  board.innerHTML = '<div id="exitZone"></div>';

  pieces = JSON.parse(JSON.stringify(LEVELS[currentLevel].pieces));
  moves = 0;
  movesText.textContent = 0;

  pieces.forEach(createPiece);
}

function createPiece(p) {
  const el = document.createElement("div");
  el.className = "piece " + p.color;

  el.style.width = p.w * CELL + "px";
  el.style.height = p.h * CELL + "px";

  update(el, p);
  addInput(el, p);

  board.appendChild(el);
}

function update(el, p) {
  el.style.left = p.x * CELL + "px";
  el.style.top = p.y * CELL + "px";
}

function addInput(el, p) {
  let sx, sy;

  el.addEventListener("pointerdown", e => {
    sx = e.clientX;
    sy = e.clientY;

    function up(ev) {
      let dx = ev.clientX - sx;
      let dy = ev.clientY - sy;

      movePiece(p, el, dx, dy);

      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointerup", up);
  });
}

function movePiece(p, el, dx, dy) {
  let dirX = 0, dirY = 0;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (p.direction === "vertical") return;
    dirX = dx > 0 ? 1 : -1;
  } else {
    if (p.direction === "horizontal") return;
    dirY = dy > 0 ? 1 : -1;
  }

  let nx = p.x;
  let ny = p.y;

  while (isValid(p, nx + dirX, ny + dirY)) {
    nx += dirX;
    ny += dirY;
  }

  if (nx === p.x && ny === p.y) return;

  p.x = nx;
  p.y = ny;

  update(el, p);

  moves++;
  movesText.textContent = moves;

  checkWin();
}

function isValid(p, x, y) {
  if (x < 0 || y < 0) return false;
  if (x + p.w > COLS) return false;
  if (y + p.h > ROWS) return false;

  for (let other of pieces) {
    if (other.id === p.id) continue;

    if (
      x < other.x + other.w &&
      x + p.w > other.x &&
      y < other.y + other.h &&
      y + p.h > other.y
    ) return false;
  }

  return true;
}

function checkWin() {
  let red = pieces.find(p => p.color === "red");

  if (red.y + red.h === ROWS) {
    victoryScreen.classList.remove("hidden");
  }
}

resetBtn.onclick = loadLevel;

menuBtn.onclick = () => {
  gameScreen.classList.add("hidden");
  victoryScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
};

nextLevelBtn.onclick = () => {
  victoryScreen.classList.add("hidden");
  loadLevel();
};

startBtn.onclick = startGame;

setupLevels();
