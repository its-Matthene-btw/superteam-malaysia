"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { MessageSquare, Quote, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types/database';
import { AnimatedSection, AnimatedItem } from '@/components/layout/AnimatedSection';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

function WallCard({ testimonial }: { testimonial: Testimonial }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "wall-card relative flex flex-col bg-[#050505] overflow-hidden transition-all duration-400 group min-w-[320px] border border-white/10 -ml-[1px] -mt-[1px]",
        testimonial.type === 'official' ? "flex-[2_1_calc(66.666%-2px)]" : "flex-[1_1_calc(33.333%-2px)]",
        "max-md:flex-[1_1:100%] max-md:min-w-full"
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={innerRef}
        className="wall-card-inner flex-1 p-8 flex flex-col justify-between z-10 transition-transform duration-200 ease-out preserve-3d"
      >
        <div className="card-header flex justify-between items-start mb-6">
          <div className="author-info flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 group-hover:border-[#9945FF] transition-all duration-300">
              {testimonial.avatar_url ? (
                <Image src={testimonial.avatar_url} alt={testimonial.name} fill className="object-cover" />
              ) : (
                <div className="bg-white/10 w-full h-full" />
              )}
            </div>
            <div className="author-details flex flex-col">
              <span className="author-name font-bold text-lg text-white">{testimonial.name}</span>
              <span className="author-handle font-code text-xs text-muted-foreground group-hover:text-[#9945FF] transition-colors">
                {testimonial.role}
              </span>
            </div>
          </div>
          <div className="platform-icon text-muted-foreground group-hover:text-white transition-colors">
            {testimonial.type === 'twitter' && <XIcon className="w-5 h-5" />}
            {testimonial.type === 'discord' && <MessageSquare className="w-5 h-5" />}
            {testimonial.type === 'official' && <Quote className="w-5 h-5" />}
          </div>
        </div>

        <div className={cn(
          "post-text text-muted-foreground font-medium mb-8 group-hover:text-white transition-colors duration-300 whitespace-pre-wrap",
          testimonial.type === 'official' ? "text-2xl leading-relaxed font-bold tracking-tight" : "text-lg leading-relaxed"
        )}>
          {testimonial.content}
        </div>

        <div className="card-footer mt-auto">
          <div className="post-date font-code text-[10px] uppercase tracking-[2px] text-muted-foreground group-hover:text-white transition-colors">
            {new Date(testimonial.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WallOfLove({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  
  return (
    <AnimatedSection className="wall-section w-full bg-black border-t border-white/10" staggerChildren={0.1}>
      <div className="max-w-[1400px] mx-auto border-x border-white/10">
        <div className="flex flex-col gap-6 mb-24 px-10 pt-32 lg:pt-48">
          <AnimatedItem>
            <div className="pill-badge mb-6"><span>✦</span> Wall of Love</div>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-none text-white mb-8">
              REAL BUILDERS. REAL STORIES.<br />
              <span className="text-[#9945FF]">THE ALPHA SITS IN OUR CHATS.</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Don't just take our word for it. See what founders, developers, and ecosystem participants are saying about their experience building with Superteam Malaysia.
            </p>
          </AnimatedItem>
        </div>

        <AnimatedItem className="border-t border-b border-white/10 overflow-hidden">
          <div className="wall-grid flex flex-wrap bg-transparent">
            {testimonials.map((testimonial) => (
              <WallCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </AnimatedItem>
      </div>
    </AnimatedSection>
  );
}