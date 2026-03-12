import { createClient } from '@/lib/supabaseClient';
import { Member } from '@/types/member';

const supabase = createClient();

export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from('members').select('*');
  if (error) throw error;
  return data as Member[];
};

export const createMember = async (member: Omit<Member, 'id'>) => {
  const { data, error } = await supabase.from('members').insert([member]);
  if (error) throw error;
  return data;
};

export const updateMember = async (id: string, member: Partial<Omit<Member, 'id'>>) => {
  const { data, error } = await supabase.from('members').update(member).eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteMember = async (id: string) => {
  const { data, error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
  return data;
};
