
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
  Globe,
  Menu,
  Building,
  UserCircle,
  LayoutDashboard,
  Heart,
  Award,
  MessageSquare,
  ShieldAlert, // SOS Icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';


const mainNavItems = [
  { href: '/#stays', label: 'Stays', icon: BedDouble },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/car-rent', label: 'Car Rent', icon: KeyRound },
  { href: '/attractions', label: 'Attractions', icon: Landmark },
  { href: '/rent-home', label: 'Rent Home', icon: Home },
  { href: '/buy-property', label: 'Buy Land/House', icon: ClipboardList },
];

const languages = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Español (ES)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (FR)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (DE)', flag: '🇩🇪' },
];

export default function Header() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
    }
  }, [pathname]); // Re-run if pathname changes, though hash changes might need more specific handling if not tied to path

  useEffect(() => {
    setIsPopoverOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSosClick = () => {
    toast({
      title: "SOS Activated",
      description: "Emergency services are being contacted. (This is a simulation)",
      variant: "destructive",
    });
  };

  const isLinkActive = (itemHref: string) => {
    if (itemHref.startsWith('/#')) {
      // For hash links, check current path and hash
      return pathname === '/' && currentHash === itemHref.substring(1);
    }
    // For regular links, just check pathname
    return pathname === itemHref;
  };


  return (
    <header className="bg-background text-foreground border-b print:hidden">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-primary">
          RoamFree
        </Link>

        {/* Desktop Top Right Items */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
            <ShieldAlert className="h-6 w-6" />
          </Button>
          <span className="text-sm font-medium text-foreground">USD</span>
          
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" aria-label="Select language">
                <Globe className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Language & Region</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language and region.
                  </p>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="language-select" className="font-medium">Language</Label>
                  <div className="mt-2 space-y-1">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={selectedLanguage.code === lang.code ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsPopoverOpen(false);
                          toast({ title: "Language Changed", description: `Language set to ${lang.name}` });
                        }}
                      >
                        <span className="mr-2">{lang.flag}</span> {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                 <div>
                  <Label className="font-medium">Region</Label>
                   <p className="text-sm text-muted-foreground mt-1">Region selection coming soon.</p>
                </div>
                <Separator />
                <div>
                  <Label className="font-medium">Currency</Label>
                  <p className="text-sm text-muted-foreground mt-1">Currently USD. More options coming soon.</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Link href="/contact-support" passHref legacyBehavior>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" aria-label="Help">
              <HelpCircle className="h-6 w-6" />
            </Button>
          </Link>

          <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary px-3 py-1.5 rounded-sm">
            Owner Dashboard
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
        <div className="md:hidden flex items-center gap-2">
           <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
            <ShieldAlert className="h-6 w-6" />
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                   <Link href="/" className="text-2xl font-extrabold text-primary">
                    RoamFree
                  </Link>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${
                        isLinkActive(item.href) ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  <Link href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/profile' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <UserCircle className="h-5 w-5" />
                    My Profile
                  </Link>
                  <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/dashboard' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <LayoutDashboard className="h-5 w-5" />
                    Owner Dashboard
                  </Link>
                  <Link href="/wishlist" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/wishlist' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Link>
                  <Link href="/loyalty" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/loyalty' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <Award className="h-5 w-5" />
                    Loyalty Program
                  </Link>
                   <Separator className="my-2" />
                  <Link href="/list-property" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/list-property' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <Building className="h-5 w-5" />
                    List your property
                  </Link>
                  <Link href="/contact-support" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/contact-support' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <MessageSquare className="h-5 w-5" />
                    Customer Service
                  </Link>
                  <Button variant="ghost" onClick={() => { setIsMobileMenuOpen(false); setIsPopoverOpen(true);}} className="w-full justify-start flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 text-foreground">
                     <Globe className="h-5 w-5" />
                    <span className="text-base font-medium">{selectedLanguage.flag} {selectedLanguage.code.toUpperCase()} / USD</span>
                  </Button>

                  <div className="pt-4 space-y-2 border-t mt-4">
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
                    isLinkActive(item.href)
                      ? 'bg-primary/10 border border-primary text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
           <Separator orientation="vertical" className="h-6 mx-2" />
            <Link href="/profile" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/profile' ? 'bg-primary/10 border border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'}`}>
                <UserCircle className="h-5 w-5" /> Profile
            </Link>
             <Link href="/wishlist" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/wishlist' ? 'bg-primary/10 border border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'}`}>
                <Heart className="h-5 w-5" /> Wishlist
            </Link>
             <Link href="/loyalty" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/loyalty' ? 'bg-primary/10 border border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-primary'}`}>
                <Award className="h-5 w-5" /> Loyalty
            </Link>
        </ul>
      </nav>
    </header>
  );
}

    