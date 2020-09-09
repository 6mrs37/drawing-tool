function smallPoint(column, row) {
	ctx.fillStyle = "hsl(0,0%,0%)";
	ctx.beginPath();
	ctx.arc((column + 0.5) * sliderSpacing.value, (row + 0.5) * sliderSpacing.value,
		sliderSpacing.value / 10, 0, 2 * Math.PI, false);
	ctx.fill();
}

function bigPoint(column, row) {
	ctx.fillStyle = "hsl(0,0%,50%)";
	ctx.beginPath();
	ctx.arc((column + 0.5) * sliderSpacing.value, (row + 0.5) * sliderSpacing.value,
		sliderSpacing.value / 3, 0, 2 * Math.PI, false);
	ctx.fill();
	smallPoint(column, row);
}

function clearPoint(column, row) {
	ctx.fillStyle = "hsl(0,0%,100%)";
	ctx.beginPath();
	ctx.arc((column + 0.5) * sliderSpacing.value, (row + 0.5) * sliderSpacing.value,
		sliderSpacing.value / 2, 0, 2 * Math.PI, false);
	ctx.fill();
	smallPoint(column, row);
}

function drawDots() {
	for (let i = 0; i < perRow; i++) {
		for (let j = 0; j < perColumn; j++) {
			smallPoint(i,j);
		}
	}
}

function drawLines() {
	for (let i = 0; i < lineArray.length; i ++) {
		ctx.strokeStyle = "hsl(" 
			+ lineArray[i].hue + "," 
			+ lineArray[i].saturation + "%,"
			+ lineArray[i].lightness + "%)";
		ctx.lineWidth = lineArray[i].width;
		ctx.beginPath();
		ctx.moveTo((lineArray[i][0] + 0.5) * sliderSpacing.value,
			(lineArray[i][1] + 0.5) * sliderSpacing.value);
		ctx.lineTo((lineArray[i][2] + 0.5) * sliderSpacing.value,
			(lineArray[i][3] + 0.5) * sliderSpacing.value);
		ctx.stroke();
	}
	if (selectedNode !== null) {
		ctx.strokeStyle = "hsla(" 
			+ lineArray[selectedNode].hue + "," 
			+ lineArray[selectedNode].saturation + "%,"
			+ lineArray[selectedNode].lightness + "%,70%)";
		ctx.lineWidth = 2 * lineArray[selectedNode].width + 10;
		ctx.beginPath();
		ctx.moveTo((lineArray[selectedNode][0] + 0.5) * sliderSpacing.value, (lineArray[selectedNode][1] + 0.5) * sliderSpacing.value);
		ctx.lineTo((lineArray[selectedNode][2] + 0.5) * sliderSpacing.value, (lineArray[selectedNode][3] + 0.5) * sliderSpacing.value);
		ctx.stroke();
	}
}

function redrawNoEvent() {
	/*This is titled as such because it redraws the canvas but does not
	take an event parameter like the other redraw.*/
	//dottedCanvas.width = $("body").width() / 2;
	//perRow = dottedCanvas.width / sliderSpacing.value;
	//perColumn = dottedCanvas.height / sliderSpacing.value;
	ctx.fillStyle = "hsl(0,0%,100%)";
	ctx.fillRect(0, 0, dottedCanvas.width, dottedCanvas.height); //Clears canvas
	drawLines();
	if (dotsOn) { //dotsOn is controlled by a button (with id "hide-dots").
		drawDots();
	}
	if (selectedNode !== null) {
		lineArray[selectedNode]["width"] = currentWidth;
		lineArray[selectedNode]["hue"] = currentHue;
		lineArray[selectedNode]["saturation"] = currentSaturation;
		lineArray[selectedNode]["lightness"] = currentLightness;
	}
}

function redraw(event) {
	clearPoint(previousTouched[0], previousTouched[1]);
	redrawNoEvent();
	let column = Math.floor((event.pageX - dottedCanvas.offsetLeft)
		/ sliderSpacing.value);
	let row = Math.floor((event.pageY - dottedCanvas.offsetTop)
		/ sliderSpacing.value);

	bigPoint(column, row);
	previousTouched = [column, row];
	if (previousClicked) {
		ctx.strokeStyle = "hsla(" 
			+ currentHue + "," 
			+ currentSaturation + "%," 
			+ currentLightness + "%,50%)";
		ctx.lineWidth = currentWidth;
		ctx.beginPath();
		ctx.moveTo((previousClicked[0] + 0.5) * sliderSpacing.value,
			(previousClicked[1] + 0.5) * sliderSpacing.value);
		ctx.lineTo((column + 0.5) * sliderSpacing.value, (row + 0.5) * sliderSpacing.value);
		ctx.stroke();
	}
}

function click(event) {
	let column = Math.floor((event.pageX - dottedCanvas.offsetLeft) / sliderSpacing.value);
	let row = Math.floor((event.pageY - dottedCanvas.offsetTop) / sliderSpacing.value);
	if (animating) {
	} else if (previousClicked) {
		if (edit.checked) {
			const key = makeKey(previousClicked[0], previousClicked[1],
				column, row);
			selectedNode = find(key);
				if (selectedNode !== null) {
					sliderWidth.value = lineArray[selectedNode]["width"];
					textWidth.value = lineArray[selectedNode]["width"];
					currentWidth = lineArray[selectedNode]["width"];
			
					sliderHue.value = lineArray[selectedNode]["hue"];
					textHue.value = lineArray[selectedNode]["hue"];
					currentHue = lineArray[selectedNode]["hue"];
			
					sliderSaturation.value = lineArray[selectedNode]["saturation"];
					textSaturation.value = lineArray[selectedNode]["saturation"];
					currentSaturation = lineArray[selectedNode]["saturation"];
			
					sliderLightness.value = lineArray[selectedNode]["lightness"];
					textLightness.value = lineArray[selectedNode]["lightness"];
					currentLightness = lineArray[selectedNode]["lightness"];
				}
		} else {
			addToLineArray(previousClicked[0], previousClicked[1],
				column, row);
		}
		previousClicked = undefined;
		redraw(event);
	} else {
		previousClicked = [column,row];
	}
}

function resizeStuff() {
	if (window.innerWidth < 900) {
		dottedCanvas.width = sliderSpacing.value * Math.floor((window.innerWidth - 20) / sliderSpacing.value);
	} else {
		dottedCanvas.width = sliderSpacing.value * Math.floor((window.innerWidth - 300) / sliderSpacing.value);
	}
	dottedCanvas.height = sliderSpacing.value * Math.floor((window.innerHeight - 20) / sliderSpacing.value);
	perRow = dottedCanvas.width / sliderSpacing.value;
	perColumn = dottedCanvas.height / sliderSpacing.value;
	redrawNoEvent();
}

function makeKey(x1, y1, x2, y2) {
	let good;
	if (x1 < x2) {
		good = true;
	} else if (x1 === x2){
		if (y1 < y2) {
			good = true;
		} else if (y1 > y2) {
			good = false;
		} else {
			return;
		};
	} else {
		good = false;
	}
	let key;
	if (good) {
		key = perRow * x1 + y1;
		key = perColumn * key + x2;
		key = perRow * key + y2;
	} else {
		key = perRow * x2 + y2;
		key = perColumn * key + x1;
		key = perRow * key + y1;
	}
	return key;
}

function find(key) { //finish
	/* 
	This function takes in a key and finds to which node it belongs. 
	*/
	let currentNode = 0;
	if (lineArray.length) {
		while (currentNode !== undefined) {
			if (lineArray[currentNode]["key"] === key) {
				return currentNode;
			} else if (lineArray[currentNode]["key"] > key) {
				currentNode = lineArray[currentNode]["leftChild"];
			} else {
				currentNode = lineArray[currentNode]["rightChild"];
			}
		}
	}
	return null;
}

function toCoordinates(key) {
	const y2 = key % perRow;
	let leftover = Math.floor(key / perRow);
	const x2 = leftover % perColumn;
	leftover = Math.floor(key / perColumn);
	const y1 = leftover % perRow;
	leftover = Math.floor(key / perRow);
	const x1 = leftover;
	return {0: x1, 1: y1, 2: x2, 3: y2};
}

function addToLineArray(x1,y1,x2,y2) {
	lineArray.push({
		0: x1,
		1: y1,
		2: x2,
		3: y2,
		hue: currentHue, 
		saturation: currentSaturation, 
		lightness: currentLightness, 
		width: currentWidth,
		key: makeKey(x1, y1, x2, y2)
	});
	
	if (lineArray.length > 1) {
		sortLast();
	};
}

function sortLast() {
	const lastIndex = lineArray.length - 1;
	let currentNode = 0;
	while (currentNode !== null) {
		if (lineArray[currentNode].key < lineArray[lastIndex].key) {
			if (lineArray[currentNode].rightChild === undefined) {
				lineArray[currentNode].rightChild = lastIndex;
				lineArray[lastIndex].parent = currentNode;
				currentNode = null;
			} else {
				currentNode = lineArray[currentNode].rightChild;
			};
		} else {
			if (lineArray[currentNode].leftChild === undefined) {
				lineArray[currentNode].leftChild = lastIndex;
				lineArray[lastIndex].parent = currentNode;
				currentNode = null;
			} else {
				currentNode = lineArray[currentNode].leftChild;
			}
		}
	}
}

function undo() {
	if (!animating) {
		const oldLine = lineArray.pop();
		if (selectedNode === lineArray.length) {
			selectedNode = null;
		}
		if (lineArray.length) {
			if (lineArray[oldLine.parent].leftChild === lineArray.length) {
				lineArray[oldLine.parent].leftChild = undefined;
			} else {
				lineArray[oldLine.parent].rightChild = undefined;
			}
		}
		redrawNoEvent();
	}
}

function erase(node) {
	if (selectedNode === node) {
		selectedNode = null;
	}
	const oldLine = lineArray.splice(node, 1);
	
	if (leftChild || rightChild) {
	
	}
	
	if (node) {
		if (lineArray[oldLine.parent].leftChild === lineArray.length) {
			lineArray[oldLine.parent].leftChild = undefined;
		} else {
			lineArray[oldLine.parent].rightChild = undefined;
		}
	}
	
}

function displayCode() {
	let toPrint = '[';
	for (let i = 0; i < lineArray.length; i++) {
		toPrint = toPrint.concat('{');
		for (const [key, value] of Object.entries(lineArray[i])) {
			if (value !== undefined) {
				toPrint = toPrint.concat('"' + key + '": ' + value + ', ');
			}
		};
		toPrint = toPrint.slice(0, -2).concat('}, ');
	};
	toPrint = toPrint.slice(0, -2).concat(']');
	$('#drawing-code').text(toPrint);
}

function randomLines() {
	//lineArray = [];
	makeNew.checked = true;
	selectedNode = null;
	const oldHue = currentHue; //Saves old color
	const oldSaturation = currentSaturation;
	const oldLightness = currentLightness;
	for (i = 0; i < 100; i++) {
		currentHue = Math.floor(360 * Math.random()); //Randomizes color
		currentSaturation = Math.floor(100 * Math.random());
		currentLightness = Math.floor(100 * Math.random());
		addToLineArray( //Randomizes placement of line
	Math.floor(perRow * Math.random()), 
	Math.floor(perColumn * Math.random()),
	Math.floor(perRow * Math.random()),
	Math.floor(perColumn * Math.random())
		);
	}
	currentHue = oldHue; //Makes it so that the user's color is
	currentSaturation = oldSaturation; //not changed by randomLines
	currentLightness = oldLightness;
	redrawNoEvent();
}

makeNew.oninput = function() {
	selectedNode = null;
};
sliderWidth.oninput = function() { 
	textWidth.value = this.value;
	currentWidth = Number(this.value);
	redrawNoEvent();
};
textWidth.oninput = function() {
	sliderWidth.value = this.value;
	this.value = sliderWidth.value;
	currentWidth = Number(this.value);
	redrawNoEvent();
};
sliderHue.oninput = function() { 
	textHue.value = this.value;
	currentHue = this.value; 
	redrawNoEvent();
};
textHue.oninput = function() {
	sliderHue.value = this.value;
	this.value = sliderHue.value;
	currentHue = this.value;
	redrawNoEvent();
};
sliderSaturation.oninput = function() { 
	textSaturation.value = this.value;
	currentSaturation = this.value; 
	redrawNoEvent();
};
textSaturation.oninput = function() {
	sliderSaturation.value = this.value;
	this.value = sliderSaturation.value;
	currentSaturation = this.value;
	redrawNoEvent();
};
sliderLightness.oninput = function() { 
	textLightness.value = this.value;
	currentLightness = this.value;
	redrawNoEvent(); 
};
textLightness.oninput = function() {
	sliderLightness.value = this.value;
	this.value = sliderLightness.value;
	currentLightness = this.value;
	redrawNoEvent();
};
sliderSpacing.oninput = function() {
	textSpacing.value = this.value;
	resizeStuff();
};
textSpacing.oninput = function() {
	sliderSpacing.value = this.value;
	resizeStuff();
};

const dottedCanvas = document.getElementById("dottedCanvas");
const ctx = dottedCanvas.getContext("2d");
let perRow = dottedCanvas.width / sliderSpacing.value;
let perColumn = dottedCanvas.height / sliderSpacing.value;
let currentWidth = 5;
let currentHue = 0; //Starting color is black
let currentSaturation = 0;
let currentLightness = 0;
let selectedNode = null;
let dotsOn = true;
let animating = false;
let lineArray = [];
let previousTouched = [-1, -1];
let previousClicked;
resizeStuff();
$(window).resize(resizeStuff);
$("#dottedCanvas").mousemove(redraw);
$("#dottedCanvas").click(click);