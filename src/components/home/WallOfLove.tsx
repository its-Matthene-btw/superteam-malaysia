"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Twitter, MessageSquare, Heart, Repeat2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  platform: 'twitter' | 'discord' | 'official';
  date: string;
  stats?: {
    likes: number;
    reposts: number;
  };
  image?: string;
  isWide?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Alex Dev',
    handle: '@alexbuilds_',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop',
    content: 'Just deployed my first program on Solana mainnet! The Superteam MY workshops were the catalyst. Went from zero Rust knowledge to shipping in 3 weeks. LFG! 🚀',
    platform: 'twitter',
    date: '10:42 AM • OCT 14, 2026',
    stats: { likes: 142, reposts: 12 }
  },
  {
    id: 't2',
    author: 'Nadia Hassan',
    handle: 'Founder, YieldFi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    content: '"Superteam Malaysia isn\'t just a community; it\'s an accelerator. They provided the grants, the high-level network, and the technical mentorship we needed to take our protocol from a raw hackathon idea to a fully funded startup."',
    platform: 'official',
    date: 'OFFICIAL TESTIMONIAL',
    isWide: true
  },
  {
    id: 't3',
    author: '0xMarcus',
    handle: '#general-dev',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop',
    content: '"Anyone awake and want to debug this Anchor CPI issue? I\'ve been staring at it for 4 hours."\n\n[20 mins later]\n\n"Fixed it! Thanks @Aiman for the clutch save!"',
    platform: 'discord',
    date: 'SUPERTEAM DISCORD'
  },
  {
    id: 't4',
    author: 'SuperteamMY',
    handle: '@SuperteamMY',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    content: 'What a weekend at the Kuala Lumpur Hacker House! 150+ builders, 24 hours of coding, endless Red Bull, and 12 incredible Web3 projects shipped to devnet. 🇲🇾⚡',
    platform: 'twitter',
    date: '09:15 PM • NOV 02, 2026',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
    stats: { likes: 319, reposts: 48 },
    isWide: true
  },
  {
    id: 't5',
    author: 'Faiz',
    handle: '@faiz_crypto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: 'The talent density in the Malaysian Web3 scene right now is wildly underrated. Keep your eyes on this ecosystem. We are building the future here.',
    platform: 'twitter',
    date: '11:05 AM • DEC 08, 2026',
    stats: { likes: 180, reposts: 21 }
  },
  {
    id: 't6',
    author: 'Wei Shen',
    handle: 'Frontend Eng',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop',
    content: '"I found my co-founder at a Superteam mixer event. 6 months later, we\'re successfully raising our seed round. Absolute game changer."',
    platform: 'official',
    date: 'COMMUNITY INTERVIEW'
  },
  {
    id: 't7',
    author: 'Chloe W.',
    handle: '@chloeweb3',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    content: 'First bounty completed! Earned my first crypto by contributing to open source documentation for a Solana project. Best feeling ever. 💸',
    platform: 'twitter',
    date: '02:30 PM • JAN 12, 2027',
    stats: { likes: 89, reposts: 4 }
  }
];

function WallCard({ testimonial }: { testimonial: Testimonial }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (window.innerWidth > 768) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      innerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    innerRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "wall-card relative flex flex-col bg-[#050505] overflow-hidden transition-all duration-400 group min-w-[320px] border border-white/10 -ml-[1px] -mt-[1px]",
        testimonial.isWide ? "flex-[2_1_calc(66.666%-2px)]" : "flex-[1_1_calc(33.333%-2px)]",
        "max-md:flex-[1_1:100%] max-md:min-w-full"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="wall-card-inner flex-1 p-8 flex flex-col justify-between z-10 transition-transform duration-200 ease-out preserve-3d"
      >
        <div className="card-header flex justify-between items-start mb-6 translate-z-20">
          <div className="author-info flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 group-hover:border-primary transition-all duration-300">
              <Image src={testimonial.avatar} alt={testimonial.author} fill className="object-cover" />
            </div>
            <div className="author-details flex flex-col">
              <span className="author-name font-bold text-lg text-white">{testimonial.author}</span>
              <span className="author-handle font-code text-xs text-muted-foreground group-hover:text-primary transition-colors">
                {testimonial.handle}
              </span>
            </div>
          </div>
          <div className="platform-icon text-muted-foreground group-hover:text-white transition-colors">
            {testimonial.platform === 'twitter' && <Twitter className="w-5 h-5" />}
            {testimonial.platform === 'discord' && <MessageSquare className="w-5 h-5" />}
            {testimonial.platform === 'official' && <Quote className="w-5 h-5" />}
          </div>
        </div>

        <div className={cn(
          "post-text text-muted-foreground font-medium mb-8 translate-z-30 group-hover:text-white transition-colors duration-300 whitespace-pre-wrap",
          testimonial.isWide ? "text-2xl leading-relaxed font-bold tracking-tight" : "text-lg leading-relaxed"
        )}>
          {testimonial.content}
        </div>

        {testimonial.image && (
          <div className="post-media relative w-full h-[280px] rounded-xl overflow-hidden border border-white/10 grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100 group-hover:border-primary/40 transition-all duration-500 mb-6 translate-z-25">
            <Image src={testimonial.image} alt="Post content" fill className="object-cover" />
          </div>
        )}

        <div className="card-footer mt-auto translate-z-20">
          <div className="post-date font-code text-[10px] uppercase tracking-[2px] text-muted-foreground group-hover:text-white transition-colors mb-4">
            {testimonial.date}
          </div>
          
          {(testimonial.platform === 'twitter' || testimonial.stats) && (
            <div className="action-bar flex items-center gap-6 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
              <button 
                className={cn(
                  "flex items-center gap-2 text-xs font-code text-muted-foreground hover:text-white transition-all p-1.5 rounded-md hover:bg-white/10",
                  reposted && "text-green-500"
                )}
                onClick={(e) => { e.preventDefault(); setReposted(!reposted); }}
              >
                <Repeat2 className={cn("w-4 h-4 transition-transform duration-300", reposted && "rotate-180 scale-125")} />
                <span>{(testimonial.stats?.reposts || 0) + (reposted ? 1 : 0)}</span>
              </button>
              <button 
                className={cn(
                  "flex items-center gap-2 text-xs font-code text-muted-foreground hover:text-white transition-all p-1.5 rounded-md hover:bg-white/10",
                  liked && "text-pink-500"
                )}
                onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
              >
                <Heart className={cn("w-4 h-4 transition-all duration-300", liked && "fill-pink-500 scale-125")} />
                <span>{(testimonial.stats?.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WallOfLove() {
  return (
    <section className="wall-section w-full bg-black border-t border-white/10">
      <div className="header-wrapper max-w-[1400px] mx-auto pt-20 border-x border-white/10">
        <div className="flex flex-col gap-6 mb-10 px-10">
          <div className="pill-badge mb-6"><span>✦</span> Wall of Love</div>
          <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-none text-white">
            Community<br />Voices.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-10 py-10 border-t border-white/10 px-10">
          <div className="uppercase font-bold text-sm tracking-wider leading-relaxed text-white max-w-sm">
            REAL BUILDERS. REAL STORIES. THE ALPHA SITS IN OUR CHATS.
          </div>
          <div className="flex flex-col gap-6 text-muted-foreground text-lg leading-relaxed max-w-2xl">
            <p>Don't just take our word for it. See what founders, developers, and ecosystem participants are saying about their experience building with Superteam Malaysia.</p>
          </div>
        </div>
      </div>

      <div className="grid-full-width w-full border-y border-white/10 overflow-hidden">
        <div className="wall-grid max-w-[1400px] mx-auto flex flex-wrap bg-transparent border-x border-white/10">
          {testimonials.map((testimonial) => (
            <WallCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}