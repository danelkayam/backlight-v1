const winston = require('winston');
const config = winston.config;

const formatter = (options) => {
    return new Date().toISOString() + ' ' 
            + config.colorize(options.level, options.level.toUpperCase()) + ' '
            + options.message;
}

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL,
            json: false,
            colorize: true,
            formatter
        })
    ]
});

module.exports = logger;