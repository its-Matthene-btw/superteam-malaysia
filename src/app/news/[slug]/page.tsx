
'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPostBySlug } from '@/services/news';
import { NewsPost } from '@/types/database';
import { ArrowLeft, Calendar, Share2, Sparkles, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const found = await getPostBySlug(slug);
        setPost(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">Accessing Node...</p>
      </div>
    );
  }

  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navbar />

      {/* ARTICLE HEADER - MATCHES HERO VIBE */}
      <header className="relative pt-48 pb-24 px-10 border-b border-white/10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20 max-w-[1400px] mx-auto">
        <div>
          <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12 font-code text-xs uppercase tracking-[3px] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
          </Link>
          <div className="pill-badge mb-8 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3" /> OFFICIAL_DISPATCH
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-muted-foreground font-code text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
              <Calendar className="w-4 h-4 text-primary" /> {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground font-code text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
              <Clock className="w-4 h-4 text-primary" /> 5 Min Read
            </div>
            <div className="flex items-center gap-3 text-muted-foreground font-code text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
              <Share2 className="w-4 h-4 text-primary" /> Share Node
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.9] text-white">
            {post.title}
          </h1>
          <p className="text-2xl text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
            {post.excerpt}
          </p>
        </div>
      </header>

      {/* CONTENT AREA */}
      <section className="py-24 px-10 max-w-[1400px] mx-auto border-x border-white/10">
        <div className="max-w-[1000px] mx-auto">
          {post.image_url && (
            <div className="relative w-full aspect-video mb-24 border border-white/10 overflow-hidden bg-zinc-900">
              <Image 
                src={post.image_url} 
                alt={post.title} 
                fill 
                className="object-cover grayscale contrast-125 opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div className="prose prose-invert prose-2xl max-w-none text-white/90 leading-relaxed font-body whitespace-pre-wrap selection:bg-primary/50">
            {post.content || post.excerpt}
          </div>
        </div>
      </section>

      {/* FOOTER NEWSLETTER CTA */}
      <section className="newsletter-footer grid grid-cols-1 lg:grid-cols-2 border-y border-white/10 bg-[#050505]">
        <div className="p-16 lg:p-24 border-r border-white/10">
          <div className="font-code text-primary text-xs font-bold tracking-[3px] mb-8">// ECOSYSTEM_STAY_SYNCED</div>
          <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            The Weekly <br />Dispatch.
          </h2>
          <p className="text-xl text-muted-foreground max-w-sm">Bounties, project updates, and dev resources delivered to your terminal once a week.</p>
        </div>
        <div className="p-16 lg:p-24 flex flex-col justify-center">
          <div className="font-code text-xs uppercase tracking-[2px] mb-6 text-muted-foreground">Enter your credentials:</div>
          <div className="flex border border-white/10 bg-black p-1">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM" 
              className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none font-code text-sm uppercase" 
            />
            <button className="bg-primary text-black font-black uppercase px-10 hover:bg-white transition-colors text-xs tracking-widest">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
