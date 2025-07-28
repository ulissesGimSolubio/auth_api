const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===== OPERAÇÕES ADMINISTRATIVAS (Segurança) =====
async function blockUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { blocked: true },
    });

    res.json({ message: "Usuário bloqueado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao bloquear usuário." });
  }
}

async function unblockUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { blocked: false },
    });

    res.json({ message: "Usuário desbloqueado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao desbloquear usuário." });
  }
}

async function disableUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { active: false },
    });

    res.json({ message: "Usuário inativado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao inativar usuário." });
  }
}

async function enableUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { active: true },
    });

    res.json({ message: "Usuário ativado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao ativar usuário." });
  }
}

// ===== GESTÃO DE ROLES (Autorização) =====
async function assignRole(req, res) {
  const { userId } = req.params;
  const { roleId } = req.body;

  try {
    await prisma.userRole.create({
      data: {
        userId: Number(userId),
        roleId: Number(roleId),
      },
    });

    res.json({ message: "Role atribuída com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atribuir role." });
  }
}

async function removeRole(req, res) {
  const { userId, roleId } = req.params;

  try {
    await prisma.userRole.deleteMany({
      where: {
        userId: Number(userId),
        roleId: Number(roleId),
      },
    });

    res.json({ message: "Role removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover role." });
  }
}

// ===== CONSULTAS ADMINISTRATIVAS =====
async function listUsers(req, res) {
  const { page = 1, limit = 10, status, role } = req.query;
  const skip = (page - 1) * limit;

  try {
    const whereClause = {};
    
    if (status === 'active') whereClause.active = true;
    if (status === 'inactive') whereClause.active = false;
    if (status === 'blocked') whereClause.blocked = true;

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where: whereClause });

    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
        blocked: user.blocked,
        createdAt: user.createdAt,
        roles: user.roles.map(ur => ur.role.name),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        loginAttempts: {
          orderBy: { attemptAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      active: user.active,
      blocked: user.blocked,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map(ur => ur.role.name),
      recentLoginAttempts: user.loginAttempts,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
}

module.exports = {
  // Operações administrativas (segurança)
  blockUser,
  unblockUser,
  disableUser,
  enableUser,  
  // Gestão de roles
  assignRole,
  removeRole,  
  // Consultas
  listUsers,
  getUserById,
};
