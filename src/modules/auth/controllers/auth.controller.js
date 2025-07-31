const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { addHours } = require('date-fns');
const { add } = require('date-fns');
const { PrismaClient } = require('@prisma/client');
const twoFactorService = require('../services/twoFactor.service');
const { sendInviteEmail } = require('../services/inviteEmail.service');
const { validate: isUuid } = require('uuid');

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
  const { email, password, name, inviteToken } = req.body;
  const inviteRequired = process.env.INVITE_REGISTRATION_ENABLED === 'true';

  try {
    if (inviteRequired) {
      if (!inviteToken || !isUuid(inviteToken)) {
        return res.status(400).json({ error: 'Token de convite ausente ou inválido.' });
      }

      const invite = await prisma.invite.findUnique({ where: { token: inviteToken } });

      if (!invite) {
        return res.status(403).json({ error: 'Convite não encontrado.' });
      }

      if (invite.used) {
        return res.status(403).json({ error: 'Este convite já foi utilizado.' });
      }

      if (invite.email !== email) {
        return res.status(403).json({ error: 'Este convite não corresponde ao e-mail informado.' });
      }

      if (new Date() > invite.expiresAt) {
        return res.status(403).json({ error: 'Este convite está expirado.' });
      }
    }

    // Só chega aqui se tudo estiver válido
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

    if (inviteRequired) {
      await prisma.invite.update({
        where: { token: inviteToken },
        data: { used: true }
      });
    }

    return res.status(201).json({ message: 'Usuário criado com sucesso.', userId: newUser.id });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;

  const emailToFind = req.body.email;
  const user = await prisma.user.findUnique({
    where: { email: emailToFind },
    include: {
      roles: { include: { role: true } }
    }
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  await prisma.loginAttempt.create({
    data: {
      userId: user.id,
      success: passwordMatch,
      ip: req.ip,
    },
  });

  if (!passwordMatch) {
    return res.status(401).json({ message: "Credenciais inválidas" });
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

<<<<<<< Updated upstream
  // 🔐 Enviar cookie HttpOnly com o access_token
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutos
  });

  // 🔐 Enviar refresh_token também como cookie, opcionalmente
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.role.name)
    }
  });
=======
  const cookieHttpOnly = process.env.COOKIE_HTTP_ONLY === 'true';
  if (cookieHttpOnly) {
    // Cookies seguros para produção
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map(r => r.role.name)
      },
      message: 'Tokens enviados como cookies HTTP Only.'
    });
  } else {
    // Envia tokens no corpo da resposta (menos seguro)
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map(r => r.role.name)
      }
    });
  }
>>>>>>> Stashed changes
}

// Logout
async function logout(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não fornecido.' });
  }

  try {
    // Revoga o token no banco
    await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
        revoked: false,
      },
      data: { revoked: true },
    });

    // Limpa os cookies no navegador do usuário
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

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

async function sendInvite(req, res) {
  const { email } = req.body;

  // Verifica se o usuário já existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já existe.' }); // <-- está certo
  }

  // Gera token e define validade
  const token = uuidv4();
  const expiresAt = addHours(new Date(), parseInt(process.env.INVITE_TOKEN_EXPIRATION_HOURS || '24'));

  // Cria ou atualiza token no banco
  await prisma.invite.upsert({
    where: { email },
    update: { token, expiresAt, used: false },
    create: { email, token, expiresAt }
  });

  // Envia o e-mail com o link contendo o token
  await sendInviteEmail(email, token);

  return res.status(200).json({ message: 'Convite enviado com sucesso. Verifique seu e-mail.' });
}

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } }
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map(r => r.role.name),
      status: user.status,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
}

// Exports
module.exports = {
  register,
  login,
  logout,
  enableTwoFactorAuthentication,
  verifyTwoFactorAuthentication,
  refreshAccessToken,
  sendInvite,
  getProfile,
};
