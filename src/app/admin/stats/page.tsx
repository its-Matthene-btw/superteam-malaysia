
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
import { Input } from '@/components/ui/input';
import { getStats, updateStat } from '@/services/stats';
import { Stat } from '@/types/database';
import { Edit2, Save, BarChart3, ArrowUpDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function StatsAdmin() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch stats.' });
    } finally {
      setLoading(false);
    }
  }

  const handleStartEdit = (stat: Stat) => {
    setEditingId(stat.id);
    setEditValue(stat.value);
    setEditLabel(stat.label);
  };

  const handleSave = async (id: string) => {
    try {
      await updateStat(id, { value: editValue, label: editLabel });
      toast({ title: 'Success', description: 'Stat updated.' });
      setEditingId(null);
      fetchStats();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update stat.' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 animate-fade-up">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> IMPACT TRACKING</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">STATS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Update the numbers displayed in the impact section.</p>
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
              ) : stats.map((stat) => (
                <TableRow key={stat.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-6 pl-8 font-code text-muted-foreground">{stat.order_index}</TableCell>
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
                    {editingId === stat.id ? (
                      <Button variant="ghost" size="icon" onClick={() => handleSave(stat.id)} className="text-secondary hover:bg-secondary/10">
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleStartEdit(stat)} className="hover:bg-white/5">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
