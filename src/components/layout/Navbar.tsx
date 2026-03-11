
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
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
    { name: 'Mission', href: '/#mission' },
    { name: 'Events', href: '/#events' },
    { name: 'Ecosystem', href: '/#ecosystem' },
    { name: 'Members', href: '/members' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-black transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="w-full px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(153,69,255,0.4)] text-xl">S</div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white uppercase">SUPERTEAM</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-6 ml-6">
            <a 
              href="https://x.com/superteammy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-all group"
              title="Follow us on X"
            >
              <Twitter className="w-5 h-5 text-black" />
            </a>
            <Link href="/#mission">
              <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-none uppercase tracking-widest text-xs">
                EXPLORE MORE
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
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
              href="https://x.com/superteammy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
            >
              <Twitter className="w-6 h-6 text-black" />
            </a>
            <span className="text-white font-bold">Follow us on X</span>
          </div>
        </div>
      )}
    </nav>
  );
}
