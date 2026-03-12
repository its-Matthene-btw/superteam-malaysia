
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import ProjectsTable from './components/ProjectsTable';
import EcosystemLayout from '../layout';

export default async function AdminProjectsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: projects, error } = await supabase
    .from('ecosystem_projects')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  const actions = (
    <Link href="/admin/ecosystem/projects/new">
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </Link>
  );

  return (
    <EcosystemLayout actions={actions}>
      <ProjectsTable projects={projects || []} />
    </EcosystemLayout>
  );
}
