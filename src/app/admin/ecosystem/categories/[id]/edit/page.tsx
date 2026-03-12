
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import CategoryForm from '../../components/CategoryForm';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: category, error } = await supabase
    .from('ecosystem_categories')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update the details of the category.</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
