
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EcosystemCategory } from '@/types/ecosystem';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { upsertEcosystemCategory } from './actions';
import { Card, CardContent } from '@/components/ui/card';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export default function CategoryForm({ category }: { category?: EcosystemCategory }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {},
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      const categoryData = { ...values, id: category?.id };
      await upsertEcosystemCategory(categoryData);
      toast({ title: category ? 'Category updated' : 'Category created' });
      router.push('/admin/ecosystem/categories');
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving category' });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{category ? 'Update Category' : 'Create Category'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
