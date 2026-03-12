
"use client";

import { events } from '@/lib/data';
import { MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function EventSection() {
  return (
    <section id="events" className="w-full border-b border-white/10 bg-black">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[4fr_6fr] border-x border-white/10">
        
        {/* Sticky Sidebar */}
        <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-10 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="max-w-md">
            <h2 className="text-6xl lg:text-7xl font-headline font-bold mb-8 leading-[1.1] tracking-tighter text-white">
              Upcoming <span className="text-[#9945FF]">Events</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Join the Malaysian Web3 community. We host workshops, hackathons, and exclusive networking sessions to help you build and scale on Solana.
            </p>
            <a 
              href="https://lu.ma/superteammy" 
              target="_blank" 
              className="inline-flex items-center gap-3 text-xs font-code font-bold uppercase tracking-[2px] px-10 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-[#9945FF] hover:text-black hover:border-[#9945FF] transition-all duration-300 group shadow-lg hover:shadow-[#9945FF]/20"
            >
              View Full Calendar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Scrolling Cards Column */}
        <div className="flex flex-col gap-16 lg:gap-24 p-10 lg:p-20">
          {events.map((event) => (
            <div key={event.id} className="event-high-fidelity-card group">
              <div className="relative h-[300px] w-full overflow-hidden border-b border-white/10">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                  data-ai-hint="event conference"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-1.5 rounded-full glass border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#9945FF] shadow-lg bg-black/40 backdrop-blur-md">
                    {event.type}
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-12">
                <div className="font-code text-sm text-[#9945FF] font-bold tracking-[4px] uppercase mb-6">
                  {event.date}
                </div>
                <h3 className="text-3xl lg:text-4xl font-headline font-bold mb-6 tracking-tight text-white group-hover:text-[#9945FF] transition-colors duration-300">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 text-muted-foreground mb-8">
                  <MapPin className="w-5 h-5 text-[#9945FF]" />
                  <span className="text-lg">{event.location}</span>
                </div>
                
                <div className="w-full h-px bg-white/10 mb-8" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground italic">
                    {event.type === 'Invite Only' ? 'Invite Only' : 'Limited Capacity'}
                  </span>
                  <a 
                    href={event.lumaUrl} 
                    target="_blank" 
                    className="flex items-center gap-3 font-bold group/btn text-white"
                  >
                    <span className="text-lg group-hover/btn:text-[#9945FF] transition-colors">{event.ctaText || 'Register'}</span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-[#9945FF] group-hover/btn:border-[#9945FF]">
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:-rotate-45" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
