var cols, rows, w;
var grid = [];
var current;
var next;
var stack = [];
var startnumb = 0;
var buttons = [4];

function setup() {
  createCanvas(400, 400);

  for (let i = 5; i <= 20; i += 5) {
    buttons[i] = createButton(i);
    buttons[i].position(width / 10 + (i / 5 - 1) * 80, height / 2 + 50);
    buttons[i].size(75, 37.5);
    buttons[i].mousePressed(function() {
      beginGame(i)
    });
  }

}

function beginGame(n) {
  cols = n;
  rows = cols;
  w = width / cols;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
  for (let i = 5; i <= 20; i += 5) {
    buttons[i].remove();
  }
  startnumb = 1;
}


function draw() {
  background(51);
  if (startnumb == 0) {
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Choose Amount Of Rows", width / 2, height / 3);
    text("And Cols In Maze", width / 2, height / 2.3);
  } else if (startnumb == 1) {

    current.highlight();
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }

    current.visited = true;
    next = current.chooseNeighbor();
    if (next) {
      stack.push(current);
      removewalls(current, next);
      next.visited = true;
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

    if (stack.length == 0 && !next) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[i].rb > 51) {
          grid[i].rb -= 4;
        }
        if (grid[i].g < 51) {
          grid[i].g += 4;
        }
        if (grid[i].alpha < 255) {
          grid[i].alpha += 4;
        }
      }
    }
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.stillrunning = true;
  this.rb = 200;
  this.g = 0;
  this.alpha = 100;

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;
    if (this.stillrunning) {
      if (this.visited) {
        noStroke();
        fill(this.rb, this.g, this.rb, this.alpha);
        rect(x, y, w, w);
      }
    }
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
  }

  this.highlight = function() {
    if (this.stillrunning) {
      fill(this.rb, this.g, this.rb, this.alpha);
      noStroke();
      rect(this.i * w, this.j * w, w, w);
    }
  }

  this.chooseNeighbor = function() {
    var neighbors = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

}

function index(i, j) {
  if (i < 0 || i > cols - 1 || j < 0 || j > rows - 1) {
    return -1;
  } else {
    return i + j * cols;
  }
}

function removewalls(current, next) {
  var x = current.i - next.i;
  var y = current.j - next.j;

  if (x == 1) {
    current.walls[3] = false;
    next.walls[1] = false;
  } else if (x == -1) {
    current.walls[1] = false;
    next.walls[3] = false;
  }
  if (y == 1) {
    current.walls[0] = false;
    next.walls[2] = false;
  } else if (y == -1) {
    current.walls[2] = false;
    next.walls[0] = false;
  }
}