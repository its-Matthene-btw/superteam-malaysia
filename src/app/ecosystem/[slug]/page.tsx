'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { EcosystemProject, EcosystemFeature, EcosystemOpportunity } from '@/types/ecosystem';
import { ArrowLeft, ExternalLink, Globe, LayoutGrid, Zap, Sparkles, Twitter, Github, Copy, CheckCircle2, Loader2, MessageSquare, ShieldCheck, Code2, Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<EcosystemProject | null>(null);
  const [features, setFeatures] = useState<EcosystemFeature[]>([]);
  const [similar, setSimilar] = useState<EcosystemProject[]>([]);
  const [opportunities, setOpportunities] = useState<EcosystemOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: pData } = await supabase
          .from('ecosystem_projects')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (pData) {
          setProject(pData);
          
          const [fData, sData, oData] = await Promise.all([
            supabase.from('ecosystem_features').select('*').eq('project_id', pData.id),
            supabase.from('ecosystem_projects').select('*').eq('category', pData.category).neq('id', pData.id).limit(3),
            supabase.from('ecosystem_opportunities').select('*').order('created_at', { ascending: false }).limit(3)
          ]);

          setFeatures(fData.data || []);
          setSimilar(sData.data || []);
          setOpportunities(oData.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const copyToClipboard = () => {
    if (project?.contract_address) {
      navigator.clipboard.writeText(project.contract_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">Accessing Node...</p>
    </div>
  );
  
  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-primary/30">
      <Navbar />

      {/* TOP NAV BAR */}
      <nav className="relative pt-24 pb-6 px-10 border-b border-white/10 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/ecosystem" className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> BACK_TO_ECOSYSTEM
          </Link>
        </div>
      </nav>

      {/* PROJECT HERO - SPLIT SYSTEM */}
      <header className="relative border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        <div className="p-10 lg:p-20 border-r border-white/10 flex flex-col justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#222] border border-white/10 overflow-hidden mb-10 group">
            {project.logo_url ? (
              <Image 
                src={project.logo_url} 
                alt={project.name} 
                width={80} 
                height={80} 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5"><Box className="w-10 h-10 text-white/20" /></div>
            )}
          </div>
          <div className="font-code text-[#14F195] text-xs font-bold tracking-[3px] mb-6 uppercase">
            // {project.category ? project.category.replace(/ /g, '_').toUpperCase() : 'GENERAL'}
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
            {project.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-12">
            {project.short_description}
          </p>
          <div className="flex flex-wrap gap-4">
            {project.website_url && (
              <a 
                href={project.website_url} 
                target="_blank" 
                className="px-10 py-5 bg-white text-black font-code font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-2"
              >
                Launch DApp <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.docs_url && (
              <a 
                href={project.docs_url} 
                target="_blank" 
                className="px-10 py-5 border border-white/10 text-white font-code font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Documentation
              </a>
            )}
          </div>
        </div>

        <div className="relative bg-[#111] overflow-hidden min-h-[400px] lg:min-h-full group">
          {project.hero_image_url ? (
            <Image 
              src={project.hero_image_url} 
              alt={project.name} 
              fill 
              className="object-cover grayscale contrast-125 opacity-40 mix-blend-screen group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.2)_0%,transparent_70%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* STATS STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-white/10">
        <StatBox label="Network" value={project.network || "Solana Mainnet"} />
        <StatBox label="Category" value={project.category || "General"} />
        <StatBox label="Status" value={project.status || "Live"} highlight />
        <StatBox label="Token" value={project.token_symbol ? `$${project.token_symbol}` : "No Token"} />
      </section>

      {/* MAIN CONTENT LAYOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] border-b border-white/10">
        {/* SIDEBAR */}
        <aside className="p-10 lg:p-16 border-r border-white/10 bg-[#050505] space-y-12">
          <div className="side-block">
            <h4 className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-8">// OFFICIAL_LINKS</h4>
            <div className="flex flex-col gap-2">
              <SideLink href={project.website_url} label="Website" />
              <SideLink href={project.twitter_url} label="Twitter / X" />
              <SideLink href={project.discord_url} label="Discord" />
            </div>
          </div>

          <div className="side-block">
            <h4 className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-8">// DEVELOPER_RESOURCES</h4>
            <div className="flex flex-col gap-2">
              <SideLink href={project.github_url} label="GitHub Repos" />
              <SideLink href={project.docs_url} label="API / SDK Docs" />
            </div>
          </div>

          {project.contract_address && (
            <div className="side-block">
              <h4 className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-8">// SMART_CONTRACT</h4>
              <div className="bg-[#0a0a0c] border border-white/10 p-4 rounded-lg flex items-center justify-between group">
                <span className="font-code text-[9px] text-muted-foreground truncate mr-2">
                  {project.contract_address}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="text-primary hover:text-white transition-colors"
                  title="Copy Address"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#14F195]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN ARTICLE */}
        <article className="p-10 lg:p-24 max-w-[1000px]">
          <div className="prose prose-invert prose-2xl max-w-none leading-relaxed text-white/80 font-body space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-10">About {project.name}</h2>
            <div className="whitespace-pre-wrap leading-loose text-xl">
              {project.long_description}
            </div>

            {/* FEATURE GRID */}
            {features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20">
                {features.map((feat) => (
                  <div key={feat.id} className="p-10 border border-white/10 bg-[#0f0f13] rounded-3xl group hover:border-primary/40 transition-all">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-primary transition-colors">{feat.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="my-20 p-10 border border-primary/20 bg-primary/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
              <ShieldCheck className="w-10 h-10 text-primary mb-8" />
              <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-8">Developer <span className="text-primary">Integration</span></h3>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                Builders in the Superteam Malaysia network frequently utilize {project.name}'s architecture. The {project.name} API and SDK allow developers to natively embed world-class capabilities directly into their own applications.
              </p>
              <p className="text-lg text-white/60 mt-6 italic">
                If you are building a project that requires deep {project.category} capabilities, utilizing the {project.name} stack is the recommended standard for the Malaysian ecosystem.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* OPPORTUNITIES SECTION */}
      {opportunities.length > 0 && (
        <section className="py-32 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-10">
            <div className="mb-16">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// ACTIVE_OPPORTUNITIES</div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Get Involved</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
              {opportunities.map(opp => (
                <div key={opp.id} className="bg-[#0a0a0c] p-12 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors h-full">
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
                    {opp.type === 'Bounty' ? 'View Bounty' : opp.type === 'Job' ? 'Apply on Superteam' : 'Apply for Grant'} <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SIMILAR PROTOCOLS */}
      {similar.length > 0 && (
        <section className="py-32 bg-[#050505] border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-10">
            <div className="mb-16">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// ECOSYSTEM_EXPLORATION</div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Similar Protocols</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
              {similar.map(p => (
                <Link 
                  key={p.id} 
                  href={`/ecosystem/${p.slug}`}
                  className="bg-[#0a0a0c] p-12 flex flex-col group hover:bg-white/[0.02] transition-colors h-full"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#222] border border-white/10 overflow-hidden">
                      {p.logo_url && <Image src={p.logo_url} alt={p.name} width={56} height={56} className="object-cover" />}
                    </div>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-primary transition-all" />
                  </div>
                  <div className="font-code text-[9px] text-primary uppercase tracking-widest mb-3">{p.category}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{p.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{p.short_description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-40 text-center relative overflow-hidden bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(153,69,255,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-10 relative z-10">
          <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-6">// STAY_UPDATED</div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
            Join the Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground mb-12">Get notified about new protocol launches, airdrops, and developer bounties in the region.</p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-6">
            <div className="flex border border-white/10 bg-black p-1">
              <input 
                type="email" 
                placeholder="ENTER_EMAIL_ADDRESS" 
                className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-code text-sm uppercase"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="bg-primary text-black font-black uppercase px-10 hover:bg-white transition-colors text-xs tracking-widest"
              >
                JOIN
              </button>
            </div>
            {subscribed && (
              <p className="font-code text-[10px] text-[#14F195] uppercase tracking-widest flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> SYSTEM_UPDATE: CREDENTIALS_ACCEPTED
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="bg-[#0f0f13] p-10 border-r border-white/10 last:border-r-0 flex flex-col justify-center">
      <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest mb-4">{label}</div>
      <div className={cn(
        "text-2xl font-black uppercase tracking-tight",
        highlight ? "text-[#14F195]" : "text-white"
      )}>
        {value}
      </div>
    </div>
  );
}

function SideLink({ href, label }: { href?: string | null, label: string }) {
  if (!href) return null;
  return (
    <a 
      href={href} 
      target="_blank" 
      className="flex justify-between items-center py-4 border-b border-white/5 text-white hover:text-primary hover:border-primary transition-all font-code text-xs uppercase tracking-widest group"
    >
      <span>{label}</span>
      <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}
