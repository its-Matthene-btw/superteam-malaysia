"use client";

import Image from 'next/image';

const partners = [
  { name: 'Solana', logo: 'https://picsum.photos/seed/sol/200/100' },
  { name: 'Pyth', logo: 'https://picsum.photos/seed/pyth/200/100' },
  { name: 'Jupiter', logo: 'https://picsum.photos/seed/jup/200/100' },
  { name: 'MDEC', logo: 'https://picsum.photos/seed/mdec/200/100' },
  { name: 'Phantom', logo: 'https://picsum.photos/seed/phan/200/100' },
  { name: 'Backpack', logo: 'https://picsum.photos/seed/bp/200/100' },
];

export default function EcosystemPartners() {
  return (
    <section id="ecosystem" className="w-full bg-black border-b border-white/10">
      <div className="max-w-[1400px] mx-auto border-x border-white/10 overflow-hidden">
        <div className="py-12 relative flex">
          <div className="animate-infinite-scroll flex items-center gap-12 px-6">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              <div 
                key={idx} 
                className="relative group flex-shrink-0 w-40 h-20 flex items-center justify-center transition-all duration-500"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl blur-xl transition-all duration-500" />
                <Image 
                  src={partner.logo} 
                  alt={partner.name} 
                  width={140} 
                  height={50} 
                  className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(153,69,255,0.6)] transition-all duration-500 ease-out"
                  data-ai-hint="logo"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
