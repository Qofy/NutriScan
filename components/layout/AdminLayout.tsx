import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50" suppressHydrationWarning>
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 shadow-md">
          <p className="text-sm font-semibold">🔐 Administrator Panel</p>
        </div>
        {children}
        <div className="h-20 lg:h-0" />
      </main>
    </div>
  );
}
