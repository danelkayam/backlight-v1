/**
 * Entry point of the application.
 * Lifts all required components and starts the server.
 */
require('dotenv').config();

const logger = require('./utils/logger');
const backlight = require("./modules/backlight");
const server = require("./server/server");

const port = process.env.PORT || 1337;

logger.info('Initializing backlight');

backlight.init()
	.then(() => {
		return server.init(backlight);
	})
	.then(server => {
		server.listen(port, () => {
			logger.info(`Server has started! port:${port}`)
		});
	})
	.catch(error => {
		logger.error(`Initialization failed: ${error.message}`);
	});