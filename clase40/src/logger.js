import winston from 'winston';

// silly 6
// debug 5
// verbose 4
// info 3
// warn 2
// error 1

function buildLogger() {
    const prodLogger = winston.createLogger({
        transports: [
            new winston.transports.Console({ level: 'info' }),
            new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
            new winston.transports.File({ filename: 'error.log', level: 'error' })
        ]
    });
    return prodLogger;
}

const logger = buildLogger();

export default logger;