
'use client';

import Link from 'next/link';
import {
  BedDouble, Car, KeyRound, Landmark, Home, ClipboardList, HelpCircle, Building,
  UserCircle, LayoutDashboard, Heart, Award, MessageSquare, ShieldAlert, Search, Bell,
  CalendarCheck2, Globe, MapPin, LogOut, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Main navigation items for desktop view
const mainNavItems = [
  { href: '/', label: 'Stays', icon: BedDouble },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/car-rent', label: 'Car Rent', icon: KeyRound },
  { href: '/attractions', label: 'Attractions', icon: Landmark },
  { href: '/rent-home', label: 'Rent Home', icon: Home },
  { href: '/buy-property', label: 'Buy Property', icon: ClipboardList },
];

export default function Header() {
  const pathname = usePathname();

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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
              <nav className="flex items-center gap-1">
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

            {/* Right: Icons & Profile */}
            <div className="flex items-center gap-1">
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild><Button variant="ghost" size="icon"><Globe className="h-5 w-5"/></Button></PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent><p>Language & Currency</p></TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 p-2"><p className="p-2 text-sm text-center text-muted-foreground">Language & currency options (Demo)</p></PopoverContent>
              </Popover>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild><Button variant="ghost" size="icon"><MapPin className="h-5 w-5"/></Button></PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent><p>Select Location</p></TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 p-2"><p className="p-2 text-sm text-center text-muted-foreground">Location selection (Demo)</p></PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Notifications</p></TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent><p>My Account</p></TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User (Demo)</p>
                      <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem asChild><Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/wishlist"><Heart className="mr-2 h-4 w-4" />Wishlist</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/bookings"><CalendarCheck2 className="mr-2 h-4 w-4" />Bookings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast({title: "Logged out (Demo)"})}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Emergency SOS</p></TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-1 items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold text-primary">RoamFree</Link>
            
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild><Link href="/stays/search"><Search className="h-5 w-5"/></Link></Button>
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                         <nav className="flex flex-col gap-4 mt-8">
                            {mainNavItems.map((item) => (
                              <Link key={item.label} href={item.href} className={`flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted ${isLinkActive(item.href) ? 'bg-muted font-semibold' : ''}`}>
                                 <item.icon className="h-5 w-5 text-primary" />
                                 <span className="text-lg">{item.label}</span>
                              </Link>
                            ))}
                             <hr className="my-4"/>
                              <Link href="/profile" className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted">
                                 <UserCircle className="h-5 w-5 text-primary" />
                                 <span className="text-lg">My Account</span>
                              </Link>
                              <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted">
                                 <LayoutDashboard className="h-5 w-5 text-primary" />
                                 <span className="text-lg">Dashboard</span>
                              </Link>
                              <Button variant="destructive" className="mt-4" onClick={handleSosClick}>
                                <ShieldAlert className="mr-2 h-4 w-4"/> Emergency SOS
                              </Button>
                         </nav>
                    </SheetContent>
                </Sheet>
            </div>
          </div>

        </div>
      </header>
    </TooltipProvider>
  );
}
