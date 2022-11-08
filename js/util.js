// function getEmptyPos() {
//   var possibleCells = [];
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[i].length; j++) {
//       var currCell = gBoard[i][j];
//       if (currCell.type !== WALL && !currCell.gameElement) {
//         possibleCells.push({ i, j });
//       }
//     }
//   }
//   return possibleCells;
// }

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function startTimer() {
  clearInterval(gIntervalId);
  var startTime = Date.now();
  gIntervalId = setInterval(function () {
    var elTime = document.querySelector('.time-played');
    elTime.innerText = 'Time Played:' + '  ';
    var secs = ((Date.now() - startTime) / 1000).toFixed(0);
    if (secs < 90) {
      elTime.innerText += '0';
      elTime.innerText += secs;
    } else if (secs < 9) {
      elTime.innerText += '0';
      elTime.innerText += secs;
    } else {
      elTime.innerText += secs;
    }
  }, 10);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function updateScore(score) {
  gBestScore++;
  gGameScore += score;

  document.querySelector('h2 span').innerText = gGameScore;
}

function getMinePositions(numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      i: getRandomInt(0, SIZE),
      j: getRandomInt(0, SIZE),
    };
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.i === b.i && a.j === b.j;
}

function countBombsAround(board, rowIdx, colIdx) {
  var BombCount = 0;

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= SIZE) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= SIZE) continue;
      if (i === rowIdx && j === colIdx) continue;

      var currCell = board[i][j];
      if (currCell.gameElement === BOMB) BombCount++;
    }
  }
  return BombCount;
}

// function countZerosAround(board, rowIdx, colIdx) {

//   for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//     if (i < 0 || i >= SIZE) continue;

//     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//       if (j < 0 || j >= SIZE) continue;
//       if (i === rowIdx && j === colIdx) continue;

//       var currZeroCell = board[i][j];
//        currZeroCellArr.push(currZeroCell)

//       console.log('currCell: ', currCell);
//       if (currZeroCell.gameElement !== BOMB) BOMBCount++;
//     }
//   }
//   return currZeroCellArr;
// }

function markCells(coords) {
  // query select them one by one and add mark
  for (var i = 0; i < coords.length; i++) {
    // #cell-3-2
    var selector = getSelector(coords[i]);
    console.log('selector: ', selector);
    var elCell = document.querySelector(selector);
    elCell.classList.add('mark');
  }
}

function getSelector(coord) {
  return `#cell-${coord.i}-${coord.j}`;
}

function getCellCoord(strCellId) {
  var coord = {};
  var parts = strCellId.split('-');
  coord.i = +parts[1];
  coord.j = +parts[2];
  return coord;
}

function renderLives() {
  var livesCount = document.getElementById('lives-count');
  livesCount.innerHTML = null;
  livesCount.innerHTML += `${'Lives Left'}: ${gLivesCount}`;
}

function calculateTileAmt() {
  var tilesSum = 0;
  // debugger
  tilesSum = gTotalTilesCount - gTotalBombCount;
  console.log('tilesSum: ', tilesSum);
  return tilesSum;
}
