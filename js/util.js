function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function get2NdClassName(location) {
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
    var elTime = document.querySelector('.timePlayed');
    elTime.innerText = 'Time Played:' + '  ';
    var secs = ((Date.now() - startTime) / 1000).toFixed(0);
    if (secs < 90) {
      elTime.innerText += '0';
      elTime.innerText += secs;
    } else if (secs < 9) {
      elTime.innerText += '0';
      elTime.innerText += secs;
    }
  }, 10);
}
