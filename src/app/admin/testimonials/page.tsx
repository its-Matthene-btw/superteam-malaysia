
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/testimonials';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Testimonial } from '@/types/database';
import { Plus, Edit2, Trash2, Eye, Lock, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '', role: '', content: '', type: 'official', avatar_url: '', twitter_url: ''
  });

  // FAIL-SAFE: Default to viewer if profile is loading or missing
  const isViewer = loading || !profile || profile.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getTestimonials(), getCurrentProfile()]);
        setTestimonials(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch testimonials.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchTestimonials() {
    const data = await getTestimonials();
    setTestimonials(data);
  }

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (isViewer && !testimonial) return;
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setEditingTestimonial(null);
      setFormData({ name: '', role: '', content: '', type: 'official', avatar_url: '', twitter_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'Viewers cannot modify records.' });
      return;
    }
    try {
      if (editingTestimonial?.id) {
        await updateTestimonial(editingTestimonial.id, formData);
        toast({ title: 'Success', description: 'Testimonial updated.' });
      } else {
        await createTestimonial(formData);
        toast({ title: 'Success', description: 'Testimonial added.' });
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save testimonial.' });
    }
  };

  const handleDelete = async (id: string) => {
    // Explicit server-side intent check
    if (isViewer) {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'Read-only users cannot remove content.' });
      return;
    }
    
    if (confirm('Are you sure you want to permanently delete this feedback?')) {
      try {
        await deleteTestimonial(id);
        toast({ title: 'Success', description: 'Testimonial removed from system.' });
        fetchTestimonials();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete testimonial.' });
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> WALL OF LOVE</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">FEEDBACK</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage testimonials from X, Discord, and core partners.</p>
        </div>
        {!isViewer && (
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Add Feedback
          </Button>
        )}
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Author</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Type</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Content Preview</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Loading testimonials...</TableCell></TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No feedback records found.</TableCell></TableRow>
            ) : testimonials.map((t) => (
              <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 grayscale">
                      {t.avatar_url ? <Image src={t.avatar_url} alt={t.name} fill className="object-cover" /> : <div className="bg-white/10 w-full h-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white uppercase tracking-tight text-sm">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground">{t.role}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                    t.type === 'twitter' ? "bg-white/10 text-white border border-white/20" : 
                    t.type === 'discord' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : 
                    "bg-primary/10 text-primary border border-primary/20"
                  )}>
                    {t.type === 'twitter' && <XIcon className="w-2.5 h-2.5" />}
                    {t.type === 'twitter' ? 'X' : t.type}
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground text-xs italic">
                  "{t.content}"
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)} className="hover:bg-primary/20 hover:text-primary">
                      {isViewer ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </Button>
                    {!isViewer && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="hover:bg-destructive/20 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {isViewer && <Lock className="w-4 h-4 text-muted-foreground opacity-20" />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              {isViewer ? 'View' : editingTestimonial ? 'Edit' : 'Add'} <span className="text-primary">Feedback</span>
              {isViewer && <Lock className="w-4 h-4 text-muted-foreground" />}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Author Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="glass border-white/10 h-12" 
                  disabled={isViewer}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val: any) => setFormData({...formData, type: val})}
                  disabled={isViewer}
                >
                  <SelectTrigger className="glass border-white/10 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="official">Official Testimonial</SelectItem>
                    <SelectItem value="twitter">X Post</SelectItem>
                    <SelectItem value="discord">Discord Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Content</Label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                className="glass border-white/10 min-h-[120px]" 
                disabled={isViewer}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Role / Description</Label>
                <Input 
                  value={formData.role || ''} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})} 
                  className="glass border-white/10" 
                  disabled={isViewer}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Avatar URL (External)</Label>
                <Input 
                  value={formData.avatar_url || ''} 
                  onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} 
                  className="glass border-white/10" 
                  disabled={isViewer}
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              {isViewer ? (
                <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full glass border-white/10 font-bold uppercase tracking-widest text-xs h-14">
                  Close Viewer
                </Button>
              ) : (
                <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                  {editingTestimonial ? 'Update Feedback' : 'Post Feedback'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
