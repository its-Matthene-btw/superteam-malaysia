
'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getFAQs } from '@/services/faqs';
import { FAQ } from '@/types/database';
import { cn } from '@/lib/utils';
import { Plus, Minus, Loader2, Sparkles, HelpCircle, AlertCircle, Search, ChevronRight, Send } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Grants & Funding');
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getFAQs();
        setFaqs(data);
        if (data.length > 0) {
          setActiveCategory(data[0].category);
        }
      } catch (e: any) {
        console.error('FAQ Fetch Failure:', e);
        setError(e.message || 'Could not access the knowledge base.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map(f => f.category)));
    return cats;
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchesSearch = f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            f.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = searchTerm.length > 0 || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, activeCategory, searchTerm]);

  const categoryCounts = useMemo(() => {
    return faqs.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [faqs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">Accessing Records...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30 font-body">
      <Navbar />

      {/* TOP NAV BAR (Static) */}
      <nav className="relative pt-20 px-10 h-20 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-xl">
        <Link href="/" className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] hover:text-primary transition-colors flex items-center gap-2">
          <span>←</span> SYSTEM_ROOT
        </Link>
        <span className="font-code text-[10px] text-[#14F195] uppercase tracking-[3px] hidden sm:block">// DATA_RETRIEVAL_MODE</span>
      </nav>

      {/* TERMINAL HEADER */}
      <header className="relative border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] bg-white/5">
        <div className="p-10 lg:p-24 border-r border-white/10 flex flex-col justify-center relative overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_right,black:0%,transparent_100%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="font-code text-primary text-xs font-bold tracking-[3px] mb-6 uppercase">// KNOWLEDGE_BASE_v2.0</div>
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
              Query<br />System.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
              Access parameters for Grants, Ecosystem Bounties, Build Stations, and Technical Support protocols across the Malaysian network.
            </p>
          </div>
        </div>

        <div className="bg-[#050505] p-10 lg:p-24 flex items-center justify-center">
          <div className="w-full max-w-[600px] bg-[#030303] border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_30px_rgba(153,69,255,0.15)]">
            <div className="bg-[#111] px-6 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="font-code text-[10px] text-muted-foreground ml-4 uppercase tracking-widest">bash - query_engine</span>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 font-code text-sm">
                <span className="text-[#14F195]">guest@superteam-my</span>:<span className="text-primary">~/docs</span>$ 
                <span className="text-muted-foreground">./search_protocol.sh</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold font-code text-xl">❯</span>
                <input 
                  type="text" 
                  placeholder="Enter search parameter..." 
                  className="flex-1 bg-transparent border-none text-white font-code text-lg outline-none caret-primary placeholder:text-[#222]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ASYMMETRIC GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] border-b border-white/10 min-h-screen">
        {/* SIDEBAR DIRECTORY */}
        <aside className="p-10 lg:p-16 border-r border-white/10 bg-[#050505]">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-10 flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full" /> DATA_DIRECTORIES
          </div>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchTerm('');
                }}
                className={cn(
                  "w-full text-left p-5 font-code text-xs uppercase tracking-widest transition-all flex justify-between items-center group",
                  activeCategory === cat && !searchTerm ? "bg-black border border-primary text-primary border-l-4" : "border border-transparent text-white hover:bg-white/5 hover:border-white/10"
                )}
              >
                {cat} 
                <span className="text-muted-foreground group-hover:text-primary">[{categoryCounts[cat]?.toString().padStart(2, '0')}]</span>
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="p-10 lg:p-24 bg-black">
          <div className="max-w-[900px]">
            <div className="flex items-center gap-6 mb-16">
              <span className="font-code text-sm border border-primary text-primary px-3 py-1">
                {searchTerm ? 'SEARCH' : categories.indexOf(activeCategory) + 1 < 10 ? `0${categories.indexOf(activeCategory) + 1}` : categories.indexOf(activeCategory) + 1}
              </span>
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight">
                {searchTerm ? `Results for "${searchTerm}"` : activeCategory}
              </h2>
            </div>

            <div className="border border-white/10 bg-white/[0.02]">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className={cn(
                  "border-b border-white/10 last:border-b-0 transition-all duration-300",
                  openId === faq.id ? "bg-black" : "hover:bg-white/[0.03]"
                )}>
                  <button 
                    className="w-full grid grid-cols-[60px_1fr_40px] items-center p-8 text-left group"
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <span className="font-code text-xs text-primary font-bold">{faq.faq_id || 'FAQ'}</span>
                    <span className={cn(
                      "text-xl font-bold transition-colors",
                      openId === faq.id ? "text-primary" : "text-white group-hover:text-primary"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all",
                      openId === faq.id ? "bg-primary border-primary text-black rotate-45" : "text-muted-foreground"
                    )}>
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    openId === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="pl-[100px] pr-10 pb-10 text-xl text-muted-foreground leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="p-20 text-center text-muted-foreground font-code uppercase text-xs tracking-widest">
                  No matching parameters found in database.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* UNRESOLVED QUERY CTA */}
      <section className="py-32 px-10 bg-white/5 text-center relative overflow-hidden border-b border-white/10">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="font-code text-primary text-[10px] uppercase tracking-[3px] mb-6">// UNRESOLVED_QUERY</div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
            Data Not Found?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">If your specific parameters were not addressed in the knowledge base, establish a direct connection with our ops team.</p>
          <Link href="/contact" className="px-12 py-6 bg-white text-black font-code font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 mx-auto w-fit">
            INITIATE_COMMUNICATION <Send className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
