"use client";

import { useRef, useEffect, useState } from 'react';
import { members } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CommunityCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Double the members for seamless infinite scroll
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
    
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (id: string) => {
    if (isDragging) return;
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full bg-black border-t border-white/10">
      <div className="max-w-[1400px] mx-auto border-x border-white/10">
        <div className="px-10 pt-20">
          <div className="flex flex-col gap-6 mb-16">
            <div className="pill-badge mb-6"><span>✦</span> THE COMMUNITY</div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-none max-w-3xl text-white">
              A Team of<br />Web3 Experts.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-10 py-10 border-t border-white/10">
            <div className="uppercase font-bold text-sm tracking-wider leading-relaxed text-white max-w-sm">
              SUPERTEAM MALAYSIA STARTED AS A COLLECTIVE TO MANAGE WEB3 PROJECTS WITH FRIENDS AND BUILDERS.
            </div>
            <div className="flex flex-col gap-6 text-muted-foreground text-lg leading-relaxed max-w-2xl">
              <p>We built advanced tooling and a robust network to optimize project development for passionate teams. Due to the sheer talent within the Solana ecosystem, our little community grew crazy fast.</p>
              <p>Now, network operators and developers can run their own nodes with full control. Superteam just takes the headaches away.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-x border-white/10 border-t border-b border-white/10 overflow-hidden">
        <div 
          ref={sliderRef}
          className="overflow-x-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setIsDown(false);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDown(false)}
        >
          <div className="flex whitespace-nowrap" ref={trackRef}>
            {displayMembers.map((member, idx) => (
              <div 
                key={`${member.id}-${idx}`}
                className={cn(
                  "relative flex flex-col min-w-[380px] h-[560px] border-r border-white/10 bg-[#050505] transition-all duration-300 group cursor-pointer overflow-hidden whitespace-normal",
                  "hover:bg-primary",
                  expandedId === `${member.id}-${idx}` && "expanded-card"
                )}
                onClick={() => handleCardClick(`${member.id}-${idx}`)}
                onMouseLeave={() => setExpandedId(null)}
              >
                {/* X Link */}
                <a 
                  href={member.social.twitter} 
                  target="_blank"
                  className="absolute top-6 right-6 p-2.5 bg-black/50 backdrop-blur-md border border-white/10 text-white z-20 group-hover:bg-black group-hover:text-primary group-hover:border-black transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                   <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.223H5.078z"/></svg>
                </a>

                {/* Card Image */}
                <div className={cn(
                  "relative w-full h-[360px] border-b border-white/10 filter grayscale contrast-[1.1] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden",
                  "group-hover:grayscale-0 group-hover:contrast-100",
                  expandedId === `${member.id}-${idx}` && "h-0 border-b-0 opacity-0"
                )}>
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>

                {/* Card Info */}
                <div className="flex-1 p-8 flex flex-col">
                  <span className="font-code text-[10px] uppercase tracking-[2px] text-muted-foreground group-hover:text-black transition-colors">
                    [{member.track}]
                  </span>
                  <h3 className="text-3xl font-headline font-extrabold uppercase tracking-tighter mb-6 group-hover:text-black transition-colors text-white">
                    {member.name}
                  </h3>
                  <div className="w-full h-px bg-white/10 mb-5 group-hover:bg-black/20 transition-colors" />
                  <div className="font-code text-[11px] uppercase tracking-wider leading-relaxed text-muted-foreground group-hover:text-black transition-colors">
                    {member.skills.join(' • ')}
                  </div>
                  
                  {/* Expanded Description */}
                  <div className={cn(
                    "text-muted-foreground leading-relaxed text-base font-medium max-h-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-normal",
                    expandedId === `${member.id}-${idx}` && "max-h-[300px] opacity-100 mt-8 group-hover:text-black"
                  )}>
                    {member.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
