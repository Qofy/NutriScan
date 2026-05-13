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
    <nav className="fixed lg:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg h-20 z-40">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-t-lg transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent
                size={24}
                color={isActive ? 'rgb(34, 197, 94)' : 'rgb(75, 85, 99)'}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
