const express = require('express');
const authRoutes = require('./modules/auth/routes/auth.routes');
const passwordRoutes = require('./modules/auth/routes/password.routes');
const userRoutes = require("./modules/users/routes/user.routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(express.json());

// Modular route prefix
app.use('/api/auth', authRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/users", userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Protected route (example, can be moved later)
app.get('/profile', authMiddleware, (req, res) => {
    return res.json({ message: `Usuário autenticado: ${req.user.email}. Acesso concedido com sucesso.` });
});

module.exports = app;
