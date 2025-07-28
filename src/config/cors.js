/**
 * Configuração de CORS baseada no ambiente
 * Suporta múltiplos domínios
 */

const cors = require('cors');

const configureCORS = () => {
  const corsOptions = {
    origin: function (origin, callback) {
      // Em desenvolvimento, permite qualquer origem
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      // Lista de origens permitidas (suporta múltiplos domínios)
      const allowedOrigins = [
        process.env.FRONTEND_URL,           // Frontend principal
        process.env.ADMIN_URL,              // Admin panel
        process.env.MOBILE_APP_URL,         // App mobile
        process.env.CORS_ORIGIN,            // Origem principal
        process.env.STAGING_URL,            // Ambiente de staging
        // Adicione mais domínios conforme necessário
        'https://app.seudominio.com',
        'https://admin.seudominio.com',
        'https://staging.seudominio.com'
      ].filter(Boolean); // Remove valores undefined/null/empty

      // Suporte a múltiplos domínios via string separada por vírgula
      if (process.env.ALLOWED_ORIGINS) {
        const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
        allowedOrigins.push(...additionalOrigins);
      }

      // Remove duplicatas
      const uniqueOrigins = [...new Set(allowedOrigins)];

      console.log('🌐 Allowed origins:', uniqueOrigins);

      // Permite requisições sem origin (ex: Postman, apps mobile)
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(new Error(`Origem ${origin} não permitida pelo CORS`));
      }
    },
    credentials: true, // Permite cookies e headers de autenticação
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'X-API-Key',
      'X-Client-Version',
      'Accept',
      'Origin'
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Rate-Limit-Remaining',
      'X-Rate-Limit-Reset'
    ],
    optionsSuccessStatus: 200 // Para suporte a browsers legados
  };

  return cors(corsOptions);
};

module.exports = { configureCORS };
