const winston = require('winston');

const logger = winston.createLogger({
  level:'info',
  format:winston.format.json(),
  transports:[], //TODO:should have a transport in production..
});

if(process.env.NODE_ENV !== 'production'){
  logger.add(new winston.transports.Console({
    format:winston.format.simple()
  }));
}

module.exports = logger;
