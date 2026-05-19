'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Apple, ChartColumnDecreasing, Sparkles, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: ChartColumnDecreasing },
    { href: '/food-analysis', label: 'Scan', icon: Apple },
    { href: '/recommendations', label: 'Tips', icon: Sparkles },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed lg:hidden bottom-0 left-0 right-0 border-t border-slate-200 shadow-2xl h-20 z-40 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-t-lg transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconComponent
                size={24}
                color={isActive ? 'rgb(249, 115, 22)' : 'rgb(71, 85, 105)'}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
