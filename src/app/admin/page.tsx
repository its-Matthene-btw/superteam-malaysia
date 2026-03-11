
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Plus, 
  Sparkles, 
  LogOut,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md glass border-white/10">
          <CardHeader>
            <CardTitle className="text-center font-headline font-bold text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <Button 
              className="w-full solana-gradient font-bold" 
              onClick={() => password === 'superteam' ? setIsLoggedIn(true) : alert('Invalid credentials')}
            >
              Access CMS
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col space-y-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg solana-gradient flex items-center justify-center font-bold text-white">S</div>
          <span className="font-headline font-bold text-lg tracking-tighter">ADMIN CMS</span>
        </Link>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" active />
          <SidebarItem icon={Users} label="Members" />
          <SidebarItem icon={Calendar} label="Events" />
          <Link href="/admin/draft" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-secondary group">
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            <span className="font-medium">AI Drafter</span>
          </Link>
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <Button variant="ghost" className="justify-start text-muted-foreground hover:text-red-400" onClick={() => setIsLoggedIn(false)}>
          <LogOut className="w-5 h-5 mr-3" /> Log Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">Events Management</h1>
            <p className="text-muted-foreground">Manage upcoming and past community events.</p>
          </div>
          <Button className="solana-gradient font-bold rounded-xl">
            <Plus className="w-5 h-5 mr-2" /> New Event
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <Card className="glass border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">Solana Ecosystem Night KL</TableCell>
                  <TableCell>May 15, 2024</TableCell>
                  <TableCell>Meetup</TableCell>
                  <TableCell><span className="text-secondary">Published</span></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Build Station Malaysia</TableCell>
                  <TableCell>April 20, 2024</TableCell>
                  <TableCell>Coworking</TableCell>
                  <TableCell><span className="text-muted-foreground">Archived</span></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
