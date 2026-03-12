
'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPartners } from '@/services/partners';
import { Partner } from '@/types/database';
import { ArrowLeft, ExternalLink, Globe, LayoutGrid, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function PartnerDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const all = await getPartners();
        const found = all.find(p => p.slug === slug);
        if (found) setPartner(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-code uppercase tracking-widest">Syncing Data...</div>;
  if (!partner) return notFound();

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-48 pb-20 px-10 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/ecosystem" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12 font-code text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20 items-end">
             <div>
                <div className="relative w-40 h-40 mb-10 border border-white/10 bg-white/5 p-8 rounded-2xl">
                   {partner.logo_url && <Image src={partner.logo_url} alt={partner.name} fill className="object-contain p-8" />}
                </div>
                <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
                  {partner.name}
                </h1>
                <div className="flex gap-4">
                  {partner.website_url && (
                    <a href={partner.website_url} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-primary transition-all">
                      Visit Website <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
             </div>
             <div className="pb-4">
                <p className="text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                  {partner.description}
                </p>
             </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] border-b border-white/10">
         <div className="p-10 lg:p-20 border-r border-white/10 space-y-16">
            <div>
               <div className="pill-badge mb-8">PROJECT OVERVIEW</div>
               <div className="prose prose-invert prose-2xl max-w-none text-white leading-relaxed font-body">
                  {partner.long_description || partner.description}
               </div>
            </div>

            <div className="glass p-12 rounded-[32px] border-primary/20 bg-primary/5 relative overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
               <Sparkles className="w-8 h-8 text-primary mb-8" />
               <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-6">Case <span className="text-primary">Study</span></h3>
               <p className="text-xl text-white/80 leading-relaxed font-medium">
                 {partner.case_study || "Case study documentation currently under internal review. Check back soon for the full technical analysis."}
               </p>
            </div>
         </div>

         <div className="bg-white/[0.02] p-10 lg:p-16 space-y-12">
            <div>
               <span className="font-code text-[10px] text-muted-foreground uppercase tracking-widest block mb-6">Core Focus</span>
               <div className="space-y-4">
                  {['Scalability', 'Security', 'Web3 UX'].map(t => (
                    <div key={t} className="flex items-center gap-3 p-4 border border-white/5 bg-black/40 text-white font-bold uppercase text-xs tracking-widest">
                       <Zap className="w-4 h-4 text-primary" /> {t}
                    </div>
                  ))}
               </div>
            </div>

            <div>
               <span className="font-code text-[10px] text-muted-foreground uppercase tracking-widest block mb-6">Impact Status</span>
               <div className="p-8 border border-white/10 bg-black">
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">70K+</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Users Scaled</div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
