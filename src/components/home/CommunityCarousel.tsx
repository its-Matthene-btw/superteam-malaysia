
"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Member } from '@/types/database';

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
    if (Math.abs(walk) > 5) setIsDragging(true);
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!members || members.length === 0) return null;

  return (
    <section className="w-full bg-black border-t border-white/10">
      <div className="max-w-[1400px] mx-auto border-x border-white/10">
        <div className="px-10 py-32 lg:py-48">
          <div className="flex flex-col gap-6 mb-24 lg:mb-32">
            <div className="pill-badge mb-6"><span>✦</span> THE COMMUNITY</div>
            <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-none max-w-3xl text-white">
              A Team of Web3 <span className="text-[#9945FF]">Experts</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-x border-white/10 border-t border-b border-white/10 overflow-hidden">
        <div 
          ref={sliderRef}
          className="overflow-x-hidden cursor-grab active:cursor-grabbing"
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
                  "relative flex flex-col min-w-[380px] h-[560px] border-r border-white/10 bg-[#050505] transition-all duration-300 group cursor-pointer overflow-hidden whitespace-normal",
                  "hover:bg-[#9945FF]",
                  expandedId === `${member.id}-${idx}` && "expanded-card"
                )}
                onClick={() => !isDragging && setExpandedId(expandedId === `${member.id}-${idx}` ? null : `${member.id}-${idx}`)}
              >
                <div className={cn(
                  "relative w-full h-[360px] border-b border-white/10 filter grayscale transition-all duration-500 overflow-hidden",
                  "group-hover:grayscale-0",
                  expandedId === `${member.id}-${idx}` && "h-0 border-b-0 opacity-0"
                )}>
                  {member.avatar_url && <Image src={member.avatar_url} alt={member.name} fill className="object-cover object-[center_15%]" />}
                </div>

                <div className="flex-1 p-8 flex flex-col">
                  <span className="font-code text-[10px] uppercase tracking-[2px] text-muted-foreground group-hover:text-black transition-colors">
                    [{member.role}]
                  </span>
                  <h3 className="text-3xl font-headline font-extrabold uppercase tracking-tighter mb-6 group-hover:text-black transition-colors text-white">
                    {member.name}
                  </h3>
                  <div className="w-full h-px bg-white/10 mb-5 group-hover:bg-black/20 transition-colors" />
                  <div className="font-code text-[11px] uppercase tracking-wider leading-relaxed text-muted-foreground group-hover:text-black transition-colors">
                    {member.company}
                  </div>
                  
                  <div className={cn(
                    "text-muted-foreground leading-relaxed text-base font-medium max-h-0 opacity-0 transition-all duration-500 whitespace-normal",
                    expandedId === `${member.id}-${idx}` && "max-h-[300px] opacity-100 mt-8 group-hover:text-black"
                  )}>
                    {member.bio}
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
