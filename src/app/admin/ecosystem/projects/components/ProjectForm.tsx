
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EcosystemProject } from '@/types/ecosystem';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { upsertEcosystemProject } from './actions';
import { Card, CardContent } from '@/components/ui/card';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  logo_url: z.string().optional(),
  hero_image_url: z.string().optional(),
  website_url: z.string().optional(),
  twitter_url: z.string().optional(),
  discord_url: z.string().optional(),
  github_url: z.string().optional(),
  docs_url: z.string().optional(),
  network: z.string().optional(),
  token_symbol: z.string().optional(),
  contract_address: z.string().optional(),
  status: z.string().optional(),
  featured: z.boolean().default(false),
});

export default function ProjectForm({ project, categories }: { project?: EcosystemProject, categories: string[] }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || { featured: false },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      const data = { ...values, id: project?.id };
      await upsertEcosystemProject(data);
      toast({ title: project ? 'Project updated' : 'Project created' });
      router.push('/admin/ecosystem/projects');
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving project' });
    }
  };

  return (
    <Card className="glass border-white/10">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Protocol Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
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
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Slug (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass border-white/10">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass border-white/10">
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Deployment Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Live & Audited" className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Network</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Solana Mainnet" className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token_symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Token Symbol</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="JUP" className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contract_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Contract Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="JUPy..." className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Summary</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="glass border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="long_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Narrative</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={8} className="glass border-white/10 font-body" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Hero Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground text-primary">Website</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground text-primary">Twitter / X</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discord_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground text-primary">Discord</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground text-secondary">GitHub</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="docs_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground text-secondary">Documentation</FormLabel>
                    <FormControl>
                      <Input {...field} className="glass border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-white/10 p-6 bg-white/5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/20 data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-bold uppercase tracking-widest">
                      Ecosystem Pillar
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Display prominently in the "Ecosystem Pillars" section of the main listing.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full solana-gradient h-14 font-black uppercase tracking-widest text-xs">
              {project ? 'Update Protocol Record' : 'Launch Ecosystem Entry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
