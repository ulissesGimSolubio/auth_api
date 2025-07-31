const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');
const hasRole = require('../../../middlewares/roleMiddleware');

const { login } = require("../controllers/auth.controller");
const limitLoginAttempts = require("../../../middlewares/limitLoginAttempts");

const allowedRoles = ["ADMIN", "COORDENADOR"];

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação, login, 2FA e tokens
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação ou usuário já existe
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário (com 2FA se necessário)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login bem-sucedido ou necessidade de 2FA
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', limitLoginAttempts, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout do usuário (requer autenticação)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /auth/enable-2fa:
 *   post:
 *     summary: Habilitar autenticação em duas etapas (2FA)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: QR Code retornado
 */
router.post('/enable-2fa', authController.enableTwoFactorAuthentication);

/**
 * @swagger
 * /auth/verify-2fa:
 *   post:
 *     summary: Verificar código 2FA e emitir token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Token JWT retornado
 *       401:
 *         description: Código 2FA inválido
 */
router.post('/verify-2fa', authController.verifyTwoFactorAuthentication);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renovar token de acesso usando refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Novo token de acesso gerado
 *       401:
 *         description: Refresh token inválido ou expirado
 */
router.post('/refresh-token', authController.refreshAccessToken);

/**
 * @swagger
 * /auth/invite:
 *   post:
 *     summary: Enviar convite para registro (apenas ADMIN e COORDENADOR)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Convite enviado com sucesso
 *       403:
 *         description: Acesso negado (role inválida)
 */
router.post('/invite', authMiddleware, hasRole(...allowedRoles), authController.sendInvite);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
