
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EcosystemCategory } from '@/types/ecosystem';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { deleteEcosystemCategory } from './actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Eye, Lock } from 'lucide-react';

export default function CategoriesTable({ categories, userRole }: { categories: EcosystemCategory[], userRole: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isViewer = userRole === 'viewer';

  const handleDelete = async (id: string) => {
    if (isViewer) return;
    setIsDeleting(true);
    try {
      await deleteEcosystemCategory(id);
      toast({ title: 'Category deleted' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting category' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="glass border-white/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5">
            <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground py-6 pl-8">Category Name</TableHead>
            <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="border-white/5 hover:bg-white/[0.02]">
              <TableCell className="font-bold text-white uppercase tracking-tight py-6 pl-8">{category.name}</TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/ecosystem/categories/${category.id}/edit`}>
                    <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary">
                      {isViewer ? <Eye className="w-4 h-4" /> : 'Edit'}
                    </Button>
                  </Link>
                  {!isViewer && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={isDeleting} className="hover:bg-destructive/20 hover:text-destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass border-white/10 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete the category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 border-white/10">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id)} disabled={isDeleting} className="bg-destructive text-white hover:bg-destructive/80">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {isViewer && <Lock className="w-4 h-4 text-muted-foreground opacity-20" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
