
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
import { getStats, updateStat, deleteStat, createStat } from '@/services/stats';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Stat } from '@/types/database';
import { Edit2, Save, Trash2, Plus, BarChart3, Eye, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function StatsAdmin() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStat, setNewStat] = useState({ label: '', value: '' });

  const isViewer = loading || !profile || profile.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getStats(), getCurrentProfile()]);
        setStats(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch stats.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchStats() {
    const data = await getStats();
    setStats(data);
  }

  const handleStartEdit = (stat: Stat) => {
    if (isViewer) return;
    setEditingId(stat.id);
    setEditValue(stat.value);
    setEditLabel(stat.label);
  };

  const handleSave = async (id: string) => {
    if (isViewer) return;
    try {
      await updateStat(id, { value: editValue, label: editLabel });
      toast({ title: 'Success', description: 'Stat updated.' });
      setEditingId(null);
      fetchStats();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update stat.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (isViewer) return;
    if (confirm('Permanently delete this statistic?')) {
      try {
        await deleteStat(id);
        toast({ title: 'Success', description: 'Stat removed.' });
        fetchStats();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete stat.' });
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    try {
      await createStat({ ...newStat, order_index: stats.length });
      toast({ title: 'Success', description: 'Stat created.' });
      setIsModalOpen(false);
      setNewStat({ label: '', value: '' });
      fetchStats();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create stat.' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> IMPACT TRACKING</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">STATS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Update the numbers displayed in the impact section.</p>
        </div>
        {!isViewer && (
          <Button onClick={() => setIsModalOpen(true)} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> New Metric
          </Button>
        )}
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8 w-16">#</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Label</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Value</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Loading stats...</TableCell></TableRow>
            ) : stats.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No stats defined.</TableCell></TableRow>
            ) : stats.map((stat, idx) => (
              <TableRow key={stat.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-6 pl-8 font-code text-muted-foreground">{idx + 1}</TableCell>
                <TableCell>
                  {editingId === stat.id ? (
                    <Input 
                      value={editLabel} 
                      onChange={(e) => setEditLabel(e.target.value)} 
                      className="glass border-white/10 h-10 w-full max-w-[200px]"
                    />
                  ) : (
                    <span className="font-bold text-white uppercase tracking-tight">{stat.label}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === stat.id ? (
                    <Input 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      className="glass border-white/10 h-10 w-full max-w-[150px]"
                    />
                  ) : (
                    <span className="text-primary text-2xl font-black">{stat.value}</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    {editingId === stat.id ? (
                      <Button variant="ghost" size="icon" onClick={() => handleSave(stat.id)} className="text-secondary hover:bg-secondary/10">
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(stat)} className="hover:bg-white/5">
                          {isViewer ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </Button>
                        {!isViewer && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(stat.id)} className="hover:bg-destructive/20 hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" /> Create <span className="text-primary">Stat</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Stat Label</Label>
              <Input 
                value={newStat.label} 
                onChange={(e) => setNewStat({...newStat, label: e.target.value})} 
                className="glass border-white/10 h-12" 
                placeholder="e.g. Active Builders"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Stat Value</Label>
              <Input 
                value={newStat.value} 
                onChange={(e) => setNewStat({...newStat, value: e.target.value})} 
                className="glass border-white/10 h-12" 
                placeholder="e.g. 2.5k+"
                required 
              />
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                Launch Metric
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
