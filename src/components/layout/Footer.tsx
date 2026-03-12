
"use client";

import Link from 'next/link';
import { MessageSquare, ArrowUp, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { subscribeToNewsletter } from '@/services/newsletter';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-section w-full bg-[#050505] border-t border-white/10">
      <div className="footer-wrapper max-w-[1400px] mx-auto border-x border-white/10 flex flex-col">
        
        {/* Main Footer Grid */}
        <div className="footer-main-grid grid grid-cols-1 lg:grid-cols-[4fr_2fr_3fr_3fr] border-b border-white/10">
          
          {/* Column 1: Brand */}
          <div className="footer-col p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <Link href="/" className="brand-logo text-4xl font-headline font-extrabold tracking-tighter uppercase leading-none mb-8 hover:opacity-80 transition-opacity text-white">
              Superteam<br /><span className="text-primary">Malaysia</span>
            </Link>
            <p className="brand-desc text-base text-muted-foreground leading-relaxed max-sm:max-w-xs mb-10">
              A decentralized community of founders, developers, and creatives building the future of the Solana ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/superteammy" target="_blank" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="https://discord.gg/superteammy" target="_blank" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Directory */}
          <div className="footer-col p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <span className="col-title font-code text-[10px] text-primary uppercase tracking-[2px] mb-8 block">DIRECTORY</span>
            <ul className="nav-list flex flex-col gap-4">
              <FooterNavLink href="/news" label="News" />
              <FooterNavLink href="/events" label="Events" />
              <FooterNavLink href="/ecosystem" label="Ecosystem" />
              <FooterNavLink href="/members" label="Members" />
              <FooterNavLink href="/faq" label="Knowledge Base" />
              <FooterNavLink href="/contact" label="Contact" />
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="footer-col p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col col-span-2">
            <span className="col-title font-code text-[10px] text-secondary uppercase tracking-[2px] mb-8 block">DISPATCH</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-6">Stay ahead of the <span className="text-secondary">curve.</span></h3>
            <p className="text-muted-foreground mb-10 max-w-sm">Get ecosystem updates, bounty alerts, and funding opportunities delivered weekly.</p>
            
            <form onSubmit={handleSubscribe} className="relative w-full max-w-md">
              <input 
                type="email" 
                placeholder="builder@ecosystem.com" 
                className="w-full bg-white/5 border border-white/10 p-5 pr-16 text-white outline-none focus:border-secondary transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-secondary text-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
            {status === 'success' && <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-4">Welcome to the dispatch.</p>}
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center p-8 lg:px-10 bg-black">
          <div className="copyright font-code text-[10px] text-muted-foreground uppercase tracking-[1px] mb-4 md:mb-0">
            © 2026 Superteam Malaysia. Built on Solana.
          </div>
          <button 
            onClick={scrollToTop}
            className="back-to-top font-code text-[10px] text-white uppercase tracking-[2px] font-bold hover:text-primary transition-colors flex items-center gap-2 group"
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
        className="nav-link text-sm font-bold text-muted-foreground uppercase tracking-[1px] hover:text-white transition-all flex items-center group"
      >
        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-code text-primary mr-2">/</span>
        {label}
      </Link>
    </li>
  );
}
