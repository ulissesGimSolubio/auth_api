const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');
const hasRole = require('../../../middlewares/roleMiddleware');

const { login } = require("../controllers/auth.controller");
const limitLoginAttempts = require("../../../middlewares/limitLoginAttempts");

const allowedRoles = process.env.INVITE_ALLOWED_ROLES?.split(',') || [];

// Rota de registro de novo usuário
router.post('/register', authController.register);

// Rota de login (retorna token ou sinaliza se 2FA é necessário)
router.post('/login', limitLoginAttempts, login);

// Rota de login com limite de tentativas
router.post("/login", limitLoginAttempts, login);

// Nova rota de logout protegida
router.post('/logout', authMiddleware, authController.logout);

// Rota para habilitar 2FA (retorna QR code)
router.post('/enable-2fa', authController.enableTwoFactorAuthentication);

// Rota para verificar o token 2FA e gerar token JWT
router.post('/verify-2fa', authController.verifyTwoFactorAuthentication);

// Rota para renovar o token de acesso
router.post('/refresh-token', authController.refreshAccessToken);

// ✅ Enviar convite (proteção por roles via .env)
router.post('/invite', authMiddleware, hasRole(...allowedRoles), authController.sendInvite);

module.exports = router;
