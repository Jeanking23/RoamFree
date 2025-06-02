import Link from 'next/link';
import { Plane, Briefcase, UserCircle2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAuthButton from '@/components/auth/user-auth-button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navItems = [
    { href: '#stays', label: 'Stays' },
    { href: '#rides', label: 'Rides' },
    { href: '#cars', label: 'Cars' },
    { href: '#explore', label: 'Explore' },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">RoamFree</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="My Bookings">
            <Briefcase className="h-5 w-5" />
          </Button>
          <UserAuthButton />
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <Plane className="h-7 w-7 text-primary" />
                  <h1 className="text-2xl font-headline font-bold text-primary">RoamFree</h1>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-6 mt-auto flex flex-col gap-4">
                   <Button variant="outline" className="w-full justify-start gap-2">
                     <Briefcase className="h-5 w-5" /> My Bookings
                   </Button>
                  <UserAuthButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
