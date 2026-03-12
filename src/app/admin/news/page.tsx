
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getNews, createPost, updatePost, deletePost } from '@/services/news';
import { NewsPost } from '@/types/database';
import { Plus, Edit2, Trash2, Calendar, Newspaper, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function NewsAdmin() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    published_at: new Date().toISOString()
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const data = await getNews();
      setPosts(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch posts.' });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (post?: NewsPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image_url: '',
        published_at: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const generateSlug = () => {
    const slug = formData.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost?.id) {
        await updatePost(editingPost.id, formData);
        toast({ title: 'Success', description: 'Post updated.' });
      } else {
        await createPost(formData);
        toast({ title: 'Success', description: 'Post created.' });
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save post.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      try {
        await deletePost(id);
        toast({ title: 'Success', description: 'Post removed.' });
        fetchPosts();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete post.' });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="pill-badge mb-6"><span>✦</span> EDITORIAL CONTROL</div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
              MANAGE <span className="text-primary">NEWS</span>
            </h1>
            <p className="text-muted-foreground mt-2">Publish announcements and ecosystem updates.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        </div>

        <div className="glass border-white/10 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5">
                <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Post</TableHead>
                <TableHead className="text-xs font-code uppercase tracking-widest">Date</TableHead>
                <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Indexing feed...</TableCell></TableRow>
              ) : posts.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No news posted.</TableCell></TableRow>
              ) : posts.map((post) => (
                <TableRow key={post.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                       <div className="relative w-16 h-12 bg-white/5 rounded border border-white/10 overflow-hidden">
                          {post.image_url && <Image src={post.image_url} alt={post.title} fill className="object-cover grayscale" />}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-white uppercase tracking-tight text-sm">{post.title}</span>
                          <span className="text-[10px] text-muted-foreground">/{post.slug}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-code uppercase tracking-widest">
                    {new Date(post.published_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(post)} className="hover:bg-primary/20 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="hover:bg-destructive/20 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="glass border-white/10 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {editingPost ? 'Edit' : 'Create'} <span className="text-primary">Announcement</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Title</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="glass border-white/10 h-12" 
                    required 
                  />
                  <Button type="button" onClick={generateSlug} variant="outline" className="glass border-white/10 h-12 px-4 uppercase text-[10px] tracking-widest">Auto Slug</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Slug</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    className="glass border-white/10" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Publish Date</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''} 
                    onChange={(e) => setFormData({...formData, published_at: e.target.value})} 
                    className="glass border-white/10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Hero Image URL</Label>
                <Input 
                  value={formData.image_url || ''} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                  className="glass border-white/10" 
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Excerpt (Short Summary)</Label>
                <Textarea 
                  value={formData.excerpt || ''} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
                  className="glass border-white/10 min-h-[80px]" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Content</Label>
                <Textarea 
                  value={formData.content || ''} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="glass border-white/10 min-h-[300px] font-body" 
                  placeholder="Write your announcement here..."
                />
              </div>

              <DialogFooter className="mt-8">
                <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                  {editingPost ? 'Update Article' : 'Launch Announcement'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
