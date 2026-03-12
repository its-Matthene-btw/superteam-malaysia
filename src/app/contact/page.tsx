
'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sendMessage } from '@/services/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2, Loader2, Mail, MessageSquare, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMessage(formData);
      setSent(true);
      toast({ title: "Message Sent!", description: "We'll get back to you shortly." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative pt-48 pb-32 px-10 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 left-0 w-[1000px] h-[800px] bg-[radial-gradient(circle,rgba(153,69,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="pill-badge mb-8"><span>✦</span> GET IN TOUCH</div>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-tighter leading-[0.9] mb-10 text-white">
              CONNECT WITH<br />
              <span className="solana-text-gradient">THE TEAM</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mb-12 font-medium">
              Have a proposal, feedback, or just want to chat about building on Solana? We're active and ready to help.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Us', value: 'hello@superteam.my' },
                { icon: MessageSquare, label: 'Join Discord', value: 'discord.gg/superteammy' },
                { icon: Globe, label: 'Global Network', value: 'superteam.fun' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 glass border-white/5 hover:border-primary/30 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <item.icon className="w-5 h-5 text-white group-hover:text-black" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</div>
                    <div className="text-white font-bold text-lg">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass p-10 lg:p-12 rounded-[32px] border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
              
              {sent ? (
                <div className="py-20 text-center animate-in fade-in zoom-in-95">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Message Transmission Complete</h3>
                  <p className="text-muted-foreground text-lg mb-10">Our team has received your inquiry. Check your inbox soon.</p>
                  <Button variant="outline" onClick={() => setSent(false)} className="glass border-white/10 uppercase font-bold tracking-widest text-xs h-12 px-10">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <Input 
                      placeholder="Your name" 
                      className="glass border-white/10 h-14 text-white focus:ring-primary focus:border-primary"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="builder@solana.com" 
                      className="glass border-white/10 h-14 text-white focus:ring-primary focus:border-primary"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Message Detail</Label>
                    <Textarea 
                      placeholder="Tell us about your project or inquiry..." 
                      className="glass border-white/10 min-h-[180px] text-white focus:ring-primary focus:border-primary p-6"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full solana-gradient h-16 font-bold uppercase tracking-[3px] text-sm group"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    Initiate Contact
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
