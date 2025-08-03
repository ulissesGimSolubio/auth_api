// src/modules/auth/routes/password.routes.js
const express = require("express");
const {
  forgotPassword,
  validateResetToken,
  resetPassword,
  changePassword,
} = require("../controllers/password.controller");
const authMiddleware = require("../../../middlewares/authMiddleware"); // ajuste o caminho se necessário

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Password
 *   description: Recuperação e redefinição de senha
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Enviar e-mail para redefinição de senha
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@exemplo.com
 *     responses:
 *       200:
 *         description: E-mail de redefinição enviado
 *       400:
 *         description: E-mail inválido ou não encontrado
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   get:
 *     summary: Validar token de redefinição de senha
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token enviado por e-mail
 *     responses:
 *       200:
 *         description: Token válido
 *       400:
 *         description: Token inválido ou expirado
 */
router.get("/reset-password/:token", validateResetToken);


/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Redefinir senha com token válido
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de redefinição de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NovaSenha@123
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou erro de validação
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Alterar senha do usuário autenticado
 *     tags: [Password]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: MinhaSenhaAtual@123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NovaSenha@123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Erro de validação ou senha atual incorreta
 *       401:
 *         description: Não autenticado
 */
router.post("/change-password", authMiddleware, changePassword);

/**
 * @swagger
 * /auth/ping:
 *   get:
 *     summary: Testar rota de senha
 *     tags: [Password]
 *     responses:
 *       200:
 *         description: Rota respondendo corretamente
 */
router.get("/ping", (req, res) => {
  res.send("rota de senha funcionando");
});

module.exports = router;
