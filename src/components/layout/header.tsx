
'use client';

import Link from 'next/link';
import {
  BedDouble,
  Car,
  KeyRound,
  Landmark,
  Home,
  ClipboardList,
  HelpCircle,
  Menu,
  Building,
  UserCircle,
  LayoutDashboard,
  Heart,
  Award,
  MessageSquare,
  ShieldAlert,
  Search,
  Bell,
  CalendarCheck2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';


const mainNavItems = [
  { href: '/', label: 'Stays', icon: BedDouble },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/car-rent', label: 'Car Rent', icon: KeyRound },
  { href: '/attractions', label: 'Attractions', icon: Landmark },
];

const allMenuItems = [
  ...mainNavItems,
  { href: '/rent-home', label: 'Rent Home', icon: Home },
  { href: '/buy-property', label: 'Buy Land/House', icon: ClipboardList },
  { href: '/list-property', label: 'List your property', icon: Building },
  { href: '/dashboard', label: 'Owner Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: UserCircle },
  { href: '/bookings', label: 'My Bookings', icon: CalendarCheck2 },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/loyalty', label: 'Loyalty Program', icon: Award },
  { href: '/contact-support', label: 'Customer Service', icon: HelpCircle },
];


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSosClick = () => {
    toast({
      title: "SOS Activated (Demo)",
      description: "Emergency services are being contacted. This is a simulation.",
      variant: "destructive",
      duration: 10000,
    });
  };

  const isLinkActive = (itemHref: string) => {
    if (itemHref === '/') return pathname === '/';
    if (itemHref === '/#stays' && pathname === '/') return true;
    return pathname.startsWith(itemHref);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        <div className="flex items-center">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                 <div className="p-6 border-b">
                   <Link href="/" className="text-2xl font-extrabold text-primary">RoamFree</Link>
                </div>
                 <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                   {allMenuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted ${isLinkActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          <Link href="/" className="hidden md:flex text-3xl font-extrabold text-primary mr-6">
            RoamFree
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${isLinkActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.label}
              </Link>
            ))}
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-3 py-2">More</Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                 {allMenuItems.filter(item => !mainNavItems.some(mainItem => mainItem.href === item.href || mainItem.href === item.href.replace('/#','/'))).map((item) => (
                  <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted/80 ${isLinkActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}>
                    <item.icon className="h-5 w-5" /> {item.label}
                  </Link>
                 ))}
              </PopoverContent>
            </Popover>
          </nav>
        </div>
        
        <div className="md:hidden">
            <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
                <ShieldAlert className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
                 <Button variant="outline" size="sm">Register (Demo)</Button>
                 <Button size="sm">Sign In (Demo)</Button>
            </div>
        </div>
      </div>
    </header>
  );
}
