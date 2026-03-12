
import { createClient } from '@/lib/supabase/client';
import { FAQ } from '@/types/database';

const supabase = createClient();

export async function getFAQs() {
  const { data, error } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
  if (error) throw error;
  return data as FAQ[];
}

export async function createFAQ(faq: Partial<FAQ>) {
  const { data, error } = await supabase.from('faqs').insert([faq]).select();
  if (error) throw error;
  return data[0];
}

export async function updateFAQ(id: string, faq: Partial<FAQ>) {
  const { data, error } = await supabase.from('faqs').update(faq).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw error;
}
