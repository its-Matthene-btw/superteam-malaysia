
'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPostBySlug, getNews } from '@/services/news';
import { NewsPost } from '@/types/database';
import { ArrowLeft, Sparkles, Loader2, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { subscribeToNewsletter } from '@/services/newsletter';

export default function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<NewsPost | null>(null);
  const [recommendations, setRecommendations] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const found = await getPostBySlug(slug);
        setPost(found);
        
        // Fetch recommendations (just get recent ones and filter current)
        const all = await getNews();
        setRecommendations(all.filter(p => p.id !== found?.id).slice(0, 2));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [slug]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubscribing(false);
    }
  };

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
    <main className="min-h-screen bg-black text-white font-body selection:bg-primary/30">
      <Navbar />

      {/* ARTICLE HERO - SPLIT SYSTEM */}
      <header className="relative pt-20 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="p-10 lg:p-20 border-r border-white/10 flex flex-col justify-center">
          <Link href="/news" className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-12 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> BACK_TO_FEED
          </Link>
          <div className="font-code text-primary text-xs font-bold tracking-[3px] mb-6">// ECOSYSTEM_MAJOR_2026</div>
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
            {post.title}
          </h1>
          <div className="font-code text-xs text-muted-foreground tracking-[2px]">
            REF_NO: STMY-{post.id.slice(0, 6).toUpperCase()}
          </div>
        </div>

        <div className="relative bg-zinc-900 overflow-hidden min-h-[400px] lg:min-h-full">
          {post.image_url && (
            <Image 
              src={post.image_url} 
              alt={post.title} 
              fill 
              className="object-cover grayscale contrast-125 opacity-50 mix-blend-screen"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      {/* MAIN LAYOUT - SIDEBAR + CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] border-b border-white/10">
        {/* Meta Sidebar */}
        <aside className="p-10 lg:p-16 border-r border-white/10 space-y-12 flex flex-col">
          <div className="space-y-2">
            <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Published</div>
            <div className="font-code text-sm font-bold uppercase">
              {new Date(post.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '_')}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Author</div>
            <div className="font-code text-sm font-bold uppercase">Team_Malaysia</div>
          </div>
          <div className="space-y-2">
            <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Status</div>
            <div className="font-code text-sm font-bold text-primary uppercase">Sync_Active</div>
          </div>
          <div className="pt-10 border-t border-white/5 space-y-4">
            <div className="font-code text-[10px] text-muted-foreground uppercase tracking-widest">Tags</div>
            <div className="flex flex-col gap-3 font-code text-[11px] text-primary font-bold">
              <span>#BUILD_STATION</span>
              <span>#ROADMAP_2026</span>
              <span>#KUALA_LUMPUR</span>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <article className="p-10 lg:p-20 xl:p-24 max-w-[1000px]">
          <div className="prose prose-invert prose-2xl max-w-none leading-relaxed text-white/80 font-body space-y-10">
            <div className="text-2xl lg:text-3xl font-bold text-white mb-12 border-l-4 border-primary pl-8 py-2">
              {post.excerpt}
            </div>
            
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Precision Figure Box */}
            {post.image_url && (
              <div className="my-20 p-2 border border-white/10 bg-white/[0.02] group">
                <div className="relative aspect-video overflow-hidden border border-white/5">
                  <Image 
                    src={post.image_url} 
                    alt="Technical Visual" 
                    fill 
                    className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  />
                </div>
                <div className="p-4 font-code text-[10px] text-muted-foreground tracking-[2px] uppercase">
                  // FIG_01: {post.title.toUpperCase().replace(/ /g, '_')}_NODE_VISUAL
                </div>
              </div>
            )}
          </div>
        </article>
      </section>

      {/* RECOMMENDATION GRID */}
      {recommendations.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10 bg-[#050505]">
          {recommendations.map((rec, idx) => (
            <Link 
              key={rec.id} 
              href={`/news/${rec.slug}`}
              className={cn(
                "p-12 lg:p-20 flex flex-col justify-between min-h-[350px] group transition-all duration-500",
                idx === 0 ? "border-r border-white/10" : ""
              )}
            >
              <div>
                <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-8 group-hover:text-primary transition-colors">
                  {idx === 0 ? 'PREVIOUS_ENTRY' : 'NEXT_ENTRY'}
                </div>
                <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none group-hover:text-white transition-colors">
                  {rec.title}
                </h3>
              </div>
              <div className="font-code text-[10px] uppercase tracking-[3px] text-primary">READ_NOW -></div>
            </Link>
          ))}
        </section>
      )}

      {/* ACTION FOOTER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/10 bg-black">
        <div className="p-16 lg:p-24 bg-primary text-black border-r border-white/10 flex flex-col justify-between items-start gap-12">
          <div>
            <div className="font-code text-[10px] font-black uppercase tracking-[3px] border-b-2 border-black inline-block mb-8">
              // BUILD_WITH_US
            </div>
            <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Apply for an <br />Ecosystem Grant
            </h2>
          </div>
          <Link 
            href="https://earn.superteam.fun" 
            target="_blank"
            className="bg-black text-white font-code text-xs font-bold uppercase tracking-[3px] px-10 py-6 hover:bg-white hover:text-black transition-all"
          >
            START_APPLICATION
          </Link>
        </div>

        <div className="p-16 lg:p-24 flex flex-col justify-center">
          <div className="font-code text-primary text-xs font-bold tracking-[3px] mb-8">// STAY_SYNCED</div>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6">The Weekly Dispatch</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-sm">Get technical updates and bounty alerts direct to your terminal.</p>
          
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div className="flex border border-white/10 bg-[#050505] p-1">
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
                disabled={subscribing || subscribed}
                className="bg-primary text-black font-black uppercase px-10 hover:bg-white transition-colors text-xs tracking-widest disabled:opacity-50"
              >
                {subscribing ? 'SENDING...' : subscribed ? 'ENROLLED' : 'JOIN'}
              </button>
            </div>
            {subscribed && (
              <p className="font-code text-[10px] text-green-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> SUCCESS: ENROLLED_IN_DATABASE
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
