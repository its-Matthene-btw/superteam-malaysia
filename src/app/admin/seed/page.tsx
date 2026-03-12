
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { seedDatabase } from '@/lib/supabase/seed';
import { Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    if (!confirm('This will insert hardcoded data into your Supabase database. Continue?')) return;
    setLoading(true);
    const data = await seedDatabase();
    setResult(data);
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            DATABASE <span className="text-primary">SEEDER</span>
          </h1>
          <p className="text-muted-foreground mt-2">Initialize your Supabase database with the hardcoded site content.</p>
        </div>

        <Card className="glass border-white/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white uppercase tracking-widest text-sm">
              <Database className="w-4 h-4 text-primary" /> System Initializer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Before running this, ensure you have created the tables in your Supabase dashboard using the SQL provided in the manual steps.
            </p>
            
            <Button 
              onClick={handleSeed} 
              disabled={loading}
              className="w-full solana-gradient h-14 font-bold uppercase tracking-widest text-xs"
            >
              {loading ? 'Seeding Database...' : 'Run Database Seed'}
            </Button>

            {result && (
              <div className="mt-8 space-y-4 animate-fade-up">
                <div className="p-4 rounded border border-white/10 bg-white/5 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Results
                  </h4>
                  <ul className="text-xs font-code space-y-1 text-muted-foreground">
                    <li>Stats Created: {result.stats}</li>
                    <li>Members Created: {result.members}</li>
                    <li>Events Created: {result.events}</li>
                    <li>Partners Created: {result.partners}</li>
                    <li>Testimonials Created: {result.testimonials}</li>
                  </ul>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 rounded border border-destructive/20 bg-destructive/10 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-destructive flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> Errors
                    </h4>
                    <ul className="text-xs font-code space-y-1 text-destructive/80">
                      {result.errors.map((err: string, i: number) => (
                        <li key={i}>- {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
