
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getMembers } from '@/services/members';
import { getEvents } from '@/services/events';
import { getPartners } from '@/services/partners';
import { getTestimonials } from '@/services/testimonials';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { Users, Calendar, Handshake, MessageSquareQuote, Sparkles, Database, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Individual fetches to handle partial table failures
        const results = await Promise.allSettled([
          getMembers(),
          getEvents(),
          getPartners(),
          getTestimonials(),
          getCurrentProfile()
        ]);

        const [m, e, p, t, prof] = results.map(res => res.status === 'fulfilled' ? res.value : null);

        setStats({
          members: m?.length || 0,
          events: e?.length || 0,
          partners: p?.length || 0,
          testimonials: t?.length || 0
        });
        
        setProfile(prof as Profile | null);

        // Check if all core tables failed
        const failedCount = results.filter(res => res.status === 'rejected').length;
        if (failedCount > 2) {
          setError('System connection limited. Database tables may not be initialized.');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError('Connection error. Please check your network and Supabase configuration.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Members', value: stats.members, icon: Users, color: 'text-primary' },
    { name: 'Total Events', value: stats.events, icon: Calendar, color: 'text-secondary' },
    { name: 'Total Partners', value: stats.partners, icon: Handshake, color: 'text-[#14F195]' },
    { name: 'Testimonials', value: stats.testimonials, icon: MessageSquareQuote, color: 'text-white' },
  ];

  return (
    <div className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6 bg-white/5 border-white/10">
            <Sparkles className="w-3 h-3 text-secondary" /> SYSTEM OVERVIEW
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            ADMIN <span className="text-primary">DASHBOARD</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage the Superteam Malaysia ecosystem content.</p>
        </div>
        
        {/* Bootstrap shortcut for users without a profile yet (initial setup) */}
        {!profile && !loading && (
          <Link href="/admin/seed">
            <Button variant="outline" className="glass border-primary/20 text-xs font-code uppercase tracking-widest gap-2 text-primary hover:bg-primary hover:text-black">
              <Database className="w-4 h-4" /> Initialize System
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="p-6 rounded-xl border border-warning/20 bg-yellow-500/5 text-yellow-500 text-sm font-medium flex items-center gap-4">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-widest text-xs mb-1">Warning: {error}</p>
            <p className="opacity-70">Go to the Seed page to run migrations and initialize tables.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.name} className="glass border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-code uppercase tracking-widest text-muted-foreground">{card.name}</CardTitle>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{loading ? '...' : card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg font-headline font-bold uppercase tracking-widest">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-10 text-center text-muted-foreground font-code text-xs uppercase tracking-widest">
            {loading ? 'Analyzing transactions...' : error ? 'System awaiting initialization.' : 'Database connected. All systems operational.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
