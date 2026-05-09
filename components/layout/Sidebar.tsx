'use client';

import { Apple, ChartColumnDecreasing, File, Sparkles, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth';
import { AppDispatch } from '@/store';

const color = "green"
const chart = <ChartColumnDecreasing color={color}/>
const apple = <Apple color={color}/>
const file = <File color={color}/>
const spakles = <Sparkles color={color}/>
const user = <User color={color}/>

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: chart },
    { href: '/food-analysis', label: 'Scan Food', icon: apple },
    { href: '/medical-reports', label: 'Reports', icon: file },
    { href: '/recommendations', label: 'Recommendations', icon: spakles },
    { href: '/profile', label: 'Profile', icon: user },
  ];

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-60 lg:flex lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:shadow-sm lg:z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
          N
        </div>
        <h1 className="text-xl font-bold text-gray-900">NutriScan</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-gray-200 space-y-4">
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900 mb-2">
            🎯 Health Tip
          </p>
          <p className="text-xs text-emerald-800">
            Check your dietary recommendations daily for personalized guidance.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-colors border border-red-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
