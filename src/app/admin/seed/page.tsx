
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase } from '@/lib/supabase/seed';
import { Database, AlertCircle, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- 1. Update Existing Tables
ALTER TABLE partners ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS case_study TEXT;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS tweet_image_url TEXT;

-- 2. Create New Tables
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Policies
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow public insert subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 5. Create Authenticated Policies
CREATE POLICY "Allow auth all contacts" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all news" ON news FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all subscribers" ON newsletter_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "SQL Schema updated." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const data = await seedDatabase();
      setResult(data);
      if (data.errors.length === 0) {
        toast({ title: "Success!", description: "Database fully initialized." });
      } else {
        toast({ variant: "destructive", title: "Partial Success", description: "Review logs for schema errors." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-up">
        <div>
          <div className="pill-badge mb-6"><span>✦</span> INITIALIZATION v2</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            DATABASE <span className="text-primary">MIGRATION</span>
          </h1>
          <p className="text-muted-foreground mt-2">Update schema for Events, News, Messages, and Partners Detail pages.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <ShieldCheck className="w-4 h-4 text-primary" /> Step 1: Run SQL Migration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run this in your **Supabase SQL Editor** to add new columns and tables.
              </p>
              <div className="relative flex-1 group">
                <pre className="p-4 rounded bg-black/50 border border-white/5 text-[10px] font-code text-primary h-[400px] overflow-y-auto whitespace-pre-wrap">
                  {sqlSchema}
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={copySql}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-primary hover:text-black transition-all"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <Database className="w-4 h-4 text-secondary" /> Step 2: Fresh Data Seed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will **wipe everything** and re-insert 2026 ecosystem data across all tables.
              </p>
              
              <div className="mt-auto">
                <Button 
                  onClick={handleSeed} 
                  disabled={loading}
                  className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs"
                >
                  {loading ? 'Processing Transaction...' : 'Reset & Seed v2'}
                </Button>
              </div>

              {result && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-4 rounded border border-white/10 bg-white/5 space-y-2">
                    <h4 className="font-bold text-[10px] uppercase tracking-widest text-secondary">Insertion Status</h4>
                    <ul className="text-[10px] font-code space-y-1 text-muted-foreground">
                      <li>News: {result.news || 0} created</li>
                      <li>Contacts: {result.contacts || 0} created</li>
                      <li>Subscribers: {result.subscribers || 0} created</li>
                      <li>Partners: {result.partners || 0} created</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
