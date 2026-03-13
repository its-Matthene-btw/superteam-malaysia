
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getCurrentProfile, Profile } from '@/services/profiles';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Handshake, 
  BarChart3, 
  MessageSquareQuote, 
  LogOut, 
  Menu, 
  X,
  Newspaper,
  Inbox,
  Database,
  Settings,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Members', href: '/admin/members', icon: Users, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Events', href: '/admin/events', icon: Calendar, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Partners', href: '/admin/partners', icon: Handshake, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Stats', href: '/admin/stats', icon: BarChart3, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, roles: ['admin', 'editor', 'viewer'] },
  { name: 'News', href: '/admin/news', icon: Newspaper, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Messages', href: '/admin/messages', icon: Inbox, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Ecosystem', href: '/admin/ecosystem', icon: Database, roles: ['admin', 'editor', 'viewer'] },
  { name: 'Users', href: '/admin/users', icon: ShieldCheck, roles: ['admin'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['admin'] },
  { name: 'Seed', href: '/admin/seed', icon: Database, roles: ['admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await getCurrentProfile();
        setProfile(p);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredNavItems = navItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-code text-xs uppercase tracking-[4px] text-muted-foreground">Authenticating Operator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 glass sticky top-0 z-50">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(153,69,255,0.4)] text-sm">S</div>
          <span className="font-headline font-bold text-lg tracking-tighter text-white uppercase">SUPERTEAM</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/10 transition-transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <Link href="/admin/dashboard" className="hidden lg:flex items-center space-x-2 mb-10">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(153,69,255,0.4)] text-sm">S</div>
            <span className="font-headline font-bold text-lg tracking-tighter text-white uppercase">SUPERTEAM</span>
          </Link>

          <div className="mb-8 px-4 py-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                profile?.role === 'admin' ? "bg-primary animate-pulse" : 
                profile?.role === 'editor' ? "bg-secondary" : "bg-white/20"
              )} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white truncate max-w-[140px]">{profile?.email}</span>
                <span className="text-[8px] font-code font-bold uppercase tracking-tighter text-muted-foreground">{profile?.role} node</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all font-code text-[10px] uppercase tracking-widest group",
                  pathname === item.href 
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(153,69,255,0.3)]" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className={cn("w-3.5 h-3.5", pathname === item.href ? "text-white" : "group-hover:text-primary transition-colors")} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/10">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors px-4"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="font-code text-[10px] uppercase tracking-widest">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-full">
        {children}
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
