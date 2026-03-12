
"use client";

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FaqCtaSection from '@/components/home/FaqCtaSection';
import { members } from '@/lib/data';
import { Search, X, Briefcase, Twitter, Github, Linkedin, Building2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('@/components/members/Globe'), { ssr: false });

export default function MemberDirectory() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const categories = ['All', 'Developer', 'Designer', 'Writer', 'Growth'];

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                            m.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
                            m.company.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || m.track === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const displayedMembers = filteredMembers.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      
      {/* HERO SECTION - Full Width Header */}
      <section className="relative overflow-hidden bg-black border-b border-white/10 flex flex-col min-h-screen min-h-[100svh] min-[1201px]:block min-[1201px]:min-h-[750px] w-full">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] bg-center [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />
        <div className="absolute top-[-30%] left-[20%] w-[1000px] h-[800px] bg-[radial-gradient(circle,rgba(153,69,255,0.25)_0%,transparent_70%)] rounded-full pointer-events-none z-0" />
        
        {/* Main Content Area - 3 Zone Vertical Flex System for Tablet/Mobile */}
        <div className="flex flex-col flex-grow relative z-10 min-[1201px]:flex-row min-[1201px]:h-full min-[1201px]:min-h-[750px] w-full">
          
          {/* ZONE 1: TEXT BLOCK (TOP) */}
          <div className="flex-shrink-0 pt-32 pb-10 px-6 text-center min-[1201px]:pt-48 min-[1201px]:pb-32 min-[1201px]:w-3/5 min-[1201px]:text-left min-[1201px]:flex min-[1201px]:flex-col min-[1201px]:justify-center min-[1201px]:px-20 z-10">
            <div className="pill-badge mb-8 bg-black/50 backdrop-blur-md inline-flex mx-auto min-[1201px]:mx-0">
              <span>✦</span> THE DIRECTORY
            </div>
            <h1 className="text-[clamp(4rem,8vw,7.5rem)] font-black uppercase tracking-tighter leading-[0.9] mb-10 flex flex-col">
              <span className="text-white">BUILDER</span>
              <span className="text-black [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)] tracking-[0.02em]">NETWORK</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto min-[1201px]:mx-0 leading-relaxed font-medium [text-shadow:0_4px_20px_rgba(0,0,0,0.8)]">
              Discover the top developers, designers, and founders scaling the Solana ecosystem across Malaysia.
            </p>
          </div>
          
          {/* ZONE 2: GLOBE AREA (MIDDLE - FLEX GROW) */}
          <div className="flex-grow relative w-full min-h-[400px] min-[1201px]:absolute min-[1201px]:inset-0 min-[1201px]:z-0 pointer-events-auto overflow-hidden">
            <Globe />
          </div>
        </div>

        {/* ZONE 3: MARQUEE TICKER (BOTTOM - FLEX SHRINK 0) */}
        <div className="flex-shrink-0 w-full bg-[#9945FF] py-4 overflow-hidden relative z-20 border-y border-white/10 mt-auto">
          <div className="flex whitespace-nowrap animate-infinite-scroll">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                {['RUST', 'SOLANA', 'ANCHOR', 'REACT', 'TYPESCRIPT', 'DEFI', 'WEB3.JS', 'SMART CONTRACTS'].map(item => (
                  <span key={item} className="font-code font-bold text-black tracking-[2px] flex items-center gap-12 text-sm uppercase">
                    {item} <span className="text-[10px]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH & FILTERS SECTION - EDGE TO EDGE */}
      <section className="bg-black border-b border-white/10 w-screen max-w-none">
        <div className="w-full px-10 py-10">
          <div className="flex flex-col gap-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search developers, designers, or protocols..."
                className="w-full bg-white/5 border border-white/10 text-white p-6 pl-16 text-xl outline-none focus:border-primary transition-all rounded-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(8);
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={cn(
                    "px-8 py-3 font-code text-xs uppercase tracking-widest border transition-all",
                    activeFilter === cat 
                      ? "bg-primary border-primary text-black font-bold" 
                      : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/40 hover:text-white"
                  )}
                  onClick={() => {
                    setActiveFilter(cat);
                    setVisibleCount(8);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEMBER GRID SECTION - Maximum 4 cards per row */}
      <section className="bg-black w-screen max-w-none">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border-b border-white/10">
            {displayedMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-[#050505] flex flex-col cursor-pointer group transition-all duration-500 hover:bg-primary"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative h-[320px] overflow-hidden border-b border-white/10">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover object-[center_15%] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-code text-[10px] uppercase tracking-[2px] text-primary group-hover:text-black font-bold transition-colors">
                      [{member.track}]
                    </span>
                    <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-black transition-colors mb-2">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-black/70 transition-colors mb-8">
                    <Building2 className="w-4 h-4" />
                    {member.company}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {member.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="font-code text-[9px] px-2 py-1 border border-white/10 text-muted-foreground group-hover:text-black group-hover:border-black/20 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedMembers.length === 0 && (
            <div className="py-32 text-center border-b border-white/10">
              <p className="font-code text-muted-foreground uppercase tracking-widest">No builders found matching your criteria.</p>
            </div>
          )}

          {filteredMembers.length > visibleCount && (
            <div className="py-20 flex justify-center border-b border-white/10">
              <button 
                className="px-12 py-5 border border-white/10 text-white font-code font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                onClick={() => setVisibleCount(prev => prev + 8)}
              >
                Load More Builders
              </button>
            </div>
          )}
        </div>
      </section>

      <FaqCtaSection />
      <Footer />

      {/* MEMBER MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-10">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative w-full max-w-5xl bg-[#050505] border border-white/10 flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all"
              onClick={() => setSelectedMember(null)}
            >
              <X />
            </button>
            
            <div className="lg:w-2/5 relative min-h-[400px] lg:min-h-full border-r border-white/10">
              <Image src={selectedMember.image} alt={selectedMember.name} fill className="object-cover object-[center_15%] grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
            
            <div className="lg:w-3/5 p-10 lg:p-16 flex flex-col">
              <span className="font-code text-primary uppercase tracking-[3px] mb-4">[{selectedMember.track}]</span>
              <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6">
                {selectedMember.name}
              </h2>
              <div className="flex items-center gap-3 text-xl text-muted-foreground mb-10">
                <Briefcase className="w-6 h-6" />
                {selectedMember.company}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-12 whitespace-normal">
                {selectedMember.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="p-6 border border-white/10 bg-white/5">
                  <span className="block font-code text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Social Network</span>
                  <div className="flex gap-4">
                    <a href="#" className="text-white hover:text-primary transition-colors"><Twitter /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Github /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Linkedin /></a>
                  </div>
                </div>
                <div className="p-6 border border-white/10 bg-white/5">
                  <span className="block font-code text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Core Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((s: string) => (
                      <span key={s} className="text-xs font-bold text-primary">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <a 
                href={selectedMember.social.twitter} 
                target="_blank"
                className="mt-auto inline-flex items-center justify-between w-full p-6 border border-white/10 text-white font-code font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
              >
                Connect on X
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
