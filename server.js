const { loadEnvironment } = require('./src/config/environment');
loadEnvironment();

const app = require('./src/app');
const { validateDatabaseConnection } = require('./src/config/dbConnection');
const { runConfigCheck } = require('./scripts/check-cookie-config');

const PORT = process.env.PORT || 3000;

async function startServer() {
  await validateDatabaseConnection();
  
  // Verifica configuração de cookies
  runConfigCheck();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
    console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
  });
}

startServer();
