
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase, seedFAQsOnly, seedSiteSettings } from '@/lib/supabase/seed';
import { seedEcosystemData } from '@/lib/supabase/ecosystem-seed';
import { Database, CheckCircle2, Copy, ShieldCheck, Trash2, HelpCircle, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [ecoLoading, setEcoLoading] = useState(false);
  const [faqLoading, setFaqLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- MASTER MIGRATION SQL (v2.1 - RBAC RECURSION FIX)

-- 1. Profiles (RBAC)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 2. RBAC Helper Functions (Crucial to prevent infinite recursion)
-- SECURITY DEFINER bypasses the RLS check on the profiles table itself
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Core CMS Tables
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  role text NOT NULL,
  company text,
  skills text[],
  bio text,
  avatar_url text,
  twitter_url text,
  featured boolean DEFAULT false,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE,
  logo_url text,
  website_url text,
  description text,
  long_description text,
  case_study text,
  featured boolean DEFAULT false,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text UNIQUE NOT NULL,
  value text NOT NULL,
  order_index integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  avatar_url text,
  twitter_url text,
  tweet_image_url text,
  type text CHECK (type IN ('twitter', 'discord', 'official')),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text UNIQUE NOT NULL,
  description text,
  location text,
  event_date timestamp WITH TIME ZONE NOT NULL,
  luma_url text,
  image_url text,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past')),
  featured boolean DEFAULT false,
  category text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  published_at timestamp WITH TIME ZONE NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text UNIQUE NOT NULL,
  answer text NOT NULL,
  faq_id text,
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

CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY,
  value text,
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

-- 4. Clean and Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_opportunities ENABLE ROW LEVEL SECURITY;

-- 5. Policies (v2.1 Recursive Fix)
-- DYNAMICALLY DROP ALL EXISTING POLICIES TO PREVENT PERSISTENT RECURSION
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Public Selects
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Members" ON members FOR SELECT USING (true);
CREATE POLICY "Public Read Partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public Read Stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Eco Projects" ON ecosystem_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Eco Features" ON ecosystem_features FOR SELECT USING (true);
CREATE POLICY "Public Read Eco Categories" ON ecosystem_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Eco Opportunities" ON ecosystem_opportunities FOR SELECT USING (true);

-- Authenticated Staff Access (Modify)
CREATE POLICY "Staff Modify Members" ON members FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Partners" ON partners FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Stats" ON stats FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Testimonials" ON testimonials FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Events" ON events FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify News" ON news FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify FAQs" ON faqs FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Eco Projects" ON ecosystem_projects FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Eco Features" ON ecosystem_features FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Eco Categories" ON ecosystem_categories FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Staff Modify Eco Opportunities" ON ecosystem_opportunities FOR ALL TO authenticated USING (check_is_staff());

-- Admin Only Management
CREATE POLICY "Admin Full Profiles" ON profiles FOR ALL TO authenticated USING (check_is_admin());
CREATE POLICY "Admin Full Settings" ON site_settings FOR ALL TO authenticated USING (check_is_admin());

-- Leads/Inbox
CREATE POLICY "Public Insert Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff Manage Contacts" ON contacts FOR ALL TO authenticated USING (check_is_staff());
CREATE POLICY "Public Insert Newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff Manage Newsletter" ON newsletter_subscribers FOR ALL TO authenticated USING (check_is_staff());

-- 6. Auth Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "SQL migration v2.1 copied." });
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

  const handleSettingsSeed = async () => {
    setSettingsLoading(true);
    try {
      await seedSiteSettings();
      toast({ title: "Settings Seeded", description: "Global configuration initialized." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setSettingsLoading(false);
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
          <p className="text-muted-foreground mt-2">Maintain core infrastructure and RBAC blueprints.</p>
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
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-2">
              Note: Version 2.1 resolves recursion errors.
            </p>
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
                <Globe className="w-4 h-4 text-primary" /> 3. Global Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground">Initialize hardcoded links, headlines, and SEO mesh parameters.</p>
              <div className="mt-auto">
                <Button onClick={handleSettingsSeed} disabled={settingsLoading} className="w-full bg-white text-black hover:bg-white/80 font-bold h-12 text-xs uppercase">
                  {settingsLoading ? 'Syncing...' : 'Seed Global Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <HelpCircle className="w-4 h-4 text-primary" /> 4. FAQ Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground">Populate FAQ parameters for Grants, Bounties, and Build Stations.</p>
              <div className="mt-auto">
                <Button onClick={handleFaqSeed} disabled={faqLoading} className="w-full border border-white/10 hover:bg-white/5 font-bold h-12 text-xs uppercase">
                  {faqLoading ? 'Seeding...' : 'Seed Knowledge Base'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 border-red-500/20 flex flex-col bg-red-500/5">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-red-400 uppercase tracking-widest text-xs">
                <Trash2 className="w-4 h-4" /> 5. Wipe & Seed Ecosystem
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
