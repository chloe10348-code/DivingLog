import NavBar from '@/components/shared/nav-bar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
