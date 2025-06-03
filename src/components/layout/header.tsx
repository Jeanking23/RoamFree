import Link from 'next/link';
import {
  BedDouble,
  Plane,
  Car,
  Landmark, // Changed from Compass for "Attractions"
  CarFront, // For "Airport taxis"
  HelpCircle,
  Globe,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Define navigation items for the lower bar
const mainNavItems = [
  { href: '/#stays', label: 'Stays', icon: BedDouble, active: true },
  { href: '/#flights', label: 'Flights', icon: Plane, active: false },
  { href: '/#car-rentals', label: 'Car rentals', icon: Car, active: false },
  { href: '/#attractions', label: 'Attractions', icon: Landmark, active: false },
  { href: '/#airport-taxis', label: 'Airport taxis', icon: CarFront, active: false },
];

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground print:hidden">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-white">
          Booking.com
        </Link>

        {/* Desktop Top Right Items */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-medium text-white">USD</span>
          <button aria-label="Select language or currency" className="text-white">
            <Globe className="h-6 w-6" />
          </button>
          <button aria-label="Help" className="text-white">
            <HelpCircle className="h-6 w-6" />
          </button>
          <Link href="/list-property" className="text-sm font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-sm">
            List your property
          </Link>
          <Button
            variant="ghost"
            className="bg-white text-primary hover:bg-slate-100 px-3 h-9 rounded-sm text-sm font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Register
          </Button>
          <Button
            variant="ghost"
            className="bg-white text-primary hover:bg-slate-100 px-3 h-9 rounded-sm text-sm font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Sign in
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/20">
                   <Link href="/" className="text-2xl font-extrabold text-white">
                    Booking.com
                  </Link>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-white/20 ${
                        item.active ? 'bg-white/15 border border-white/30' : 'text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2">
                     <Link href="/list-property" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-white/20 text-white">
                        List your property
                      </Link>
                     <Button
                        variant="ghost"
                        className="w-full justify-start bg-white text-primary hover:bg-slate-100 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Register
                      </Button>
                      <Button
                         variant="ghost"
                         className="w-full justify-start bg-white text-primary hover:bg-slate-100 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Sign in
                      </Button>
                       <div className="flex items-center gap-3 px-3 py-2.5 text-white">
                        <span className="text-base font-medium">USD</span>
                        <Globe className="h-5 w-5 ml-auto" />
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 text-white">
                         <HelpCircle className="h-5 w-5" />
                         <span className="text-base font-medium">Help</span>
                      </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden md:block container mx-auto px-4 h-[52px]">
        <ul className="flex items-center gap-1 h-full">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    item.active
                      ? 'bg-white/15 hover:bg-white/25 border border-white text-white'
                      : 'text-white hover:bg-white/10'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
