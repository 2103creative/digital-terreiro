// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'membro' | 'user';
  isActive?: boolean;
  avatar?: string;
  orixa?: string;
  batismoDate?: string;
  birthdate?: string;
  terreiroId?: string;
}

// Corrigido para o endpoint correto do backend
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/users';

export async function authenticate(email: string, password: string): Promise<User | null> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: password })
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.token && data.user) {
    localStorage.setItem('token', data.token);
    const adaptedUser = {
      id: data.user.id,
      name: data.user.nome || data.user.name,
      email: data.user.email,
      role: data.user.role,
      isActive: true,
      terreiroId: data.user.terreiroId
    };
    localStorage.setItem('user', JSON.stringify(adaptedUser));
    return adaptedUser;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function isAdmin(): boolean {
  const user = getCurrentUserSync();
  return user?.role === 'admin';
}

export async function getCurrentUser(): Promise<User | null> {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

function getCurrentUserSync(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function getAllUsers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.map((u: any) => ({
    id: u.id,
    name: u.nome || u.name,
    email: u.email,
    role: u.role,
    isActive: true,
    terreiroId: u.terreiroId
  }));
}

export async function registerUser(nome: string, email: string, senha: string, terreiroId: string): Promise<User | null> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, terreiroId })
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.user) {
    const adaptedUser = {
      id: data.user.id,
      name: data.user.nome || data.user.name,
      email: data.user.email,
      role: data.user.role,
      isActive: true,
      terreiroId: data.user.terreiroId
    };
    localStorage.setItem('user', JSON.stringify(adaptedUser));
    return adaptedUser;
  }
  return null;
}