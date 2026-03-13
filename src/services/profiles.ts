
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
    // PGRST116 is "no rows found" - expected for new users
    // 42P17 is "infinite recursion" - indicates Supabase policies need the fix
    if (error.code === '42P17') {
      console.warn('SECURITY ALERT: Infinite recursion detected in database policies. Please run the SQL Migration v2.1 in Admin > Seed.');
    } else if (error.code !== 'PGRST116') {
      console.error(`Profile Fetch Error [${error.code}]: ${error.message}`);
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
    if (error.code === '42P17') {
      throw new Error('Database security error: Infinite recursion detected. Please contact the administrator to run Migration v2.1.');
    }
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
