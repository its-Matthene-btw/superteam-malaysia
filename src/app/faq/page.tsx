
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getFAQs } from '@/services/faqs';
import { FAQ } from '@/types/database';
import { cn } from '@/lib/utils';
import { Plus, Minus, Loader2, Sparkles, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFAQs();
        setFaqs(data);
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

      <section className="relative pt-48 pb-32 px-10 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(153,69,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10 text-center">
          <div className="pill-badge mb-8 mx-auto"><span>✦</span> KNOWLEDGE BASE</div>
          <h1 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8] mb-12 text-white">
            FREQUENTLY ASKED<br />
            <span className="solana-text-gradient">QUESTIONS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to know about joining Superteam, securing grants, and contributing to the Solana ecosystem in Malaysia.
          </p>
        </div>
      </section>

      <section className="py-24 px-10 bg-white/[0.01]">
        <div className="max-w-[1000px] mx-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">Accessing Records...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-20 text-center border border-white/10 glass rounded-3xl">
               <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <p className="font-code text-muted-foreground uppercase tracking-widest">No FAQ entries indexed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={faq.id} className={cn(
                  "glass border-white/10 transition-all duration-500 rounded-[24px] overflow-hidden",
                  openIndex === idx ? "border-primary/40 bg-white/[0.03]" : "hover:border-white/20"
                )}>
                  <button 
                    className="w-full flex items-center justify-between p-8 lg:p-10 text-left group"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <h3 className={cn(
                      "text-2xl lg:text-3xl font-headline font-bold transition-colors",
                      openIndex === idx ? "text-primary" : "text-white group-hover:text-primary"
                    )}>
                      {faq.question}
                    </h3>
                    <div className={cn(
                      "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all",
                      openIndex === idx ? "bg-primary border-primary text-black rotate-180" : "text-white"
                    )}>
                      {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-8 lg:px-10 pb-10 text-xl text-white/70 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-32 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-8">Still have <span className="text-secondary">doubts?</span></h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-md">Our team is available on Discord and via email to help you navigate the ecosystem.</p>
          </div>
          <div className="flex gap-4">
             <a href="/contact" className="px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all">Contact Us</a>
             <a href="https://discord.gg/superteammy" target="_blank" className="px-12 py-6 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Join Discord</a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
