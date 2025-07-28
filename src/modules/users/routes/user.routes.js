const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middlewares/authMiddleware");
const hasRole = require("../../../middlewares/roleMiddleware");

const {
  // Operações administrativas (segurança)
  blockUser,
  unblockUser,
  disableUser,
  enableUser,
  
  // Gestão de roles
  assignRole,
  removeRole,
  
  // Consultas
  listUsers,
  getUserById,
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

// ===== GESTÃO DE ROLES =====

/**
 * @swagger
 * /users/{userId}/roles:
 *   post:
 *     summary: Atribuir role a um usuário
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: number
 *                 description: ID da role a ser atribuída
 */
router.post("/:userId/roles", authMiddleware, hasRole("ADMIN"), assignRole);

/**
 * @swagger
 * /users/{userId}/roles/{roleId}:
 *   delete:
 *     summary: Remover role de um usuário
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/:userId/roles/:roleId", authMiddleware, hasRole("ADMIN"), removeRole);

// ===== CONSULTAS ADMINISTRATIVAS =====

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários (paginado)
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 */
router.get("/", authMiddleware, hasRole("ADMIN", "COORDENADOR"), listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID (com detalhes administrativos)
 *     tags: [Users - Admin Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:id", authMiddleware, hasRole("ADMIN", "COORDENADOR"), getUserById);

module.exports = router;
