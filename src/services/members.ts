import { createClient } from '@/lib/supabase/client';
import { Member } from '@/types/database';

const supabase = createClient();

export async function getMembers() {
  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Member[];
}

export async function getFeaturedMembers(limit = 6) {
  const { data, error } = await supabase.from('members').select('*').eq('featured', true).limit(limit);
  if (error) throw error;
  return data as Member[];
}

export async function createMember(member: Partial<Member>) {
  const { data, error } = await supabase.from('members').insert([member]).select();
  if (error) throw error;
  return data[0];
}

export async function updateMember(id: string, member: Partial<Member>) {
  const { data, error } = await supabase.from('members').update(member).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteMember(id: string) {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
}
