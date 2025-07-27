const app = require('./src/app');
const { validateDatabaseConnection } = require('./src/config/dbConnection');

const PORT = process.env.PORT || 3000;

async function startServer() {
  await validateDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
