// const board = createMat(SIZE, SIZE);

// const minesLeftText = document.querySelector('[data-mine-count]');
// const messageText = document.querySelector('.subtext');

// board.forEach((row) => {
//   row.forEach((tile) => {
//     boardElement.append(tile.element);
//     tile.element.addEventListener('click', () => {
//
//       revealTile(board, tile);
//       checkGameEnd();
//     });
//   });
// });

function createMat(ROWS, COLS) {
  var mat = [];
  totalBombCount = convertSizeToBombAmt(COLS);

  const minesPositions = getMinePositions(
    totalBombCount,
    convertSizeToBombAmt(totalBombCount)
  );

  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      const element = document.createElement('div');
      element.dataset.status = TILE_STATUS.HIDDEN;

      const tile = {
        element,
        i,
        j,
        mine: minesPositions.some(positionMatch.bind(null, { i, j })),
        gameElement: null,
        bombCount: null,
        isSelected: false,
      };
      row.push(tile);
      gTotalTilesCount++;
    }
    mat.push(row);
  }
  return mat;
}

function buildBoard() {
  var totalBombCount = convertSizeToBombAmt(SIZE);
  gTotalBombCount = totalBombCount;
  board = createMat(SIZE, SIZE);
  //

  for (var k = 0; k < totalBombCount; k++) {
    // board[getRandomInt(0, SIZE)][getRandomInt(0, SIZE)].gameElement = BOMB;
  }
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCellBombsCount = countBombsAround(board, i, j);

      board[i][j].bombCount = currCellBombsCount;
      //
    }
  }

  return board;
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

      //prettier-ignore
      strHTML += `\t<td class="cell ${cellClass}" draggable="true"
        onclick="cellClicked( this, event, ${i}, ${j},${isFalse})" oncontextmenu="cellClicked(this, event, ${i}, ${j},${isTrue})">`;

      if (currCell.mine && gLivesCount === 0) {
        strHTML += '💣';
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }
  elBoard.innerHTML = strHTML;
}
