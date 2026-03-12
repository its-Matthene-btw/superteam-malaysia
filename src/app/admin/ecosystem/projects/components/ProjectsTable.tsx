
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EcosystemProject } from '@/types/ecosystem';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { deleteEcosystemProject } from './actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function ProjectsTable({ projects }: { projects: EcosystemProject[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteEcosystemProject(id);
      toast({ title: 'Project deleted' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting project' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.category}</TableCell>
              <TableCell>
                <Badge variant={project.status === 'Live' ? 'secondary' : 'default'}>{project.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={project.featured ? 'secondary' : 'default'}>{project.featured ? 'Yes' : 'No'}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/ecosystem/projects/${project.id}/edit`}>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(project.id)} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
