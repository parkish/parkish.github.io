var gridName = "grid";
var rowCoords = 'ABCDEFGHI';
var columnCoords = [1,2,3,4,5,6,7,8,9];

function createCell(id) {
	var cellDiv = document.createElement('input');
		
	// each cell is an editable text field
	cellDiv.type = "text";
	cellDiv.id = id;
	cellDiv.className = "cell";		
	cellDiv.possibles = "123456789";
	cellDiv.onfocus = function () {
		var possiblesSpan = document.getElementById("possibles");
		possiblesSpan.innerHTML = cellDiv.possibles;
	};
	
	return cellDiv;
}

function populateGrid(chosenPopulationFunction) {
	initGrid();
	chosenPopulationFunction();
	stylize(chosenPopulationFunction.readonly);
}

function stylize(markReadOnly) {
	// find all squares, blat out their possibles and make it obvious that there are possibles
	rowCoords.split("").forEach(function (rowCoord) {
		for (var columnCoord = 1; columnCoord <= 9; ++columnCoord) {
			var coord = rowCoord + columnCoord;
			var cell = getCell(coord);
			
			if (cell.possibles != null) {
				cell.className += " hasPossibles"
				cell.value = cell.possibles;
			}

			if (markReadOnly) {
				cell.readOnly = true;
			}
		}	
	});
}

// a grid with rows represented with A-I
// and columns represented as 1-9
function initGrid() {
	var gridDiv = document.getElementById(gridName);
	gridDiv.innerHTML = '';
	
	rowCoords.split("").forEach(function(row) {
		for (var column = 1; column <= 9; ++column) {
			// id's like "A1", etc...
			var cell = createCell(row + column);
			gridDiv.appendChild(cell);
		}
	 });
}

// id a string like 'A1'
function getRowNeighborCells(id) {
	var row = id[0];
	var col = id[1];

	return getCells([row], columnCoords, id);	
}

function cross(rows, columns, call) {
	rowCoords.forEach(function(row) {
		columnCoords.forEach(function(column) {
			call(row,column);
		});
	});
}

function getCells(rows, columns, skip) {
	var cells = [];

	rows.forEach(function(row) {
		columns.forEach(function(column) {
			var coord = row + column;

			if (coord === skip) {
				return;
			}

			var cell = getCell(coord);

			if (cell.possibles == null) {
				return;
			}

			cells.push(cell);
		});
	});

	return cells;
}

function getColumnNeighborCells(id) {
	var row = id[0];
	var col = id[1];

	return getCells(rowCoords.split(""), [col], id);
}

function getSquareNeighborCells(id) {
	var row = id[0];
	var col = id[1];
		
	// get the nearest interval and then grab +3 squares from there
	var columnStart = Math.floor((col - 1)/3) * 3; // (ie, 0 means 0,1,2, 1 means 3,4,5 and 2 means 6,7,8)
	++columnStart;
	
	var rowIndex = rowCoords.indexOf(row);
	var rowOffset = Math.floor(rowIndex / 3) * 3;
	
	return getCells(
		[ rowCoords[rowOffset], rowCoords[rowOffset + 1], rowCoords[rowOffset + 2] ],
		[ columnStart, columnStart + 1, columnStart + 2 ],
		id
	 );	
}

function getCell(coord) {
	var cell = document.getElementById(coord);
	
	if (cell == null) {
		throw "Failed to find cell with coord '" + coord + "'";
	}
	
	return cell;
}

function setCell(id, value) {
	var cell = getCell(id);
	cell.value = value;	
	cell.possibles = null;
	
	var rowNeighborCells = getRowNeighborCells(id);
	var columnNeighborCells = getColumnNeighborCells(id);
	var squareNeighborCells = getSquareNeighborCells(id);
	
	// go through and eliminate this value from their list
	rowNeighborCells.forEach(function(cell) {
		eliminate(cell, value);
	});
	
	columnNeighborCells.forEach(function(cell) {
		eliminate(cell, value);
	});
	
	squareNeighborCells.forEach(function(cell) {
		eliminate(cell, value);
	});
}

function fillRow(rowCoord, rowValuesStr) {
	for (var i = 1; i <= 9; ++i) {
		var value = rowValuesStr[i - 1];
		if (value == " ") {
			continue;			
		}
		
		setCell(rowCoord + i, rowValuesStr[i -1] );
	}	
}

function getListOfPredefinedGrids() {
    var predefinedGrids = [
        emptyFunction(),
		shouldBeSolvableWithJustLogic(),
		unsolvableWithJustLogicExample(),
		isThisSolvableWithJustLogic(),
		unusuallyDifficultMondayPuzzle(),
		exampleThursdayPuzzle(),
		unsolvableWednesdayProblem()
	];
	
	return predefinedGrids;
}

function emptyFunction() {
    var func = function () {};
    func.description = "Empty - fill in your own puzzle";
    return func;
}

function exampleThursdayPuzzle() {
	var func = function() {
		fillRow("A", " 9 1 3   ");
		fillRow("B", "  5  6  2");
		fillRow("C", " 7 45  6 ");
		fillRow("D", "   2  1  ");
		fillRow("E", "  79     ");
		fillRow("F", " 8  1  5 ");
		fillRow("G", "  2    4 ");
		fillRow("H", "   3 8  1");
		fillRow("I", "        7");
	};
	
	func.description = "example thursday puzzle - should be solvable";
	func.readonly = true;
	
	return func;
}

function isThisSolvableWithJustLogic() {
	var func = function() {
		fillRow("A", "3   75   ");		
		fillRow("B", "1   9  37");
		fillRow("C", "2  4     ");
		fillRow("D", "6    4 5 ");
		fillRow("E", "  4 21  3");
		fillRow("F", " 7  6    ");
		fillRow("G", "        4");
		fillRow("H", "  62   79");
		fillRow("I", "48    3 6");
	};
	
	func.description = "Is this one solvable?";
	func.readonly = true;
	return func;
}   

function unusuallyDifficultMondayPuzzle() {
	var func = function() {
		fillRow("A", "   6  71 ");
		fillRow("B", "8 1 5 9  ");
		fillRow("C", " 7    5  ");
		fillRow("D", "9 7  3   ");
		fillRow("E", "      2 9");
		fillRow("F", " 4   8  5");
		fillRow("G", "  9  2  3");
		fillRow("H", " 6  7 1  ");
		fillRow("I", " 1 3     ");
	};
	
	func.description = "Unusually difficult monday puzzle";
	func.readonly = true;
	return func;
}

function shouldBeSolvableWithJustLogic() {
	var func = function() {
		fillRow("A", " 64 183 9");
		fillRow("B", "  3 751  ");
		fillRow("C", " 7      5");
		fillRow("D", "  1 5    ");
		fillRow("E", " 85 6 24 ");
		fillRow("F", "    9 5  ");
		fillRow("G", "4      2 ");
		fillRow("H", "  974 8  ");
		fillRow("I", "3 892 71 ");
	};
	
	func.description = "Solvable using just logic";
	func.readonly = true;
	return func;
}

// as far as I know of this one is unsolvable using just logic - it requires you to guess and see if
// any of those contraints work
function unsolvableWithJustLogicExample() {
	var func = function() {
		fillRow("A", " 247  95 ");
		fillRow("B", " 395    7");
		fillRow("C", "715   4 6");
		fillRow("D", " 58      ");
		fillRow("E", "  61 87 5");
		fillRow("F", "1 7  58  ");
		fillRow("G", "9638  514");
		fillRow("H", "482351679");
		fillRow("I", "5714693  ");	
	};
	
	func.description = "not solvable with logic - requires trial and error (and thus, lame)";
	func.readonly = true;
	return func;
}

// Dec 17
function unsolvableWednesdayProblem() {
	var func = function() {
		fillRow("A", "     1 6 ");
		fillRow("B", " 6 8 7  1");
		fillRow("C", "37 5  9  ");
		fillRow("D", "4  9   5 ");
		fillRow("E", "  6   4 8");
		fillRow("F", "   2  79 ");
		fillRow("G", "    8    ");
		fillRow("H", "592      ");
		fillRow("I", "      1  ");
	};
	
	func.description = "wednesday problem - not sure if this is unsolveable";
	func.readonly = true;
	return func;
}

// so we can eliminate possible values in one of 3 ways:
// 1. the value already exists in a cell in the column
// 2. the value already exists in a cell in the row
// 3. the value already exists in a cell within the group (the 9 cells)

function eliminate(cellTextField, valueToRemove) {

	if (cellTextField.possibles == null) {
		return;
	}
	
	cellTextField.possibles = cellTextField.possibles.replace(valueToRemove, "");
	
	if (cellTextField.possibles.length == 1) {
		cellTextField.className += " calculated";
		setCell(cellTextField.id, cellTextField.possibles);
		return;
	}
}

function isFullySolvedGrid() {
	// if any of the cell's 'possibles' member is not null then it's not fully solved
	
}