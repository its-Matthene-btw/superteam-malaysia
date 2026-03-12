
import { createClient } from '@/lib/supabase/client';
import { Contact } from '@/types/database';

const supabase = createClient();

export async function getMessages() {
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Contact[];
}

export async function sendMessage(message: Partial<Contact>) {
  const { error } = await supabase.from('contacts').insert([message]);
  if (error) throw error;
  return true;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}
