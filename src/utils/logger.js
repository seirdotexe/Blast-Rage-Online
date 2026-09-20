import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  exitOnError: false,
  handleExceptions: true,
  handleRejections: true,
  levels: { error: 0, warn: 1, verbose: 2, info: 3 }
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple())
}));

export default logger;