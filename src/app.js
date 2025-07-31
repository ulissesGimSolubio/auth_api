const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { configureCORS } = require('./config/cors');
const { generalLimiter, authLimiter, registerLimiter } = require('./config/rateLimiting');
const { logger } = require('./config/logger');
const { testCORS, corsHealthCheck } = require('./utils/corsTest');

const authRoutes = require('./modules/auth/routes/auth.routes');
const passwordRoutes = require('./modules/auth/routes/password.routes');
const userRoutes = require("./modules/users/routes/user.routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Segurança básica
app.use(helmet());
app.use(configureCORS());

// Rate limiting
app.use(generalLimiter);

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rotas de teste/debug (remover em produção se necessário)
app.get('/api/cors-test', testCORS);
app.get('/api/health/cors', corsHealthCheck);

// Rotas com rate limiting específico
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/invite', registerLimiter);

// Rotas modulares
app.use('/api/auth', authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/users", userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Protected route (example, can be moved later)
app.get('/profile', authMiddleware, (req, res) => {
    return res.json({ message: `Usuário autenticado: ${req.user.email}. Acesso concedido com sucesso.` });
});

module.exports = app;
