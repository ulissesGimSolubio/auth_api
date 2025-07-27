const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

async function validateDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao PostgreSQL via Prisma');
  } catch (error) {
    console.error('❌ Falha ao conectar no banco de dados:', error);
    process.exit(1);
  }
}

module.exports = {
  prisma,
  validateDatabaseConnection
};
