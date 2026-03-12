'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getMembers } from '@/services/members';
import { getEvents } from '@/services/events';
import { getPartners } from '@/services/partners';
import { getTestimonials } from '@/services/testimonials';
import { Users, Calendar, Handshake, MessageSquareQuote, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    partners: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [m, e, p, t] = await Promise.all([
          getMembers(),
          getEvents(),
          getPartners(),
          getTestimonials()
        ]);
        setStats({
          members: m.length,
          events: e.length,
          partners: p.length,
          testimonials: t.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
    <AdminLayout>
      <div className="space-y-10 animate-fade-up">
        <div>
          <div className="pill-badge mb-6 bg-white/5 border-white/10">
            <Sparkles className="w-3 h-3 text-secondary" /> SYSTEM OVERVIEW
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            ADMIN <span className="text-primary">DASHBOARD</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage the Superteam Malaysia ecosystem content.</p>
        </div>

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
              Live updates coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}