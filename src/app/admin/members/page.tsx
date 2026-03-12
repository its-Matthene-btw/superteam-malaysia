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
import { Checkbox } from '@/components/ui/checkbox';
import { getMembers, createMember, updateMember, deleteMember, uploadAvatar } from '@/services/members';
import { Member } from '@/types/database';
import { Plus, Edit2, Trash2, User, Star, Upload, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MembersAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    role: '',
    company: '',
    skills: [],
    bio: '',
    featured: false,
    twitter_url: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch members.' });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        skills: [],
        bio: '',
        featured: false,
        twitter_url: '',
        avatar_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember?.id) {
        await updateMember(editingMember.id, formData);
        toast({ title: 'Success', description: 'Member updated successfully.' });
      } else {
        await createMember(formData);
        toast({ title: 'Success', description: 'Member created successfully.' });
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save member.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id);
        toast({ title: 'Success', description: 'Member deleted.' });
        fetchMembers();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete member.' });
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadAvatar(file);
        setFormData({ ...formData, avatar_url: url });
        toast({ title: 'Success', description: 'Avatar uploaded to storage.' });
      } catch (error: any) {
        console.error(error);
        toast({ 
          variant: 'destructive', 
          title: 'Upload Failed', 
          description: error.message || 'Check if Storage RLS is configured in Supabase.' 
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="pill-badge mb-6"><span>✦</span> DIRECTORY MANAGEMENT</div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
              MANAGE <span className="text-primary">MEMBERS</span>
            </h1>
            <p className="text-muted-foreground mt-2">Add, edit, or remove builders from the network.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>

        <div className="glass border-white/10 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground py-6 pl-8">Member</TableHead>
                <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground">Role/Company</TableHead>
                <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground">Featured</TableHead>
                <TableHead className="text-xs font-code uppercase tracking-widest text-muted-foreground text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Loading members...</TableCell></TableRow>
              ) : members.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No members found.</TableCell></TableRow>
              ) : members.map((member) => (
                <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        {member.avatar_url ? (
                          <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                        )}
                      </div>
                      <span className="font-bold text-white uppercase tracking-tight">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {member.role} at <span className="text-white">{member.company}</span>
                  </TableCell>
                  <TableCell>
                    {member.featured ? (
                      <div className="flex items-center text-secondary gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-secondary" /> Featured
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(member)} className="hover:bg-primary/20 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="hover:bg-destructive/20 hover:text-destructive">
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
          <DialogContent className="glass border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {editingMember ? 'Edit' : 'Add'} <span className="text-primary">Member</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="glass border-white/10" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</Label>
                  <Input 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="glass border-white/10" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Company</Label>
                  <Input 
                    value={formData.company} 
                    onChange={(e) => setFormData({...formData, company: e.target.value})} 
                    className="glass border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Twitter URL</Label>
                  <Input 
                    value={formData.twitter_url || ''} 
                    onChange={(e) => setFormData({...formData, twitter_url: e.target.value})} 
                    className="glass border-white/10" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Bio</Label>
                <Textarea 
                  value={formData.bio || ''} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                  className="glass border-white/10 min-h-[100px]" 
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={(checked) => setFormData({...formData, featured: !!checked})}
                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="featured" className="text-xs uppercase tracking-widest font-code cursor-pointer">Featured on spotlight</Label>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Avatar Source</Label>
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-black flex-shrink-0">
                    {formData.avatar_url ? (
                      <Image src={formData.avatar_url} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User className="w-8 h-8" /></div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-tighter text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="w-2 h-2" /> Direct URL
                      </Label>
                      <Input 
                        placeholder="https://picsum.photos/..." 
                        value={formData.avatar_url || ''}
                        onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                        className="glass border-white/10 h-8 text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-tighter text-muted-foreground flex items-center gap-1">
                        <Upload className="w-2 h-2" /> Upload to Supabase
                      </Label>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="glass border-white/10 cursor-pointer text-[10px] h-8 file:bg-white/10 file:text-white file:border-0" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-8">
                <Button type="submit" className="w-full solana-gradient h-12 font-bold uppercase tracking-widest text-xs">
                  {editingMember ? 'Update Member' : 'Create Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
