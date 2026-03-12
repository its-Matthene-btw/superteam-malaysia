'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase } from '@/lib/supabase/seed';
import { Database, AlertCircle, CheckCircle2, Copy, Terminal, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- 1. Create Tables
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  skills TEXT[],
  bio TEXT,
  avatar_url TEXT,
  twitter_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  luma_url TEXT,
  status TEXT DEFAULT 'upcoming',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  twitter_url TEXT,
  type TEXT DEFAULT 'official',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Policies
CREATE POLICY "Allow public select" ON stats FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow public select" ON testimonials FOR SELECT USING (true);

-- 4. Create Authenticated Write Policies
CREATE POLICY "Allow auth all" ON stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all" ON members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all" ON partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow auth all" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. UNLOCK STORAGE BUCKETS (Run this to fix Upload Errors)
-- Make sure buckets 'avatars' and 'logos' are created in the Storage tab first.
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('avatars', 'logos') );
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id IN ('avatars', 'logos') );
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id IN ('avatars', 'logos') );
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id IN ('avatars', 'logos') );`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    toast({ title: "Copied!", description: "SQL Schema & Security Policies copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const data = await seedDatabase();
      setResult(data);
      if (data.errors.length === 0) {
        toast({ title: "Success!", description: "Database seeded successfully." });
      } else {
        toast({ variant: "destructive", title: "Partial Success", description: "RLS issues or table errors occurred." });
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
          <div className="pill-badge mb-6"><span>✦</span> INITIALIZATION</div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white">
            DATABASE <span className="text-primary">SETUP</span>
          </h1>
          <p className="text-muted-foreground mt-2">Unlock your CMS tables and Storage buckets with proper security policies.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass border-white/10 flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-xs">
                <ShieldCheck className="w-4 h-4 text-primary" /> Step 1: SQL & RLS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run this in your **Supabase SQL Editor** to create tables and **fix upload permissions**.
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
                <Database className="w-4 h-4 text-secondary" /> Step 2: Seed Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Inject the initial ecosystem content once policies are active.
              </p>
              
              <div className="mt-auto">
                <Button 
                  onClick={handleSeed} 
                  disabled={loading}
                  className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(153,69,255,0.2)]"
                >
                  {loading ? 'Processing Transaction...' : 'Run Database Seed'}
                </Button>
              </div>

              {result && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-4 rounded border border-white/10 bg-white/5 space-y-2">
                    <h4 className="font-bold text-[10px] uppercase tracking-widest text-secondary flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Record Insertion Status
                    </h4>
                    <ul className="text-[10px] font-code space-y-1 text-muted-foreground">
                      <li className={result.stats > 0 ? "text-white" : ""}>Stats: {result.stats} created</li>
                      <li className={result.members > 0 ? "text-white" : ""}>Members: {result.members} created</li>
                      <li className={result.events > 0 ? "text-white" : ""}>Events: {result.events} created</li>
                      <li className={result.partners > 0 ? "text-white" : ""}>Partners: {result.partners} created</li>
                      <li className={result.testimonials > 0 ? "text-white" : ""}>Testimonials: {result.testimonials} created</li>
                    </ul>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="p-4 rounded border border-destructive/20 bg-destructive/10 space-y-2">
                      <h4 className="font-bold text-[10px] uppercase tracking-widest text-destructive flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" /> System Logs (RLS Errors?)
                      </h4>
                      <ul className="text-[10px] font-code space-y-1 text-destructive/80">
                        {result.errors.map((err: string, i: number) => (
                          <li key={i}>ERR: {err}</li>
                        ))}
                      </ul>
                      <p className="text-[9px] text-muted-foreground italic mt-2">If you see RLS errors, verify you ran the policies in the SQL Editor.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
