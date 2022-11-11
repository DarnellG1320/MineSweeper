'use strict';

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

//

const TILE = 'TILE';

const TILE_STATUS = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

var BOMB = ' ';

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

//**** Local Storage name and best score *****
var elBestScore = document.getElementById('best-score');
var elInputField = document.getElementById('input-field');
var elSubmitButton = document.getElementById('submit-button');
var elPlayerName = document.getElementById('player-name');

var storedBestScore = localStorage.getItem('Best Score', gGameScore);
elBestScore.innerHTML = null;
elBestScore.innerHTML += `${'Best Score'}: ${storedBestScore}`;
var key = localStorage.getItem('Name', key);

// **** DOM name field and input field ****
elPlayerName.innerHTML += `${'Player Name'}: ${key}`;
elSubmitButton.onclick = function () {
  var key = elInputField.value;

  if (key) {
    localStorage.setItem('Name', key);
  }
  elPlayerName.innerHTML = null;
  elPlayerName.innerHTML += `${'Player Name'}: ${key}`;
};

window.addEventListener('drag', (event) => {
  elBestScore.classList.add('animation-spin');
  elPlayerName.classList.add('animation-spin');
});

function changeFunc() {
  var selectBox = document.getElementById('select-box');
  SIZE = +selectBox.options[selectBox.selectedIndex].value;
  scoreToWin = 0;
  createMat(SIZE, SIZE);
  initGame(SIZE);
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
  clearInterval(gIntervalId);
}

function convertSizeToBombAmt(SIZE) {
  if (SIZE === 4) SIZE = 2;
  else if (SIZE === 8) SIZE = 14;
  else if (SIZE === 12) SIZE = 32;
  else if (SIZE === 16) SIZE = 64;

  return SIZE;
}

function countBombsAround(board, rowIdx, colIdx) {
  var BombCount = 0;
  var noBombsAroundPosArr = [];
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= SIZE) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= SIZE) continue;
      if (i === rowIdx && j === colIdx) continue;

      var currCell = board[i][j];

      if (currCell.mine ? BombCount++ : noBombsAroundPosArr.push(currCell));
    }
  }
  return BombCount;
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

function cellClicked(elCell, event, i, j, isRightClick) {
  elCell.classList.add('animation-scale-down');
  if (elCell.innerText) {
    elCell.classList.add('animation-spin');
    return;
  } else if (elCell.classList.contains('animation-spin')) return;
  else var currCell = gBoard[i][j];
  //

  if (isRightClick && currCell.mine) {
    elCell.innerText = '🇧🇦';
    elCell.style.backgroundColor = 'rgb(224, 117, 117)';
    checkWin();
    winOrLoseEvents(elCell);
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
  if (!currCell.isSelected) elCell.style.backgroundColor = 'rgb(224, 117, 117)';

  currCell.isSelected = !currCell.isSelected;

  var bombCount = countBombsAround(gBoard, i, j);

  if (bombCount === 0 && !isRightClick) {
    elCell.classList.add('animation-spin');
    var newI = i + 1;
    var newJ = j + 1;

    cellClicked(elCell, event, newI, newJ, isRightClick);

    updateScore(1);
    return;
  }
  //

  if (!currCell.mine) {
    elCell.innerText = bombCount;
    // showZeros(gBoard);
    updateScore(1);
  }
  gCellClicked = !gCellClicked;
  elCell.classList.add('selected');
  gElSelectedCell = elCell;

  if (!isRightClick && isFirstClick && currCell.mine) {
    elCell.innerText = '🎂';
    isFirstClick = false;
    updateScore(1);
  } else if (currCell.mine) {
    elCell.innerText = '💣';
    gLivesCount--;
    renderLives();
    checkIfBest(gGameScore);
  }
  winOrLoseEvents(elCell);
}

function winOrLoseEvents(elCell) {
  if (gLivesCount === 0) {
    checkIfBest(gGameScore);
    gisGameLost = true;
    gIsGamePlaying = false;
    // showBombs(gBoard, elCell);
    // showZeros(gBoard, elCell);
    clearInterval(gIntervalId);
    renderLives();
    renderBoard(gBoard);
  }
}
