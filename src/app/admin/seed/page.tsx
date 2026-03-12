'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase, seedFAQsOnly } from '@/lib/supabase/seed';
import { seedEcosystemData } from '@/lib/supabase/ecosystem-seed';
import { Database, CheckCircle2, Copy, ShieldCheck, Trash2, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [ecoLoading, setEcoLoading] = useState(false);
  const [faqLoading, setFaqLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- MASTER MIGRATION SQL
-- 1. Create Ecosystem Tables
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
  network text,
  token_symbol text,
  contract_address text,
  status text,
  featured boolean DEFAULT false,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES ecosystem_projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  type text,
  link text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 2. Create FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  faq_id text,
  order_index integer DEFAULT 0,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 3. Create Newsletter Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE ecosystem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Idempotent using DROP IF EXISTS)
DROP POLICY IF EXISTS "Public Read Ecosystem" ON ecosystem_projects;
CREATE POLICY "Public Read Ecosystem" ON ecosystem_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Full Access Ecosystem" ON ecosystem_projects;
CREATE POLICY "Admin Full Access Ecosystem" ON ecosystem_projects FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Features" ON ecosystem_features;
CREATE POLICY "Public Read Features" ON ecosystem_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Features" ON ecosystem_features;
CREATE POLICY "Admin All Features" ON ecosystem_features FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON ecosystem_categories;
CREATE POLICY "Public Read Categories" ON ecosystem_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Categories" ON ecosystem_categories;
CREATE POLICY "Admin All Categories" ON ecosystem_categories FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Opportunities" ON ecosystem_opportunities;
CREATE POLICY "Public Read Opportunities" ON ecosystem_opportunities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Opportunities" ON ecosystem_opportunities;
CREATE POLICY "Admin All Opportunities" ON ecosystem_opportunities FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Read FAQs" ON faqs;
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All FAQs" ON faqs;
CREATE POLICY "Admin All FAQs" ON faqs FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Write News" ON newsletter_subscribers;
CREATE POLICY "Public Write News" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin All News" ON newsletter_subscribers;
CREATE POLICY "Admin All News" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
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
      await seedDatabase();
      toast({ title: "System Seeded", description: "Base records updated." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEcosystemSeed = async () => {
    if (!confirm('WIPE ALL ecosystem data and re-seed blueprints?')) return;
    setEcoLoading(true);
    try {
      await seedEcosystemData();
      toast({ title: "Ecosystem Re-Seeded", description: "Blueprints are live." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Run SQL migration first." });
    } finally {
      setEcoLoading(false);
    }
  };

  const handleFaqSeed = async () => {
    setFaqLoading(true);
    try {
      await seedFAQsOnly();
      toast({ title: "FAQs Seeded", description: "Knowledge base updated." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setFaqLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="pill-badge mb-6">
            <ShieldCheck className="w-3 h-3 text-primary" /> SYSTEM CONTROL
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            DATABASE <span className="text-primary">SYNC</span>
          </h1>
          <p className="text-muted-foreground mt-2">Maintain core infrastructure and technical blueprints.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass border-white/10 flex flex-col">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
              <ShieldCheck className="w-4 h-4 text-primary" /> 1. SQL Migration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
            <pre className="p-4 rounded bg-black/50 border border-white/5 text-[9px] font-code text-primary h-[400px] overflow-y-auto whitespace-pre-wrap relative">
              {sqlSchema}
              <button onClick={copySql} className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-primary transition-all rounded">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </pre>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <Database className="w-4 h-4 text-secondary" /> 2. System Seed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground">Non-destructive update for News, Members, and Stats.</p>
              <div className="mt-auto">
                <Button onClick={handleSeed} disabled={loading} className="w-full solana-gradient font-bold h-12 text-xs uppercase">
                  {loading ? 'Syncing...' : 'Execute System Seed'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <HelpCircle className="w-4 h-4 text-[#14F195]" /> 3. FAQ / Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground">Populate technical FAQ parameters for Grants, Bounties, and Build Stations.</p>
              <div className="mt-auto">
                <Button onClick={handleFaqSeed} disabled={faqLoading} className="w-full bg-[#14F195] text-black hover:bg-[#14F195]/80 font-bold h-12 text-xs uppercase">
                  {faqLoading ? 'Seeding...' : 'Seed Knowledge Base'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 border-red-500/20 flex flex-col bg-red-500/5 col-span-1 md:col-span-2">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-red-400 uppercase tracking-widest text-xs">
                <Trash2 className="w-4 h-4" /> 4. Wipe & Seed Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-red-200/60 font-medium">DESTRUCTIVE: Swipes only Ecosystem data and Features.</p>
              <div className="mt-auto">
                <Button onClick={handleEcosystemSeed} disabled={ecoLoading} variant="destructive" className="w-full h-12 text-xs uppercase font-bold">
                  {ecoLoading ? 'Wiping...' : 'Wipe & Re-Seed Ecosystem'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
