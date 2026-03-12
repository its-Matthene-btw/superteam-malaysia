
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { EcosystemCategory } from '@/types/ecosystem';

export async function deleteEcosystemCategory(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('ecosystem_categories').delete().eq('id', id);

  if (error) {
    throw new Error('Error deleting category');
  }

  revalidatePath('/admin/ecosystem/categories');
}

export async function upsertEcosystemCategory(category: Partial<EcosystemCategory>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('ecosystem_categories')
        .upsert(category)
        .select();

    if (error) {
        console.error('Error upserting category:', error)
        throw new Error('Error saving category');
    }

    revalidatePath('/admin/ecosystem/categories');

    return data;
}
