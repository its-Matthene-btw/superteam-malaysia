
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // PGRST116 is the code for "no rows found", which is expected for new users before role assignment
    if (error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error.message || error);
    }
    return null;
  }

  return data as Profile;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all profiles:', error.message || error);
    throw error;
  }
  return data as Profile[];
}

export async function updateProfileRole(id: string, role: UserRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0] as Profile;
}

export async function deleteProfile(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}
