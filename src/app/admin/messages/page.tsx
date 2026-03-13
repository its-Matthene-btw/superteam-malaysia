
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
import { getMessages, deleteMessage } from '@/services/messages';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Contact } from '@/types/database';
import { Trash2, Mail, User, Clock, Inbox, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const isViewer = loading || !profile || profile.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getMessages(), getCurrentProfile()]);
        setMessages(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch messages.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchMessages() {
    const data = await getMessages();
    setMessages(data);
  }

  const handleDelete = async (id: string) => {
    if (isViewer) return;
    if (confirm('Delete this inquiry?')) {
      try {
        await deleteMessage(id);
        toast({ title: 'Success', description: 'Message removed.' });
        fetchMessages();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete message.' });
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div>
        <div className="pill-badge mb-6"><span>✦</span> INBOUND COMMUNICATIONS</div>
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
          ADMIN <span className="text-primary">INBOX</span>
        </h1>
        <p className="text-muted-foreground mt-2">Manage inquiries from the contact portal.</p>
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Sender</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Message</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Received</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Scanning inbox...</TableCell></TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32 text-muted-foreground">
                  <Inbox className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-code text-xs uppercase tracking-widest">Inbox is empty.</p>
                </TableCell>
              </TableRow>
            ) : messages.map((msg) => (
              <TableRow key={msg.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="py-8 pl-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <User className="w-3 h-3 text-primary" /> {msg.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-code flex items-center gap-2 mt-1">
                      <Mail className="w-3 h-3" /> {msg.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-white text-sm leading-relaxed line-clamp-2 italic">"{msg.message}"</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-code uppercase tracking-widest">
                     <Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <a href={`mailto:${msg.email}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:bg-primary hover:text-black transition-all">
                      <Mail className="w-4 h-4" />
                    </a>
                    {!isViewer && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)} className="hover:bg-destructive/20 hover:text-destructive">
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
    </div>
  );
}
