import winston from 'winston';

const logger = winston.createLogger({
  levels: { error: 0, warn: 1, verbose: 2, info: 3 },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((info) => `[${info.clientId ?? 'SERVER'}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
});

export default logger;