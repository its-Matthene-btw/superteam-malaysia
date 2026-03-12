
'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPostBySlug } from '@/services/news';
import { NewsPost } from '@/types/database';
import { ArrowLeft, Calendar, Share2, Sparkles, Clock } from 'lucide-react';
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-code uppercase tracking-widest">Accessing Node...</div>;
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative pt-48 pb-24 px-10 border-b border-white/10">
        <div className="max-w-[1000px] mx-auto">
          <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12 font-code text-xs uppercase tracking-widest group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
          </Link>
          
          <div className="pill-badge mb-8 bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20">
            <Sparkles className="w-3 h-3" /> OFFICIAL ANNOUNCEMENT
          </div>
          <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-10 leading-[0.9]">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-8 py-8 border-y border-white/10 mb-12">
            <div className="flex items-center gap-3 text-muted-foreground font-code text-[11px] uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-[#14F195]" /> {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground font-code text-[11px] uppercase tracking-widest">
              <Clock className="w-4 h-4 text-[#14F195]" /> 5 Min Read
            </div>
            <button className="flex items-center gap-3 text-muted-foreground font-code text-[11px] uppercase tracking-widest hover:text-white transition-colors ml-auto">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-10">
        <div className="max-w-[1000px] mx-auto">
          {post.image_url && (
            <div className="relative w-full aspect-video mb-20 border border-white/10 rounded-2xl overflow-hidden glass">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-2xl max-w-none text-white leading-relaxed font-body whitespace-pre-wrap">
            {post.content || post.excerpt}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-6">Stay Connected</h2>
          <p className="text-muted-foreground text-xl mb-12 max-w-md mx-auto">Subscribe to our newsletter for exclusive ecosystem updates and project deep dives.</p>
          <div className="max-w-md mx-auto p-2 glass border-white/10 flex items-center">
             <input placeholder="email@ecosystem.com" className="flex-1 bg-transparent border-none text-white px-4 outline-none font-code text-sm" />
             <button className="bg-[#14F195] text-black font-bold uppercase px-8 py-3 text-xs tracking-widest hover:bg-white transition-colors">Join</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
