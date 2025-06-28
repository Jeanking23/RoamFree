// src/components/layout/bottom-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, CalendarCheck2, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Search', icon: Search },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/') || (pathname !== '/' && item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}>
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
