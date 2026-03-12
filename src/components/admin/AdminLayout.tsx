
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Partners', href: '/admin/partners', icon: Handshake },
  { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Messages', href: '/admin/messages', icon: Inbox },
  { name: 'Seed', href: '/admin/seed', icon: Database },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
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
