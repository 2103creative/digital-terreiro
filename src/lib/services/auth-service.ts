
import { supabase } from '../db/supabase-client';
import type { Tables } from '../db/supabase-client';

type User = Tables<'users'>;

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUp(
  email: string, 
  password: string, 
  userData: { name: string; orixa?: string; avatar_url?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
        orixa: userData.orixa,
        avatar_url: userData.avatar_url
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function updatePassword(new_password: string) {
  const { error } = await supabase.auth.updateUser({
    password: new_password
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

export async function updateUserProfile(userDetails: Partial<User>) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('Usuário não autenticado');
  }
  
  const { data, error } = await supabase
    .from('users')
    .update({ 
      ...userDetails,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as User;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function isMember(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'member';
}

export async function getAllUsers(): Promise<User[]> {
  // Verificar se o usuário atual é admin
  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    throw new Error('Acesso não autorizado');
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as User[];
}

export async function updateUserRole(userId: string, role: 'admin' | 'member' | 'guest') {
  // Verificar se o usuário atual é admin
  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    throw new Error('Acesso não autorizado');
  }
  
  const { data, error } = await supabase
    .from('users')
    .update({ 
      role,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as User;
}
