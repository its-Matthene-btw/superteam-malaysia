
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
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- 1. Extend Ecosystem Table
ALTER TABLE ecosystem_projects 
ADD COLUMN IF NOT EXISTS network text,
ADD COLUMN IF NOT EXISTS token_symbol text,
ADD COLUMN IF NOT EXISTS contract_address text;

-- 2. Create Features Table
CREATE TABLE IF NOT EXISTS ecosystem_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES ecosystem_projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE ecosystem_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Features" ON ecosystem_features FOR SELECT USING (true);
CREATE POLICY "Admin All Features" ON ecosystem_features FOR ALL TO authenticated USING (true);
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
      await seedEcosystemData();
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
          <div className="pill-badge mb-6 bg-white/5 border-white/10">
            <ShieldCheck className="w-3 h-3 text-primary" /> CORE INITIALIZATION
          </div>
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
                Execute this in Supabase SQL Editor to enable individual protocol features and metadata.
              </p>
              <pre className="p-4 rounded bg-black/50 border border-white/5 text-[9px] font-code text-primary h-[300px] overflow-y-auto whitespace-pre-wrap relative">
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
                  Populates the high-fidelity Ecosystem page with detailed protocol features and stats.
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
