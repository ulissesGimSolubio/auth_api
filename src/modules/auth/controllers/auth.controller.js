const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { add } = require('date-fns');
const { PrismaClient } = require('@prisma/client');
const twoFactorService = require('../services/twoFactor.service');

const prisma = new PrismaClient();

// ENV configs
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Helpers
function generateAccessToken(user) {
  const roles = user.roles.map(r => r.role.name);
  return jwt.sign({ userId: user.id, roles }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

// Register
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
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
}

// Login
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: add(new Date(), { days: 7 })
      }
    });

    return res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro no login.' });
  }
}

// Logout
async function logout(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não fornecido.' });
  }

  try {
    const updated = await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
        revoked: false
      },
      data: {
        revoked: true
      }
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Token não encontrado ou já revogado.' });
    }

    return res.status(200).json({ message: 'Logout realizado com sucesso.' });

  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    return res.status(500).json({ error: 'Erro interno ao revogar o token.' });
  }
}

// Enable 2FA
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
    console.error('Erro ao ativar 2FA:', error);
    return res.status(500).json({ error: 'Erro ao ativar 2FA.' });
  }
}

// Verify 2FA
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: add(new Date(), { days: 7 })
      }
    });

    return res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    console.error('Erro ao verificar 2FA:', error);
    return res.status(500).json({ error: 'Erro ao verificar 2FA.' });
  }
}

// Refresh Token
async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não fornecido.' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        revoked: false
      }
    });

    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const newAccessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

// Exports
module.exports = {
  register,
  login,
  logout,
  enableTwoFactorAuthentication,
  verifyTwoFactorAuthentication,
  refreshAccessToken
};
