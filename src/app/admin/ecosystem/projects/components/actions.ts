
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { EcosystemProject } from '@/types/ecosystem';

export async function deleteEcosystemProject(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from('ecosystem_projects').delete().eq('id', id);

  if (error) {
    throw new Error('Error deleting project');
  }

  revalidatePath('/admin/ecosystem/projects');
}

export async function upsertEcosystemProject(project: Partial<EcosystemProject>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('ecosystem_projects')
        .upsert(project)
        .select();

    if (error) {
        console.error('Error upserting project:', error)
        throw new Error('Error saving project');
    }

    revalidatePath('/admin/ecosystem/projects');
    revalidatePath(`/admin/ecosystem/projects/${project.slug}`);

    return data;
}
