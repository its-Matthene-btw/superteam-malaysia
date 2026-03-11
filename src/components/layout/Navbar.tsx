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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">S</div>
          <span className="font-headline font-bold text-xl tracking-tighter">SUPERTEAM <span className="text-primary">MY</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
          <Button variant="ghost" className="text-sm hover:text-primary">
            Join Discord
          </Button>
          <Link href="/admin">
            <Button size="sm" className="bg-primary hover:opacity-90">Admin</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300">
          {links.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium">
              {link.name}
            </Link>
          ))}
          <Button className="w-full bg-primary">Join Discord</Button>
        </div>
      )}
    </nav>
  );
}
