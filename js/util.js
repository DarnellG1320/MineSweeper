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

function renderLives() {
  var livesCount = document.getElementById('lives-count');
  livesCount.innerHTML = null;
  livesCount.innerHTML += `${'Lives Left'}: ${gLivesCount}`;
}
