const thisGrid = document.querySelector(".grid");
const tetrisGrid = document.querySelector(".gameGrid");
const statsGrid = document.querySelector(".statusGrid");
const gameWidth = 10;
const statusWidth = 4;
let gameStatus = document.createElement("p");
gameStatus.classList.add("statusStyle");
tetrisGrid.appendChild(gameStatus);

let quackSound = document.getElementById("quack_sound");
quackSound.src = "quack.mp3";
quackSound.volume = 1;

let gameMusic = document.getElementById("theme_music");
gameMusic.src = "Tetris_theme.ogg.mp3";
gameMusic.loop = true;

let score = 0;
let lines = 0;

for (let i = 0; i < 210; i++) {
  let divSquare = document.createElement("div");
  divSquare.classList.add(i);
  tetrisGrid.appendChild(divSquare);

  if (i < gameWidth) {
    divSquare.classList.add("gameCeiling");
  }
}

for (let i = 0; i < 36; i++) {
  let divSquare = document.createElement("div");
  divSquare.classList.add(i);
  statsGrid.appendChild(divSquare);
}

let scoreDiv = document.createElement("p");
scoreDiv.classList.add("scoreBoard");
statsGrid.appendChild(scoreDiv);
scoreDiv.textContent = "Score: " + score;

let linesDiv = document.createElement("p");
linesDiv.classList.add("lineBoard");
statsGrid.appendChild(linesDiv);
linesDiv.textContent = "Lines: " + lines;

document.addEventListener("DOMContentLoaded", () => {
  let tetrisSquares = Array.from(document.querySelectorAll(".gameGrid div"));
  const statsSquares = document.querySelectorAll(".statusGrid div");
  const startBtn = document.querySelector("#start");
  const pauseBtn = document.querySelector("#pause");

  let gameSpeed = 500;

  document.querySelectorAll("button").forEach(function (item) {
    item.addEventListener("focus", function () {
      this.blur();
    });
  });

  let gameInterval;
  let currentPosition = 5;
  let currentPiece = Math.floor(Math.random() * 7);
  let currentOrient = 0;
  let nextPiece = Math.floor(Math.random() * 7);
  let nextPiecePosition = 13;
  let gameStarted = false;
  let gamePaused = false;
  const blockColors = [
    "plum",
    "silver",
    "lightcoral",
    "lightseagreen",
    "gold",
    "orange",
    "tan",
  ];

  //create tetris pieces
  function createBlock(width) {
    gridWidth = width;

    const lLeftTetro = [
      [0, gridWidth, gridWidth * 2, gridWidth * 2 + 1],
      [0, 1, 2, gridWidth],
      [0, 1, gridWidth + 1, gridWidth * 2 + 1],
      [gridWidth, gridWidth + 1, gridWidth + 2, 2],
    ];

    const lRightTetro = [
      [gridWidth * 2, 1, gridWidth + 1, gridWidth * 2 + 1],
      [0, gridWidth, gridWidth + 1, gridWidth + 2],
      [0, gridWidth, gridWidth * 2, 1],
      [0, 1, 2, gridWidth + 2],
    ];

    const tTetro = [
      [1, gridWidth, gridWidth + 1, gridWidth + 2],
      [0, gridWidth, gridWidth + 1, gridWidth * 2],
      [0, 1, 2, gridWidth + 1],
      [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth],
    ];

    const oTetro = [
      [0, 1, gridWidth, gridWidth + 1],
      [0, 1, gridWidth, gridWidth + 1],
      [0, 1, gridWidth, gridWidth + 1],
      [0, 1, gridWidth, gridWidth + 1],
    ];

    const iTetro = [
      [0, gridWidth, gridWidth * 2, gridWidth * 3],
      [0, 1, 2, 3],
      [0, gridWidth, gridWidth * 2, gridWidth * 3],
      [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    ];

    const zLeftTetro = [
      [gridWidth, gridWidth + 1, 1, 2],
      [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
      [gridWidth, gridWidth + 1, 1, 2],
      [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1],
    ];

    const zRightTetro = [
      [0, 1, gridWidth + 1, gridWidth + 2],
      [1, gridWidth, gridWidth + 1, gridWidth * 2],
      [0, 1, gridWidth + 1, gridWidth + 2],
      [1, gridWidth, gridWidth + 1, gridWidth * 2],
    ];

    tetroArray = [
      lLeftTetro,
      lRightTetro,
      tTetro,
      oTetro,
      iTetro,
      zLeftTetro,
      zRightTetro,
    ];

    return tetroArray;
  }

  const currentBlocks = createBlock(gameWidth);
  const nextBlocks = createBlock(statusWidth);

  let currentArray;
  let nextArray;

  //generate current tetris and next tetris randomly at beginning
  //if there is already next tetris, make next tetris the current tetris and
  //randomly generate another next tetris piece
  function randomTetris() {
    currentPosition = 5;
    currentPiece = Math.floor(Math.random() * 7);
    currentOrient = 0;
    nextPiece = Math.floor(Math.random() * 7);
    currentArray = currentBlocks[currentPiece][currentOrient];
    nextArray = nextBlocks[nextPiece][currentOrient];

    drawPiece(nextPiecePosition, statusWidth);
  }

  function nextTetris() {
    undrawPiece(nextPiecePosition, statusWidth);

    currentPosition = 5;
    currentPiece = nextPiece;
    currentOrient = 0;
    currentArray = currentBlocks[currentPiece][currentOrient];
    nextPiece = Math.floor(Math.random() * 7);
    nextArray = nextBlocks[nextPiece][currentOrient];

    drawPiece(nextPiecePosition, statusWidth);
  }

  //undraw tetris piece
  function undrawPiece(thisPosition, width) {
    if (width == gameWidth) {
      currentArray.forEach((index) => {
        tetrisSquares[thisPosition + index].classList.remove("tetrisPiece");
        tetrisSquares[thisPosition + index].style.backgroundColor = "";
      });
    } else {
      nextArray.forEach((index) => {
        statsSquares[thisPosition + index].classList.remove("tetrisPiece");
        statsSquares[thisPosition + index].style.backgroundColor = "";
      });
    }
  }

  //draw tetris piece
  function drawPiece(thisPosition, width) {
    if (width == gameWidth) {
      currentArray.forEach((index) => {
        tetrisSquares[thisPosition + index].classList.add("tetrisPiece");
        tetrisSquares[thisPosition + index].style.backgroundColor =
          blockColors[currentPiece];
      });
    } else {
      nextArray.forEach((index) => {
        statsSquares[thisPosition + index].classList.add("tetrisPiece");
        statsSquares[thisPosition + index].style.backgroundColor =
          blockColors[nextPiece];
      });
    }
  }

  //freeze condition for a tetris piece
  //if piece hits the bottom of the game grid or any square below the piece is frozen
  function freezePiece() {
    if (
      currentArray.some((index) => index + currentPosition + gameWidth > 209) ||
      currentArray.some((index) =>
        tetrisSquares[index + currentPosition + gameWidth].classList.contains(
          "frozenPiece"
        )
      )
    ) {
      currentArray.forEach((index) =>
        tetrisSquares[index + currentPosition].classList.add("frozenPiece")
      );
      nextTetris();
      clearRow();
      checkLoseCondition();
    }
  }

  //current tetris piece, will appear at the top and fall to the bottom.
  // will move a row down at a set interval
  function moveDown() {
    freezePiece();
    undrawPiece(currentPosition, gameWidth);

    currentPosition += gameWidth;

    drawPiece(currentPosition, gameWidth);
  }

  //tetris piece controls

  //move right if +1 does is on the same row, doesn't hit the wall, and next square
  //does not have a frozen piece.
  function moveRight() {
    undrawPiece(currentPosition, gameWidth);
    let rightEdge = currentArray.some(
      (index) =>
        (currentPosition + index + 1) % 10 === 0 ||
        tetrisSquares[currentPosition + index + 1].classList.contains(
          "frozenPiece"
        )
    );
    if (!rightEdge) {
      currentPosition += 1;
    }
    drawPiece(currentPosition, gameWidth);
  }

  //move left if -1 does is on the same row, doesn't hit the wall, and next square
  //does not have a frozen piece.
  function moveLeft() {
    undrawPiece(currentPosition, gameWidth);

    let leftEdge = currentArray.some(
      (index) =>
        currentPosition % 10 === 0 ||
        tetrisSquares[currentPosition + index - 1].classList.contains(
          "frozenPiece"
        )
    );
    if (!leftEdge) {
      currentPosition -= 1;
    }
    drawPiece(currentPosition, gameWidth);
  }

  //move the indext of the current tetris orientation to the next one in the
  //currentOrientArray index
  function rotate() {
    undrawPiece(currentPosition, gameWidth);

    tempOrient = (currentOrient + 1) % 4;
    tempArray = currentBlocks[currentPiece][currentOrient];

    let aboveBottom = tempArray.every((index) => currentPosition + index < 209);

    if (
      aboveBottom &&
      !tempArray.some((index) =>
        tetrisSquares[currentPosition + index].classList.contains("frozenPiece")
      )
    ) {
      currentOrient = tempOrient;
      currentArray = tempArray;
    }
    drawPiece(currentPosition, gameWidth);

    let onEdge = false;
    let pastEdge = false;

    for (let i = 0; i < currentArray.length; i++) {
      if ((currentPosition + currentArray[i]) % 10 === 0) [(pastEdge = true)];

      if ((currentPosition + currentArray[i] + 1) % 10 === 0) {
        onEdge = true;
      }

      if (onEdge && pastEdge) {
        currentPosition -= 1;
      }
    }
  }

  function blockControls(e) {
    let direction = 0;
    switch (e.keyCode) {
      //right
      case 39:
        moveRight();
        break;
      //left
      case 37:
        moveLeft();
        break;
      //down
      case 40:
        moveDown();
        break;
      case 32:
        rotate();
        break;
    }
  }

  document.addEventListener("keydown", blockControls);

  startBtn.addEventListener("click", () => {
    if (gameStarted) {
      clearInterval(gameInterval);
      undrawPiece(currentPosition, gameWidth);
      for (let i = 0; i < tetrisSquares.length; i++) {
        tetrisSquares[i].classList.remove("frozenPiece");
        tetrisSquares[i].style.backgroundColor = "";
      }
      gameMusic.pause();
      undrawPiece(nextPiecePosition, statusWidth);
      gameStatus.textContent = "Game Ended";
      gameStarted = false;
      gamePaused = false;
    } else {
      gameMusic.src = "Tetris_theme.ogg.mp3";
      gameMusic.play();
      gameStatus.textContent = "";
      randomTetris();

      gameInterval = setInterval(moveDown, gameSpeed);
      gameStatus.textContent = "";
      gamePaused = false;
      gameStarted = true;
    }
  });

  pauseBtn.addEventListener("click", () => {
    if (gamePaused && gameStarted) {
      gameStatus.textContent = "";
      gameMusic.play();

      gameInterval = setInterval(moveDown, gameSpeed);
      gamePaused = false;
    } else if (!gamePaused && gameStarted) {
      clearInterval(gameInterval);
      gameMusic.pause();
      gameStatus.textContent = "Game Paused";
      gamePaused = true;
    }
  });

  //when an entire row is filled without gaps, add score and line and clear row
  function clearRow() {
    for (let i = 0; i < tetrisSquares.length; i += gameWidth) {
      let gameRow = [...Array(10).keys()].map((index) => index + i);

      if (
        gameRow.every((index) =>
          tetrisSquares[index].classList.contains("frozenPiece")
        )
      ) {
        quackSound.play();
        score += 100;
        scoreDiv.textContent = "Score: " + score;

        lines += 1;
        linesDiv.textContent = "Lines: " + lines;

        gameSpeed = gameSpeed - lines * 10;
        clearInterval(gameInterval);
        gameInterval = setInterval(moveDown, gameSpeed);

        gameRow.forEach((index) => {
          tetrisSquares[index].classList.remove("frozenPiece");
          tetrisSquares[index].classList.remove("tetrisPiece");
          tetrisSquares[index].style.backgroundColor = "";
        });

        for (let i = 0; i < gameWidth; i++) {
          tetrisSquares[i].classList.remove("gameCeiling");
        }

        let removedRow = tetrisSquares.splice(gameRow[0], gameWidth);
        tetrisSquares = removedRow.concat(tetrisSquares);
        tetrisSquares.forEach((cell) => tetrisGrid.appendChild(cell));

        for (let i = 0; i < gameWidth; i++) {
          tetrisSquares[i].classList.add("gameCeiling");
        }
      }
    }
  }

  function checkLoseCondition() {
    for (let i = 0; i < gameWidth * 2; i++) {
      if (tetrisSquares[i].classList.contains("frozenPiece")) {
        clearInterval(gameInterval);
        gameStatus.textContent = "You Lose";
      }
    }
  }
});
