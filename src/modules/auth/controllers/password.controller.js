// src/modules/auth/controllers/password.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const { sendPasswordResetEmail } = require("../services/email.service");
const { generateResetToken } = require("../services/token.service");

const prisma = new PrismaClient();

async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(200).json({ message: "Se existir, o e-mail foi enviado" });

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  console.log("✅ [forgotPassword] Gerando token para:", email);
  console.log("🔑 Token:", token);

  await sendPasswordResetEmail(email, token);
  res.json({ message: "E-mail de redefinição enviado" });
}

async function validateResetToken(req, res) {
  const { token } = req.params;

  const resetEntry = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetEntry || resetEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }

  res.json({ message: "Token válido" });
}

async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const resetEntry = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetEntry || resetEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetEntry.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  res.json({ message: "Senha atualizada com sucesso" });
}

module.exports = {
  forgotPassword,
  validateResetToken,
  resetPassword,
};
