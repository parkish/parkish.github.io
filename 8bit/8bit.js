function debugWrite(message) 
{
	var parent = document.getElementById("debugging");
	
	var element = document.createElement('div');
	
	//element.style.height = "20px";
	//element.style.width = "20px";
	
	element.innerHTML = "<b>" + message + "</b>";
		
	parent.appendChild(element);
}

function EightBit(canvasElement) 
{
	if (canvasElement == null)
		return;
	
	// size in pixels of each cell
	// this.CellSize = 10;		// dynamically derived from the canvas size
	// assumes the canvas is square
	this.NumCells = 10;		// grid is square, so only 1-dim
	
	this.canvas = canvasElement;
	
	/*
		TODO: figure out what was going on here - basically, I had set the dimensions of the
		canvas using the css style as well as the actual width/height attributes off of the
		canvas itself. However, when I draw in it it's obvious that the sizes are _way_ off
		
		If you just uncomment the .width/height off the element itself the resized element
		isn't right. Uncomment the CSS version and the grid is way too big. 
		
		So not sure what's happening - the only thing that seems to work is to size the grid
		statically in HTML and then assume the same dimensions here. So now I dynamically
		reconfigure based on the dimensions set in HTML (which is probably right anyways)
	
	// TODO: this is supposed to resize the canvas so it can handle
	// the # of cells that we're trying to throw at it. Instead it only seems
	// to make it big enough to accomodate a few of the cells?
	//this.canvas.style.width = Math.floor(this.CellSize * this.NumCells) + "px";
	//this.canvas.style.height = Math.floor(this.CellSize * this.NumCells) + "px";
	
	// something is vaguely bubbling back in my memory - I remember that not setting a height on 
	// the canvas would cause any of my size estimations/queries to come back incorrectly.
	//this.canvas.width = Math.floor(this.CellSize * this.NumCells) + "px";
	//this.canvas.height = Math.floor(this.CellSize * this.NumCells) + "px";
	*/
	
	this.CellSize = Math.floor(this.canvas.width / this.NumCells);
	//alert("cellsize = " + this.CellSize);
	
	this.context = this.canvas.getContext("2d");	
	this.currentImageId = 0;
}

new EightBit();

EightBit.prototype.plopFatBit = function(x, y) {
	var newCoords = this.snapToGrid(x,y);	

	// alert("cell size = " + this.CellSize);
	this.context.fillRect(newCoords.x, newCoords.y, this.CellSize, this.CellSize);
}

EightBit.prototype.setColor = function(color) {
	this.context.fillStyle = color;
}

EightBit.prototype.clear = function(event) {
	var previousColor = this.context.fillStyle;
	
	this.context.fillStyle = "RGB(255,255,255)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.context.fillStyle = previousColor;
}

EightBit.prototype.snapToGrid = function(x,y) {

	// BUG: not sure if this is exactly where it is, but the calculation for the 
	// cell I'm supposed to fill is incorrect and I think this is the base of it.
	// try clicking nearby the bottom of a cell - it's like the actual target is 
	// about 2 pixels above the cursor.
	
	var logicalX = Math.floor(x / this.CellSize);
	var logicalY = Math.floor(y / this.CellSize);
	
	debugWrite("(" + x + "," + y + ") => (" + logicalX + "," + logicalY + ")");
	
	return { x : logicalX * this.CellSize, y : logicalY * this.CellSize };
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex.toUpperCase();
}

EightBit.prototype.handleClickOnColorPickers = function(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
		
	if (targ.id.match(/^color/)) 
	{
		// snag the color from the element
		var colorElement = document.getElementById(targ.id);
		var color = colorElement.style.backgroundColor;
		this.setColor(color);
	}
}

function generateColorPickers(parentElement)
{
	var overall = 0;

	var addElementFunction = function(r,g,b) {
		// #FF0000
		var element = document.createElement('div');
		var rgb = "#" + decimalToHex(r, 2) + decimalToHex(g, 2) + decimalToHex(b, 2);
		
		element.style.backgroundColor = rgb;
		element.style.border = "1px solid black";
		element.style.height = "20px";
		element.style.width = "20px";
		
		// set the elements position within the colors box itself
		// figure out your row and column
		var row = Math.floor(overall / 3);
		var column = Math.floor(overall % 3);
		
		//alert("row = " + row + " column = " + column);
		
		// originally I had element.top instead and it apparently doesn't work
		// you really need to add that .style in there.
		element.style.position = "absolute";
		element.style.left = (column * 21) + "px";
		element.style.top = (row * 21) + "px";
		
		//element.style.cssFloat = "left";	
		//alert("overall = " + overall);
		
		element.id = "color_" + rgb;
		
		parentElement.appendChild(element);
		++overall;
	};
	
	var start = 100;
	var step = 20;
	
	// generate a bunch of colors
	for (var r = start; r <= 255; r += step) {
		addElementFunction(r,0,0);
	}
	
	for (var g = start; g <= 255; g += step) {
		addElementFunction(0,g,0);
	}

	for (var b = start; b <= 255; b += step) {
		addElementFunction(0, 0, b);
	}
}

EightBit.prototype.getCanvas = function() {
	return document.getElementById('canvas');
}

EightBit.prototype.saveImage = function() {
	var data = this.canvas.toDataURL("image/png");
	
	// create an image element, place it in our "strip" of elements
	var images = document.getElementById('images');
	var anchor = document.createElement('a');
	
	anchor.id = "image" + this.currentImageId;
	++this.currentImageId;	
	anchor.style.display = 'none';
		
	var img = document.createElement('img');
	img.src = data;
	img.className = "createdImage";
	
	anchor.href = data;
	anchor.appendChild(img);
	
	images.appendChild(anchor);
	
	// bring the image in a little slowly, gives the user a chance to
	// see it happening
	$('#' + anchor.id).fadeIn('slow');
}

EightBit.prototype.handleClick = function(e) {
	var x = e.clientX - this.canvas.offsetLeft;
	var y = e.clientY - this.canvas.offsetTop;
	this.plopFatBit(x, y);
}