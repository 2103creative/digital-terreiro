import { Request, Response } from 'express';
import prisma from '../prismaClient';
import setupNovoTerreiro from '../services/setupNovoTerreiro';

export async function criarTerreiro(req: Request, res: Response) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const terreiro = await prisma.terreiro.create({ data: { nome } });
    await setupNovoTerreiro(terreiro.id);
    return res.status(201).json(terreiro);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar terreiro.' });
  }
}

export async function listarTerreiros(req: Request, res: Response) {
  try {
    const terreiros = await prisma.terreiro.findMany();
    return res.json(terreiros);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar terreiros.' });
  }
}
