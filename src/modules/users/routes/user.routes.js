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

// Bloqueio manual
router.patch("/:id/block", authMiddleware, hasRole("ADMIN"), blockUser);
router.patch("/:id/unblock", authMiddleware, hasRole("ADMIN"), unblockUser);

// Ativação/inativação
router.patch("/:id/disable", authMiddleware, hasRole("ADMIN"), disableUser);
router.patch("/:id/enable", authMiddleware, hasRole("ADMIN"), enableUser);

module.exports = router;
