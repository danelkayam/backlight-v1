const pixel = require("node-pixel");
const five = require("johnny-five");
const logger = require('../utils/logger');


const DATA_PIN = process.env.DATA_PIN;
const STRIP_LENGTH = process.env.STRIP_LENGTH;
const PARTY_ANIMATION_FPS = process.env.PARTY_ANIMATION_FPS;

// injects the default logging of the board:
five.Board.prototype.info = function(message) {
	logger.info(`Board ${message}`);
}

five.Board.prototype.debug = function(message) {
	logger.debug(`Board ${message}`);
}

five.Board.prototype.warn = function(message) {
	logger.warn(`Board ${message}`);
}

five.Board.prototype.error = function(message) {
	logger.error(`Board ${message}`);
}


let board = new five.Board({ repl: false });
let strip = null;
let partyInterval = null;


function init() {
	return new Promise((resolve, reject) => {
    	board.on("exit", () => {
      		turnOff();
    	});

    	board.on("ready", () => {
			logger.info("Board ready, preparing lights");

      		strip = new pixel.Strip({
        		data: DATA_PIN,
        		length: STRIP_LENGTH,
				board: board,
				controller: "FIRMATA",
				gamma: 2.8
      		});

			strip.on("ready", () => {
				logger.info("Lights are prepared");
				resolve();
			});

			strip.on("error", error => {
				logger.error(`Failed preparing lights: ${error}`);
				reject();
			});
    	});

		board.on("fail", event => {
			logger.error(`${event.class} sent a 'fail' message: ${event.message}`);
			reject();
		});
  });
}

function setColor(color) {
	logger.debug(`Setting color: ${color}`);

	strip.color(color);
	strip.show();
}

function startParty() {
	logger.debug("Party has started!");
	dynamicRainbow(PARTY_ANIMATION_FPS);
}

function stopParty() {
	logger.debug("Party has stopped!");

	if (partyInterval) {
		clearInterval(partyInterval);
		partyInterval = null;
	}
}

function turnOff() {
	logger.debug("Turning lights off!");
	strip.off();
}

module.exports = {
  init,
  setColor,
  startParty,
  stopParty,
  turnOff
};


function dynamicRainbow(delay) {
	let showColor;
	let cwi = 0; // colour wheel index (current position on colour wheel)

	partyInterval = setInterval(function() {
		if (++cwi > 255) {
			cwi = 0;
		}

		for (var i = 0; i < strip.length; i++) {
			showColor = colorWheel((cwi + i) & 255);
			strip.pixel(i).color(showColor);
		}

		strip.show();
	}, 1000 / delay);
}

function colorWheel(WheelPos) {
	let r, g, b;
	WheelPos = 255 - WheelPos;

	if (WheelPos < 85) {
		r = 255 - WheelPos * 3;
		g = 0;
		b = WheelPos * 3;

	} else if (WheelPos < 170) {
		WheelPos -= 85;
		r = 0;
		g = WheelPos * 3;
		b = 255 - WheelPos * 3;

	} else {
		WheelPos -= 170;
		r = WheelPos * 3;
		g = 255 - WheelPos * 3;
		b = 0;
	}

  	return "rgb(" + r + "," + g + "," + b + ")";
}