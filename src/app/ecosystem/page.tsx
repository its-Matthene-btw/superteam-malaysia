'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { EcosystemProject, EcosystemCategory, EcosystemOpportunity } from '@/types/ecosystem';
import { NewsPost } from '@/types/database';
import { ArrowRight, Loader2, Search, Zap, ExternalLink, Globe, LayoutGrid, Box, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AnimatedSection, AnimatedItem } from '@/components/layout/AnimatedSection';

export default function EcosystemPage() {
  const [projects, setProjects] = useState<EcosystemProject[]>([]);
  const [categories, setCategories] = useState<EcosystemCategory[]>([]);
  const [opportunities, setOpportunities] = useState<EcosystemOpportunity[]>([]);
  const [randomPost, setRandomPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, c, o, n] = await Promise.all([
          supabase.from('ecosystem_projects').select('*').order('name'),
          supabase.from('ecosystem_categories').select('*').order('name'),
          supabase.from('ecosystem_opportunities').select('*').order('created_at', { ascending: false }),
          supabase.from('news').select('*').order('published_at', { ascending: false }).limit(10)
        ]);
        
        setProjects(p.data || []);
        setCategories(c.data || []);
        setOpportunities(o.data || []);
        
        if (n.data && n.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * n.data.length);
          setRandomPost(n.data[randomIndex]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchTerm]);

  const featured = projects.filter(p => p.featured).slice(0, 2);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navbar />

      {/* HERO SECTION */}
      <AnimatedSection className="relative z-10 pt-40 pb-20 border-b border-white/10 overflow-hidden bg-black" staggerChildren={0.2}>
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(to_bottom,black:20%,transparent_100%)]" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <AnimatedItem>
              <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-6">// MALAYSIA_NETWORK</div>
            </AnimatedItem>
            <AnimatedItem>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
                The Solana<br /><span className="text-primary">Ecosystem</span>
              </h1>
            </AnimatedItem>
            <AnimatedItem>
              <p className="text-xl text-muted-foreground max-w-lg mb-12 font-medium">
                Explore the leading protocols, infrastructure, and developer tools built by and for the Malaysian Web3 community.
              </p>
            </AnimatedItem>
            
            <div className="grid grid-cols-3 gap-8">
              <AnimatedItem><StatItem value={projects.length} label="Ecosystem Projects" /></AnimatedItem>
              <AnimatedItem><StatItem value={45} label="Global Partners" /></AnimatedItem>
              <AnimatedItem><StatItem value="2.5k" label="Active Builders" /></AnimatedItem>
            </div>
          </div>

          <AnimatedItem className="relative group perspective-1000 hidden lg:block">
            <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden bg-black shadow-2xl transition-transform duration-700 hover:scale-[1.02] group">
              <Image 
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200" 
                alt="Ecosystem Blueprint" 
                fill 
                className="object-cover grayscale contrast-125 opacity-40 mix-blend-screen group-hover:opacity-60 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </AnimatedItem>
        </div>
      </AnimatedSection>

      {/* FILTER BAR - Conditional to ensure animation triggers correctly after data load */}
      {!loading && (
        <AnimatedSection className="relative z-20 bg-black border-b border-white/10 py-10">
          <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between gap-6">
            <AnimatedItem className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
                label="All Ecosystem" 
              />
              {categories.map(cat => (
                <FilterButton 
                  key={cat.id}
                  active={activeFilter === cat.name}
                  onClick={() => setActiveFilter(cat.name)}
                  label={cat.name}
                />
              ))}
            </AnimatedItem>
            <AnimatedItem className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search protocols..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </AnimatedItem>
          </div>
        </AnimatedSection>
      )}

      {/* PROJECT GRID */}
      {loading ? (
        <section className="py-40 flex flex-col items-center justify-center bg-black border-b border-white/10">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="font-code text-[10px] uppercase tracking-[4px] text-muted-foreground">Accessing Node...</p>
        </section>
      ) : (
        <AnimatedSection className="relative z-30 py-20 border-b border-white/10 bg-black" staggerChildren={0.1}>
          <div className="max-w-[1400px] mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10 relative z-40">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-40 text-center bg-black">
                  <Box className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="font-code text-xs uppercase tracking-widest text-muted-foreground text-center">No projects listed in this category yet.</p>
                </div>
              ) : (
                filteredProjects.map((p) => (
                  <AnimatedItem key={p.id} className="h-full">
                    <ProjectCard project={p} />
                  </AnimatedItem>
                ))
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* FEATURED PILLARS */}
      {!loading && featured.length > 0 && (
        <AnimatedSection className="relative z-10 py-32 bg-black border-b border-white/10" staggerChildren={0.2}>
          <div className="max-w-[1400px] mx-auto px-10">
            <AnimatedItem className="mb-16">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// FEATURED_PROTOCOLS</div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Ecosystem Pillars</h2>
            </AnimatedItem>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {featured.map(p => (
                <AnimatedItem key={p.id}>
                  <FeaturedCard project={p} />
                </AnimatedItem>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* DEEP DIVE SECTION */}
      {!loading && randomPost && (
        <AnimatedSection className="relative z-10 border-b border-white/10 bg-black" staggerChildren={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <AnimatedItem className="p-10 lg:p-24 border-r border-white/10 flex flex-col justify-center h-full bg-black">
              <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-8">// DEEP_DIVE_PREVIEW</div>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-10">
                {randomPost.title.split(' ').slice(0, 2).join(' ')}:<br />
                <span className="text-primary">{randomPost.title.split(' ').slice(2).join(' ')}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed">
                {randomPost.excerpt || "Discover the innovations scaling world-class protocols on Solana."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={`/news/${randomPost.slug}`} className="px-10 py-5 bg-white text-black font-code font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
                  Read Case Study
                </Link>
                <Link href="/news" className="px-10 py-5 border border-white/10 text-white font-code font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                  Visit Feed
                </Link>
              </div>
            </AnimatedItem>
            <AnimatedItem className="relative bg-black min-h-[500px] overflow-hidden group">
              {randomPost.image_url ? (
                <Image 
                  src={randomPost.image_url} 
                  alt={randomPost.title} 
                  fill 
                  className="object-cover grayscale opacity-40 mix-blend-screen group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.2)_0%,transparent_70%)]" />
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />
            </AnimatedItem>
          </div>
        </AnimatedSection>
      )}

      {/* OPPORTUNITIES */}
      {!loading && opportunities.length > 0 && (
        <AnimatedSection className="relative z-10 py-32 border-b border-white/10 bg-black" staggerChildren={0.1}>
          <div className="max-w-[1400px] mx-auto px-10">
            <AnimatedItem className="mb-16">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// ACTIVE_OPPORTUNITIES</div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Get Involved</h2>
            </AnimatedItem>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
              {opportunities.map(opp => (
                <AnimatedItem key={opp.id}>
                  <div className="bg-black p-12 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors h-full">
                    <div>
                      <div className={cn(
                        "inline-block px-4 py-1.5 rounded-full font-code text-[10px] font-bold uppercase tracking-widest mb-8 border",
                        opp.type === 'Grant' ? "border-[#14F195] text-[#14F195]" : 
                        opp.type === 'Bounty' ? "border-primary text-primary" : "border-yellow-500 text-yellow-500"
                      )}>
                        {opp.type}
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight mb-6">{opp.title}</h3>
                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">{opp.description}</p>
                    </div>
                    <a href={opp.link || '#'} target="_blank" className="font-code text-xs font-bold uppercase tracking-widest flex items-center gap-3 group-hover:text-primary transition-colors">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      <Footer />
    </main>
  );
}

function StatItem({ value, label }: { value: any, label: string }) {
  const [count, setCount] = useState(0);
  const target = typeof value === 'string' ? parseInt(value) : value;

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="border-l-2 border-primary pl-6">
      <div className="text-4xl font-black font-code text-white mb-1">
        {count}{typeof value === 'string' && value.includes('k') ? 'k+' : '+'}
      </div>
      <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-8 py-3 rounded-full font-code text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
        active 
          ? "bg-white text-black border-white" 
          : "bg-transparent text-muted-foreground border-white/10 hover:border-white/40 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function ProjectCard({ project }: { project: EcosystemProject }) {
  return (
    <Link 
      href={`/ecosystem/${project.slug}`}
      className="bg-black p-10 flex flex-col group transition-all duration-500 hover:bg-[#050505] relative overflow-hidden h-full z-50"
    >
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-colors z-10 pointer-events-none shadow-[inset_0_0_30px_rgba(153,69,255,0)] group-hover:shadow-[inset_0_0_30px_rgba(153,69,255,0.1)]" />
      <div className="flex justify-between items-start mb-8 relative z-20">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden p-2">
          {project.logo_url ? (
            <Image src={project.logo_url} alt={project.name} width={56} height={56} className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5"><Box className="w-6 h-6 text-white/20" /></div>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
      <div className="relative z-20 flex-1">
        <div className="font-code text-[9px] text-primary font-bold uppercase tracking-widest mb-2">{project.category}</div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-white transition-colors">{project.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:text-white/70 transition-colors">{project.short_description}</p>
      </div>
    </Link>
  );
}

function FeaturedCard({ project }: { project: EcosystemProject }) {
  return (
    <Link 
      href={`/ecosystem/${project.slug}`}
      className="rounded-3xl border border-white/10 overflow-hidden flex flex-col group transition-all duration-500 hover:border-primary hover:shadow-[0_0_50px_rgba(153,69,255,0.2)] bg-black h-full relative z-10"
    >
      <div className="h-60 relative overflow-hidden bg-zinc-900">
        <Image 
          src={project.hero_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'} 
          alt={project.name} 
          fill 
          className="object-cover opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div className="p-10 -mt-16 relative z-10 flex-1 flex flex-col">
        <div className="w-16 h-16 rounded-2xl bg-black border-2 border-black shadow-xl overflow-hidden p-3 mb-6 relative">
          {project.logo_url && <Image src={project.logo_url} alt={project.name} width={64} height={64} className="object-contain" />}
        </div>
        <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{project.name}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 flex-1">{project.short_description}</p>
        <div className="font-code text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-3">
          Explore Protocol <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}