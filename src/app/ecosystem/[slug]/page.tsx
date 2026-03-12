
'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { EcosystemProject } from '@/types/ecosystem';
import { ArrowLeft, ExternalLink, Globe, LayoutGrid, Zap, Sparkles, Twitter, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<EcosystemProject | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('ecosystem_projects')
          .select('*')
          .eq('slug', slug)
          .single();
        if (data) setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-code uppercase tracking-widest animate-pulse">Accessing Node...</div>;
  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-primary/30">
      <Navbar />

      {/* ARTICLE HERO - SPLIT SYSTEM */}
      <header className="relative pt-20 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="p-10 lg:p-20 border-r border-white/10 flex flex-col justify-center">
          <Link href="/ecosystem" className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-12 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> BACK_TO_DIRECTORY
          </Link>
          <div className="article-category font-code text-primary text-xs font-bold tracking-[3px] mb-6">// {project.category.toUpperCase().replace(/ /g, '_')}</div>
          <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
            {project.name}
          </h1>
          <div className="font-code text-xs text-muted-foreground tracking-[2px]">
            PROJECT_ID: {project.id.slice(0, 8).toUpperCase()}
          </div>
        </div>

        <div className="relative bg-zinc-900 overflow-hidden min-h-[400px] lg:min-h-full">
          {project.hero_image_url ? (
            <Image 
              src={project.hero_image_url} 
              alt={project.name} 
              fill 
              className="object-cover grayscale contrast-125 opacity-50 mix-blend-screen"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,69,255,0.2)_0%,transparent_70%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* MAIN LAYOUT - SIDEBAR + CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] border-b border-white/10">
        {/* Meta Sidebar */}
        <aside className="p-10 lg:p-16 border-r border-white/10 space-y-12 flex flex-col">
          <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden p-4 mb-4">
            {project.logo_url && <Image src={project.logo_url} alt={project.name} width={96} height={96} className="object-contain" />}
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Status</div>
              <div className="font-code text-sm font-bold text-primary uppercase">{project.status}_ONLINE</div>
            </div>
            <div className="space-y-2">
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Links</div>
              <div className="flex flex-col gap-3">
                {project.website_url && (
                  <a href={project.website_url} target="_blank" className="font-code text-[11px] font-bold text-white flex items-center gap-2 hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" /> WEBSITE
                  </a>
                )}
                {project.twitter_url && (
                  <a href={project.twitter_url} target="_blank" className="font-code text-[11px] font-bold text-white flex items-center gap-2 hover:text-primary transition-colors">
                    <Twitter className="w-3 h-3" /> TWITTER_X
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" className="font-code text-[11px] font-bold text-white flex items-center gap-2 hover:text-primary transition-colors">
                    <Github className="w-3 h-3" /> GITHUB_REPO
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <article className="p-10 lg:p-24 max-w-[1000px]">
          <div className="prose prose-invert prose-2xl max-w-none leading-relaxed text-white/80 font-body space-y-12">
            <div className="text-2xl lg:text-3xl font-bold text-white mb-16 border-l-4 border-primary pl-10 py-2">
              {project.short_description}
            </div>
            
            <div className="whitespace-pre-wrap leading-loose">
              {project.long_description || "Project documentation under review. This protocol is a core component of the Malaysian Solana infrastructure, providing essential services to builders and participants in the region."}
            </div>

            <div className="my-20 p-10 border border-primary/20 bg-primary/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
              <Sparkles className="w-10 h-10 text-primary mb-8" />
              <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-8">Ecosystem <span className="text-primary">Impact</span></h3>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                Successfully onboarded local developers and integrated high-speed Solana infrastructure to serve the Southeast Asian market. This project represents a critical bridge between local talent and global DeFi liquidity.
              </p>
            </div>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
