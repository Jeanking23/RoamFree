import Link from 'next/link';
import {
  BedDouble,
  Car, // For Transport & Car Rentals (now Car Rent)
  Home, // For Rent Home
  KeyRound, // For Car Rent (new icon based on image)
  ClipboardList, // For Buy Land/House
  HelpCircle,
  Globe,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Define navigation items for the lower bar
const mainNavItems = [
  { href: '/#stays', label: 'Stays', icon: BedDouble, active: false },
  { href: '/#transport', label: 'Transport', icon: Car, active: false },
  { href: '/#car-rent', label: 'Car Rent', icon: KeyRound, active: true },
  { href: '/#rent-home', label: 'Rent Home', icon: Home, active: false },
  { href: '/#buy-property', label: 'Buy Land/House', icon: ClipboardList, active: false },
];

export default function Header() {
  return (
    <header className="bg-background text-foreground border-b print:hidden">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-primary">
          RoamFree
        </Link>

        {/* Desktop Top Right Items */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">USD</span>
          <button aria-label="Select language or currency" className="text-foreground">
            <Globe className="h-6 w-6" />
          </button>
          <button aria-label="Help" className="text-foreground">
            <HelpCircle className="h-6 w-6" />
          </button>
          <Link href="/list-property" className="text-sm font-medium text-foreground hover:text-primary px-3 py-1.5 rounded-sm">
            List your property
          </Link>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10 px-3 h-9 rounded-sm text-sm font-medium focus-visible:ring-primary"
          >
            Register
          </Button>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10 px-3 h-9 rounded-sm text-sm font-medium focus-visible:ring-primary"
          >
            Sign in
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                   <Link href="/" className="text-2xl font-extrabold text-primary">
                    RoamFree
                  </Link>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${
                        item.active ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2 border-t mt-4">
                     <Link href="/list-property" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 text-foreground">
                        List your property
                      </Link>
                     <Button
                        variant="outline"
                        className="w-full justify-start text-primary border-primary hover:bg-primary/10 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Register
                      </Button>
                      <Button
                         variant="outline"
                         className="w-full justify-start text-primary border-primary hover:bg-primary/10 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Sign in
                      </Button>
                       <div className="flex items-center gap-3 px-3 py-2.5 text-foreground">
                        <span className="text-base font-medium">USD</span>
                        <Globe className="h-5 w-5 ml-auto" />
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 text-foreground">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${
                    item.active
                      ? 'bg-primary/10 border border-primary text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
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
