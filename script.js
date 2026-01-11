const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

let board, currentPlayer, mode, gameOver;

function setMode(m) {
  mode = m;
  resetGame();
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusEl.textContent = "Ход: X";
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.addEventListener("click", () => makeMove(i));
    boardEl.appendChild(div);
  });
}

function makeMove(i) {
  if (board[i] || gameOver) return;

  board[i] = currentPlayer;
  renderBoard();

  if (checkWin(board, currentPlayer)) {
    statusEl.textContent = `Победил ${currentPlayer}!`;
    gameOver = true;
    return;
  }

  if (board.every(c => c)) {
    statusEl.textContent = "Ничья!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Ход: ${currentPlayer}`;

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 250);
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  makeMove(move);
}

function minimax(b, depth, isMax) {
  if (checkWin(b, "O")) return 10 - depth;
  if (checkWin(b, "X")) return depth - 10;
  if (b.every(c => c)) return 0;

  if (isMax) {
    let best = -Infinity;
    b.forEach((cell, i) => {
      if (!cell) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((cell, i) => {
      if (!cell) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = "";
      }
    });
    return best;
  }
}

function checkWin(b, p) {
  const w = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return w.some(line => line.every(i => b[i] === p));
}
