
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, AlertCircle } from 'lucide-react';
import CategoriesTable from './components/CategoriesTable';
import EcosystemLayout from '../layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function AdminCategoriesPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: categories, error } = await supabase
    .from('ecosystem_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error.message || error);
  }

  const actions = (
    <Link href="/admin/ecosystem/categories/new">
      <Button className="solana-gradient font-bold uppercase tracking-widest text-[10px]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Category
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
            {error.message || 'Could not access ecosystem_categories table.'}
            <div className="mt-4">
              <Link href="/admin/seed" className="underline hover:text-white transition-colors">
                Run migration in System Seed ->
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <CategoriesTable categories={categories || []} />
      )}
    </EcosystemLayout>
  );
}
