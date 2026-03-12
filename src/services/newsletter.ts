
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function subscribeToNewsletter(email: string) {
  const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
  if (error) throw error;
  return true;
}

export async function getSubscribers() {
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteSubscriber(id: string) {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) throw error;
  return true;
}
