
import { supabase } from '../db/supabase-client';
import type { Tables } from '../db/supabase-client';

type Frente = Tables<'frentes'>;

export async function getAllFrentes(): Promise<Frente[]> {
  const { data, error } = await supabase
    .from('frentes')
    .select('*')
    .order('title');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getFrentesByType(type: 'umbanda' | 'nacao'): Promise<Frente[]> {
  const { data, error } = await supabase
    .from('frentes')
    .select('*')
    .eq('type', type)
    .order('title');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getFrenteById(id: string): Promise<Frente> {
  const { data, error } = await supabase
    .from('frentes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createFrente(frente: Omit<Frente, 'id' | 'created_at' | 'updated_at'>): Promise<Frente> {
  const { data, error } = await supabase
    .from('frentes')
    .insert([frente])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateFrente(id: string, frente: Partial<Frente>): Promise<Frente> {
  const { data, error } = await supabase
    .from('frentes')
    .update({
      ...frente,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteFrente(id: string): Promise<void> {
  const { error } = await supabase
    .from('frentes')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
