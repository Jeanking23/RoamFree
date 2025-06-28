'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, CalendarCheck2, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/stays/search', label: 'Search', icon: Search },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border z-40 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/stays/search' && (pathname === '/' || pathname.startsWith('/stays')));
        return (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a className="flex flex-col items-center justify-center text-center w-full h-full p-1">
              <item.icon
                className={cn(
                  'h-6 w-6 mb-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs transition-colors',
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
