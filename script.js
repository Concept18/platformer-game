document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const width = 10;
  let squares = [];
  let currentPosition = 4;
  let currentRotation = 0;
  let score = 0;

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  // Create grid squares
  for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);
  }

  for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.classList.add('taken');
    grid.appendChild(square);
    squares.push(square);
  }

  // Select a random Tetromino
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('active');
    });
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('active');
    });
  }

  // Move Tetromino down
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze Tetromino
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      );
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  // Move Tetromino left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  // Move Tetromino right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  // Rotate Tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = Array.from(
        { length: width },
        (_, index) => squares[i + index]
      );

      if (row.every((square) => square.classList.contains('taken'))) {
        score += 10;
        scoreDisplay.textContent = score;
        row.forEach((square) => {
          square.classList.remove('taken', 'active');
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      clearInterval(timerId);
      alert('Game Over! Your score is ' + score);
    }
  }

  // Controls
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener('keyup', control);

  // Start the game
  let timerId = setInterval(moveDown, 1000);
});
