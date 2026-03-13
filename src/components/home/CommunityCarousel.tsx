"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Member } from '@/types/database';
import { AnimatedSection, AnimatedItem } from '@/components/layout/AnimatedSection';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function CommunityCarousel({ members }: { members: Member[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayMembers = [...members, ...members];

  useEffect(() => {
    let animationFrameId: number;
    const scrollSpeed = 1;

    const autoScroll = () => {
      if (sliderRef.current && !isDown && !isHovering) {
        sliderRef.current.scrollLeft += scrollSpeed;
        if (sliderRef.current.scrollLeft >= (sliderRef.current.scrollWidth / 2)) {
          sliderRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDown, isHovering]);

  // DETECT SLIDE AWAY (Trackpad / Mouse Wheel)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let lastScrollPos = slider.scrollLeft;
    const handleScroll = () => {
      const currentScroll = slider.scrollLeft;
      // If user scrolls horizontally while a card is open, close it
      if (expandedId && Math.abs(currentScroll - lastScrollPos) > 10) {
        setExpandedId(null);
      }
      lastScrollPos = currentScroll;
    };

    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [expandedId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    // Detection of intentional drag
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
      // Close open card if user starts dragging
      if (expandedId) setExpandedId(null);
    }
    
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!members || members.length === 0) return null;

  return (
    <AnimatedSection className="w-full bg-black border-t border-white/10" staggerChildren={0.25}>
      <div className="max-w-[1400px] mx-auto border-x border-white/10">
        <div className="px-10 py-24 lg:py-32">
          <AnimatedItem className="header-top mb-16">
            <div className="pill-badge mb-8"><span>✦</span> THE COMMUNITY</div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-[1.1] max-w-3xl text-white">
              A TEAM OF<br />WEB3 <span className="text-[#9945FF]">EXPERTS.</span>
            </h2>
          </AnimatedItem>
          
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 lg:gap-20 pt-16 border-t border-white/10">
            <AnimatedItem className="col-left">
              <p className="text-xl font-bold text-white uppercase tracking-wider leading-relaxed max-w-sm">
                SUPERTEAM MALAYSIA STARTED AS A COLLECTIVE TO MANAGE WEB3 PROJECTS WITH FRIENDS AND BUILDERS.
              </p>
            </AnimatedItem>
            <div className="col-right space-y-8">
              <AnimatedItem>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  We built advanced tooling and a robust network to optimize project development for passionate teams. Due to the sheer talent within the Solana ecosystem, our little community grew crazy fast.
                </p>
              </AnimatedItem>
              <AnimatedItem>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Now, network operators and developers can run their own nodes with full control. Superteam just takes the headaches away.
                </p>
              </AnimatedItem>
            </div>
          </div>
        </div>
      </div>

      <AnimatedItem className="w-full border-y border-white/10 bg-black overflow-hidden">
        <div 
          ref={sliderRef}
          className="max-w-[1400px] mx-auto border-x border-white/10 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setIsDown(false); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDown(false)}
        >
          <div className="flex whitespace-nowrap">
            {displayMembers.map((member, idx) => (
              <div 
                key={`${member.id}-${idx}`}
                className={cn(
                  "relative flex flex-col min-w-[380px] h-[560px] border-r border-white/10 bg-[#050505] transition-all duration-500 group cursor-pointer overflow-hidden whitespace-normal",
                  "hover:bg-[#9945FF]",
                  expandedId === `${member.id}-${idx}` && "bg-[#9945FF]"
                )}
                onClick={() => !isDragging && setExpandedId(expandedId === `${member.id}-${idx}` ? null : `${member.id}-${idx}`)}
              >
                {/* Image Area - Collapses on Click */}
                <div className={cn(
                  "relative w-full h-[360px] border-b border-white/10 grayscale transition-all duration-500 overflow-hidden group-hover:grayscale-0",
                  expandedId === `${member.id}-${idx}` && "h-0 border-b-0 opacity-0"
                )}>
                  {member.avatar_url && <Image src={member.avatar_url} alt={member.name} fill className="object-cover object-[center_15%]" />}
                  
                  {/* Floating X Link */}
                  {member.twitter_url && (
                    <a 
                      href={member.twitter_url} 
                      target="_blank" 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-black hover:text-[#9945FF] transition-all"
                    >
                      <XIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex-1 p-8 flex flex-col justify-start">
                  <span className="font-code text-[10px] uppercase tracking-[2px] text-muted-foreground group-hover:text-black transition-colors mb-3">
                    [{member.role}]
                  </span>
                  <h3 className="text-3xl font-headline font-extrabold uppercase tracking-tighter text-white group-hover:text-black transition-colors mb-6">
                    {member.name}
                  </h3>
                  <div className="w-full h-px bg-white/10 group-hover:bg-black/20 mb-6 transition-colors" />
                  
                  <div className="font-code text-[11px] uppercase tracking-wider leading-relaxed text-muted-foreground group-hover:text-black transition-colors">
                    {member.company}
                  </div>
                  
                  {/* Bio Content - Glides up when expanded */}
                  <div className={cn(
                    "text-muted-foreground leading-relaxed text-lg font-medium max-h-0 opacity-0 transition-all duration-500 ease-in-out whitespace-normal",
                    expandedId === `${member.id}-${idx}` && "max-h-[400px] opacity-100 mt-10 text-black"
                  )}>
                    {member.bio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedItem>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AnimatedSection>
  );
}