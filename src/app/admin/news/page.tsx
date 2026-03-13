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
import { NewsPost } from '@/types/database';
import { Plus, Edit2, Trash2, Globe, FileText, ImageIcon, Eye, Sparkles } from 'lucide-react';
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
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    published_at: new Date().toISOString(),
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
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
        published_at: new Date().toISOString(),
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
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
        <DialogContent className="glass border-white/10 text-white sm:max-w-[1000px] h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-white/5">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingPost ? 'Edit' : 'Create'} <span className="text-primary">Announcement</span>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden" onValueChange={setActiveTab}>
            <div className="px-6 border-b border-white/5">
              <TabsList className="bg-transparent h-12 gap-6 p-0">
                <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <FileText className="w-3.5 h-3.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Media & Settings
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2">
                  <Globe className="w-3.5 h-3.5" /> SEO Meta
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-xs font-bold uppercase tracking-widest gap-2 ml-auto">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="content" className="m-0 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Announcement Title</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      className="glass border-white/10 h-12 text-lg font-bold" 
                      required 
                    />
                    <Button type="button" onClick={generateSlug} variant="outline" className="glass border-white/10 h-12 px-4 uppercase text-[10px] tracking-widest shrink-0">Auto Slug</Button>
                  </div>
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
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Content (Supports Markdown & HTML Markup)</Label>
                    <span className="text-[9px] text-primary/60 font-code uppercase">Rich Markup Mode Active</span>
                  </div>
                  <Textarea 
                    value={formData.content || ''} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    className="glass border-white/10 min-h-[500px] font-mono text-sm leading-relaxed" 
                    placeholder="Write your article here using Markdown or HTML..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="m-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
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
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Publish Date</Label>
                      <Input 
                        type="datetime-local"
                        value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''} 
                        onChange={(e) => setFormData({...formData, published_at: e.target.value})} 
                        className="glass border-white/10" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">URL Slug</Label>
                      <Input 
                        value={formData.slug} 
                        onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                        className="glass border-white/10 font-mono text-xs" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Cover Preview</Label>
                    <div className="relative aspect-video rounded-xl border border-white/10 overflow-hidden bg-black flex items-center justify-center">
                      {formData.image_url ? (
                        <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-white/5" />
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="m-0 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Meta Title (SEO)</Label>
                  <Input 
                    value={formData.meta_title || ''} 
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})} 
                    className="glass border-white/10 h-12"
                    placeholder="Custom title for Google Search results..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Meta Description</Label>
                  <Textarea 
                    value={formData.meta_description || ''} 
                    onChange={(e) => setFormData({...formData, meta_description: e.target.value})} 
                    className="glass border-white/10 min-h-[100px]"
                    placeholder="Brief summary for search engine snippets..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Keywords (Comma Separated)</Label>
                  <Input 
                    value={formData.meta_keywords || ''} 
                    onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})} 
                    className="glass border-white/10"
                    placeholder="solana, malaysia, building, rust..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <div className="max-w-[800px] mx-auto space-y-10 py-10">
                  <h1 className="text-5xl font-black uppercase tracking-tighter">{formData.title || 'Untitled Article'}</h1>
                  <div className="p-6 border-l-4 border-primary bg-primary/5 italic text-xl text-white/80">
                    {formData.excerpt || 'No excerpt provided.'}
                  </div>
                  <div className="rich-content-styles prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {formData.content || '_No content to preview._'}
                    </ReactMarkdown>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-6 border-t border-white/5">
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="w-full solana-gradient h-14 font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              {editingPost ? 'Update Record' : 'Launch Announcement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .rich-content-styles h1, .rich-content-styles h2, .rich-content-styles h3 { @apply font-black uppercase tracking-tighter mb-6 mt-12 text-white; }
        .rich-content-styles h1 { @apply text-4xl; }
        .rich-content-styles h2 { @apply text-3xl; }
        .rich-content-styles h3 { @apply text-2xl; }
        .rich-content-styles p { @apply text-white/80 leading-relaxed mb-8 text-lg; }
        .rich-content-styles .lead { @apply text-2xl font-bold text-white mb-10; }
        .rich-content-styles img { @apply rounded-xl border border-white/10 my-10 w-full object-cover; }
        .rich-content-styles ul { @apply list-disc pl-6 mb-8 space-y-4 text-white/80; }
        .rich-content-styles ol { @apply list-decimal pl-6 mb-8 space-y-4 text-white/80; }
        .rich-content-styles blockquote { @apply border-l-4 border-primary/40 pl-8 italic my-10 text-white/60; }
      `}</style>
    </div>
  );
}
