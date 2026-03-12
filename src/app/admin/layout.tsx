
'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  // Single source of truth for Admin Sidebar
  return <AdminLayout>{children}</AdminLayout>;
}
