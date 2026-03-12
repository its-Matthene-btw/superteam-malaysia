
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function getSettings() {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  
  // Transform array into a simple key-value object
  return data.reduce((acc: Record<string, string>, item) => {
    acc[item.id] = item.value;
    return acc;
  }, {});
}

export async function updateSetting(id: string, value: string) {
  const { error } = await supabase.from('site_settings').upsert({ id, value });
  if (error) throw error;
}

export async function updateSettingsBatch(settings: Record<string, string>) {
  const payload = Object.entries(settings).map(([id, value]) => ({ id, value }));
  const { error } = await supabase.from('site_settings').upsert(payload);
  if (error) throw error;
}
