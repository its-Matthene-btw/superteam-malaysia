
'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getNews } from '@/services/news';
import { NewsPost } from '@/types/database';
import { ArrowRight, Loader2, Search, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getNews();
        setPosts(data);
      } catch (e: any) {
        console.error('News Fetch Error:', e);
        setError('Failed to sync news feed. Ensure the database is initialized.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const featured = filteredPosts[0];
  const gridItems = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">Initializing Terminal...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-body overflow-x-hidden">
      <Navbar />

      {/* 3-COL WIREFRAME HERO */}
      {featured && (
        <header className="relative pt-20 border-b border-white/10 grid grid-cols-1 lg:grid-cols-[350px_1fr_400px] min-h-[500px]">
          <div className="p-10 border-r border-white/10 flex flex-col justify-between max-lg:hidden">
            <div className="font-code text-[10px] text-primary uppercase tracking-[3px]">[ SYSTEM_UPDATE_v.2.0 ]</div>
            <div>
              <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[2px]">Latest Entry</div>
              <div className="font-code text-xs font-bold uppercase tracking-[2px]">
                {new Date(featured.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase().replace(' ', '_')}
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-16 border-r border-white/10 flex flex-col justify-center relative">
            <div className="inline-block bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-8">FEATURED DISPATCH</div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
              {featured.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mb-12 font-medium">
              {featured.excerpt}
            </p>
            <Link 
              href={`/news/${featured.slug}`} 
              className="font-code text-xs font-bold uppercase tracking-[3px] flex items-center gap-3 hover:text-primary transition-colors"
            >
              Read Entry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative bg-zinc-900 overflow-hidden max-lg:h-64">
            {featured.image_url && (
              <Image 
                src={featured.image_url} 
                alt={featured.title} 
                fill 
                className="object-cover grayscale contrast-125 opacity-60 mix-blend-screen"
              />
            )}
          </div>
        </header>
      )}

      {/* SYSTEM BAR */}
      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] border-b border-white/10 bg-[#050505]">
        <div className="px-10 py-6 border-r border-white/10 flex items-center gap-4">
          <span className="font-code text-primary text-xs font-bold tracking-widest whitespace-nowrap">SCAN_</span>
          <input 
            type="text" 
            placeholder="KEYWORD_SEARCH..." 
            className="bg-transparent border-none outline-none font-code text-xs w-full placeholder:text-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <nav className="flex items-center gap-10 px-10 overflow-x-auto whitespace-nowrap no-scrollbar max-lg:py-6">
          {['ALL', 'DEV_LOGS', 'GRANTS', 'EVENTS', 'CULTURE'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "font-code text-[10px] font-bold uppercase tracking-[2px] transition-colors",
                activeFilter === filter ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              / {filter}
            </button>
          ))}
        </nav>
      </section>

      {/* SQUARE GRID FEED */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {gridItems.map((post, idx) => (
          <Link 
            key={post.id} 
            href={`/news/${post.slug}`}
            className="group relative aspect-square border-r border-b border-white/10 flex flex-col overflow-hidden hover:bg-primary/5 transition-all duration-500"
          >
            <div className="flex-1 relative overflow-hidden border-b border-white/10 bg-black">
              {post.image_url ? (
                <Image 
                  src={post.image_url} 
                  alt={post.title} 
                  fill 
                  className="object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-8 h-8 text-white/10" /></div>
              )}
            </div>
            
            <div className="p-8 h-40 flex flex-col justify-between">
              <div>
                <div className="font-code text-[9px] text-primary font-bold uppercase tracking-widest mb-3">
                  {(idx + 1).toString().padStart(2, '0')}. DISPATCH
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>

            <div className="px-8 py-4 border-t border-white/10 bg-white/[0.02] flex justify-between items-center font-code text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-white">
              <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {/* CTA SQUARE */}
        <div className="aspect-square bg-primary p-10 flex flex-col items-center justify-center text-center text-black">
          <div className="font-code text-[10px] font-black uppercase tracking-[3px] mb-6">[ BECOME_MEMBER ]</div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-tight">
            Join the Inner Circle of Solana Malaysia
          </h3>
          <Link 
            href="/contact" 
            className="font-code text-xs font-black uppercase tracking-[2px] border-2 border-black px-6 py-3 hover:bg-black hover:text-primary transition-all"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* PAGINATION INFO */}
      <section className="border-b border-white/10 flex items-center">
        <div className="p-10 border-r border-white/10 w-[350px] font-code max-lg:hidden">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Displaying</span><br />
          <span className="text-xl font-black">{filteredPosts.length} / {posts.length} ARTICLES</span>
        </div>
        <div className="flex font-code">
          <button className="w-20 h-20 border-r border-white/10 flex items-center justify-center bg-primary text-black font-black">01</button>
          {[2, 3, 4].map(num => (
            <button key={num} className="w-20 h-20 border-r border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">0{num}</button>
          ))}
          <button className="w-20 h-20 border-r border-white/10 flex items-center justify-center text-muted-foreground">...</button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
