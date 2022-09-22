'use strict';

const WALL = 'WALL';
const FLOOR = 'FLOOR';

var BOMB = ' ';

const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

var gCollectedBOMBCount = 0;
var gCellClicked = false;

var gTotalBOMBCount = 2;
var SIZE = 4;

var gIntervalId = null;
// var gIntervalId2 = null;
var gSelectedElCell;

var gGameScore = 0;
var gisGameLost = false;
var gGameIsPlaying = false;
var gBoard;
var scoreSum = localStorage.getItem('Best Score', scoreSum);
var inputKey = document.getElementById('inputKey');
var btnInsert = document.getElementById('btnInsert');
var isNamed = document.getElementById('isNamed');

var key = localStorage.getItem('Name', key);

isNamed.innerHTML += `${'Player Name'}: ${key}`;
// bestScore.innerHTML += `${'Best Score'}: ${scoreSum}`;

btnInsert.onclick = function () {
  var key = inputKey.value;

  if (key) {
    localStorage.setItem('Name', key);
  }
  isNamed.innerHTML = null;
  isNamed.innerHTML += `${'Player Name'}: ${key}`;
  console.log(localStorage);
};

function changeFunc() {
  var selectBox = document.getElementById('selectBox');
  SIZE = +selectBox.options[selectBox.selectedIndex].value;

  initGame();
}

function startGame() {
  initGame();
}

function restartGame() {
  gGameScore = 0;
  initGame();
  updateScore(0);
}

function initGame(SIZE = 12) {
  clearInterval(gIntervalId);
  gisGameLost = false;

  gBoard = buildBoard(SIZE);
  console.log('gBoard: ', gBoard);
  renderBoard(gBoard);
  hideTiles(gBoard);
  clearInterval(gIntervalId);
}

function getEmptyPos() {
  var possibleCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.type !== WALL && !currCell.gameElement) {
        possibleCells.push({ i, j });
      }
    }
  }
  return possibleCells;
}

function buildBoard() {
  clearInterval(gIntervalId);
  var board = [];

  // TODO: Create the Matrix 10 * 12
  board = createMat(SIZE, SIZE);

  // TODO: Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = { i, j, type: FLOOR, gameElement: null, bombCount: null };
      //

      board[i][j].type = WALL;
      // var currCellBombsCount = countBombsAround(board, i, j)

      // board[i][j].bombCount = currCellBombsCount
    }
  }

  //********* MINE ADDER******

  var totalBOMBCount = convertSizeToBombAmt(SIZE);

  for (var k = 0; k < totalBOMBCount; k++) {
    board[getRandomInt(0, SIZE)][getRandomInt(0, SIZE)].gameElement = BOMB;
  }
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCellBombsCount = countBombsAround(board, i, j);

      board[i][j].bombCount = currCellBombsCount;
    }
  }
  console.log('board: ', board);

  return board;
}

function convertSizeToBombAmt(SIZE) {
  if (SIZE === 4) {
    SIZE = 2;
  } else if (SIZE === 8) {
    SIZE = 14;
  } else if (SIZE === 12) {
    SIZE = 32;
  }

  return SIZE;
}

function renderBoard(board) {
  var elBoard = document.querySelector('.board');
  var strHTML = '';

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';

    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i, j });

      // **** if cellClicked - remove status hidden
      currCell.status = 'HIDDEN';

      if (currCell.status === 'HIDDEN')
        if (currCell.type === FLOOR)
          //  var elCurrCell = document.querySelector(".cell")
          //  console.log('elCurrCell: ', elCurrCell);
          //  elCurrCell.classlist.remove
          // currCell.dataset.status = TILE_STATUSES.HIDDEN;

          cellClass += ' floor';
        else if (currCell.type === WALL) cellClass += ' wall';
      //prettier-ignore
      strHTML += `\t<td data-type="status" class="cell ${cellClass}" 
      onclick="cellClicked(this, event, ${i}, ${j})">`;

      // if (currCell.gameElement === GAMER) {
      //   strHTML += GAMER_IMG;

      if (currCell.gameElement === BOMB && gCellClicked) {
        console.log('Bomb Clicked');
      } else if (currCell.gameElement === BOMB) {
        strHTML += BOMB;
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  // console.log('strHTML is:');
  // console.log(strHTML);
  elBoard.innerHTML = strHTML;
}

function showBOMBS(board) {
  var elBoard = document.querySelector('.board');
  var currCell;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      currCell = board[i][j];

      if (currCell.gameElement === ' ') {
        console.log('currCell.gameElement: ', currCell.gameElement);
      }

      board[i][j].type = WALL;
      // var currCellBombsCount = countBombsAround(board, i, j)

      // board[i][j].bombCount = currCellBombsCount
    }
  }

  //********* MINE ADDER******

  var totalBOMBCount = convertSizeToBombAmt(SIZE);

  for (var k = 0; k < totalBOMBCount; k++) {
    board[getRandomInt(0, SIZE)][getRandomInt(0, SIZE)].gameElement = BOMB;
  }
}

function hideTiles(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      // document.querySelector("cell ").setAttribute('data', "icon: 'base2.gif', url: 'output.htm', target: 'AccessPage', output: '1'");

      if (currCell.status === 'hidden') return;

      // var elCurrCell = document.querySelector('.cell');
      // console.log('elCurrCell: ', elCurrCell);
      // console.log('elCurrCell: ', elCurrCell);
      //  elCurrCell.classlist.remove
      // currCell.dataset.status = TILE_STATUSES.HIDDEN;
    }
  }
}

// window.oncontextmenu = function () {
//   showCustomMenu();
//   return false; // cancel default menu
// };

function cellClicked(elCell, event, i, j) {
  if (!gGameIsPlaying) {
    startTimer();
    gGameIsPlaying = true;
  } else if (gisGameLost) return;
  elCell.style.backgroundColor = 'rgb(224, 117, 117)';
  if (event.type === 'click') var BOMBCount = countBombsAround(gBoard, i, j);
  // var zeroCount = countZerosAround(gBoard, i, j)
  // while (!BOMBCount) {
  //   prompt('Hello')
  // document.querySelectorAll('td')
  // console.log('document: ', document);
  // return
  // }

  if (gBoard[i][j].gameElement !== BOMB) {
    elCell.innerText = BOMBCount;
    updateScore(1);
  }
  for (let key = 0; key < SIZE; key++) {
    for (let p = 0; p < SIZE; p++) {
      if (gBoard[i][j].gameElement === BOMB && gBoard[i][j].bombCount === 0)
        elCell.innerText = BOMBCount;
    }
  }
  console.log('BOMBCount: ', BOMBCount);

  /// ***** remove hidden *******

  gCellClicked = !gCellClicked;
  if (gBoard[i][j].status === 'HIDDEN')
    if (gBoard[i][j].status === 'marked') return;
  if (gBoard[i][j].status !== 'marked') {
    gBoard[i][j].status = 'marked';
  }
  elCell.classList.add('selected');
  gSelectedElCell = elCell;
  console.log('gSelectedElCell: ', gSelectedElCell);
  if (gBoard[i][j].gameElement === BOMB) {
    elCell.innerText = '💥';

    // buildBoard(gBoard)
    // renderBoard(gBoard)

    // ***** NEED TO SHOW BOMB
    //********** BOMB HIT EVENTS *********

    console.log('Game Over');
    gisGameLost = true;
    gGameIsPlaying = !gGameIsPlaying;
    clearInterval(gIntervalId);
  }

  // console.log('elCell.id: ', elCell.id)
  var cellCoord = getCellCoord(elCell.id);
  // console.log('cellCoord: ', cellCoord)
  // var piece = gBoard[cellCoord.i][cellCoord.j];
  markCells(cellCoord);
  return true;
  // markTile()
}

function markCells(coords) {
  // TODO: query select them one by one and add mark
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

function countBombsAround(board, rowIdx, colIdx) {
  var BOMBCount = 0;

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= SIZE) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= SIZE) continue;
      if (i === rowIdx && j === colIdx) continue;

      var currCell = board[i][j];
      if (currCell.gameElement === BOMB) BOMBCount++;
    }
  }
  return BOMBCount;
}

function countZerosAround(board, rowIdx, colIdx) {
  var BOMBCount = 0;

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= SIZE) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= SIZE) continue;
      if (i === rowIdx && j === colIdx) continue;

      var currCell = board[i][j];

      console.log('currCell: ', currCell);
      if (currCell.gameElement !== BOMB) BOMBCount++;
    }
  }
  return BOMBCount;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function updateScore(score) {
  gGameScore += score;
  document.querySelector('h2 span').innerText = gGameScore;
}

// function handleKey(event) {
//   console.log('event: ', event);
//   var i = gGamerPos.i;
//   var j = gGamerPos.j;
//   // my wall/floor pos
//   // board[0][4].type = FLOOR;
//   //   board[4][0].type = FLOOR;
//   //   board[9][6].type = FLOOR;
//   //   board[4][11].type = FLOOR;

//   switch (event.key) {
//     case 'ArrowLeft':
//       moveTo(i, j - 1);
//       break;
//     case 'ArrowRight':
//       moveTo(i, j + 1);
//       break;
//     case 'ArrowUp':
//       moveTo(i - 1, j);
//       break;
//     case 'ArrowDown':
//       moveTo(i + 1, j);
//       break;
//   }
// }
