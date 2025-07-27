function hasRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
    }

    next();
  };
}

module.exports = hasRole;
