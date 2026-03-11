
"use client";

import { partners } from '@/lib/data';
import Image from 'next/image';

export default function EcosystemPartners() {
  return (
    <section id="ecosystem" className="py-24 px-4 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-headline font-bold mb-4">Empowered by the <span className="solana-text-gradient">Ecosystem</span></h2>
        <p className="text-muted-foreground">Collaborating with the world's leading protocols and local institutions.</p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-infinite-scroll flex items-center py-8">
          {[...partners, ...partners].map((partner, idx) => (
            <div key={idx} className="mx-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
              <Image 
                src={partner.logo} 
                alt={partner.name} 
                width={160} 
                height={60} 
                className="object-contain"
                data-ai-hint="logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
