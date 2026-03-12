'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import EcosystemPartners from '@/components/home/EcosystemPartners';
import EventSection from '@/components/home/EventSection';
import CommunityCarousel from '@/components/home/CommunityCarousel';
import WallOfLove from '@/components/home/WallOfLove';
import FaqCtaSection from '@/components/home/FaqCtaSection';
import Footer from '@/components/layout/Footer';
import { getStats } from '@/services/stats';
import { getUpcomingEvents } from '@/services/events';
import { getFeaturedMembers } from '@/services/members';
import { getPartners } from '@/services/partners';
import { getTestimonials } from '@/services/testimonials';
import { Stat, Event, Member, Partner, Testimonial } from '@/types/database';
import { Wrench, LayoutGrid, DollarSign, TrendingUp, Code2, Globe, CheckCircle2, Users, Database } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, any> = {
  Wrench, LayoutGrid, DollarSign, TrendingUp, Code2, Globe, CheckCircle2, Users
};

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<Member[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        const [s, e, m, p, t] = await Promise.all([
          getStats().catch(() => []),
          getUpcomingEvents().catch(() => []),
          getFeaturedMembers().catch(() => []),
          getPartners().catch(() => []),
          getTestimonials().catch(() => [])
        ]);
        
        setStats(s);
        setEvents(e);
        setFeaturedMembers(m);
        setPartners(p);
        setTestimonials(t);
        
        // If everything is empty, database probably needs seeding
        if (s.length === 0 && e.length === 0 && m.length === 0) {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load page data:', err);
        setError(true);
      }
    }
    initData();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {error && (
        <div className="fixed bottom-10 right-10 z-[200] max-w-sm">
          <div className="glass border-destructive/20 bg-destructive/10 p-6 rounded-2xl animate-fade-up">
            <div className="flex items-start gap-4">
              <Database className="w-5 h-5 text-destructive mt-1" />
              <div>
                <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-2">Sync Required</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">Core infrastructure tables not detected. Initialize the system to activate full functionality.</p>
                <Link href="/admin/seed" className="text-[10px] font-black uppercase text-primary underline">Execute Sync -&gt;</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Hero />
      
      <EcosystemPartners partners={partners} />

      {/* Mission Section */}
      <section id="mission" className="bg-black">
        {[
          { title: "Builder Support", index: "01", desc: "Superteam Malaysia helps developers, designers, and founders start building in the Solana ecosystem." },
          { title: "Events & Hackathons", index: "02", desc: "We host workshops, meetups, and hackathons that bring the Malaysian Web3 community together." },
          { title: "Grants & Funding", index: "03", desc: "Superteam connects builders with grants and funding opportunities across the Solana ecosystem." },
          { title: "Bounties & Opportunities", index: "04", desc: "Members can earn by contributing to real projects through ecosystem bounties and freelance opportunities." },
          { title: "Education & Learning", index: "05", desc: "We provide workshops, learning sessions, and community resources to help builders develop skills." },
        ].map((item, i) => (
          <div key={i} className="w-full border-b border-white/10">
            <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
              <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
                <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter text-white">{item.title}</h2>
                <div className="hidden lg:block font-code text-sm tracking-[4px] text-white font-bold">[ {item.index} / 05 ]</div>
              </div>
              <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
                <div className={i === 0 ? "shape-sphere" : i === 1 ? "shape-card" : i === 2 ? "shape-globe-mission" : i === 3 ? "shape-coin coin-1" : "shape-pyramid"}></div>
              </div>
              <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
                <p className="text-lg text-white leading-relaxed max-w-sm">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Dynamic Stats Section */}
      <section className="w-full bg-white/5 relative overflow-hidden border-b border-white/10">
        <div className="bg-watermark">S</div>
        <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[2.5fr_7.5fr] gap-10 md:gap-16 px-10 py-24 md:py-32">
          <div className="stats-header">
            <h2 className="text-5xl font-headline font-bold tracking-tight text-white">In <span className="text-white">Numbers</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-16 md:gap-y-20">
            {stats.length > 0 ? stats.map((stat, idx) => {
              const Icon = iconMap[stat.label.split(' ')[0]] || Globe;
              return (
                <div key={idx} className="stat-cell group border-l border-white/10 p-2.5 px-8 min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-white group-hover:text-primary transition-colors mt-0.5" />
                    <span className="text-sm font-medium text-white leading-tight uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-headline font-bold tracking-tighter mt-10 text-white group-hover:solana-text-gradient transition-all duration-300">
                    {stat.value}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-10 border-l border-white/10 pl-8">
                <p className="font-code text-xs uppercase tracking-widest text-muted-foreground italic">No system metrics detected.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <EventSection events={events} />
      <CommunityCarousel members={featuredMembers} />
      <WallOfLove testimonials={testimonials} />
      <FaqCtaSection />
      <Footer />
    </main>
  );
}
