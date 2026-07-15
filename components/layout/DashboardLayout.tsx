import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-60 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-full">
          {children}
          <div className="h-20 lg:h-0" />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
