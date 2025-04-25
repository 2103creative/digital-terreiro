import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo') as any;
    (req as any).user = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      terreiroId: decoded.terreiroId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}
