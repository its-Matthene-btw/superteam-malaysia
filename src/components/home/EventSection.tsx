
"use client";

import { events } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function EventSection() {
  return (
    <section id="events" className="py-24 px-4 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-headline font-bold mb-4">Ecosystem <span className="solana-text-gradient">Events</span></h2>
            <p className="text-muted-foreground max-w-xl">
              Stay connected with the community through our workshops, meetups, and hackathons across Malaysia.
            </p>
          </div>
          <a href="https://lu.ma/superteammy" target="_blank" className="text-secondary hover:underline flex items-center gap-2 font-medium">
            View Luma Calendar <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="glass border-white/5 overflow-hidden group">
              <div className="relative h-64">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="event conference"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={event.type === 'Upcoming' ? 'bg-secondary text-black' : 'bg-muted'}>
                    {event.type}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.location}
                  </div>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">{event.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  {event.description}
                </p>
                <a 
                  href={event.lumaUrl} 
                  target="_blank" 
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-semibold"
                >
                  Register via Luma
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
