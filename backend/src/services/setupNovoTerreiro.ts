import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import crypto from 'crypto';

/**
 * Cria um novo schema no PostgreSQL e executa as migrações Prisma nesse schema.
 * Depois, pode criar um usuário admin padrão com senha aleatória.
 */
export default async function setupNovoTerreiro(terreiroId: string) {
  const schemaName = `terreiro_${terreiroId}`;
  const prisma = new PrismaClient();

  // 1. Cria o schema no banco
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // 2. Executa as migrações Prisma no novo schema
  await new Promise((resolve, reject) => {
    exec(
      `npx prisma migrate deploy --schema=./prisma/schema.prisma`,
      { cwd: process.cwd(), env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL?.replace('public', schemaName) } },
      (error, stdout, stderr) => {
        if (error) reject(stderr);
        else resolve(stdout);
      }
    );
  });

  // 3. Gera senha aleatória segura
  const senhaAdmin = crypto.randomBytes(10).toString('base64');
  const bcrypt = require('bcryptjs');
  const senhaHash = await bcrypt.hash(senhaAdmin, 10);

  // 4. Cria admin padrão no novo schema
  const prismaTenant = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL?.replace('public', schemaName) } } });
  await prismaTenant.user.create({
    data: {
      nome: 'Administrador',
      email: `admin_${terreiroId}@terreiro.com`,
      senha: senhaHash,
      terreiroId,
      role: 'admin',
    },
  });
  await prismaTenant.$disconnect();
  await prisma.$disconnect();

  // 5. Log seguro da senha gerada
  console.log(`Senha do admin do terreiro ${terreiroId}:`, senhaAdmin);
}
