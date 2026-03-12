
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
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/services/faqs';
import { FAQ } from '@/types/database';
import { Settings, Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SettingsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    order_index: 0
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    try {
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch FAQs.' });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData(faq);
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '', order_index: faqs.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq?.id) {
        await updateFAQ(editingFaq.id, formData);
        toast({ title: 'Success', description: 'FAQ updated.' });
      } else {
        await createFAQ(formData);
        toast({ title: 'Success', description: 'FAQ added.' });
      }
      setIsModalOpen(false);
      fetchFAQs();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save FAQ.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this FAQ entry?')) {
      try {
        await deleteFAQ(id);
        toast({ title: 'Success', description: 'FAQ removed.' });
        fetchFAQs();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete FAQ.' });
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> GLOBAL CONFIGURATION</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            SYSTEM <span className="text-primary">SETTINGS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage global site components and help center content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">Help Center <span className="text-muted-foreground">(FAQ)</span></h3>
            </div>
            <Button onClick={() => handleOpenModal()} className="glass border-white/10 text-xs font-bold uppercase tracking-widest h-10">
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </div>

          <div className="glass border-white/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8 w-16">#</TableHead>
                  <TableHead className="text-xs font-code uppercase tracking-widest">Question</TableHead>
                  <TableHead className="text-xs font-code uppercase tracking-widest">Answer Preview</TableHead>
                  <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground uppercase font-code text-xs tracking-widest">Syncing knowledge base...</TableCell></TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">No FAQ entries found.</TableCell></TableRow>
                ) : faqs.map((faq) => (
                  <TableRow key={faq.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                    <TableCell className="py-6 pl-8 font-code text-muted-foreground">{faq.order_index}</TableCell>
                    <TableCell className="font-bold text-white max-w-xs">{faq.question}</TableCell>
                    <TableCell className="text-muted-foreground text-xs italic max-w-md truncate">"{faq.answer}"</TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(faq)} className="hover:bg-primary/20 hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="hover:bg-destructive/20 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="p-10 border border-white/10 glass rounded-3xl bg-white/[0.02] opacity-50">
           <div className="flex items-center gap-4 mb-8">
              <Settings className="w-6 h-6 text-muted-foreground" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">Advanced <span className="text-muted-foreground">Configuration</span></h3>
           </div>
           <p className="text-sm text-muted-foreground mb-10 italic">Global SEO and metadata settings are currently locked for core maintenance. Contact a system administrator for manual overrides.</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-none">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Site Title</Label>
                <Input value="Superteam Connect Malaysia" disabled className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Primary Accent</Label>
                <Input value="#9945FF" disabled className="bg-white/5 border-white/10" />
              </div>
           </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingFaq ? 'Edit' : 'Add'} <span className="text-primary">FAQ Entry</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Question</Label>
              <Input 
                value={formData.question} 
                onChange={(e) => setFormData({...formData, question: e.target.value})} 
                className="glass border-white/10 h-12" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Detailed Answer</Label>
              <Textarea 
                value={formData.answer} 
                onChange={(e) => setFormData({...formData, answer: e.target.value})} 
                className="glass border-white/10 min-h-[160px]" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Order Index</Label>
              <Input 
                type="number"
                value={formData.order_index} 
                onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} 
                className="glass border-white/10" 
                required 
              />
            </div>

            <DialogFooter className="mt-8">
              <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                {editingFaq ? 'Update Knowledge Base' : 'Publish Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
