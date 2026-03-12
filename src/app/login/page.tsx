"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ChevronLeft, Sparkles, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] bg-center [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(153,69,255,0.15)_0%,transparent_70%)] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(20,241,149,0.05)_0%,transparent_70%)] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-20 w-full px-8 h-20 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(153,69,255,0.4)] text-sm">S</div>
          <span className="font-headline font-bold text-lg tracking-tighter text-white uppercase">SUPERTEAM</span>
        </Link>
        <Link href="/" className="text-xs font-code font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft className="w-3 h-3" /> Back Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-10">
            <div className="pill-badge mb-6 mx-auto bg-white/5 border-white/10">
              <Sparkles className="w-3 h-3 text-secondary" /> PORTAL ACCESS
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              WELCOME <span className="text-primary">BACK</span>
            </h1>
            <p className="text-muted-foreground font-medium">Enter your credentials to access the builder dashboard.</p>
          </div>

          <Card className="glass border-white/10 shadow-2xl overflow-hidden bg-black/40">
            <CardHeader className="border-b border-white/5 pb-8">
              <CardTitle className="text-xl font-headline font-bold uppercase tracking-widest text-white flex items-center gap-3">
                <LogIn className="w-5 h-5 text-primary" /> Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-code text-[10px] uppercase tracking-[2px] text-muted-foreground ml-1">Email Protocol</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@ecosystem.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass border-white/10 h-12 text-white focus:ring-primary focus:border-primary placeholder:text-white/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="font-code text-[10px] uppercase tracking-[2px] text-muted-foreground ml-1">Key Phrase</Label>
                    <button type="button" className="text-[10px] font-code uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Forgot?</button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass border-white/10 h-12 text-white focus:ring-primary focus:border-primary placeholder:text-white/20"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 rounded border border-destructive/20 bg-destructive/10 text-destructive text-xs font-medium animate-in fade-in zoom-in-95">
                    ERROR: {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full solana-gradient h-14 font-bold text-sm uppercase tracking-[3px] shadow-[0_0_20px_rgba(153,69,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Initiate Session'}
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] font-code text-muted-foreground uppercase tracking-widest">
                  Not a member? <Link href="/#mission" className="text-primary hover:underline">Apply to the network</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 w-full p-8 flex justify-center border-t border-white/5 bg-black/50 backdrop-blur-md">
        <p className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px]">
          Secure Authentication Layer v4.0.2
        </p>
      </footer>
    </div>
  );
}
