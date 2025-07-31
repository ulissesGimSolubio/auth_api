const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const cookieHttpOnly = process.env.COOKIE_HTTP_ONLY === 'true';
  let token;

  if (cookieHttpOnly) {
    // Tenta obter o token do cookie
    token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso não encontrado nos cookies.' });
    }
  } else {
    // Modo tradicional: obtém token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    token = authHeader.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      roles: decoded.roles
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
