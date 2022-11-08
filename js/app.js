'use strict';

var BOMB = ' ';

// var gGameStats = {
//   TotalTilesCount: 0,
//   CellClicked: false,
//   IsFirstClick: true,
//   isGameLost: false,
//   IsGamePlaying: false,
//   LivesCount: 3,
//   BestScore: 0,
//   coreToWin: 0,

//   TotalBombCount: 2,
//   SIZE: 8,
//   IntervalId: null,
//   ElSelectedCell,
//   IsRightClick: false,
//   GameScore: 0,
//   Board,
// };

// console.log('gGameStats: ', gGameStats);

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

window.oncontextmenu = function () {
  return false;
};

// prettier-ignore
// import { createMat } from "./createboard.js";

const board = createMat(SIZE, SIZE);
console.log('board: ', board);
const boardElement = document.querySelector('.board');

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
  });
});

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

window.addEventListener('drag', (event) => {
  elBestScore.classList.add('animation-spin');
  elBestScore.classList.add('selected');
  elPlayerName.classList.add('animation-spin');
  elPlayerName.classList.add('selected');
});

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
  // hideTiles(gBoard);

  clearInterval(gIntervalId);
}

function convertSizeToBombAmt(SIZE) {
  if (SIZE === 4) SIZE = 2;
  else if (SIZE === 8) SIZE = 14;
  else if (SIZE === 12) SIZE = 32;
  else if (SIZE === 16) SIZE = 64;

  return SIZE;
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

// function hideTiles(board) {
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       var currCell = board[i][j];

//       if (currCell.status === 'hidden') return;
//     }
//   }
// }

function cellClicked(elCell, event, i, j, isRightClick) {
  if (elCell.innerText) {
    elCell.classList.add('animation-spin');
    return;
  } else if (elCell.classList.contains('animation-spin')) return;
  else var currCell = gBoard[i][j];

  var currCellElement = gBoard[i][j].gameElement;

  if (isRightClick && currCellElement === ' ') {
    elCell.innerText = '🇧🇦';
    elCell.style.backgroundColor = 'rgb(224, 117, 117)';
    elCell.classList.add('animation-scale-down');

    renderBoard();
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
  elCell.classList.add('animation-scale-down');

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
  // if (gBoard[i][j].status === 'HIDDEN')
  // if (gBoard[i][j].status === 'marked') return;
  // if (gBoard[i][j].status !== 'marked')
  //   gBoard[i][j].status = 'marked';
  if (gBoard[i][j].gameElement !== BOMB) updateScore(1);

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
