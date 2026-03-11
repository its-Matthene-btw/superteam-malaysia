"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Members', href: '/members' },
    { name: 'Events', href: '/#events' },
    { name: 'Ecosystem', href: '/#ecosystem' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black">
      <div className="w-full px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(153,69,255,0.4)]">S</div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">SUPERTEAM <span className="text-primary">MY</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4 ml-6">
            <Button variant="ghost" className="text-sm font-bold text-white hover:text-primary transition-colors">
              Join Discord
            </Button>
            <Link href="/admin">
              <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold px-6 py-5 rounded-none">ADMIN CMS</Button>
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
          <Button className="w-full bg-primary font-bold py-6">Join Discord</Button>
        </div>
      )}
    </nav>
  );
}
