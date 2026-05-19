'use client';

import { Apple, ChartColumnDecreasing, File, Sparkles, User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth';
import { AppDispatch, RootState } from '@/store';

const color = "#FF6B4A"
const chart = <ChartColumnDecreasing color={color}/>
const apple = <Apple color={color}/>
const file = <File color={color}/>
const spakles = <Sparkles color={color}/>
const user = <User color={color}/>

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      router.push('/login');
    } else {
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: chart },
    { href: '/food-analysis', label: 'Scan Food', icon: apple },
    { href: '/medical-reports', label: 'Reports', icon: file },
    { href: '/recommendations', label: 'Recommendations', icon: spakles },
    { href: '/profile', label: 'Profile', icon: user },
  ];

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-60 lg:flex lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:shadow-md lg:z-40 lg:transition-all lg:duration-300">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
          N
        </div>
        <h1 className="text-xl font-bold text-slate-900">NutriScan</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-200 space-y-4">
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 p-4 border border-orange-100 shadow-sm">
          <p className="text-sm font-semibold text-orange-900 mb-2">
            💡 Health Tip
          </p>
          <p className="text-xs text-orange-800">
            Check your dietary recommendations daily for personalized guidance.
          </p>
        </div>
        <button
          onClick={handleAuthAction}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-all duration-200 border shadow-sm ${
            isAuthenticated
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-red-600'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-orange-600'
          }`}
        >
          {isAuthenticated ? (
            <>
              <LogOut size={18} />
              Logout
            </>
          ) : (
            <>
              <LogIn size={18} />
              Login
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
