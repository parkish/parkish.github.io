var gridName = "grid";
var rowCoords = 'ABCDEFGHI';
var columnCoords = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
function populateGrid(gridData) {
    initGrid();
    fillUsingData(gridData);
    stylize(true);
}
function stylize(markReadOnly) {
    // find all squares, blat out their possibles and make it obvious that there are possibles
    rowCoords.split("").forEach(function (rowCoord) {
        for (var columnCoord = 1; columnCoord <= 9; ++columnCoord) {
            var coord = rowCoord + columnCoord;
            var cell = getCell(coord);
            if (cell.possibles != null) {
                cell.className += " hasPossibles";
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
    rowCoords.split("").forEach(function (row) {
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
function getCells(rows, columns, skip) {
    var cells = [];
    rows.forEach(function (row) {
        columns.forEach(function (column) {
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
    var columnStart = Math.floor((col - 1) / 3) * 3; // (ie, 0 means 0,1,2, 1 means 3,4,5 and 2 means 6,7,8)
    ++columnStart;
    var rowIndex = rowCoords.indexOf(row);
    var rowOffset = Math.floor(rowIndex / 3) * 3;
    return getCells([rowCoords[rowOffset], rowCoords[rowOffset + 1], rowCoords[rowOffset + 2]], [columnStart, columnStart + 1, columnStart + 2], id);
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
    rowNeighborCells.forEach(function (cell) {
        eliminate(cell, value);
    });
    columnNeighborCells.forEach(function (cell) {
        eliminate(cell, value);
    });
    squareNeighborCells.forEach(function (cell) {
        eliminate(cell, value);
    });
}
function fillRow(rowId, rowValuesStr) {
    for (var i = 1; i <= 9; ++i) {
        var value = rowValuesStr[i - 1];
        if (value == " ") {
            continue;
        }
        setCell(rowId + i, rowValuesStr[i - 1]);
    }
}
function fillUsingData(grid) {
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var value = grid[row][col];
            if (value == " ") {
                continue;
            }
            setCell(rowCoords[row] + (col + 1), value);
        }
    }
}
function loadGames(grids) {
    var predefinedSelect = document.getElementById('predefinedGrids');
    for (var puzzleName in grids) {
        var rows = grids[puzzleName];
        var option = document.createElement("option");
        option.text = puzzleName;
        option.gridData = grids[puzzleName];
        predefinedSelect.appendChild(option);
    }
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
function loadGrid() {
    var predefinedSelect = document.getElementById('predefinedGrids');
    onChangeSelect(predefinedSelect);
}
function onChangeSelect(select) {
    var gridData = select.options[select.selectedIndex].gridData;
    populateGrid(gridData);
}
