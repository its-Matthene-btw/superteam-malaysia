
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase, seedEcosystemData } from '@/lib/supabase/seed';
import { Database, CheckCircle2, Copy, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [ecoLoading, setEcoLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- 1. Ecosystem System Creation
CREATE TABLE IF NOT EXISTS ecosystem_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS ecosystem_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  link text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 2. News & FAQ Tables
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

-- 3. RLS Security (Public Read, Authenticated Write)
ALTER TABLE ecosystem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Categories Policies
DO $$ BEGIN
  CREATE POLICY "Public Read Categories" ON ecosystem_categories FOR SELECT USING (true);
  CREATE POLICY "Admin All Categories" ON ecosystem_categories FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

-- Projects Policies
DO $$ BEGIN
  CREATE POLICY "Public Read Projects" ON ecosystem_projects FOR SELECT USING (true);
  CREATE POLICY "Admin All Projects" ON ecosystem_projects FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

-- Features Policies
DO $$ BEGIN
  CREATE POLICY "Public Read Features" ON ecosystem_features FOR SELECT USING (true);
  CREATE POLICY "Admin All Features" ON ecosystem_features FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

-- Opportunities Policies
DO $$ BEGIN
  CREATE POLICY "Public Read Opportunities" ON ecosystem_opportunities FOR SELECT USING (true);
  CREATE POLICY "Admin All Opportunities" ON ecosystem_opportunities FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

-- News Policies
DO $$ BEGIN
  CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
  CREATE POLICY "Admin All News" ON news FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;

-- FAQ Policies
DO $$ BEGIN
  CREATE POLICY "Public Read FAQ" ON faqs FOR SELECT USING (true);
  CREATE POLICY "Admin All FAQ" ON faqs FOR ALL TO authenticated USING (true);
EXCEPTION WHEN others THEN NULL; END $$;
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "Master SQL migration copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await seedDatabase();
      if (res.errors.length > 0) {
        toast({ variant: "destructive", title: "Partial Success", description: "Seeded some data, but some tables failed (likely missing schema)." });
      } else {
        toast({ title: "Success!", description: "Main database systems seeded." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEcosystemSeed = async () => {
    setEcoLoading(true);
    try {
      await seedEcosystemData();
      toast({ title: "Ecosystem Seeded!", description: "High-fidelity ecosystem data is now live." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: "Ensure you have run the SQL migration first." });
    } finally {
      setEcoLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="pill-badge mb-6 bg-white/5 border-white/10">
              <ShieldCheck className="w-3 h-3 text-primary" /> CORE INITIALIZATION
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
              DATABASE <span className="text-primary">SYNC</span>
            </h1>
            <p className="text-muted-foreground mt-2">Initialize the high-fidelity Ecosystem, News, and FAQ modules.</p>
          </div>
          
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 max-w-sm">
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest mb-2">
              <AlertTriangle className="w-4 h-4" /> Migration Required
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              If you see "Table not found" errors in the dashboard, you must run the SQL Migration in Step 1 first.
            </p>
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
              <p className="text-xs text-muted-foreground leading-relaxed">
                Execute this in your Supabase SQL Editor to create the Ecosystem and News tables.
              </p>
              <pre className="p-4 rounded bg-black/50 border border-white/5 text-[9px] font-code text-primary h-[400px] overflow-y-auto whitespace-pre-wrap relative">
                {sqlSchema}
                <button 
                  onClick={copySql}
                  className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-primary hover:text-black transition-all rounded"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
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
                  Inserts fresh content for core systems: members, events, and stats.
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
                  Populates the high-fidelity Ecosystem page with technical protocol features and opportunities.
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
