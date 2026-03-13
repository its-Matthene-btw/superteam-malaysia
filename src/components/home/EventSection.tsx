'use client';

import { Event } from '@/types/database';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EventSection({ events }: { events: Event[] }) {
  // Show top upcoming events
  const sortedEvents = [...events]
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 4);

  return (
    <section id="events" className="w-full border-b border-white/10 bg-black">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 border-x border-white/10 bg-white/5 gap-[1px]">
        
        {/* LEFT COLUMN - STICKY */}
        <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-10 lg:p-16 bg-black relative overflow-hidden border-r border-white/10">
          {/* Abstract Grid Background */}
          <div 
            className="absolute inset-0 z-0 opacity-50"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
            }}
          />
          
          <div className="relative z-10">
            <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-6">// EVENTS_RADAR</div>
            <h2 className="text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter mb-10 uppercase text-white">
              Upcoming<br /><span className="text-primary">Schedule.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-md leading-relaxed font-medium mb-12">
              Sync with the Malaysian Web3 community. We host technical workshops, global hackathons, and exclusive networking sessions.
            </p>
            <Link 
              href="/events" 
              className="inline-flex items-center gap-3 font-code font-bold uppercase tracking-[2px] px-10 py-5 border border-white/10 text-white hover:bg-white hover:text-black transition-all group text-xs"
            >
              FULL_CALENDAR
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN - SCROLLING CARDS */}
        <div className="p-10 lg:p-24 bg-[#0f0f13] relative flex flex-col gap-16 overflow-hidden">
          {/* CTA-STYLE BACKGROUND PATTERN */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -bottom-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/15 rounded-full blur-[100px]" />
            <div 
              className="absolute inset-0 opacity-50" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center'
              }} 
            />
          </div>

          {sortedEvents.length > 0 ? sortedEvents.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="group bg-black border border-white/10 transition-all duration-500 hover:-translate-x-2 relative z-10 flex flex-col"
            >
              {/* Card Image Box */}
              <div className="relative h-72 w-full overflow-hidden border-b border-white/10 bg-[#111]">
                {event.image_url ? (
                  <Image 
                    src={event.image_url} 
                    alt={event.title} 
                    fill 
                    className="object-cover opacity-60 grayscale contrast-125 transition-all duration-700 group-hover:opacity-90 group-hover:grayscale-0 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.05)_0%,transparent_70%)]" />
                )}
                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
                
                <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/80 border border-white/10 backdrop-blur-md font-code text-[10px] font-bold text-primary uppercase tracking-widest z-10">
                  {event.category || 'EVENT'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-10 lg:p-12 flex flex-col">
                <div className="font-code text-sm text-primary font-bold tracking-[4px] uppercase mb-6">
                  {new Date(event.event_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase().replace(/ /g, '_')}
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-black mb-10 leading-none tracking-tight text-white group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
                  <div className="flex flex-col gap-2">
                    <span className="font-code text-[9px] text-muted-foreground uppercase tracking-widest">LOCATION</span>
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {event.location || 'VIRTUAL_NODE'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-code text-[9px] text-muted-foreground uppercase tracking-widest">ADMISSION</span>
                    <span className="font-bold text-white text-sm uppercase">
                      {event.featured ? 'Invite_Only' : 'Public_Access'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-code text-[10px] font-bold uppercase tracking-[2px]",
                    event.status === 'upcoming' ? "text-primary" : "text-muted-foreground"
                  )}>
                    {event.status === 'upcoming' ? 'REGISTRATION_OPEN' : 'ARCHIVED_FEED'}
                  </span>
                  
                  <div className="flex items-center gap-3 font-code text-xs font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                    INITIATE_RSVP
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </div>

              {/* Inner Glow Border Hover Effect */}
              <div className="absolute inset-0 border border-transparent group-hover:border-primary/40 pointer-events-none transition-colors duration-500 shadow-[inset_0_0_30px_rgba(153,69,255,0)] group-hover:shadow-[inset_0_0_30px_rgba(153,69,255,0.1)]" />
            </Link>
          )) : (
            <div className="py-40 text-center border border-white/10 bg-black relative z-10">
              <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">No upcoming events found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
