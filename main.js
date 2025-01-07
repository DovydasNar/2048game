document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector("#gridContainer");
  const resetButton = document.querySelector("#resetButton");
  const continueButton = document.querySelector("#continue");

  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let score = 0;

  function initGame() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    updateTiles();
  }

  resetButton.addEventListener("click", function () {
    initGame();
    const gameOverElement = document.querySelector("#gameOver");
    gameOverElement.classList.add("hidden");
  });

  continueButton.addEventListener("click", function () {
    const winElement = document.querySelector("#winResult");
    winElement.classList.add("hidden");
  });

  function checkforWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 2048) {
          const winElement = document.querySelector("#winResult");
          winElement.classList.remove("hidden");
          return true;
        }
      }
    }
    return false;
  }

  const bestScoreElement = localStorage.getItem("bestScore") || 0;
  bestScoreElement.textContent = localStorage.getItem("bestScore") || 0;

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }

  function addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const tileValue = Math.random() < 0.9 ? 2 : 4;
    board[row][col] = tileValue;
  }

  function updateTiles() {
    const tiles = grid.querySelectorAll(".tile");
    tiles.forEach((tile) => tile.remove());

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = grid.children[row * 4 + col];
        const tileValue = board[row][col];

        if (tileValue > 0) {
          const newTile = document.createElement("div");
          newTile.classList.add("tile");
          newTile.textContent = tileValue;
          newTile.setAttribute("data-value", tileValue);

          if (!cell.querySelector(".tile")) {
            newTile.classList.add("new");
          }

          cell.appendChild(newTile);
        }
      }
    }
  }

  function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      const column = getColumn(col);
      const newColumn = mergeTiles(column);
      if (!arraysEqual(column, newColumn)) {
        moved = true;
      }
      setColumn(col, newColumn);
    }
    return moved;
  }

  function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      const column = getColumn(col);
      const newColumn = mergeTiles(column.reverse()).reverse();
      if (!arraysEqual(column, newColumn)) {
        moved = true;
      }
      setColumn(col, newColumn);
    }
    return moved;
  }

  function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      const rowArray = getRow(row);
      const newRow = mergeTiles(rowArray);
      if (!arraysEqual(rowArray, newRow)) {
        moved = true;
      }
      setRow(row, newRow);
    }
    return moved;
  }

  function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      const rowArray = getRow(row);
      const newRow = mergeTiles(rowArray.reverse()).reverse();
      if (!arraysEqual(rowArray, newRow)) {
        moved = true;
      }
      setRow(row, newRow);
    }
    return moved;
  }

  function mergeTiles(array) {
    const result = array.filter((value) => value !== 0);
    const newArray = [];

    for (let i = 0; i < result.length; i++) {
      if (result[i] === result[i + 1]) {
        const mergedValue = result[i] * 2;
        newArray.push(mergedValue);
        score += mergedValue;
        i++;

        setTimeout(() => {
          const tiles = grid.querySelectorAll(
            `.tile[data-value="${mergedValue}"]`
          );
          tiles.forEach((tile) => tile.classList.add("merge"));
        }, 0);
      } else {
        newArray.push(result[i]);
      }
    }

    while (newArray.length < 4) {
      newArray.push(0);
    }

    updateScore();
    return newArray;
  }

  function removeAnimationClasses() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.classList.remove("new", "merge");
    });
  }

  updateTiles();
  setTimeout(removeAnimationClasses, 200);

  function updateScore() {
    const scoreElement = document.querySelector("#score");
    const bestScoreElement = document.querySelector("#bestScore");
    scoreElement.textContent = score;

    let bestScore = localStorage.getItem("bestScore") || 0;

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }

    bestScoreElement.textContent = bestScore;
  }

  function getColumn(col) {
    return board.map((row) => row[col]);
  }

  function getRow(row) {
    return board[row];
  }

  function setColumn(col, newColumn) {
    for (let row = 0; row < 4; row++) {
      board[row][col] = newColumn[row];
    }
  }

  function setRow(row, newRow) {
    board[row] = newRow;
  }

  function arraysEqual(a, b) {
    return (
      a.length === b.length && a.every((value, index) => value === b[index])
    );
  }

  function isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          return false;
        }
        if (col < 3 && board[row][col] === board[row][col + 1]) {
          return false;
        }
        if (row < 3 && board[row][col] === board[row + 1][col]) {
          return false;
        }
      }
    }
    return true;
  }

  function checkGameOver() {
    if (isGameOver()) {
      const gameOverElement = document.querySelector("#gameOver");
      gameOverElement.classList.remove("hidden");
    }
  }

  document.addEventListener("keydown", function (event) {
    let moved = false;
    if (event.key === "ArrowUp") {
      moved = moveUp();
    } else if (event.key === "ArrowDown") {
      moved = moveDown();
    } else if (event.key === "ArrowLeft") {
      moved = moveLeft();
    } else if (event.key === "ArrowRight") {
      moved = moveRight();
    }

    if (moved) {
      addRandomTile();
      updateTiles();
      if (!checkforWin()) {
        checkGameOver();
      }
    }
  });

  initGame();
});
