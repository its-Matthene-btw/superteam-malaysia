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

export async function uploadAvatar(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('avatars').upload(fileName, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
  return publicUrl;
}
