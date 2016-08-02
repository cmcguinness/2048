function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
    	if (!this.cells[x][y]) {
    		for (var x2 = Math.max(0,x-1); x2 < Math.min(x+2, this.size); x2++) {
				for (var y2 = Math.max(0,y-1); y2 < Math.min(y+2, this.size); y2++) {
					if (this.cells[x2][y2] !== null && this.cells[x2][y2].value == 2 &&
						(x2 ==x || y2 == y)) {
						return {x : x, y : y};
					}
				}
    		}

    	}
    }
  }

  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};


//	Find a a cell, optimally one that is near
Grid.prototype.randomAvailableCell2 = function (v) {
  var cells = this.availableCells2(v);

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

Grid.prototype.availableCells2 = function(v) {
    var mycells = [];
    var parent = this;

    this.eachCell(function(x, y, tile) {
        if (!tile) {
            for (var x2 = Math.max(0, x - 1); x2 < Math.min(x + 2, parent.size); x2++) {
                for (var y2 = Math.max(0, y - 1); y2 < Math.min(y + 2, parent.size); y2++) {
                    if (parent.cells[x2][y2] !== null && parent.cells[x2][y2].value == v && (x2 == x || y2 == y)) {
                        mycells.push({x: x, y: y});
                    }
                }
            }
        }
    });

	if (mycells.length == 0) {
		return this.availableCells();
	} else {
	    return mycells;
	}
};


// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

//	Do we have a 4 tile on the board but not a 2 tile?
Grid.prototype.has4not2 = function() {
    var has2 = false;
    var has4 = false;

    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            if (this.cells[x][y] !== null) {
                if (this.cells[x][y].value == 2) {
                    has2 = true;
                }
                if (this.cells[x][y].value == 4) {
                    has4 = true;
                }
            }
        }
    }

    return ((has2 == false) && (has4 == true));

}

//	Do we have an 8 tile on the board but not a 4 or 22 tile?
Grid.prototype.has8not24 = function() {
    var has24 = false;
    var has8 = false;

    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            if (this.cells[x][y] !== null) {
                if (this.cells[x][y].value == 2 || this.cells[x][y].value == 4) {
                    has24 = true;
                }
                if (this.cells[x][y].value == 8) {
                    has8 = true;
                }
            }
        }
    }

    return ((has24 == false) && (has8 == true));

}


// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
