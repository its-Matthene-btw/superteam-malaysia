
'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/services/faqs';
import { getSubscribers, deleteSubscriber } from '@/services/newsletter';
import { getSettings, updateSettingsBatch } from '@/services/settings';
import { FAQ, NewsletterSubscriber } from '@/types/database';
import { Settings, Plus, Edit2, Trash2, HelpCircle, Mail, Download, Search, Calendar, Save, Globe, Zap, MessageSquare, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SettingsAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    order_index: 0
  });

  // Newsletter states
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberSort, setSubscriberSort] = useState<'newest' | 'oldest' | 'email'>('newest');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [fData, sData, settingsData] = await Promise.all([
        getFAQs(), 
        getSubscribers(),
        getSettings()
      ]);
      setFaqs(fData);
      setSubscribers(sData);
      setGlobalSettings(settingsData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to sync settings data.' });
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateBatchSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettingsBatch(globalSettings);
      toast({ title: 'Success', description: 'Global configuration updated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save configuration.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

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

  const handleSubmitFaq = async (e: React.FormEvent) => {
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
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save FAQ.' });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Delete this FAQ entry?')) {
      try {
        await deleteFAQ(id);
        toast({ title: 'Success', description: 'FAQ removed.' });
        fetchData();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete FAQ.' });
      }
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm('Permanently remove this subscriber?')) {
      try {
        await deleteSubscriber(id);
        toast({ title: 'Success', description: 'Subscriber removed.' });
        fetchData();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove subscriber.' });
      }
    }
  };

  const filteredSubscribers = useMemo(() => {
    let result = [...subscribers].filter(s => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()));
    
    if (subscriberSort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (subscriberSort === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (subscriberSort === 'email') result.sort((a, b) => a.email.localeCompare(b.email));

    return result;
  }, [subscribers, subscriberSearch, subscriberSort]);

  const exportToCSV = () => {
    const headers = ['Email', 'Date Joined'];
    const rows = filteredSubscribers.map(s => [s.email, new Date(s.created_at).toLocaleString()]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Successful', description: `${filteredSubscribers.length} subscribers exported to CSV.` });
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> GLOBAL CONFIGURATION</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            SYSTEM <span className="text-primary">SETTINGS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage metadata, homepage sections, and subscriber databases.</p>
        </div>
      </div>

      <Tabs defaultValue="site" className="space-y-10">
        <TabsList className="bg-white/5 border border-white/10 h-14 p-1">
          <TabsTrigger value="site" className="data-[state=active]:bg-primary data-[state=active]:text-white h-full px-8 text-xs uppercase font-bold tracking-widest gap-2">
            <Globe className="w-3.5 h-3.5" /> Site Content
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-white h-full px-8 text-xs uppercase font-bold tracking-widest gap-2">
            <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="data-[state=active]:bg-primary data-[state=active]:text-white h-full px-8 text-xs uppercase font-bold tracking-widest gap-2">
            <Mail className="w-3.5 h-3.5" /> Subscribers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-10">
          <form onSubmit={handleUpdateBatchSettings} className="space-y-10">
            {/* SEO & METADATA */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Share2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[2px]">SEO & Metadata</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Site Title</Label>
                  <Input 
                    value={globalSettings.site_title || ''} 
                    onChange={(e) => handleSettingChange('site_title', e.target.value)} 
                    placeholder="Superteam Malaysia | Solana Ecosystem"
                    className="glass border-white/10 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">OG Image URL</Label>
                  <Input 
                    value={globalSettings.site_og_image || ''} 
                    onChange={(e) => handleSettingChange('site_og_image', e.target.value)} 
                    placeholder="https://..."
                    className="glass border-white/10 h-12"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Meta Description</Label>
                  <Textarea 
                    value={globalSettings.site_description || ''} 
                    onChange={(e) => handleSettingChange('site_description', e.target.value)} 
                    placeholder="Empowering Malaysian talent to build..."
                    className="glass border-white/10 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* HERO SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[2px]">Hero Section</h3>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Main Headline</Label>
                  <Input 
                    value={globalSettings.hero_headline || ''} 
                    onChange={(e) => handleSettingChange('hero_headline', e.target.value)} 
                    placeholder="Malaysia’s Home for Solana Builders"
                    className="glass border-white/10 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Sub-headline</Label>
                  <Textarea 
                    value={globalSettings.hero_subheadline || ''} 
                    onChange={(e) => handleSettingChange('hero_subheadline', e.target.value)} 
                    placeholder="Discover bounties, grants, events..."
                    className="glass border-white/10 h-24"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
                    <Label className="text-[10px] uppercase tracking-[2px] text-primary">Primary Button</Label>
                    <div className="space-y-4">
                      <Input placeholder="Text: JOIN NETWORK" value={globalSettings.hero_primary_btn_text || ''} onChange={(e) => handleSettingChange('hero_primary_btn_text', e.target.value)} className="glass border-white/10 h-10 text-xs" />
                      <Input placeholder="Link: /contact" value={globalSettings.hero_primary_btn_link || ''} onChange={(e) => handleSettingChange('hero_primary_btn_link', e.target.value)} className="glass border-white/10 h-10 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
                    <Label className="text-[10px] uppercase tracking-[2px] text-muted-foreground">Secondary Button</Label>
                    <div className="space-y-4">
                      <Input placeholder="Text: OPPORTUNITIES" value={globalSettings.hero_secondary_btn_text || ''} onChange={(e) => handleSettingChange('hero_secondary_btn_text', e.target.value)} className="glass border-white/10 h-10 text-xs" />
                      <Input placeholder="Link: /ecosystem" value={globalSettings.hero_secondary_btn_link || ''} onChange={(e) => handleSettingChange('hero_secondary_btn_link', e.target.value)} className="glass border-white/10 h-10 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GLOBAL CTA */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Settings className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[2px]">Global CTA (Footer)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">CTA Title</Label>
                  <Input value={globalSettings.cta_headline || ''} onChange={(e) => handleSettingChange('cta_headline', e.target.value)} placeholder="BUILD THE FUTURE." className="glass border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">CTA Subtext</Label>
                  <Textarea value={globalSettings.cta_subtext || ''} onChange={(e) => handleSettingChange('cta_subtext', e.target.value)} placeholder="Ready to ship your next big idea..." className="glass border-white/10 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Discord Button Link</Label>
                  <Input value={globalSettings.cta_discord_url || ''} onChange={(e) => handleSettingChange('cta_discord_url', e.target.value)} placeholder="https://discord.gg/..." className="glass border-white/10 h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Grant Button Link</Label>
                  <Input value={globalSettings.cta_grant_url || ''} onChange={(e) => handleSettingChange('cta_grant_url', e.target.value)} placeholder="https://earn.superteam.fun" className="glass border-white/10 h-12" />
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[2px]">Social Mesh</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">X (Twitter)</Label>
                  <Input value={globalSettings.social_x || ''} onChange={(e) => handleSettingChange('social_x', e.target.value)} className="glass border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Discord</Label>
                  <Input value={globalSettings.social_discord || ''} onChange={(e) => handleSettingChange('social_discord', e.target.value)} className="glass border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">GitHub</Label>
                  <Input value={globalSettings.social_github || ''} onChange={(e) => handleSettingChange('social_github', e.target.value)} className="glass border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">LinkedIn</Label>
                  <Input value={globalSettings.social_linkedin || ''} onChange={(e) => handleSettingChange('social_linkedin', e.target.value)} className="glass border-white/10 h-10" />
                </div>
              </div>
            </div>

            {/* QUICK ANSWERS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <HelpCircle className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-[2px]">Quick Answers (Contact Page)</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(num => (
                  <div key={num} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                    <Label className="text-[10px] uppercase tracking-[2px] text-muted-foreground">Card #{num}</Label>
                    <Input placeholder="Title" value={globalSettings[`qa_${num}_title`] || ''} onChange={(e) => handleSettingChange(`qa_${num}_title`, e.target.value)} className="glass border-white/10 h-10 text-xs" />
                    <Textarea placeholder="Description" value={globalSettings[`qa_${num}_desc`] || ''} onChange={(e) => handleSettingChange(`qa_${num}_desc`, e.target.value)} className="glass border-white/10 h-20 text-xs" />
                    <Input placeholder="Link" value={globalSettings[`qa_${num}_link`] || ''} onChange={(e) => handleSettingChange(`qa_${num}_link`, e.target.value)} className="glass border-white/10 h-10 text-xs" />
                    <Input placeholder="Label: e.g. JOIN_DISCORD" value={globalSettings[`qa_${num}_label`] || ''} onChange={(e) => handleSettingChange(`qa_${num}_label`, e.target.value)} className="glass border-white/10 h-10 text-xs" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-10 z-50 flex justify-end">
              <Button type="submit" disabled={savingSettings} className="solana-gradient h-16 px-12 rounded-full font-black uppercase tracking-[3px] text-xs shadow-2xl hover:scale-105 transition-all">
                {savingSettings ? 'Syncing...' : 'Publish All Changes'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="faq" className="space-y-10">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Knowledge Base <span className="text-muted-foreground">(FAQ)</span></h3>
            <Button onClick={() => handleOpenModal()} className="glass border-white/10 text-xs font-bold uppercase tracking-widest h-10 gap-2">
              <Plus className="w-4 h-4" /> Add FAQ
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
                  <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No FAQ entries found.</TableCell></TableRow>
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
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFaq(faq.id)} className="hover:bg-destructive/20 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">Subscriber <span className="text-muted-foreground">Dispatch</span></h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-code mt-1">{subscribers.length} active nodes</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                <Input 
                  placeholder="Filter by email..." 
                  className="glass border-white/10 h-10 pl-9 w-64 text-xs" 
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                />
              </div>
              <Select value={subscriberSort} onValueChange={(v: any) => setSubscriberSort(v)}>
                <SelectTrigger className="glass border-white/10 h-10 w-40 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="email">Email A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV} variant="outline" className="glass border-white/10 text-xs font-bold uppercase tracking-widest h-10 gap-2">
                <Download className="w-3 h-3" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="glass border-white/10 rounded-xl overflow-hidden max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-white/5 sticky top-0 z-10">
                <TableRow className="border-white/5">
                  <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Email</TableHead>
                  <TableHead className="text-xs font-code uppercase tracking-widest">Joined</TableHead>
                  <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground uppercase font-code text-xs tracking-widest">Scanning network...</TableCell></TableRow>
                ) : filteredSubscribers.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">No subscribers found.</TableCell></TableRow>
                ) : filteredSubscribers.map((s) => (
                  <TableRow key={s.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="py-4 pl-8 font-medium text-white">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-code">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteSubscriber(s.id)} 
                        className="hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingFaq ? 'Edit' : 'Add'} <span className="text-primary">FAQ Entry</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitFaq} className="space-y-6 pt-4">
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
