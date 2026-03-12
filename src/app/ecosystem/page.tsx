
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPartners } from '@/services/partners';
import { Partner } from '@/types/database';
import { ArrowRight, Loader2, ExternalLink, Box } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EcosystemPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative pt-48 pb-32 px-10 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(20,241,149,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="pill-badge mb-8"><span>✦</span> NETWORK INFRASTRUCTURE</div>
          <h1 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8] mb-12">
            <span className="text-white">PROJECT</span><br />
            <span className="text-[#14F195]">DIRECTORY</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            The protocols, tools, and platforms powering the Solana revolution in Malaysia.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#14F195] animate-spin mb-4" />
              <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">Indexing Ecosystem...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-x border-white/10">
              {partners.map((partner) => (
                <Link 
                  key={partner.id} 
                  href={`/ecosystem/${partner.slug}`}
                  className="group relative h-[450px] border-b border-r border-white/10 overflow-hidden flex flex-col justify-end p-10 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="absolute top-10 left-10 w-24 h-24 relative">
                    {partner.logo_url && (
                      <Image src={partner.logo_url} alt={partner.name} fill className="object-contain grayscale group-hover:grayscale-0 transition-all" />
                    )}
                  </div>
                  
                  <div className="relative z-10">
                    <span className="font-code text-[10px] text-[#14F195] uppercase tracking-widest mb-4 block">[{partner.name.toUpperCase()}]</span>
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-6 group-hover:text-[#14F195] transition-colors">{partner.name}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-8">{partner.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/20 pb-1 group-hover:border-[#14F195] transition-all">View Case Study</span>
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-[#14F195] group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
