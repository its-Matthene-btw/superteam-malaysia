import { createClient } from '@/lib/supabase/client';
import { Stat } from '@/types/database';

const supabase = createClient();

export async function getStats() {
  const { data, error } = await supabase.from('stats').select('*').order('order_index');
  if (error) throw error;
  return data as Stat[];
}

export async function updateStat(id: string, stat: Partial<Stat>) {
  const { data, error } = await supabase.from('stats').update(stat).eq('id', id).select();
  if (error) throw error;
  return data[0];
}
