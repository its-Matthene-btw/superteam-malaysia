
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import ProjectForm from '../components/ProjectForm';
import EcosystemLayout from '../../layout';

export default async function NewProjectPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: categories, error } = await supabase
    .from('ecosystem_categories')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <EcosystemLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground">Fill out the form to add a new project to the ecosystem.</p>
        </div>
        <ProjectForm categories={categories?.map(c => c.name) || []} />
      </div>
    </EcosystemLayout>
  );
}
