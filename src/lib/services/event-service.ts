
import { supabase } from '../db/supabase-client';
import type { Tables } from '../db/supabase-client';

type Event = Tables<'events'>;

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getUpcomingEvents(daysAhead: number = 30): Promise<Event[]> {
  const { data, error } = await supabase
    .rpc('get_upcoming_events', { days_ahead: daysAhead });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getEventById(id: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getEventsByFrente(frenteId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('frente_id', frenteId)
    .order('start_time');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...event,
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

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
