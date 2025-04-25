import { Request, Response } from 'express';
import { emitFrenteCreated, emitFrenteUpdated, emitFrenteDeleted } from '../socket';

interface AuthRequest extends Request {
  user?: {
    id: string;
    nome: string;
    email: string;
    terreiroId: string;
    role: string;
  };
}

export const criarFrente = async (req: AuthRequest, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const terreiroId = req.user?.terreiroId;
    if (!terreiroId) {
      return res.status(400).json({ error: 'TerreiroId não encontrado no usuário autenticado.' });
    }
    const frente = await (req as any).prisma.frente.create({
      data: { nome, descricao, terreiroId }
    });
    // Emite evento real-time para todos conectados ao terreiro
    emitFrenteCreated(terreiroId, frente);
    return res.status(201).json(frente);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar frente.' });
  }
};

export const listarFrentes = async (req: AuthRequest, res: Response) => {
  try {
    const terreiroId = req.user?.terreiroId;
    if (!terreiroId) {
      return res.status(400).json({ error: 'TerreiroId não encontrado no usuário autenticado.' });
    }
    const frentes = await (req as any).prisma.frente.findMany({
      where: { terreiroId }
    });
    return res.json(frentes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar frentes.' });
  }
};

export const editarFrente = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const terreiroId = req.user?.terreiroId;
    if (!terreiroId) {
      return res.status(400).json({ error: 'TerreiroId não encontrado no usuário autenticado.' });
    }
    const frente = await (req as any).prisma.frente.updateMany({
      where: { id, terreiroId },
      data: { nome, descricao }
    });
    if (frente.count === 0) return res.status(404).json({ error: 'Frente não encontrada.' });
    const frenteAtualizada = await (req as any).prisma.frente.findUnique({ where: { id } });
    emitFrenteUpdated(terreiroId, frenteAtualizada);
    return res.json({ message: 'Frente atualizada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao editar frente.' });
  }
};

export const removerFrente = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const terreiroId = req.user?.terreiroId;
    if (!terreiroId) {
      return res.status(400).json({ error: 'TerreiroId não encontrado no usuário autenticado.' });
    }
    const frente = await (req as any).prisma.frente.deleteMany({
      where: { id, terreiroId }
    });
    if (frente.count === 0) return res.status(404).json({ error: 'Frente não encontrada.' });
    emitFrenteDeleted(terreiroId, id);
    return res.json({ message: 'Frente removida com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao remover frente.' });
  }
};
