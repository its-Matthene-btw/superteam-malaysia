
'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sendMessage } from '@/services/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, MessageSquare, MapPin, Globe, ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.223H5.078z" />
  </svg>
);

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
      toast({ title: "Transmission Successful", description: "Your message has been received by the Malaysian node." });
    } catch (error) {
      toast({ variant: "destructive", title: "Transmission Error", description: "Failed to sync message with the network." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-primary/30 font-body">
      <Navbar />

      <nav className="fixed top-0 left-0 right-0 z-[100] px-10 h-20 border-b border-white/10 flex items-center justify-between bg-[#0a0a0c]/85 backdrop-blur-xl">
        <Link href="/" className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] hover:text-primary transition-colors flex items-center gap-2">
          <ChevronLeft className="w-3 h-3" /> SYSTEM_ROOT
        </Link>
        <span className="font-code text-[10px] text-[#14F195] uppercase tracking-[3px] whitespace-nowrap hidden sm:block">// SECURE_CONNECTION</span>
      </nav>

      {/* HERO SECTION - CONTROL PANEL */}
      <section className="relative mt-20 border-b border-white/10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] bg-white/10 gap-[1px]">
        <div className="bg-[#0a0a0c] p-10 lg:p-24 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black:30%,transparent_100%)]" />
          
          <div className="relative z-10">
            <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-6">// INITIATE_COMMUNICATION</div>
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">
              Transmit<br />Message<span className="inline-block w-4 h-12 lg:w-6 lg:h-20 bg-primary align-bottom ml-4 animate-pulse" />
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
              Whether you are looking for a grant, want to co-host an event, or need technical support from the local Solana developer network—ping the system.
            </p>
          </div>
        </div>

        <div className="relative bg-[#050505] overflow-hidden min-h-[400px] lg:min-h-full flex items-center justify-center group">
          <Image 
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200" 
            alt="Technical Grid" 
            fill 
            className="object-cover opacity-40 grayscale contrast-150 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)] z-10" />
          
          {/* SCANNER ANIMATION */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_20px_5px_rgba(153,69,255,0.15)] z-20 animate-[scan_4s_linear_infinite]" />
          
          {/* RETICLE */}
          <div className="relative w-48 h-48 border border-dashed border-primary/40 rounded-full flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite] z-10">
            <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* CONTACT LAYOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_450px] border-b border-white/10">
        
        {/* FORM SECTION */}
        <div className="p-10 lg:p-24 bg-[#0a0a0c]">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-12">// INPUT_PARAMETERS</div>
          
          {sent ? (
            <div className="p-10 border border-[#14F195]/20 bg-[#14F195]/5 font-code text-sm text-[#14F195] uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4">
              // SUCCESS: TRANSMISSION_RECEIVED. WE WILL RESPOND WITHIN 48_HOURS.
              <Button 
                variant="link" 
                onClick={() => setSent(false)} 
                className="mt-6 text-[#14F195] p-0 font-bold underline"
              >
                [ RESET_TERMINAL ]
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 group">
                  <Label className="font-code text-[10px] text-muted-foreground uppercase tracking-[2px] flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <span className="text-[8px]">►</span> IDENTIFIER [FULL_NAME]
                  </Label>
                  <Input 
                    placeholder="Enter your full name" 
                    className="h-16 bg-[#050505] border-white/10 rounded-none font-code text-sm focus:ring-0 focus:border-primary focus:border-l-4 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-4 group">
                  <Label className="font-code text-[10px] text-muted-foreground uppercase tracking-[2px] flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <span className="text-[8px]">►</span> RETURN_ADDRESS [EMAIL_ADDRESS]
                  </Label>
                  <Input 
                    type="email" 
                    placeholder="Enter routing email" 
                    className="h-16 bg-[#050505] border-white/10 rounded-none font-code text-sm focus:ring-0 focus:border-primary focus:border-l-4 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-4 group">
                <Label className="font-code text-[10px] text-muted-foreground uppercase tracking-[2px] flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <span className="text-[8px]">►</span> PAYLOAD [MESSAGE_DETAIL]
                </Label>
                <Textarea 
                  placeholder="Detail your request or inquiry here..." 
                  className="min-h-[220px] bg-[#050505] border-white/10 rounded-none font-code text-sm focus:ring-0 focus:border-primary focus:border-l-4 transition-all p-6"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-white text-black font-code font-black uppercase tracking-[3px] text-xs px-12 py-6 hover:bg-primary hover:text-white transition-all flex items-center gap-4 disabled:opacity-50"
              >
                {loading ? 'TRANSMITTING...' : 'TRANSMIT_DATA'}
                {!loading && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>

        {/* INFO SECTION */}
        <aside className="p-10 lg:p-16 bg-[#050505] border-l border-white/10 flex flex-col gap-10">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// DIRECT_CHANNELS</div>
          
          <Link href="https://discord.gg/superteammy" target="_blank" className="p-8 bg-[#0a0a0c] border border-white/10 relative overflow-hidden group hover:border-primary transition-all flex flex-col gap-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            <div className="w-12 h-12 bg-[#050505] border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              <DiscordIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Discord Server</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Bypass the form. Connect directly with devs for fast technical support.</p>
            </div>
            <span className="font-code text-[10px] text-primary uppercase tracking-[2px]">JOIN_SERVER ↗</span>
          </Link>

          <Link href="https://x.com/superteammy" target="_blank" className="p-8 bg-[#0a0a0c] border border-white/10 relative overflow-hidden group hover:border-primary transition-all flex flex-col gap-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            <div className="w-12 h-12 bg-[#050505] border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              <XIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">X / Twitter</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">DMs are open for partnership and event co-hosting inquiries.</p>
            </div>
            <span className="font-code text-[10px] text-primary uppercase tracking-[2px]">FOLLOW_US ↗</span>
          </Link>

          <div className="mt-auto relative h-56 border border-white/10 bg-zinc-900 overflow-hidden flex items-center justify-center group">
            <Image 
              src="https://images.unsplash.com/photo-1596422846543-75c6ff416766?auto=format&fit=crop&q=80&w=600" 
              alt="KL Map" 
              fill 
              className="object-cover opacity-20 sepia hue-rotate-[220deg] saturate-[3] contrast-125 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,#050505_100%)]" />
            <div className="relative z-10 text-center">
              <div className="font-code text-[10px] text-primary uppercase tracking-[3px] mb-2">// PRIMARY_NODE</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Kuala Lumpur</h3>
              <p className="font-code text-[10px] text-muted-foreground mt-2 tracking-widest uppercase">MY_REGION</p>
            </div>
          </div>
        </aside>
      </section>

      {/* QUICK ANSWERS */}
      <section className="py-24 px-10 bg-[#0a0a0c]">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-code text-[10px] text-muted-foreground uppercase tracking-[3px] mb-4">// KNOWLEDGE_BASE</div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-16">Quick Answers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {[
              { title: 'Looking for Grants?', desc: 'We offer equity-free funding up to $25k for builders in the region. Check our grant criteria before applying.', link: '/ecosystem', label: 'READ_GUIDELINES' },
              { title: 'Want to earn Bounties?', desc: 'Check the Superteam Earn platform. We post new technical and non-technical bounties every week.', link: 'https://earn.superteam.fun', label: 'EXPLORE_EARN' },
              { title: 'Need Dev Support?', desc: "Don't use the contact form for code issues. Drop your Anchor/Rust questions in the #dev-support Discord channel.", link: 'https://discord.gg/superteammy', label: 'JOIN_DISCORD' }
            ].map((card, i) => (
              <Link key={i} href={card.link} className="p-12 bg-[#050505] hover:bg-[#0a0a0c] transition-colors flex flex-col h-full group">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6 group-hover:text-[#14F195] transition-colors">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-10 flex-1">{card.desc}</p>
                <div className="font-code text-[10px] text-primary uppercase tracking-[2px]">{card.label} ↗</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
