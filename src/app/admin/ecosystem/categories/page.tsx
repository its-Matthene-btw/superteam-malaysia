
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import CategoriesTable from './components/CategoriesTable';
import EcosystemLayout from '../layout';

export default async function AdminCategoriesPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: categories, error } = await supabase
    .from('ecosystem_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
  }

  const actions = (
    <Link href="/admin/ecosystem/categories/new">
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Category
      </Button>
    </Link>
  );

  return (
    <EcosystemLayout actions={actions}>
      <CategoriesTable categories={categories || []} />
    </EcosystemLayout>
  );
}
