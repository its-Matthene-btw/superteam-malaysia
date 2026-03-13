
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
import { Checkbox } from '@/components/ui/checkbox';
import { getPartners, createPartner, updatePartner, deletePartner } from '@/services/partners';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Partner } from '@/types/database';
import { Plus, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon, Eye, Lock } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '', logo_url: '', website_url: '', featured: false
  });

  const isViewer = profile?.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getPartners(), getCurrentProfile()]);
        setPartners(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch partners.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchPartners() {
    const data = await getPartners();
    setPartners(data);
  }

  const handleOpenModal = (partner?: Partner) => {
    if (isViewer && !partner) return;
    if (partner) {
      setEditingPartner(partner);
      setFormData(partner);
    } else {
      setEditingPartner(null);
      setFormData({ name: '', logo_url: '', website_url: '', featured: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    try {
      if (editingPartner?.id) {
        await updatePartner(editingPartner.id, formData);
        toast({ title: 'Success', description: 'Partner updated.' });
      } else {
        await createPartner(formData);
        toast({ title: 'Success', description: 'Partner added.' });
      }
      setIsModalOpen(false);
      fetchPartners();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save partner.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (isViewer) return;
    if (confirm('Remove this partner?')) {
      try {
        await deletePartner(id);
        toast({ title: 'Success', description: 'Partner removed.' });
        fetchPartners();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete partner.' });
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> ECOSYSTEM RELATIONS</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">PARTNERS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage the logos displayed on the homepage marquee.</p>
        </div>
        {!isViewer && (
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Add Partner
          </Button>
        )}
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Logo</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Partner Name</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Featured</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Loading partners...</TableCell></TableRow>
            ) : partners.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No partners added.</TableCell></TableRow>
            ) : partners.map((partner) => (
              <TableRow key={partner.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="relative w-24 h-12 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    {partner.logo_url ? (
                      <Image src={partner.logo_url} alt={partner.name} fill className="object-contain p-2 grayscale" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-white uppercase tracking-tight">{partner.name}</TableCell>
                <TableCell>
                  <Checkbox checked={partner.featured} disabled className="border-white/20 data-[state=checked]:bg-primary" />
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(partner)} className="hover:bg-primary/20 hover:text-primary">
                      {isViewer ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </Button>
                    {!isViewer && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(partner.id)} className="hover:bg-destructive/20 hover:text-destructive">
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
        <DialogContent className="glass border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              {isViewer ? 'View' : editingPartner ? 'Edit' : 'Add'} <span className="text-primary">Partner</span>
              {isViewer && <Lock className="w-4 h-4 text-muted-foreground" />}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Partner Name</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="glass border-white/10 h-12" 
                disabled={isViewer}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Website URL</Label>
              <Input 
                value={formData.website_url || ''} 
                onChange={(e) => setFormData({...formData, website_url: e.target.value})} 
                className="glass border-white/10" 
                disabled={isViewer}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured-partner" 
                checked={formData.featured} 
                onCheckedChange={(checked) => setFormData({...formData, featured: !!checked})}
                className="border-white/20 data-[state=checked]:bg-primary"
                disabled={isViewer}
              />
              <Label htmlFor="featured-partner" className="text-xs uppercase tracking-widest font-code cursor-pointer">High Visibility</Label>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Logo URL</Label>
              <Input 
                value={formData.logo_url} 
                onChange={(e) => setFormData({...formData, logo_url: e.target.value})} 
                className="glass border-white/10" 
                disabled={isViewer}
              />
            </div>

            <DialogFooter className="mt-8">
              {isViewer ? (
                <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full glass border-white/10 font-bold uppercase tracking-widest text-xs h-14">
                  Close Viewer
                </Button>
              ) : (
                <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                  {editingPartner ? 'Update Partner' : 'Confirm Partner'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
