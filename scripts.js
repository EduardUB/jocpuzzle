const COLS = 4;
const ROWS = 5;
const CELL = 80;

const board = document.getElementById("board");

let pieces = [];
let currentLevel = 0;

/* =========================
   SETUP
========================= */

function startGame() {
  document.getElementById("menuScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  loadLevel();
}

function loadLevel() {
  board.innerHTML = '<div id="exitZone"></div>';
  pieces = JSON.parse(JSON.stringify(LEVELS[currentLevel].pieces));

  pieces.forEach(createPiece);
}

/* =========================
   CREAR PECES
========================= */

function createPiece(p) {
  const el = document.createElement("div");

  el.className = "piece " + p.color;

  el.style.width = p.w * CELL + "px";
  el.style.height = p.h * CELL + "px";

  update(el, p);
  enableDrag(el, p);

  board.appendChild(el);
}

function update(el, p) {
  el.style.left = p.x * CELL + "px";
  el.style.top = p.y * CELL + "px";
}

/* =========================
   DRAG REAL (IMPORTANT)
========================= */

function enableDrag(el, piece) {
  let startX, startY;
  let startGridX, startGridY;

  el.addEventListener("pointerdown", e => {
    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;

    startGridX = piece.x;
    startGridY = piece.y;

    function move(e2) {
      const dx = e2.clientX - startX;
      const dy = e2.clientY - startY;

      let moveX = 0;
      let moveY = 0;

      // determinar direcció
      if (Math.abs(dx) > Math.abs(dy)) {
        if (piece.direction === "vertical") return;
        moveX = Math.round(dx / CELL);
      } else {
        if (piece.direction === "horizontal") return;
        moveY = Math.round(dy / CELL);
      }

      let newX = startGridX + moveX;
      let newY = startGridY + moveY;

      // limitar pel màxim possible
      while (!isValid(piece, newX, newY)) {
        if (moveX > 0) newX--;
        if (moveX < 0) newX++;
        if (moveY > 0) newY--;
        if (moveY < 0) newY++;

        if (newX === piece.x && newY === piece.y) break;
      }

      piece.x = newX;
      piece.y = newY;

      update(el, piece);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);

      checkWin();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });
}

/* =========================
   COL·LISIONS
========================= */

function isValid(p, x, y) {
  if (x < 0 || y < 0) return false;
  if (x + p.w > COLS) return false;
  if (y + p.h > ROWS) return false;

  for (let o of pieces) {
    if (o.id === p.id) continue;

    if (
      x < o.x + o.w &&
      x + p.w > o.x &&
      y < o.y + o.h &&
      y + p.h > o.y
    ) return false;
  }
  return true;
}

/* =========================
   WIN
========================= */

function checkWin() {
  const red = pieces.find(p => p.color === "red");

  if (red.y + red.h === ROWS) {
    document.getElementById("victoryScreen").classList.remove("hidden");
  }
}

/* =========================
   BUTTONS
========================= */

document.getElementById("startBtn").onclick = startGame;

document.getElementById("resetBtn").onclick = loadLevel;

document.getElementById("menuBtn").onclick = () => {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("menuScreen").classList.remove("hidden");
};

document.getElementById("nextLevelBtn").onclick = () => {
  document.getElementById("victoryScreen").classList.add("hidden");
  loadLevel();
};

