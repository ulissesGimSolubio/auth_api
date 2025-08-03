// src/modules/auth/controllers/password.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const { sendPasswordResetEmail } = require("../services/email.service");
const { generateResetToken } = require("../services/token.service");

const prisma = new PrismaClient();

async function forgotPassword(req, res) {
  const { email } = req.body;

  const emailToFind = req.body.email;
const user = await prisma.user.findUnique({
  where: { email: emailToFind },
  include: {
    roles: { include: { role: true } }
  }
});

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
  const { newPassword } = req.body;

  const resetEntry = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetEntry || resetEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetEntry.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  res.json({ message: "Senha atualizada com sucesso" });
}

// Altera a senha do usuário autenticado
async function changePassword(req, res) {
  try {
    const userId = req.user.id; // req.user deve ser preenchido pelo middleware de autenticação
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
}

module.exports = {
  forgotPassword,
  validateResetToken,
  resetPassword,
  changePassword,
};
