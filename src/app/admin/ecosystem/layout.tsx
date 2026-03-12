
import AdminLayout from '@/components/admin/AdminLayout';
import SubNav from './components/SubNav';

export default function EcosystemLayout({ children, actions }: { children: React.ReactNode, actions: React.ReactNode }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ecosystem</h1>
            <p className="text-muted-foreground">Manage the projects and categories in the ecosystem.</p>
          </div>
          {actions}
        </div>
        <SubNav />
        <div>{children}</div>
      </div>
    </AdminLayout>
  );
}
