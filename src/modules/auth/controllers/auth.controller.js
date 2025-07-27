const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../../../generated/prisma');
const twoFactorService = require('../services/twoFactor.service');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || '1h';


async function register(req, res) {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso.', userId: newUser.id });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error); // 👈 mostra o erro real no terminal
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.twoFactorEnabled) {
      return res.status(200).json({ twoFactorRequired: true, userId: user.id });
    }

    const roles = user.roles.map(r => r.role.name);

    const token = jwt.sign({ userId: user.id, roles }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no login.' });
  }
}

async function enableTwoFactorAuthentication(req, res) {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const { base32, otpauthUrl } = twoFactorService.generateTwoFactorSecret(user.email);
    const qrCode = await twoFactorService.generateQRCode(otpauthUrl);

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: base32,
        twoFactorEnabled: true
      }
    });

    return res.status(200).json({ qrCode });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao ativar 2FA.' });
  }
}

async function verifyTwoFactorAuthentication(req, res) {
  const { userId, token } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: '2FA não configurado.' });
    }

    const isTokenValid = twoFactorService.verifyToken(user.twoFactorSecret, token);

    if (!isTokenValid) {
      return res.status(401).json({ error: 'Código 2FA inválido.' });
    }

    const roles = user.roles.map(r => r.role.name);
    const accessToken = jwt.sign({ userId: user.id, roles }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    return res.status(200).json({ token: accessToken });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar 2FA.' });
  }
}

module.exports = {
  register,
  login,
  enableTwoFactorAuthentication,
  verifyTwoFactorAuthentication
};
