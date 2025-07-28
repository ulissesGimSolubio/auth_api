/**
 * Configuração de ambiente
 * Carrega o arquivo .env apropriado baseado no NODE_ENV
 */

const path = require('path');

function loadEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Ordem de precedência dos arquivos .env
  const envFiles = [
    `.env.${nodeEnv}.local`,  // Ambiente específico local (não deve ser commitado)
    `.env.local`,             // Local (não deve ser commitado)
    `.env.${nodeEnv}`,        // Ambiente específico
    `.env`                    // Padrão
  ];

  // Carrega os arquivos .env na ordem de precedência
  envFiles.forEach(file => {
    const envPath = path.resolve(process.cwd(), file);
    try {
      require('dotenv').config({ path: envPath });
      console.log(`✅ Loaded environment from: ${file}`);
    } catch (error) {
      // Arquivo não encontrado, continua para o próximo
    }
  });

  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 Port: ${process.env.PORT}`);
  console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
}

module.exports = { loadEnvironment };
