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

var gTotalTilesCount = 0;
var gCellClicked = false;
var gIsFirstClick = true;
var gisGameLost = false;
var gIsGamePlaying = false;
var gLivesCount = 3;
var gBestScore = 0;
var scoreToWin = 0;

var gTotalBombCount = 2;
var SIZE = 8;
var gIntervalId = null;
var gElSelectedCell;
var gIsRightClick = false;
var gGameScore = 0;
var gBoard;

//  ****** right click cancel default menu *****

window.oncontextmenu = function () {
  return false;
};

//**** Local Storage name and best score *****
var storedBestScore = localStorage.getItem('Best Score', gGameScore);
var elBestScore = document.getElementById('best-score');

elBestScore.innerHTML = null;
elBestScore.innerHTML += `${'Best Score'}: ${storedBestScore}`;
var key = localStorage.getItem('Name', key);
// **** DOM name field and input field ****

var elInputField = document.getElementById('input-field');
var elSubmitButton = document.getElementById('submit-button');
var elPlayerName = document.getElementById('player-name');

elPlayerName.innerHTML += `${'Player Name'}: ${key}`;
elSubmitButton.onclick = function () {
  var key = elInputField.value;

  if (key) {
    localStorage.setItem('Name', key);
  }
  elPlayerName.innerHTML = null;
  elPlayerName.innerHTML += `${'Player Name'}: ${key}`;
  // console.log(localStorage);
};

function changeFunc() {
  var selectBox = document.getElementById('select-box');
  SIZE = +selectBox.options[selectBox.selectedIndex].value;
  scoreToWin = 0;
  initGame();
}

function restartGame() {
  gGameScore = 0;
  scoreToWin = 0;
  initGame();
  updateScore(0);
}

function initGame(SIZE) {
  clearInterval(gIntervalId);
  gGameScore = 0;
  gLivesCount = 3;
  gBestScore = 0;
  gIsFirstClick = true;
  gisGameLost = false;
  gIsGamePlaying = false;

  gBoard = buildBoard(SIZE);
  
  renderBoard(gBoard);
  // scoreToWin = calculateTileAmt()
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
      gTotalTilesCount++;
    }
  }

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

  return board;
}

function convertSizeToBombAmt(SIZE) {
  if (SIZE === 4) SIZE = 2;
  else if (SIZE === 8) SIZE = 14;
  else if (SIZE === 12) SIZE = 32;
  else if (SIZE === 16) SIZE = 64;

  return SIZE;
}

function renderBoard(board) {
  var elBoard = document.querySelector('.board');
  var strHTML = '';
  var isTrue = true;
  var isFalse = false;

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';

    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i, j });

      // if cellClicked - remove status hidden
      currCell.status = 'HIDDEN';
      if (currCell.status === 'HIDDEN')
        if (currCell.type === FLOOR) cellClass += ' floor';
        else if (currCell.type === TILE) cellClass += ' wall';
      //prettier-ignore
      strHTML += `\t<td data-type="status" class="cell ${cellClass}" 
      onclick="cellClicked( this, event, ${i}, ${j},${isFalse})" oncontextmenu="cellClicked(this, event, ${i}, ${j},${isTrue})">`;

      if (currCell.gameElement === BOMB && gCellClicked) {
        strHTML += BOMB;
      } else if (currCell.gameElement === '💣' && gisGameLost) {
        strHTML += '💣';
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  // console.log('strHTML is:');
  // console.log(strHTML);
  elBoard.innerHTML = strHTML;
}

function showBombs(board) {
  var currCell;

  for (var i = 0; i < SIZE; i++) {
    for (var j = 0; j < SIZE; j++) {
      currCell = board[i][j];

      if (currCell.gameElement === ' ') {
        currCell.gameElement = '💣';
      }
    }
  }
}

function showZeros(board) {
  var currCell;

  for (var i = 0; i < SIZE; i++) {
    for (var j = 0; j < SIZE; j++) {
      currCell = board[i][j];
      // console.log('currCell: ', currCell);

      if (currCell.bombCount === 0) {
      }
    }
  }
}
function checkWin() {
  if (gGameScore !== gTotalTilesCount) {
    checkIfBest(gGameScore);
  }
}

function checkIfBest() {
  var storedBestScore = localStorage.getItem('Best Score', gBestScore);

  if (storedBestScore > gGameScore) return;
  else localStorage.setItem('Best Score', gGameScore);
  elBestScore.innerHTML = null;
  elBestScore.innerHTML += `${'Best Score'}: ${gGameScore}`;
}

function hideTiles(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      if (currCell.status === 'hidden') return;
    }
  }
}

function cellClicked(elCell, event, i, j, isRightClick) {
  if (elCell.innerText === '🇧🇦' || elCell.innerText === '💣') return;
  else var currCell = gBoard[i][j];

  var currCellElement = gBoard[i][j].gameElement;

  if (isRightClick && currCellElement === ' ') {
    elCell.innerText = '🇧🇦';
    elCell.style.backgroundColor = 'rgb(224, 117, 117)';
    elCell.classList.add('scale-down-center');
    renderBoard;
    checkWin();
    return;
  }

  checkWin();
  if (gisGameLost) return;
  // showZeros(gBoard)
  renderLives();

  if (gIsFirstClick) {
    var isFirstClick = true;
    gIsFirstClick = false;
  }

  if (!gIsGamePlaying) {
    startTimer();
    checkIfBest();
    gIsGamePlaying = true;
  } else if (gisGameLost) return;
  elCell.style.backgroundColor = 'rgb(224, 117, 117)';
  elCell.classList.add('scale-down-center');

  var BombCount = countBombsAround(gBoard, i, j);
  // console.log('BOMBCount: ', BOMBCount);

  //***** showZeros not working yet *******
  if (gBoard[i][j].gameElement !== BOMB) {
    elCell.innerText = BombCount;
    showZeros(gBoard);
    // updateScore(1);
  }

  for (var k = 0; k < SIZE; k++) {
    for (var p = 0; p < SIZE; p++) {
      if (gBoard[i][j].gameElement === BOMB && gBoard[i][j].bombCount === 0)
        elCell.innerText = BombCount;
    }
  }

  /// ***** remove hidden *******

  gCellClicked = !gCellClicked;
  if (gBoard[i][j].status === 'HIDDEN')
    if (gBoard[i][j].status === 'marked') return;
  if (gBoard[i][j].status !== 'marked') {
    gBoard[i][j].status = 'marked';
    if (gBoard[i][j].gameElement !== BOMB) updateScore(1);
  }

  elCell.classList.add('selected');
  gElSelectedCell = elCell;

  if (!isRightClick && isFirstClick && currCell.gameElement === ' ') {
    elCell.innerText = '🎂';
    isFirstClick = false;
    updateScore(1);
  } else if (!isRightClick && currCell.gameElement === ' ') {
    elCell.innerText = '💣';
    gLivesCount--;
    renderLives();
    checkIfBest(gGameScore);

    //********** Game Lost EVENTS *********
  }
  if (gLivesCount === 0) {
    checkIfBest(gGameScore);
    gisGameLost = true;
    gIsGamePlaying = false;
    showBombs(gBoard);
    showZeros(gBoard);
    clearInterval(gIntervalId);
    renderLives();
    renderBoard(gBoard);
    alert('Game Over');
  }
  var cellCoord = getCellCoord(elCell.id);
  markCells(cellCoord);
  return true;
}
