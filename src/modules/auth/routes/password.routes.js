// src/modules/auth/routes/password.routes.js
const express = require("express");
const {
  forgotPassword,
  validateResetToken,
  resetPassword,
} = require("../controllers/password.controller");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", validateResetToken);
router.post("/reset-password/:token", resetPassword);

router.get("/ping", (req, res) => {
  res.send("rota de senha funcionando");
});

module.exports = router;
