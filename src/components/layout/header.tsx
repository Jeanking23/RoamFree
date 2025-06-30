
'use client';

import Link from 'next/link';
import {
  BedDouble, Car, KeyRound, Landmark, Home, ClipboardList, HelpCircle, Building,
  UserCircle, LayoutDashboard, Heart, Award, MessageSquare, ShieldAlert, Search, Bell,
  CalendarCheck2, Globe, MapPin, LogOut, Menu, Users, Phone, CarFront, Bus, Truck
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
  { href: '/cars-for-sale', label: 'Buy Car', icon: CarFront },
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
    // For other routes, check if the pathname starts with the href
    // This makes parent routes active for their sub-routes (e.g., /stays is active for /stays/123)
    return pathname.startsWith(itemHref);
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1 items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
            </div>
            
            {/* Center: Nav */}
            <nav className="flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" asChild className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isLinkActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`}>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Explore {item.label}</p></TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Right: Icons & Profile */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button></TooltipTrigger>
                <TooltipContent><p>Notifications</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button></TooltipTrigger>
                <TooltipContent><p>Messages</p></TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar"/>
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
                  <DropdownMenuItem asChild><Link href="/bookings"><CalendarCheck2 className="mr-2 h-4 w-4" />Bookings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/community-forum-demo"><Users className="mr-2 h-4 w-4" />Community Forum</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/contact-support"><Phone className="mr-2 h-4 w-4" />Contact Support</Link></DropdownMenuItem>
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
            <Sheet>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                  </SheetTrigger>
                </TooltipTrigger>
                 <TooltipContent><p>Main Menu</p></TooltipContent>
              </Tooltip>
              <SheetContent side="left">
                    <Link href="/" className="text-3xl font-extrabold text-primary mb-8 block">RoamFree</Link>
                    <nav className="flex flex-col gap-4">
                      {mainNavItems.map((item) => (
                        <Link key={item.label} href={item.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted ${isLinkActive(item.href) ? 'bg-muted font-semibold' : ''}`}>
                            <item.icon className="h-5 w-5 text-primary" />
                            <span className="text-lg">{item.label}</span>
                        </Link>
                      ))}
                      <Separator className="my-2" />
                        <Link href="/bus-transportation" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Bus className="h-5 w-5 text-primary" /><span className="text-lg">Bus Tickets</span></Link>
                        <Link href="/courier-delivery" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Truck className="h-5 w-5 text-primary" /><span className="text-lg">Courier</span></Link>
                      <hr className="my-4"/>
                        <Link href="/community-forum-demo" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Users className="h-5 w-5 text-primary" /><span className="text-lg">Forum</span></Link>
                        <Link href="/contact-support" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Phone className="h-5 w-5 text-primary" /><span className="text-lg">Contact</span></Link>
                        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><UserCircle className="h-5 w-5 text-primary" /><span className="text-lg">My Account</span></Link>
                    </nav>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="text-2xl font-extrabold text-primary">RoamFree</Link>
            
            <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Messages</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Notifications</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Emergency SOS</p></TooltipContent>
                </Tooltip>
            </div>
          </div>

        </div>
      </header>
    </TooltipProvider>
  );
}
