import { Request, Response } from 'express';
import setupNovoTerreiro from '../services/setupNovoTerreiro';
import { emitThemeUpdated } from '../socket';

export async function criarTerreiro(req: Request, res: Response) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const terreiro = await (req as any).prisma.terreiro.create({ data: { nome } });
    await setupNovoTerreiro(terreiro.id);
    return res.status(201).json(terreiro);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar terreiro.' });
  }
}

export async function listarTerreiros(req: Request, res: Response) {
  try {
    const terreiros = await (req as any).prisma.terreiro.findMany();
    return res.json(terreiros);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar terreiros.' });
  }
}

// Novo: Obter tema do terreiro
export async function obterTemaTerreiro(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const terreiro = await (req as any).prisma.terreiro.findUnique({ where: { id } });
    if (!terreiro) return res.status(404).json({ error: 'Terreiro não encontrado.' });
    return res.json({ theme: terreiro.theme });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter tema.' });
  }
}

// Novo: Atualizar tema do terreiro
export async function atualizarTemaTerreiro(req: Request, res: Response) {
  const { id } = req.params;
  const { theme } = req.body;
  try {
    const terreiro = await (req as any).prisma.terreiro.update({
      where: { id },
      data: { theme },
    });
    // Emite evento real-time para todos conectados ao terreiro
    emitThemeUpdated(id, { theme: terreiro.theme });
    return res.json({ theme: terreiro.theme });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar tema.' });
  }
}
