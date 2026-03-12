
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, AlertCircle } from 'lucide-react';
import ProjectsTable from './components/ProjectsTable';
import EcosystemLayout from '../layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function AdminProjectsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: projects, error } = await supabase
    .from('ecosystem_projects')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error.message || error);
  }

  const actions = (
    <Link href="/admin/ecosystem/projects/new">
      <Button className="solana-gradient font-bold uppercase tracking-widest text-[10px]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </Link>
  );

  return (
    <EcosystemLayout actions={actions}>
      {error ? (
        <Alert variant="destructive" className="glass border-destructive/20 bg-destructive/5 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Sync Error</AlertTitle>
          <AlertDescription className="font-code text-xs uppercase tracking-tight">
            {error.message || 'Could not access ecosystem_projects table.'}
            <div className="mt-4">
              <Link href="/admin/seed" className="underline hover:text-white transition-colors">
                Run migration in System Seed -&gt;
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <ProjectsTable projects={projects || []} />
      )}
    </EcosystemLayout>
  );
}
