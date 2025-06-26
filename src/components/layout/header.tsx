
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
  ShieldAlert,
  Users2,
  Truck,
  CarFront as CarSaleIcon,
  DollarSign, // For currency
  MapPin as RegionPinIcon // For region
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useLocalization, languages, regions, currencies } from '@/contexts/LocalizationContext';


const mainNavItems = [
  { href: '/#stays', label: 'Stays', icon: BedDouble },
  { href: '/transport', label: 'Transport', icon: Car },
  { href: '/courier-delivery', label: 'Courier', icon: Truck },
  { href: '/car-rent', label: 'Car Rent', icon: KeyRound },
  { href: '/cars-for-sale', label: 'Cars for Sale', icon: CarSaleIcon },
  { href: '/attractions', label: 'Attractions', icon: Landmark },
  { href: '/rent-home', label: 'Rent Home', icon: Home },
  { href: '/buy-property', label: 'Buy Land/House', icon: ClipboardList },
];

export default function Header() {
  const {
    selectedLanguage,
    setLanguage: setSelectedLanguage,
    selectedRegion,
    setRegion: setSelectedRegion,
    selectedCurrency,
    setCurrency: setSelectedCurrency,
    isHydrated
  } = useLocalization();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => {
        if (typeof window !== 'undefined') {
            setCurrentHash(window.location.hash);
        }
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  useEffect(() => {
    setIsPopoverOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname, currentHash]);

  const handleSosClick = () => {
    toast({
      title: "SOS Activated (Demo)",
      description: "Emergency services are being contacted. This is a simulation.",
      variant: "destructive",
    });
  };

  const isLinkActive = (itemHref: string) => {
    if (!hasMounted) {
      if (itemHref.startsWith('/#')) {
        return pathname === '/';
      }
      return pathname === itemHref || pathname.startsWith(itemHref + '/');
    }
    if (itemHref.startsWith('/#')) {
      return pathname === '/' && currentHash === itemHref.substring(1);
    }
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  const handleLanguageChange = (lang: typeof languages[0], silent = false) => {
    setSelectedLanguage(lang);
    if (!silent) {
      toast({ title: "Language Changed (Demo)", description: `Language set to ${lang.name}. App content would update.` });
    }
    setIsPopoverOpen(false);
  };

  const handleRegionChange = (region: typeof regions[0], silent = false) => {
    setSelectedRegion(region);
    if (!silent) {
        toast({ title: "Region Changed (Demo)", description: `Region set to ${region.name}. Language and currency settings updated.` });
    }
    setIsPopoverOpen(false);
  };

  const handleCurrencyChange = (currency: typeof currencies[0], silent = false) => {
    setSelectedCurrency(currency);
     if (!silent) {
        toast({ title: "Currency Changed (Demo)", description: `Currency set to ${currency.name} (${currency.symbol}). Prices would update.` });
    }
    setIsPopoverOpen(false);
  };


  return (
    <header className="bg-background text-foreground border-b print:hidden">
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-primary">
          RoamFree
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
            <ShieldAlert className="h-6 w-6" />
          </Button>
         
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-foreground hover:bg-muted px-2 h-9 min-w-[70px]" aria-label="Select language, region or currency">
                {isHydrated ? (
                  <>
                    <span className="mr-1.5 text-lg">{selectedLanguage.flag}</span>
                    <span className="text-sm font-medium mr-1.5">{selectedLanguage.code.toUpperCase()}</span>
                    <Globe className="h-5 w-5 mr-1.5" />
                    <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
                  </>
                ) : (
                  <Globe className="h-5 w-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50" sideOffset={10}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Language, Region & Currency</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience.
                  </p>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="language-select" className="font-medium mb-1.5 block">Language</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={selectedLanguage.code === lang.code ? "secondary" : "ghost"}
                        className="w-full justify-start h-8 text-sm"
                        onClick={() => handleLanguageChange(lang)}
                      >
                        <span className="mr-2 text-base">{lang.flag}</span> {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                 <div>
                  <Label htmlFor="region-select" className="font-medium mb-1.5 block">Region/Country</Label>
                   <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {regions.map((region) => (
                      <Button
                        key={region.code}
                        variant={selectedRegion.code === region.code ? "secondary" : "ghost"}
                        className="w-full justify-start h-8 text-sm"
                        onClick={() => handleRegionChange(region)}
                      >
                        <span className="mr-2 text-base">{region.flag}</span> {region.name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Changing region may update language & currency.</p>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="currency-select" className="font-medium mb-1.5 block">Currency</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                    {currencies.map((curr) => (
                      <Button
                        key={curr.code}
                        variant={selectedCurrency.code === curr.code ? "secondary" : "ghost"}
                        className="w-full justify-start h-8 text-sm"
                        onClick={() => handleCurrencyChange(curr)}
                      >
                        <span className="font-semibold mr-2 w-6 text-center">{curr.symbol}</span> {curr.name} ({curr.code})
                      </Button>
                    ))}
                  </div>
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
           <Link href="/community-forum-demo" className="text-sm font-medium text-foreground hover:text-primary px-3 py-1.5 rounded-sm flex items-center gap-1">
            <Users2 className="h-4 w-4"/> Forum
          </Link>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10 px-3 h-9 rounded-sm text-sm font-medium focus-visible:ring-primary"
          >
            Register (Demo)
          </Button>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10 px-3 h-9 rounded-sm text-sm font-medium focus-visible:ring-primary"
          >
            Sign in (Demo)
          </Button>
        </div>

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
                   <Link href="/community-forum-demo" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/community-forum-demo' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <Users2 className="h-5 w-5" />
                    Community Forum
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
                      {isHydrated ? (
                        <span className="text-base font-medium">{selectedLanguage.flag} {selectedLanguage.code.toUpperCase()} / {selectedCurrency.symbol}</span>
                      ) : (
                        <span className="text-base font-medium">Language & Currency</span>
                      )}
                  </Button>

                  <div className="pt-4 space-y-2 border-t mt-4">
                     <Button
                        variant="outline"
                        className="w-full justify-start text-primary border-primary hover:bg-primary/10 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Register (Demo)
                      </Button>
                      <Button
                         variant="outline"
                         className="w-full justify-start text-primary border-primary hover:bg-primary/10 px-3 h-10 rounded-sm text-base font-medium"
                      >
                        Sign in (Demo)
                      </Button>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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
            <Link href="/profile" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/profile' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                <UserCircle className="h-5 w-5" /> Profile
            </Link>
             <Link href="/wishlist" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/wishlist' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground hover:bg-muted/50 hover:text-primary'}`}>
                <Heart className="h-5 w-5" /> Wishlist
            </Link>
             <Link href="/loyalty" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${pathname === '/loyalty' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground hover:bg-muted/50 hover:text-primary'}`}>
                <Award className="h-5 w-5" /> Loyalty
            </Link>
        </ul>
      </nav>
    </header>
  );
}
