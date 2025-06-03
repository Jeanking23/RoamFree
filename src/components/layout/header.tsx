import Link from 'next/link';
import { 
  Plane, 
  Briefcase, 
  UserCircle2, 
  Menu,
  BedDouble,
  Car,
  CarFront,
  TramFront,
  Home,
  LandPlot,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAuthButton from '@/components/auth/user-auth-button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navItems = [
    { href: '#stays', label: 'Stays', icon: BedDouble },
    { href: '#rides', label: 'Rides', icon: Car },
    { href: '#car-rent', label: 'Car Rent', icon: CarFront },
    { href: '#transport', label: 'Transport', icon: TramFront },
    { href: '#rent-home', label: 'Rent Home', icon: Home },
    { href: '#buy-property', label: 'Buy Land/House', icon: LandPlot },
    { href: '#explore', label: 'Explore', icon: Compass },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">RoamFree</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 text-sm lg:text-base"
            >
              <item.icon className="h-5 w-5" />
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
                    className="text-lg text-foreground hover:text-primary transition-colors font-medium flex items-center gap-3"
                  >
                    <item.icon className="h-5 w-5" />
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
