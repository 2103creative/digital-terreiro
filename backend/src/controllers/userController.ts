import { Request, Response } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registrarUsuario(req: Request, res: Response) {
  const { nome, email, senha, terreiroId } = req.body;
  if (!nome || !email || !senha || !terreiroId) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.user.create({
      data: { nome, email, senha: hash, terreiroId, role: 'membro' },
    });
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
}

export async function loginUsuario(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const token = jwt.sign(
      { userId: usuario.id, terreiroId: usuario.terreiroId, role: usuario.role },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '1d' }
    );
    return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, terreiroId: usuario.terreiroId, role: usuario.role } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

export async function listarUsuarios(req: Request, res: Response) {
  // Só lista usuários do mesmo terreiro do usuário autenticado
  const { terreiroId } = (req as any).usuario;
  try {
    const usuarios = await prisma.user.findMany({ where: { terreiroId } });
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
}
