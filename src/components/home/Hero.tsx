
"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border-white/10 text-xs font-medium mb-8 animate-fade-up">
          <span className="solana-gradient w-2 h-2 rounded-full" />
          <span className="text-secondary">Official Solana Ecosystem Hub</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold mb-6 animate-fade-up [animation-delay:200ms]">
          Build the Future of <br />
          <span className="solana-text-gradient">Web3 in Malaysia</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-fade-up [animation-delay:400ms]">
          Superteam Malaysia is the community-driven launchpad for developers, designers, and creators in the Solana ecosystem. 
          We provide the resources, mentorship, and network to scale your ideas globally.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-up [animation-delay:600ms]">
          <Button size="lg" className="solana-gradient text-white font-bold h-12 px-8 rounded-full glow-purple">
            Explore Bounties <Zap className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/10 glass hover:bg-white/10">
            View Directory <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up [animation-delay:800ms]">
          {[
            { label: 'Grants Issued', value: '$250k+' },
            { label: 'Hackathon Wins', value: '12' },
            { label: 'Active Members', value: '1,200+' },
            { label: 'Project Launches', value: '15' }
          ].map((stat) => (
            <div key={stat.label} className="p-6 glass rounded-2xl border-white/5">
              <div className="text-3xl font-headline font-bold solana-text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
