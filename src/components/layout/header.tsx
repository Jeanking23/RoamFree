
'use client';

import Link from 'next/link';
import {
  BedDouble, Car, KeyRound, Landmark, Home, ClipboardList, HelpCircle, Menu, Building,
  UserCircle, LayoutDashboard, Heart, Award, MessageSquare, ShieldAlert, Search, Bell,
  CalendarCheck2, Globe, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Main navigation items for desktop view
const mainNavItems = [
  { href: '/', label: 'Stays', icon: BedDouble },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/car-rent', label: 'Car Rent', icon: KeyRound },
  { href: '/attractions', label: 'Attractions', icon: Landmark },
];

// All menu items for the mobile drawer
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
    return pathname.startsWith(itemHref);
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          
          {/* Left side: Hamburger and Desktop Logo/Nav */}
          <div className="flex items-center gap-2">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
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
            
              <Link href="/" className="hidden md:flex text-3xl font-extrabold text-primary mr-4">
                  RoamFree
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                  {mainNavItems.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" asChild className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isLinkActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Explore {item.label}</p></TooltipContent>
                  </Tooltip>
                  ))}
              </nav>
          </div>
          
          {/* Center (Mobile Only): Logo */}
          <div className="md:hidden">
              <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
          </div>

          {/* Right side: Icons and Auth buttons */}
          <div className="flex items-center gap-1">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-1">
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon"><Globe className="h-5 w-5"/></Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent><p>Language & Currency</p></TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-56 p-2">
                    <p className="p-2 text-sm text-center text-muted-foreground">Language & currency options (Demo)</p>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon"><MapPin className="h-5 w-5"/></Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent><p>Select Location</p></TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-56 p-2">
                    <p className="p-2 text-sm text-center text-muted-foreground">Location selection (Demo)</p>
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}>
                        <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Notifications</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}>
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Messages</p></TooltipContent>
                </Tooltip>
              </div>

              {/* Mobile Search Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" asChild>
                      <Link href="/stays/search"><Search className="h-5 w-5"/></Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Quick Search</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
                        <ShieldAlert className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Emergency SOS</p></TooltipContent>
              </Tooltip>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                   <Button variant="outline" size="sm">Register (Demo)</Button>
                   <Button size="sm">Sign In (Demo)</Button>
              </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
