
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase, seedEcosystemData } from '@/lib/supabase/seed';
import { Database, CheckCircle2, Copy, ShieldCheck, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [ecoLoading, setEcoLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [ecoResult, setEcoResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- 1. Extend Schema for News, Ecosystem & Contacts
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  published_at timestamp WITH TIME ZONE DEFAULT now(),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 2. Create Ecosystem Tables
CREATE TABLE IF NOT EXISTS ecosystem_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  short_description text,
  long_description text,
  logo_url text,
  hero_image_url text,
  website_url text,
  docs_url text,
  twitter_url text,
  discord_url text,
  github_url text,
  status text DEFAULT 'Live',
  featured boolean DEFAULT false,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text, -- Grant, Bounty, Job
  link text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON ecosystem_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON ecosystem_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Opps" ON ecosystem_opportunities FOR SELECT USING (true);

CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Subs" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin All News" ON news FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All FAQs" ON faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Contacts" ON contacts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Subs" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Projects" ON ecosystem_projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Categories" ON ecosystem_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Opps" ON ecosystem_opportunities FOR ALL TO authenticated USING (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "SQL migration copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const data = await seedDatabase();
      setResult(data);
      toast({ title: "Success!", description: "Main database systems seeded." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEcosystemSeed = async () => {
    setEcoLoading(true);
    try {
      const data = await seedEcosystemData();
      setEcoResult(data);
      toast({ title: "Ecosystem Seeded!", description: "High-fidelity ecosystem data is now live." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setEcoLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> CORE INITIALIZATION v5</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            DATABASE <span className="text-primary">SYNC</span>
          </h1>
          <p className="text-muted-foreground mt-2">Initialize News, FAQ, and the new Ecosystem Blueprint systems.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <ShieldCheck className="w-4 h-4 text-primary" /> 1. SQL Migration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Execute this in Supabase SQL Editor to ensure all new Ecosystem tables and RLS policies are active.
              </p>
              <pre className="p-4 rounded bg-black/50 border border-white/5 text-[9px] font-code text-primary h-[300px] overflow-y-auto whitespace-pre-wrap relative">
                {sqlSchema}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copySql}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-primary hover:text-black transition-all"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </pre>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass border-white/10 flex flex-col">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                  <Database className="w-4 h-4 text-secondary" /> 2. Main System Seed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inserts fresh content for core systems: news, FAQs, events, and members.
                </p>
                <div className="mt-auto">
                  <Button 
                    onClick={handleSeed} 
                    disabled={loading}
                    className="w-full solana-gradient h-12 font-bold uppercase tracking-widest text-xs"
                  >
                    {loading ? 'Processing...' : 'Execute Main Seed'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 flex flex-col">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                  <Zap className="w-4 h-4 text-yellow-400" /> 3. Ecosystem Blueprint Seed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Populates the high-fidelity Ecosystem page with projects, categories, and active opportunities.
                </p>
                <div className="mt-auto">
                  <Button 
                    onClick={handleEcosystemSeed} 
                    disabled={ecoLoading}
                    variant="secondary"
                    className="w-full h-12 font-bold uppercase tracking-widest text-xs"
                  >
                    {ecoLoading ? 'Seeding...' : 'Seed Ecosystem Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
