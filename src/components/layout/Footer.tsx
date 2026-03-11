
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-lg solana-gradient flex items-center justify-center font-bold text-white">S</div>
            <span className="font-headline font-bold text-xl tracking-tighter uppercase">Superteam MY</span>
          </Link>
          <p className="text-muted-foreground max-w-sm mb-6">
            Building the next generation of digital infrastructure in Malaysia. Join the most active Solana community in Southeast Asia.
          </p>
          <div className="flex space-x-4">
            {[Twitter, Github, Linkedin, MessageSquare].map((Icon, idx) => (
              <a key={idx} href="#" className="p-2 glass rounded-full hover:text-secondary transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><a href="#" className="hover:text-white transition-colors">Bounties</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Grants</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Ecosystem Tools</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Build Station</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-6">Community</h4>
          <ul className="space-y-4 text-muted-foreground">
            <li><Link href="/members" className="hover:text-white transition-colors">Talent Directory</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Events Calendar</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2024 Superteam Connect Malaysia. Not affiliated with Solana Labs.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
