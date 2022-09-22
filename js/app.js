'use strict';

const TILE = 'WALL';
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
var gIsFirstClick = true;
var gisGameLost = false;
var gGameIsPlaying = false;

var gTotalBOMBCount = 2;
var SIZE = 4;

var gIntervalId = null;

var gSelectedElCell;

var gIsRightClick = false;

var gGameScore = 0;
var gBoard;

//  ****** right click events *****

window.oncontextmenu = function () {
  rightClicked();
  return false; // cancel default menu
};

function rightClicked() {
  gIsRightClick = !gIsRightClick;
  alert('Yo');
  // cellClicked()
}

//**** Local Storage *****

var scoreSum = localStorage.getItem('Best Score', scoreSum);
var key = localStorage.getItem('Name', key);

// **** DOM name field and input field ****

var inputKey = document.getElementById('inputKey');
var btnInsert = document.getElementById('btnInsert');
var isNamed = document.getElementById('isNamed');

isNamed.innerHTML += `${'Player Name'}: ${key}`;
bestScore.innerHTML += `${'Best Score'}: ${scoreSum}`;

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
  gIsFirstClick = true;
  gisGameLost = false;
  

  gBoard = buildBoard(SIZE);
  console.log('gBoard: ', gBoard);
  renderBoard(gBoard);
  hideTiles(gBoard);
  clearInterval(gIntervalId);
}

function buildBoard() {
  clearInterval(gIntervalId);
  var board = [];

  // Create the Matrix
  board = createMat(SIZE, SIZE);

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = { i, j, type: TILE, gameElement: null, bombCount: null };
      //

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

      // if cellClicked - remove status hidden
      currCell.status = 'HIDDEN';

      if (currCell.status === 'HIDDEN')
        if (currCell.type === FLOOR)
          //  var elCurrCell = document.querySelector(".cell")
          //  console.log('elCurrCell: ', elCurrCell);
          //  elCurrCell.classlist.remove
          // currCell.dataset.status = TILE_STATUSES.HIDDEN;

          cellClass += ' floor';
        else if (currCell.type === TILE) cellClass += ' wall';
      //prettier-ignore
      strHTML += `\t<td data-type="status" class="cell ${cellClass}" 
      onclick="cellClicked(this, event, ${i}, ${j})">`;

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

function checkWin() {
  winEvents();
}

function winEvents() {
  localStorage.setItem('Best Score', XXXX);
  bestScore.innerHTML = null;
  bestScore.innerHTML += `${'Best Score'}: ${sumTime}`;
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

function cellClicked(elCell, event, i, j) {
  if (gIsFirstClick) {
    var isFirstClick = true;
    gIsFirstClick = false;
  } else {
    isFirstClick = false;
  }

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

  if (gBoard[i][j].gameElement !== BOMB);
  {
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

  if (isFirstClick && gBoard[i][j].gameElement === BOMB) {
    elCell.innerText = 'U Lucky';
    isFirstClick = false;
  } else if (gBoard[i][j].gameElement === BOMB) {
    elCell.innerText = '💥';
    // ***** NEED TO SHOW BOMBS
    //********** BOMB HIT EVENTS *********

    console.log('Game Over');
    gisGameLost = true;
    gGameIsPlaying = !gGameIsPlaying;
    clearInterval(gIntervalId);
  }
  var cellCoord = getCellCoord(elCell.id);
  markCells(cellCoord);
  return true;
}
