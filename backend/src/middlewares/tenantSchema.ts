import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

// Use declaração de módulo TypeScript, não import real
// Adiciona tipagem para req.prisma

declare module 'express-serve-static-core' {
  interface Request {
    prisma?: any; // Permite extensão dinâmica
  }
}

// Função utilitária para extrair o schema do terreiro do usuário
function getTenantSchema(req: Request): string {
  // Exemplo: extraindo do header, subdomínio ou JWT
  // Aqui está hardcoded para fins de exemplo
  // Troque por lógica real conforme seu app
  return req.headers['x-tenant-schema'] as string || 'public';
}

// Middleware para injetar Prisma Client com schema dinâmico
export function tenantPrismaMiddleware(req: Request, res: Response, next: NextFunction) {
  const schema = getTenantSchema(req);
  req.prisma = new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          await req.prisma!.$executeRawUnsafe(`SET search_path TO ${schema},public`);
          return query(args);
        }
      }
    }
  }) as any;
  next();
}

// Para uso no app:
// app.use(tenantPrismaMiddleware);
// E nos controllers: const prisma = req.prisma;
