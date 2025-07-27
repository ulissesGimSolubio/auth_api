const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Rota de registro de novo usuário
router.post('/register', authController.register);

// Rota de login (retorna token ou sinaliza se 2FA é necessário)
router.post('/login', authController.login);

// Nova rota de logout protegida
router.post('/logout', authMiddleware, authController.logout);

// Rota para habilitar 2FA (retorna QR code)
router.post('/enable-2fa', authController.enableTwoFactorAuthentication);

// Rota para verificar o token 2FA e gerar token JWT
router.post('/verify-2fa', authController.verifyTwoFactorAuthentication);

// Rota para renovar o token de acesso
router.post('/refresh-token', authController.refreshAccessToken);

module.exports = router;
