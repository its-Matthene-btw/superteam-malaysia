
"use client";

import { useState } from 'react';
import { faqs } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqCtaSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section w-full border-t border-white/10 bg-black">
      <div className="header-wrapper max-w-[1400px] mx-auto px-10 py-20 border-x border-white/10">
        <div className="pill-badge mb-6"><span>✦</span> KNOWLEDGE BASE</div>
        <h2 className="text-5xl lg:text-7xl font-headline font-bold uppercase tracking-tight leading-none text-white">
          Have <span className="text-[#9945FF]">Questions?</span>
        </h2>
      </div>

      <div className="grid-full-width w-full border-y border-white/10">
        <div className="faq-cta-grid max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[6fr_4fr] border-x border-white/10">
          
          <div className="faq-column border-b lg:border-b-0 lg:border-r border-white/10 bg-black flex flex-col">
            {faqs.map((faq, idx) => (
              <div key={idx} className={cn("faq-item border-b border-white/10 last:border-b-0", openIndex === idx && "active")}>
                <button 
                  className="faq-header w-full flex items-center justify-between p-8 lg:p-10 hover:bg-white/[0.02] group transition-all"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-code text-xs text-muted-foreground mt-1.5 hidden md:block">
                      {(idx + 1).toString().padStart(2, '0')} //
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-headline font-bold group-hover:text-[#9945FF] transition-colors text-left text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="faq-icon-custom"></div>
                </button>
                <div 
                  className="faq-body overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: openIndex === idx ? '500px' : '0px' }}
                >
                  <div className="faq-answer px-8 lg:pl-[116px] lg:pr-10 pb-10 text-lg text-white leading-relaxed max-w-2xl">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Column - Stable Content */}
          <div className="cta-column bg-[#050505] relative flex flex-col min-h-[500px] lg:min-h-0 items-start overflow-hidden">
             <div className="cta-bg-wrapper absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -bottom-[10%] -right-[10%] w-[800px] h-[800px] bg-[#9945FF]/15 rounded-full blur-[100px]" />
                
                <div 
                  className="absolute inset-0 opacity-50" 
                  style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center center'
                  }} 
                />
             </div>
             
             {/* Content stays at top and is fixed relative to the column start */}
             <div className="p-10 lg:p-20 z-10 w-full flex-shrink-0">
                <h2 className="text-5xl lg:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] mb-8 uppercase text-white">
                  BUILD<br />THE<br />FUTURE.
                </h2>
                <p className="text-lg lg:text-xl text-white mb-12 max-w-md leading-relaxed">
                  Ready to ship your next big idea on Solana? Get access to exclusive bounties, ecosystem funding, and the smartest builders in Malaysia.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                  <a href="#" className="group flex items-center justify-between bg-[#9945FF] text-black px-8 py-5 font-code font-bold uppercase tracking-widest border border-[#9945FF] hover:bg-white hover:border-white transition-all shadow-lg hover:shadow-[#9945FF]/20">
                    Join Discord
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </a>
                  <a href="#" className="group flex items-center justify-between bg-transparent text-white border border-white/10 px-8 py-5 font-code font-bold uppercase tracking-widest hover:bg-white/5 hover:border-white transition-all">
                    Apply For Grant
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
