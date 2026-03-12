import { createClient } from '@/lib/supabase/client';
import { Partner } from '@/types/database';

const supabase = createClient();

export async function getPartners() {
  const { data, error } = await supabase.from('partners').select('*').order('name');
  if (error) throw error;
  return data as Partner[];
}

export async function createPartner(partner: Partial<Partner>) {
  const { data, error } = await supabase.from('partners').insert([partner]).select();
  if (error) throw error;
  return data[0];
}

export async function updatePartner(id: string, partner: Partial<Partner>) {
  const { data, error } = await supabase.from('partners').update(partner).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deletePartner(id: string) {
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadLogo(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('logos').upload(fileName, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
  return publicUrl;
}
