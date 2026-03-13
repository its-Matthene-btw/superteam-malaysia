
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
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/events';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Event } from '@/types/database';
import { Plus, Edit2, Trash2, Calendar, MapPin, Star, Image as ImageIcon, Link as LinkIcon, Eye, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '', description: '', location: '', event_date: '', luma_url: '', image_url: '', status: 'upcoming', category: 'Meetup', featured: false
  });

  const isViewer = loading || !profile || profile.role === 'viewer';

  useEffect(() => {
    async function init() {
      try {
        const [data, p] = await Promise.all([getEvents(), getCurrentProfile()]);
        setEvents(data);
        setProfile(p);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sync calendar.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchEvents() {
    const data = await getEvents();
    setEvents(data);
  }

  const handleOpenModal = (event?: Event) => {
    if (isViewer && !event) return;
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title ?? '',
        description: event.description ?? '',
        location: event.location ?? '',
        event_date: event.event_date ?? '',
        luma_url: event.luma_url ?? '',
        image_url: event.image_url ?? '',
        status: event.status ?? 'upcoming',
        category: event.category ?? 'Meetup',
        featured: event.featured ?? false
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '', description: '', location: '', event_date: '', luma_url: '', image_url: '', status: 'upcoming', category: 'Meetup', featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    const payload = {
      title: formData.title,
      description: formData.description || null,
      location: formData.location || null,
      event_date: formData.event_date || new Date().toISOString(),
      luma_url: formData.luma_url || null,
      image_url: formData.image_url || null,
      status: formData.status || 'upcoming',
      category: formData.category || 'Meetup',
      featured: !!formData.featured
    };

    try {
      if (editingEvent?.id) {
        await updateEvent(editingEvent.id, payload);
        toast({ title: 'Success', description: 'Event updated.' });
      } else {
        await createEvent(payload);
        toast({ title: 'Success', description: 'Event created.' });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save event.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (isViewer) return;
    if (confirm('Delete this event?')) {
      try {
        await deleteEvent(id);
        toast({ title: 'Success', description: 'Event removed.' });
        fetchEvents();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
      }
    }
  };

  const isValidUrl = (url?: string | null) => {
    if (!url) return false;
    try {
      new URL(url);
      return (url.startsWith('http://') || url.startsWith('https://'));
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> CALENDAR CONTROL</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            MANAGE <span className="text-primary">EVENTS</span>
          </h1>
          <p className="text-muted-foreground mt-2">Update upcoming and past ecosystem events.</p>
        </div>
        {!isViewer && (
          <Button onClick={() => handleOpenModal()} className="solana-gradient font-bold h-12 px-8 uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        )}
      </div>

      <div className="glass border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-xs font-code uppercase tracking-widest py-6 pl-8">Event</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Date / Location</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-xs font-code uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">Loading events...</TableCell></TableRow>
            ) : events.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground uppercase font-code text-xs tracking-widest">No events scheduled.</TableCell></TableRow>
            ) : events.map((event) => (
              <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded bg-white/5 overflow-hidden border border-white/10 flex-shrink-0">
                      {isValidUrl(event.image_url) ? (
                        <Image src={event.image_url!} alt="" fill className="object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon className="w-5 h-5" /></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white uppercase tracking-tight text-lg">{event.title}</span>
                      {event.featured && (
                        <span className="text-[9px] text-secondary font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-secondary" /> Spotlight Event
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar className="w-3 h-3 text-primary" /> {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    event.status === 'upcoming' ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-muted-foreground border border-white/10"
                  )}>
                    {event.status}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(event)} className="hover:bg-primary/20 hover:text-primary">
                      {isViewer ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </Button>
                    {!isViewer && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="hover:bg-destructive/20 hover:text-destructive">
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
        <DialogContent className="glass border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              {isViewer ? 'View' : editingEvent ? 'Edit' : 'Create'} <span className="text-primary">Event</span>
              {isViewer && <Lock className="w-4 h-4 text-muted-foreground" />}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="glass border-white/10 h-12" 
                disabled={isViewer}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Location</Label>
                <Input 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  className="glass border-white/10" 
                  disabled={isViewer}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Date</Label>
                <Input 
                  type="date"
                  value={formData.event_date ? formData.event_date.split('T')[0] : ''} 
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                  className="glass border-white/10" 
                  disabled={isViewer}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</Label>
                <Select 
                  value={formData.category ?? 'Meetup'} 
                  onValueChange={(val: any) => setFormData({...formData, category: val})}
                  disabled={isViewer}
                >
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</Label>
                <Select 
                  value={formData.status ?? 'upcoming'} 
                  onValueChange={(val: any) => setFormData({...formData, status: val})}
                  disabled={isViewer}
                >
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Luma Link</Label>
              <Input 
                value={formData.luma_url} 
                onChange={(e) => setFormData({...formData, luma_url: e.target.value})} 
                className="glass border-white/10" 
                disabled={isViewer}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Image URL</Label>
              <Input 
                value={formData.image_url} 
                onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                className="glass border-white/10" 
                disabled={isViewer}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                className="glass border-white/10 min-h-[120px]" 
                disabled={isViewer}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured-event" 
                checked={formData.featured ?? false} 
                onCheckedChange={(checked) => setFormData({...formData, featured: !!checked})}
                className="border-white/20 data-[state=checked]:bg-primary"
                disabled={isViewer}
              />
              <Label htmlFor="featured-event" className="text-xs uppercase tracking-widest font-code cursor-pointer">Highlight this event</Label>
            </div>

            <DialogFooter className="mt-8">
              {isViewer ? (
                <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full glass border-white/10 font-bold uppercase tracking-widest text-xs h-14">
                  Close Viewer
                </Button>
              ) : (
                <Button type="submit" className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs">
                  {editingEvent ? 'Update Schedule' : 'Launch Event'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
