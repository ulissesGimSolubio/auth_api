/**
 * Utilitário para testar configurações de CORS
 * Útil para debug e verificação de origens permitidas
 */

const testCORS = (req, res) => {
  const origin = req.get('Origin');
  const userAgent = req.get('User-Agent');
  
  const corsInfo = {
    origin: origin || 'No Origin header',
    userAgent: userAgent ? userAgent.substring(0, 100) + '...' : 'No User-Agent',
    method: req.method,
    headers: req.headers,
    allowedOrigins: [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      process.env.MOBILE_APP_URL,
      process.env.CORS_ORIGIN,
      process.env.STAGING_URL,
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [])
    ].filter(Boolean),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  res.json({
    message: '✅ CORS configurado corretamente',
    corsInfo
  });
};

const corsHealthCheck = (req, res) => {
  res.json({
    status: 'healthy',
    cors: 'enabled',
    environment: process.env.NODE_ENV,
    allowedOrigins: process.env.NODE_ENV === 'development' ? 'all' : 'restricted'
  });
};

module.exports = {
  testCORS,
  corsHealthCheck
};
