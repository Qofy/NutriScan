'use client';

import { useState, useEffect } from 'react';
import { BarChart2, Users, Camera, FileText, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth';
import { AppDispatch, RootState } from '@/store';

export default function AdminSidebar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navItems = [
    { href: '/admin-panel', label: 'Overview', icon: <BarChart2 size={20} /> },
    { href: '/admin-panel/users', label: 'Users', icon: <Users size={20} /> },
    { href: '/admin-panel/scans', label: 'Food Scans', icon: <Camera size={20} /> },
    { href: '/admin-panel/reports', label: 'Medical Reports', icon: <FileText size={20} /> },
  ];

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:flex lg:flex-col lg:border-r lg:border-slate-700 lg:bg-slate-900 lg:shadow-lg lg:z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700">
        <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
          N
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">NutriScan</h1>
          <p className="text-xs text-red-300">Admin Panel</p>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800">
        {isHydrated && user ? (
          <>
            <p className="text-sm text-slate-300">Logged in as</p>
            <p className="text-white font-semibold">{user.username}</p>
            <div className="inline-block mt-2 px-2 py-1 bg-orange-600 text-white text-xs rounded font-medium">
              👤 Admin
            </div>
          </>
        ) : (
          <div className="h-16" />
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-700 space-y-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to App
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
