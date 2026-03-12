
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventSection from '@/components/home/EventSection';
import { getEvents } from '@/services/events';
import { Event } from '@/types/database';
import { Calendar, MapPin, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'past');

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-48 pb-32 px-10 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.15)_0%,transparent_70%)]" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="pill-badge mb-8"><span>✦</span> ECOSYSTEM CALENDAR</div>
          <h1 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8] mb-12">
            <span className="text-white">BUILDER</span><br />
            <span className="solana-text-gradient">EVENTS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            From localized hacker houses to global summits—if it's building on Solana in Malaysia, it's here.
          </p>
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-10 py-24">
          <div className="flex items-end justify-between mb-16">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">UPCOMING <span className="text-primary">SESSIONS</span></h2>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground text-xs font-code uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-secondary" /> Network Sync Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">Scanning the blockchain...</p>
              </div>
            ) : upcoming.length === 0 ? (
              <p className="text-muted-foreground italic">No upcoming events scheduled. Stay tuned!</p>
            ) : upcoming.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Luma Embeds */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 lg:p-20 border-r border-white/10">
             <div className="pill-badge mb-8">LIVE VIEW</div>
             <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-10">Ecosystem <span className="text-secondary">Calendar</span></h3>
             <div className="aspect-[4/3] glass border-white/10 rounded-2xl overflow-hidden relative">
                <iframe 
                  src="https://lu.ma/embed/calendar/cal-SIn8K6uF6lXWp9n?compact=true" 
                  width="100%" 
                  height="100%" 
                  className="absolute inset-0 border-0 invert grayscale" 
                  allowFullScreen
                />
             </div>
          </div>
          <div className="p-10 lg:p-20">
             <div className="pill-badge mb-8">MAP VIEW</div>
             <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-10">Event <span className="text-[#14F195]">Locator</span></h3>
             <div className="aspect-[4/3] glass border-white/10 rounded-2xl overflow-hidden relative">
                <iframe 
                  src="https://lu.ma/embed/map/cal-SIn8K6uF6lXWp9n" 
                  width="100%" 
                  height="100%" 
                  className="absolute inset-0 border-0 invert" 
                  allowFullScreen
                />
             </div>
          </div>
        </div>
      </section>

      {/* Past Section */}
      <section className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-10 py-24">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white/40 mb-16">PAST <span className="text-white/20">HIGHLIGHTS</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {past.map(event => (
              <div key={event.id} className="glass p-6 border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2">{event.title}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> {event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="event-high-fidelity-card group">
      <div className="relative h-[240px] overflow-hidden border-b border-white/10">
        <Image 
          src={`https://picsum.photos/seed/${event.id}/800/600`} 
          alt={event.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-code text-xs text-primary font-bold tracking-widest uppercase">
            {new Date(event.event_date).toLocaleDateString()}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 border border-primary/20 bg-primary/10 text-primary uppercase tracking-widest">Upcoming</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-8 line-clamp-2">{event.description}</p>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs text-muted-foreground">
             <MapPin className="w-4 h-4 text-primary" /> {event.location}
           </div>
           {event.luma_url && (
             <a href={event.luma_url} target="_blank" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:text-primary transition-colors">
               Register <ArrowRight className="w-4 h-4" />
             </a>
           )}
        </div>
      </div>
    </div>
  );
}
