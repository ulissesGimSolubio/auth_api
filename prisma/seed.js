const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' }
  });

   const solicitanteRole = await prisma.role.upsert({
    where: { name: 'SOLICITANTE' },
    update: {},
    create: { name: 'SOLICITANTE' }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'devadmin@authapi.com' },
    update: {},
    create: {
      email: 'devadmin@authapi.com',
      name: 'Dev Admin',
      password: await bcrypt.hash('admin123', 10),
    }
  });

  const solicitanteUser = await prisma.user.upsert({
    where: { email: 'devsolicitante@authapi.com' },
    update: {},
    create: {
      email: 'devsolicitante@authapi.com',
      name: 'Dev Solicitante',
      password: await bcrypt.hash('admin123', 10),
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: solicitanteUser.id,
        roleId: solicitanteRole.id,
      },
    },
    update: {},
    create: {
      userId: solicitanteUser.id,
      roleId: solicitanteRole.id,
    },
  });

  console.log('Seeds criados com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
