
'use client';

import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNews, createPost, updatePost, deletePost } from '@/services/news';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { NewsPost } from '@/types/database';
import { Plus, Edit2, Trash2, Globe, FileText, ImageIcon, Eye, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function NewsAdmin() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    title: '', slug: '', excerpt: '', content: '', image_url: '',
    published_at: new Date().toISOString(), meta_title: '',
    meta_description: '', meta_keywords: ''
  });

  const isViewer = profile?.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getNews(), getCurrentProfile()]);
        setPosts(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sync news feed.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchPosts() {
    const data = await getNews();
    setPosts(data);
  }

  const handleOpenModal = (post?: NewsPost) => {
    if (isViewer && !post) return; // Viewers can't create
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '', slug: '', excerpt: '', content: '', image_url: '',
        published_at: new Date().toISOString(), meta_title: '',
        meta_description: '', meta_keywords: ''
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
    if (isViewer) return;
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
    if (isViewer) return;
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
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> EDITORIAL CONTROL</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">NEWS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Publish announcements and ecosystem updates.</p>
        </div>
        {!isViewer && (
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        )}
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
                      {isViewer ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </Button>
                    {!isViewer && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="hover:bg-destructive/20 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 text-white sm:max-w-[1000px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-white/5">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              {isViewer ? 'View' : editingPost ? 'Edit' : 'Create'} <span className="text-primary">Announcement</span>
              {isViewer && <Lock className="w-4 h-4 text-muted-foreground" />}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
            <div className="px-6 border-b border-white/5">
              <TabsList className="bg-transparent h-12 gap-6 p-0">
                <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Media
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <Globe className="w-3.5 h-3.5" /> SEO
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2 ml-auto">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="content" className="m-0 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Title</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="glass border-white/10 h-12 text-lg font-bold" 
                      disabled={isViewer}
                      required 
                    />
                    {!isViewer && <Button type="button" onClick={generateSlug} variant="outline" className="glass border-white/10 h-12 px-4 uppercase text-[10px] tracking-widest shrink-0">Auto Slug</Button>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Excerpt</Label>
                  <Textarea 
                    value={formData.excerpt || ''} 
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
                    className="glass border-white/10 min-h-[80px]" 
                    disabled={isViewer}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Content (Markdown/HTML)</Label>
                  <Textarea 
                    value={formData.content || ''} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    className="glass border-white/10 min-h-[400px] font-mono text-sm" 
                    disabled={isViewer}
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="m-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Image URL</Label>
                      <Input value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="glass border-white/10" disabled={isViewer} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">URL Slug</Label>
                      <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="glass border-white/10" disabled={isViewer} />
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-lg border border-white/10 bg-black overflow-hidden flex items-center justify-center">
                    {formData.image_url ? <Image src={formData.image_url} alt="" fill className="object-cover" /> : <ImageIcon className="w-12 h-12 opacity-10" />}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="m-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Meta Title</Label>
                    <Input value={formData.meta_title || ''} onChange={(e) => setFormData({...formData, meta_title: e.target.value})} className="glass border-white/10" disabled={isViewer} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Meta Description</Label>
                    <Textarea value={formData.meta_description || ''} onChange={(e) => setFormData({...formData, meta_description: e.target.value})} className="glass border-white/10" disabled={isViewer} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="m-0 py-10 max-w-3xl mx-auto">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">{formData.title || 'Untitled'}</h1>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {formData.content || '_No content to preview._'}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-6 border-t border-white/5">
            {isViewer ? (
              <Button onClick={() => setIsModalOpen(false)} className="w-full glass border-white/10 font-bold uppercase tracking-widest text-xs h-14">Close Viewer</Button>
            ) : (
              <Button onClick={handleSubmit} className="w-full solana-gradient h-14 font-black uppercase tracking-widest text-xs shadow-2xl">
                {editingPost ? 'Update Record' : 'Launch Announcement'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
