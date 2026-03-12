import { createClient } from '@/lib/supabase/client';
import { Event } from '@/types/database';

const supabase = createClient();

export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if (error) throw error;
  return data as Event[];
}

export async function getUpcomingEvents() {
  const { data, error } = await supabase.from('events').select('*').eq('status', 'upcoming').order('event_date', { ascending: true });
  if (error) throw error;
  return data as Event[];
}

export async function createEvent(event: Partial<Event>) {
  const { data, error } = await supabase.from('events').insert([event]).select();
  if (error) throw error;
  return data[0];
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const { data, error } = await supabase.from('events').update(event).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}
