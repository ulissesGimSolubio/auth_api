const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middlewares/authMiddleware");
const hasRole = require("../../../middlewares/roleMiddleware");

const {
  blockUser,
  unblockUser,
  disableUser,
  enableUser,
} = require("../controllers/user.controller");

/**
 * @swagger
 * tags:
 *   name: Users - Admin Actions
 *   description: Endpoints de administração de usuários (bloqueio, ativação, etc.)
 */

/**
 * @swagger
 * /users/{id}/block:
 *   patch:
 *     summary: Bloquear um usuário manualmente
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário bloqueado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/:id/block", authMiddleware, hasRole("ADMIN"), blockUser);

/**
 * @swagger
 * /users/{id}/unblock:
 *   patch:
 *     summary: Desbloquear um usuário manualmente
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário desbloqueado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/:id/unblock", authMiddleware, hasRole("ADMIN"), unblockUser);

/**
 * @swagger
 * /users/{id}/disable:
 *   patch:
 *     summary: Inativar um usuário
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário inativado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */ 
router.patch("/:id/disable", authMiddleware, hasRole("ADMIN"), disableUser);

/**
 * @swagger
 * /users/{id}/enable:
 *   patch:
 *     summary: Ativar um usuário
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário ativado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
router.patch("/:id/enable", authMiddleware, hasRole("ADMIN"), enableUser);

module.exports = router;
