// src/middlewares/limitLoginAttempts.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 10;

module.exports = async function limitLoginAttempts(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return next();

  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const recentAttempts = await prisma.loginAttempt.findMany({
    where: {
      userId: user.id,
      attemptAt: { gte: since },
    },
    orderBy: { attemptAt: "desc" },
  });

  const failedAttempts = recentAttempts.filter(a => !a.success).length;

  if (failedAttempts >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: `Muitas tentativas de login. Tente novamente em ${WINDOW_MINUTES} minutos.`,
    });
  }

  req.bruteUser = user;

  next();
};
