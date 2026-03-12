
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getNews } from '@/services/news';
import { NewsPost } from '@/types/database';
import { ArrowRight, Loader2, Calendar, Share2, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getNews();
        setPosts(data);
      } catch (e: any) {
        console.error('News Fetch Error:', e);
        setError(e.message || 'Failed to sync news feed. Ensure the "news" table exists.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative pt-48 pb-32 px-10 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(20,241,149,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="pill-badge mb-8"><span>✦</span> ECOSYSTEM UPDATES</div>
          <h1 className="text-[clamp(4rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8] mb-12">
            <span className="text-white">LATEST</span><br />
            <span className="text-[#14F195]">ANNOUNCEMENTS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            The pulse of the Solana ecosystem in Malaysia. News, project launches, and community updates.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.01]">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#14F195] animate-spin mb-4" />
              <p className="font-code text-xs uppercase tracking-widest text-muted-foreground">Fetching Data Stream...</p>
            </div>
          ) : error ? (
            <div className="py-40 text-center px-10">
              <AlertCircle className="w-12 h-12 text-destructive/50 mx-auto mb-6" />
              <p className="font-code text-destructive uppercase tracking-widest text-sm mb-2">Sync Error</p>
              <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-40 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
              <p className="font-code text-muted-foreground uppercase tracking-widest">No announcements indexed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/news/${post.slug}`}
                  className="group relative bg-black flex flex-col p-10 lg:p-12 hover:bg-white/[0.02] transition-all min-h-[500px]"
                >
                  <div className="relative h-64 mb-10 overflow-hidden border border-white/10">
                    {post.image_url ? (
                      <Image 
                        src={post.image_url} 
                        alt={post.title} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center"><Calendar className="w-8 h-8 text-white/20" /></div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-code text-[10px] text-[#14F195] font-bold uppercase tracking-widest">
                        [{new Date(post.published_at).toLocaleDateString()}]
                      </span>
                      <Share2 className="w-4 h-4 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-6 group-hover:text-[#14F195] transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-10 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                      <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:text-[#14F195] transition-colors">Read Article</span>
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-[#14F195] group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
