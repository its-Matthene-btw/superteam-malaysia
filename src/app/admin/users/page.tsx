
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getAllProfiles, updateProfileRole, deleteProfile, Profile, UserRole } from '@/services/profiles';
import { Users, Shield, ShieldAlert, ShieldCheck, Trash2, Mail, Clock, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch user profiles.' });
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (id: string, role: UserRole) => {
    setUpdatingId(id);
    try {
      await updateProfileRole(id, role);
      toast({ title: 'Success', description: `User role updated to ${role}.` });
      fetchProfiles();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update role.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this user from the admin system?')) {
      try {
        await deleteProfile(id);
        toast({ title: 'Success', description: 'User profile removed.' });
        fetchProfiles();
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove user.' });
      }
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <ShieldAlert className="w-4 h-4 text-primary" />;
      case 'editor': return <ShieldCheck className="w-4 h-4 text-secondary" />;
      case 'viewer': return <Shield className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <div className="pill-badge mb-6"><span>✦</span> ACCESS CONTROL</div>
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
          USER <span className="text-primary">MANAGEMENT</span>
        </h1>
        <p className="text-muted-foreground mt-2">Manage permissions and roles for system operators.</p>
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Operator</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">System Role</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Registered</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Scanning network users...</TableCell></TableRow>
            ) : profiles.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">No operators found in database.</TableCell></TableRow>
            ) : profiles.map((profile) => (
              <TableRow key={profile.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="py-8 pl-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <Mail className="w-3 h-3 text-primary" /> {profile.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-code mt-1 uppercase">UID: {profile.id.slice(0, 8)}...</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getRoleIcon(profile.role)}
                    <Select 
                      defaultValue={profile.role} 
                      onValueChange={(val: UserRole) => handleRoleChange(profile.id, val)}
                      disabled={updatingId === profile.id}
                    >
                      <SelectTrigger className="glass border-white/10 h-9 w-32 text-xs font-bold uppercase tracking-widest">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        <SelectItem value="admin" className="text-primary font-bold">ADMIN</SelectItem>
                        <SelectItem value="editor" className="text-secondary font-bold">EDITOR</SelectItem>
                        <SelectItem value="viewer" className="text-white font-bold">VIEWER</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingId === profile.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-code uppercase tracking-widest">
                     <Clock className="w-3 h-3" /> {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(profile.id)} 
                    className="hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
