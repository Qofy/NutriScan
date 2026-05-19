import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-stone-50 via-slate-50 to-stone-100">
      <Sidebar />
      <main className="flex-1 lg:ml-60">
        {children}
        <div className="h-20 lg:h-0" />
      </main>
      <BottomNav />
    </div>
  );
}
