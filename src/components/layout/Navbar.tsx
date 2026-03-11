
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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg solana-gradient flex items-center justify-center font-bold text-white">S</div>
          <span className="font-headline font-bold text-xl tracking-tighter">SUPERTEAM <span className="solana-text-gradient">MY</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-secondary transition-colors">
              {link.name}
            </Link>
          ))}
          <Button variant="outline" className="border-primary/50 hover:border-primary">
            Join Discord
          </Button>
          <Link href="/admin">
            <Button size="sm" className="solana-gradient hover:opacity-90">Admin</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 glass rounded-2xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          {links.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium">
              {link.name}
            </Link>
          ))}
          <Button className="w-full solana-gradient">Join Discord</Button>
        </div>
      )}
    </nav>
  );
}
