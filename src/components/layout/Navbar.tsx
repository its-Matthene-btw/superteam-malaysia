
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getSettings } from '@/services/settings';
import Logo from './Logo';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const links = [
    { name: 'News', href: '/news' },
    { name: 'Events', href: '/events' },
    { name: 'Ecosystem', href: '/ecosystem' },
    { name: 'Members', href: '/members' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-black transition-transform duration-300 ease-in-out border-b border-white/5",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Logo className="w-10 h-10 text-white" />
          <span className="font-headline font-bold text-xl lg:text-2xl tracking-tighter text-white uppercase">SUPERTEAM</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center lg:space-x-10 space-x-4">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-[11px] lg:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors whitespace-nowrap">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center lg:space-x-6 space-x-3 ml-2 lg:ml-6 flex-shrink-0">
            <a 
              href={settings.social_x || "https://x.com/superteammy"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-all group"
              title="Follow us on X"
            >
              <XIcon className="w-4 h-4 lg:w-5 lg:h-5 text-black" />
            </a>
            <Link href="/contact">
              <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold px-3 lg:px-8 h-9 lg:h-12 rounded-none uppercase tracking-widest text-[9px] lg:text-xs">
                CONTACT
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-white/5 p-8 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
          {links.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xl font-bold uppercase tracking-widest text-white">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4">
             <a 
              href={settings.social_x || "https://x.com/superteammy"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
            >
              <XIcon className="w-6 h-6 text-black" />
            </a>
            <span className="text-white font-bold">Follow us on X</span>
          </div>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <Button className="w-full bg-primary font-bold rounded-none uppercase tracking-widest h-14">
              CONTACT
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
