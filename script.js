const canvas = document.getElementById("knightCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const N = 8;
const tileSize = canvas.width / N;
const moveX = [2, 1, -1, -2, -2, -1, 1, 2];
const moveY = [1, 2, 2, 1, -1, -2, -2, -1];

// رسم لوحة الشطرنج
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "#444" : "#222";
      ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
    }
  }
}

// خوارزمية وارنسدورف لاختيار أفضل حركة تالية
function getBestMove(x, y, sol) {
  let minDeg = 9,
    bestIdx = -1;
  for (let i = 0; i < 8; i++) {
    let nx = x + moveX[i],
      ny = y + moveY[i];
    if (nx >= 0 && nx < N && ny >= 0 && ny < N && sol[nx][ny] === -1) {
      let deg = 0;
      for (let j = 0; j < 8; j++) {
        let nnx = nx + moveX[j],
          nny = ny + moveY[j];
        if (nnx >= 0 && nnx < N && nny >= 0 && nny < N && sol[nnx][nny] === -1)
          deg++;
      }
      if (deg < minDeg) {
        minDeg = deg;
        bestIdx = i;
      }
    }
  }
  return bestIdx !== -1
    ? { x: x + moveX[bestIdx], y: y + moveY[bestIdx] }
    : null;
}

async function startTour() {
  startBtn.disabled = true;
  drawBoard();

  let sol = Array.from({ length: N }, () => Array(N).fill(-1));
  let curX = 0,
    curY = 0; // نقطة البداية
  sol[curX][curY] = 0;

  // إعدادات الفرشاة
  ctx.strokeStyle = "#00d2ff";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  let startPosX = curY * tileSize + tileSize / 2;
  let startPosY = curX * tileSize + tileSize / 2;

  ctx.beginPath();
  ctx.moveTo(startPosX, startPosY);

  for (let m = 1; m < N * N; m++) {
    let nextMove = getBestMove(curX, curY, sol);
    if (nextMove) {
      curX = nextMove.x;
      curY = nextMove.y;
      sol[curX][curY] = m;

      const targetX = curY * tileSize + tileSize / 2;
      const targetY = curX * tileSize + tileSize / 2;

      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // رسم نقطة عند كل مربع يزوره
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.moveTo(targetX, targetY);

      await new Promise((r) => setTimeout(r, 300)); // سرعة الحركة
    }
  }
  startBtn.disabled = false;
}

startBtn.addEventListener("click", startTour);
resetBtn.addEventListener("click", drawBoard);

// تهيئة اللوحة عند فتح الصفحة
drawBoard();
