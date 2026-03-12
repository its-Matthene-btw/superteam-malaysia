
'use client';

import SubNav from './components/SubNav';

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  // This layout is automatically nested inside the root admin/layout.tsx
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ecosystem</h1>
          <p className="text-muted-foreground">Manage the projects and categories in the ecosystem.</p>
        </div>
      </div>
      <SubNav />
      <div>{children}</div>
    </div>
  );
}
