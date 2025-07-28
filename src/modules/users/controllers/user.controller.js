const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function blockUser(req, res) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id: Number(id) },
    data: { blocked: true },
  });

  res.json({ message: "Usuário bloqueado com sucesso." });
}

async function unblockUser(req, res) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id: Number(id) },
    data: { blocked: false },
  });

  res.json({ message: "Usuário desbloqueado com sucesso." });
}

async function disableUser(req, res) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id: Number(id) },
    data: { active: false },
  });

  res.json({ message: "Usuário inativado com sucesso." });
}

async function enableUser(req, res) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id: Number(id) },
    data: { active: true },
  });

  res.json({ message: "Usuário ativado com sucesso." });
}

module.exports = {
  blockUser,
  unblockUser,
  disableUser,
  enableUser,
};
