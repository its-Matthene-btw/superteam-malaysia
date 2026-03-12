
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import ProjectForm from '../../components/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: project, error: projectError } = await supabase
    .from('ecosystem_projects')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: categories, error: categoriesError } = await supabase
    .from('ecosystem_categories')
    .select('name')
    .order('name', { ascending: true });

  if (projectError || categoriesError) {
    console.error('Error fetching data:', projectError || categoriesError);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Update the details of the project.</p>
      </div>
      <ProjectForm project={project} categories={categories?.map(c => c.name) || []} />
    </div>
  );
}
