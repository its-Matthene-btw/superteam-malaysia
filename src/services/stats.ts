
import { createClient } from '@/lib/supabase/client';
import { Stat } from '@/types/database';

const supabase = createClient();

export async function getStats() {
  const { data, error } = await supabase.from('stats').select('*').order('order_index');
  if (error) throw error;
  return data as Stat[];
}

export async function createStat(stat: Partial<Stat>) {
  const { data, error } = await supabase.from('stats').insert([stat]).select();
  if (error) throw error;
  return data[0];
}

export async function updateStat(id: string, stat: Partial<Stat>) {
  const { data, error } = await supabase.from('stats').update(stat).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteStat(id: string) {
  const { error } = await supabase.from('stats').delete().eq('id', id);
  if (error) throw error;
}
