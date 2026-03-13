'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getEvents } from '@/services/events';
import { Event } from '@/types/database';
import { Calendar, MapPin, ArrowRight, Loader2, Sparkles, LayoutGrid, Zap, Globe, Users } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AnimatedSection, AnimatedItem } from '@/components/layout/AnimatedSection';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

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
  const featured = upcoming.find(e => e.featured) || upcoming[0];

  const filteredUpcoming = upcoming.filter(e => {
    if (activeFilter === 'all') return true;
    return e.category === activeFilter;
  });

  return (
    <main className="min-h-screen bg-black text-white font-body selection:bg-primary/30">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <AnimatedSection className="relative pt-20 border-b border-white/10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] bg-white/10 gap-[1px]" staggerChildren={0.2}>
        <div className="bg-[#0a0a0c] p-10 lg:p-24 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black:30%,transparent:100%)]" />
          
          <div className="relative z-10">
            <AnimatedItem>
              <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-6">// SUPERTEAM_MY_EVENTS</div>
            </AnimatedItem>
            <AnimatedItem>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
                Discover the<br /><span className="text-primary">Events.</span>
              </h1>
            </AnimatedItem>
            <AnimatedItem>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium mb-12">
                Find hackathons, technical workshops, and builder meetups happening across the Solana ecosystem in Malaysia.
              </p>
            </AnimatedItem>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedItem><AnimatedStat label="Events Hosted" value={120} /></AnimatedItem>
              <AnimatedItem><AnimatedStat label="Upcoming" value={upcoming.length} /></AnimatedItem>
              <AnimatedItem><AnimatedStat label="Builders Attended" value={4500} /></AnimatedItem>
            </div>
          </div>
        </div>

        <div className="relative bg-[#050505] overflow-hidden min-h-[400px] lg:min-h-full flex items-center justify-center">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full max-w-[600px] h-auto object-contain opacity-60"
          >
            <source src="https://image2url.com/r2/default/videos/1773398842747-51e838a3-a9ba-4230-a50e-8972c4c84a1a.webm" type="video/webm" />
          </video>
        </div>
      </AnimatedSection>

      {/* 2. FEATURED EVENT */}
      {featured && (
        <AnimatedSection className="border-b border-white/10 bg-[#050505]" staggerChildren={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <AnimatedItem className="p-10 lg:p-20 flex flex-col justify-center border-r border-white/10">
              <div className="inline-block bg-primary text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-8">MAJOR_SPOTLIGHT</div>
              <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                {featured.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed">
                {featured.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <MetaItem label="DATE_START" value={new Date(featured.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase().replace(/ /g, '_')} />
                <MetaItem label="LOCATION" value={featured.location?.toUpperCase().replace(/ /g, '_') || 'VIRTUAL'} />
                <MetaItem label="CAPACITY" value="500_BUILDERS" />
              </div>

              <a 
                href={featured.luma_url || '#'} 
                target="_blank"
                className="bg-primary text-black font-code font-black uppercase tracking-[3px] text-xs px-12 py-6 hover:bg-white transition-all flex items-center justify-center gap-4 w-fit shadow-[0_0_30px_rgba(153,69,255,0.2)]"
              >
                REGISTER_NOW <ArrowRight className="w-4 h-4" />
              </a>
            </AnimatedItem>
            <AnimatedItem className="relative bg-zinc-900 overflow-hidden min-h-[400px] lg:min-h-full group">
              <Image 
                src={featured.image_url || `https://picsum.photos/seed/${featured.id}/1200/800`} 
                alt={featured.title} 
                fill 
                className="object-cover grayscale contrast-125 opacity-60 mix-blend-screen group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent" />
            </AnimatedItem>
          </div>
        </AnimatedSection>
      )}

      {/* 3. FILTER SYSTEM */}
      <div className="bg-[#0a0a0c] border-b border-white/10 py-8 relative z-50">
        <div className="max-w-[1400px] mx-auto px-10 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <span className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] whitespace-nowrap">// FILTER_BY:</span>
          <div className="flex gap-4">
            {['All Events', 'Hackathon', 'Workshop', 'Meetup', 'Community'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter === 'All Events' ? 'all' : filter)}
                className={cn(
                  "px-8 py-3 rounded-full font-code text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
                  (activeFilter === filter || (filter === 'All Events' && activeFilter === 'all'))
                    ? "bg-white text-black border-white" 
                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/40 hover:text-white"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. UPCOMING GRID */}
      <AnimatedSection className="py-24 bg-black border-b border-white/10" staggerChildren={0.1}>
        <div className="max-w-[1400px] mx-auto px-10">
          <AnimatedItem className="flex items-center justify-between mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Upcoming Schedule</h2>
            <div className="font-code text-[10px] text-primary uppercase tracking-[3px]">[ SYSTEM_SYNCED ]</div>
          </AnimatedItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {loading ? (
              <div className="col-span-full py-40 flex flex-col items-center justify-center bg-[#0a0a0c]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-code text-[10px] uppercase tracking-[4px] text-muted-foreground">Accessing Node...</p>
              </div>
            ) : filteredUpcoming.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-[#0a0a0c]">
                <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">No events scheduled for this protocol.</p>
              </div>
            ) : filteredUpcoming.map(event => (
              <AnimatedItem key={event.id}>
                <div className="bg-[#0a0a0c] flex flex-col group hover:bg-[#050505] transition-all duration-500 relative overflow-hidden h-full">
                  <div className="relative h-56 overflow-hidden border-b border-white/10">
                    <Image 
                      src={event.image_url || `https://picsum.photos/seed/${event.id}/800/600`} 
                      alt={event.title} 
                      fill 
                      className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-black/80 border border-white/10 px-3 py-1 font-code text-[9px] text-primary uppercase tracking-widest">
                      {event.category || 'EVENT'}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 line-clamp-3">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
                      <div>
                        <div className="font-code text-[9px] text-muted-foreground uppercase tracking-widest mb-1">DATE</div>
                        <div className="font-code text-xs font-bold text-white">{new Date(event.event_date).toLocaleDateString().toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="font-code text-[9px] text-muted-foreground uppercase tracking-widest mb-1">LOCATION</div>
                        <div className="font-code text-xs font-bold text-white truncate">{event.location?.toUpperCase() || 'VIRTUAL'}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href={event.luma_url || '#'} target="_blank" className="flex-1 bg-primary text-black font-code text-[10px] font-black uppercase tracking-widest py-4 text-center hover:bg-white transition-colors">
                        REGISTER_ON_LUMA
                      </a>
                      <Link href={`/events/${event.id}`} className="flex-1 border border-white/10 text-white font-code text-[10px] font-black uppercase tracking-widest py-4 text-center hover:border-primary hover:text-primary transition-all">
                        DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 5 & 6. LUMA & MAP SECTION */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10 bg-[#050505]" staggerChildren={0.2}>
        <AnimatedItem className="p-10 lg:p-20 border-r border-white/10 flex flex-col">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// CALENDAR_VIEW</div>
          <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Luma Directory</h3>
          <p className="text-muted-foreground mb-10 leading-relaxed">Sync our entire schedule directly to your personal calendar.</p>
          
          <div className="relative aspect-video lg:flex-1 bg-black border border-white/10 rounded-xl overflow-hidden group">
            <iframe src="https://lu.ma/embed/calendar/cal-SIn8K6uF6lXWp9n?compact=true" width="100%" height="100%" className="border-none invert grayscale" />
          </div>
        </AnimatedItem>

        <AnimatedItem className="p-10 lg:p-20 flex flex-col">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// GEOLOCATION</div>
          <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Event Coordinates</h3>
          <p className="text-muted-foreground mb-10 leading-relaxed">Find the exact coordinates for our upcoming physical build stations.</p>
          
          <div className="relative aspect-video lg:flex-1 bg-black border border-white/10 rounded-xl overflow-hidden group">
            <iframe src="https://maps.google.com/maps?q=Kuala%20Lumpur&t=k&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" className="border-none invert grayscale" />
          </div>
        </AnimatedItem>
      </AnimatedSection>

      {/* 7. PAST EVENTS SECTION */}
      <AnimatedSection className="py-24 bg-black border-b border-white/10" staggerChildren={0.1}>
        <div className="max-w-[1400px] mx-auto px-10">
          <AnimatedItem className="flex items-center justify-between mb-16">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Archived Events</h2>
            <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px]">[ PAST_TRANSMISSIONS ]</div>
          </AnimatedItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10">
            {past.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-[#0a0a0c]">
                <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">No past events found in database.</p>
              </div>
            ) : past.map(event => (
              <AnimatedItem key={event.id}>
                <div className="bg-[#0a0a0c] flex flex-col opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 h-full">
                  <div className="relative h-40 overflow-hidden border-b border-white/10">
                    <Image 
                      src={event.image_url || `https://picsum.photos/seed/${event.id}/600/400`} 
                      alt={event.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="font-code text-[9px] text-muted-foreground uppercase tracking-widest mb-2">{new Date(event.event_date).toLocaleDateString()}</div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4">{event.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-6 line-clamp-2">{event.description}</p>
                    <a href="#" className="mt-auto font-code text-[10px] text-primary uppercase tracking-[2px] flex items-center gap-2 hover:text-white transition-colors">
                      VIEW_RECAP <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 8. COMMUNITY CTA */}
      <AnimatedSection className="py-40 text-center relative overflow-hidden bg-black" staggerChildren={0.2}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(153,69,255,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-10 relative z-10">
          <AnimatedItem>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
              Join the Network.
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="text-xl text-muted-foreground mb-12">Don't build in isolation. Connect with founders, find co-builders, and accelerate your Web3 journey.</p>
          </AnimatedItem>
          
          <AnimatedItem className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="px-12 py-6 bg-white text-black font-code font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
              JOIN_COMMUNITY
            </Link>
            <Link href="/ecosystem" className="px-12 py-6 border border-white/10 text-white font-code font-black uppercase tracking-widest text-xs hover:border-white transition-all">
              EXPLORE_ECOSYSTEM
            </Link>
            <Link href="/members" className="px-12 py-6 border border-white/10 text-white font-code font-black uppercase tracking-widest text-xs hover:border-white transition-all">
              VIEW_MEMBERS
            </Link>
          </AnimatedItem>
        </div>
      </AnimatedSection>

      <Footer />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; }
        }
        .animate-flicker {
          animation: flicker 3s linear infinite;
        }
      `}</style>
    </main>
  );
}

function AnimatedStat({ label, value }: { label: string, value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="border-l-2 border-primary pl-6">
      <div className="text-4xl font-black font-code text-white mb-1">
        {count}{value > 1000 ? '+' : '+'}
      </div>
      <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-code text-[9px] text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="font-code text-sm font-bold text-white">{value}</span>
    </div>
  );
}
