import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nome: string;
        email: string;
        terreiroId: string;
        role: string;
      };
    }
  }
}
export {};
