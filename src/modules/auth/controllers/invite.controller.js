// invite.controller.ts
import { v4 as uuidv4 } from 'uuid'
import { addHours } from 'date-fns'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInvite = async (req, res) => {
  const { email } = req.body;

  // ✅ Verifica se usuário já existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já registrado.' });
  }

  const token = uuidv4();
  const expiresAt = addHours(new Date(), parseInt(process.env.INVITE_TOKEN_EXPIRATION_HOURS || '24'));

  await prisma.invite.upsert({
    where: { email },
    update: { token, expiresAt, used: false, sentBy: req.user?.id },
    create: { email, token, expiresAt, sentBy: req.user?.id }
  });

  await sendInviteEmail(email, token); // ✅ só envia se passou na verificação

  return res.status(201).json({ message: 'Convite enviado com sucesso.' });
};
