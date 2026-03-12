"use client";

import Link from 'next/link';
import { Twitter, MessageSquare, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section w-full bg-[#050505] border-t border-white/10">
      <div className="footer-wrapper max-w-[1400px] mx-auto border-x border-white/10 flex flex-col">
        
        {/* Main Footer Grid */}
        <div className="footer-main-grid grid grid-cols-1 lg:grid-cols-[5fr_3fr_4fr] border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="footer-col p-10 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <Link href="/" className="brand-logo text-4xl lg:text-6xl font-headline font-extrabold tracking-tighter uppercase leading-none mb-8 hover:opacity-80 transition-opacity text-white">
              Superteam<br /><span className="text-primary">Malaysia</span>
            </Link>
            <p className="brand-desc text-lg text-muted-foreground leading-relaxed max-w-sm">
              A decentralized community of founders, developers, and creatives building the future of the Solana ecosystem.
            </p>
          </div>

          {/* Column 2: Directory */}
          <div className="footer-col p-10 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <span className="col-title font-code text-xs text-primary uppercase tracking-[2px] mb-8 block">[ DIRECTORY ]</span>
            <ul className="nav-list flex flex-col gap-4">
              <FooterNavLink href="/" label="Home" />
              <FooterNavLink href="#mission" label="About Us" />
              <FooterNavLink href="#events" label="Events" />
              <FooterNavLink href="#" label="Grants" />
              <FooterNavLink href="#" label="Bounties" />
            </ul>
          </div>

          {/* Column 3: Network */}
          <div className="footer-col p-10 lg:p-20 flex flex-col">
            <span className="col-title font-code text-xs text-primary uppercase tracking-[2px] mb-8 block">[ NETWORK ]</span>
            <div className="social-list flex flex-col gap-3 max-w-[300px]">
              <SocialBrutalistButton 
                href="https://x.com/superteammy" 
                label="Twitter / X" 
                icon={<Twitter className="w-5 h-5" />} 
              />
              <SocialBrutalistButton 
                href="#" 
                label="Telegram" 
                icon={<svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.98 1.25-5.6 3.68-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.43.02.09.02.19.01.21z"/></svg>} 
              />
              <SocialBrutalistButton 
                href="#" 
                label="Discord" 
                icon={<MessageSquare className="w-5 h-5" />} 
              />
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center p-8 lg:px-10 bg-black">
          <div className="copyright font-code text-[10px] lg:text-xs text-muted-foreground uppercase tracking-[1px] mb-4 md:mb-0">
            © 2026 Superteam Malaysia. All Rights Reserved.
          </div>
          <button 
            onClick={scrollToTop}
            className="back-to-top font-code text-[10px] lg:text-xs text-white uppercase tracking-[2px] font-bold hover:text-primary transition-colors flex items-center gap-2 group"
          >
            Back To Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}

function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="nav-link text-lg font-bold text-muted-foreground uppercase tracking-[1px] hover:text-white transition-all flex items-center group"
      >
        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-code text-primary mr-2 font-black">&gt;</span>
        {label}
      </Link>
    </li>
  );
}

function SocialBrutalistButton({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="social-btn flex items-center justify-between p-4 border border-white/10 text-white font-code text-[11px] font-bold uppercase tracking-[1px] hover:bg-primary hover:text-black hover:border-primary transition-all group"
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <span className="social-arrow text-base group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
    </a>
  );
}
