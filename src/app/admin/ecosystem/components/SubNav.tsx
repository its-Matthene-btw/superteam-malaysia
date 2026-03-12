
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Database, LayoutGrid } from 'lucide-react';

const subNavItems = [
  { name: 'Projects', href: '/admin/ecosystem/projects', icon: LayoutGrid },
  { name: 'Categories', href: '/admin/ecosystem/categories', icon: Database },
];

export default function SubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2">
      {subNavItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium',
            pathname === item.href
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-white/5 hover:text-white'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
