/**
 * Sistema de Logs configurável por ambiente
 */

const winston = require('winston');

// Configuração baseada nas variáveis de ambiente
const logLevel = process.env.LOG_LEVEL || 'info';
const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProduction 
      ? winston.format.json() // JSON em produção
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
  ),
  transports: [
    // Console sempre presente
    new winston.transports.Console(),
    
    // Arquivo apenas em produção
    ...(isProduction ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log' 
      })
    ] : [])
  ]
});

// Debug wrapper baseado na variável DEBUG
const debug = (message, data = null) => {
  if (process.env.DEBUG === 'true') {
    logger.debug(message, data);
  }
};

module.exports = { logger, debug };
