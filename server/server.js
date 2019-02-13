/**
 * Sets all server's required configurations in order to
 * lift it up properly.
 */
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const morgan = require("morgan");
const logger = require('../utils/logger');

const publicPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan("short", {
    stream: {
        write: (message, encoding) => {
            logger.info(message.replace('\n', ''));
        }
    }
}));
app.use(express.static(publicPath));


const DEAFULT_BACKLIGHT_COLOR = process.env.DEAFAULT_COLOR;

let state = {
    light: {
        enabled: false
    },
    party: {
        enabled: false
    },
    connection: {
        enabled: false
    }
};

async function init(backlight) {
    // set the current existing state.
    handleStateChanged(state, state, backlight);

    // sets connection events.
    io.sockets.on('connection', (socket) => {
        logger.debug('new connection!');
    
        socket.on('state', (data) => {
            logger.debug(`receiving new state: ${JSON.stringify(data)}`);

            let oldState = Object.assign({}, state);
            state = Object.assign(state, data);

            handleStateChanged(oldState, state, backlight);
            socket.broadcast.emit('state', state);
        });
    
        socket.emit('state', state);
    });

    return server;
};

function handleStateChanged(oldState, newState, backlight) {
    let lightsChanged = oldState.light.enabled !== newState.light.enabled;
    let partyChanged = oldState.party.enabled !== newState.party.enabled;
    let lights = newState.light.enabled;
    let party = newState.party.enabled;


    if (partyChanged) {
        logger.info(`Party mode has changed from ${!party} to ${party}`);
        // stop any existing party.
        backlight.stopParty();
        backlight.turnOff();

        if (party) {
            // starts a new party.
            backlight.startParty();

        } else {
            // no pary or it's over, turn off the lights!
            backlight.turnOff();

            if (lights) {
                backlight.setColor(DEAFULT_BACKLIGHT_COLOR);
            }
        }
    }

    if (lightsChanged) {
        logger.info(`Lights have changed from ${!lights} to ${lights}`);

        // checks whatever there is a party going on,
        // if so, we don't care.
        if (!party) {
            // there is no party, we care about the lights:
            if (lights) {
                backlight.setColor(DEAFULT_BACKLIGHT_COLOR);
            } else {
                backlight.turnOff();
            }
        }
    }
}

/**
 * Initializes the server.
 * @param {*Backlight} backlight 
 */
module.exports = { init };
