/**
 * Configuração de Rate Limiting baseada no ambiente
 */

const rateLimit = require('express-rate-limit');
const { logger } = require('./logger');

// Rate limit geral
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente mais tarde.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60) // em minutos
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas requisições deste IP, tente novamente mais tarde.'
    });
  }
});

// Rate limit mais restritivo para login/auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // 5 tentativas em prod, 20 em dev
  message: {
    error: 'Muitas tentativas de login, tente novamente em 15 minutos.'
  },
  skipSuccessfulRequests: true, // Não conta requests bem-sucedidos
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Route: ${req.path}`);
    res.status(429).json({
      error: 'Muitas tentativas de login, tente novamente em 15 minutos.'
    });
  }
});

// Rate limit para registro/convites
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por hora por IP
  message: {
    error: 'Muitas tentativas de registro, tente novamente em 1 hora.'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter
};
