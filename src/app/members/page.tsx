
"use client";

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { members } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Search, Twitter, Github, Linkedin, Award, Briefcase } from 'lucide-react';
import Image from 'next/image';

export default function MemberDirectory() {
  const [search, setSearch] = useState('');
  const [activeTrack, setActiveTrack] = useState('All');
  
  const tracks = ['All', 'Developer', 'Designer', 'Writer', 'Growth'];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesTrack = activeTrack === 'All' || m.track === activeTrack;
    return matchesSearch && matchesTrack;
  });

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline font-bold mb-6">Talent <span className="solana-text-gradient">Directory</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the founders, builders, and contributors who make up the Superteam Malaysia ecosystem.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search by name or skill..." 
              className="pl-10 glass border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tracks.map(track => (
              <Button 
                key={track}
                variant={activeTrack === track ? 'default' : 'outline'}
                size="sm"
                className={activeTrack === track ? 'solana-gradient border-none' : 'glass border-white/10'}
                onClick={() => setActiveTrack(track)}
              >
                {track}
              </Button>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <div className="glass rounded-2xl border-white/5 p-6 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-secondary">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-secondary mb-4">{member.title}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-white/5 text-[10px] uppercase font-bold tracking-wider">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Briefcase className="w-3 h-3 mr-1" /> {member.company}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 text-foreground max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="hidden">Member Profile</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                  <div className="col-span-1">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="flex justify-center space-x-4">
                      {member.social.twitter && <a href={member.social.twitter} className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></a>}
                      {member.social.github && <a href={member.social.github} className="text-muted-foreground hover:text-primary"><Github className="w-5 h-5" /></a>}
                      {member.social.linkedin && <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></a>}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-3xl font-headline font-bold">{member.name}</h2>
                      <Badge className="bg-secondary text-black">{member.track}</Badge>
                    </div>
                    <p className="text-primary font-medium mb-6">{member.title} @ {member.company}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="border-white/10">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Achievements</h4>
                        <ul className="space-y-2">
                          {member.achievements.map((ach, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Award className="w-4 h-4 text-secondary mr-2" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
