import { Request, Response } from 'express';
import { emitUserCreated, emitUserUpdated, emitUserDeleted } from '../socket';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registrarUsuario(req: Request, res: Response) {
  const { nome, email, senha, terreiroId } = req.body;
  if (!nome || !email || !senha || !terreiroId) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    // Remove espaços e normaliza email
    const emailNorm = email.trim().toLowerCase();
    // Garante senha como string
    const senhaStr = String(senha);
    const hash = await bcrypt.hash(senhaStr, 10);
    const usuario = await (req as any).prisma.user.create({
      data: { nome, email: emailNorm, senha: hash, terreiroId, role: 'membro' },
    });
    emitUserCreated(terreiroId, usuario);
    return res.status(201).json({ user: { id: usuario.id, nome: usuario.nome, email: usuario.email, terreiroId: usuario.terreiroId, role: usuario.role } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
}

export async function loginUsuario(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  try {
    // Remove espaços e normaliza email
    const emailNorm = email.trim().toLowerCase();
    // Garante senha como string
    const senhaStr = String(senha);
    const usuario = await (req as any).prisma.user.findUnique({ where: { email: emailNorm } });
    if (!usuario) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    // LOG para debug
    console.log('Tentando login com:', emailNorm);
    console.log('Usuário encontrado:', usuario.email);
    console.log('Senha digitada:', senhaStr);
    console.log('Hash no banco:', usuario.senha);
    const valido = await bcrypt.compare(senhaStr, usuario.senha);
    console.log('Senha válida?', valido);
    if (!valido) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const token = jwt.sign(
      { userId: usuario.id, terreiroId: usuario.terreiroId, role: usuario.role },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '1d' }
    );
    return res.json({ token, user: { id: usuario.id, nome: usuario.nome, email: usuario.email, terreiroId: usuario.terreiroId, role: usuario.role } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

export async function atualizarUsuario(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, email, role, senha } = req.body;
  try {
    let data: any = { nome, email, role };
    if (senha) {
      const hash = await bcrypt.hash(String(senha), 10);
      data.senha = hash;
    }
    const usuario = await (req as any).prisma.user.update({
      where: { id },
      data
    });
    emitUserUpdated(usuario.terreiroId, usuario);
    return res.json({ user: { id: usuario.id, nome: usuario.nome, email: usuario.email, terreiroId: usuario.terreiroId, role: usuario.role } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}

export async function deletarUsuario(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const usuario = await (req as any).prisma.user.delete({ where: { id } });
    emitUserDeleted(usuario.terreiroId, usuario.id);
    return res.json({ id: usuario.id });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
}

export async function listarUsuarios(req: Request, res: Response) {
  // Só lista usuários do mesmo terreiro do usuário autenticado
  const { terreiroId } = (req as any).user;
  try {
    const usuarios = await (req as any).prisma.user.findMany({ where: { terreiroId } });
    return res.json({ users: usuarios });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
}
