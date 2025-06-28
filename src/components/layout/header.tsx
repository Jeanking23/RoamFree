
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
  DollarSign,
  MapPin as RegionPinIcon,
  Search,
  Bell
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
  
  useEffect(() => {
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
      duration: 10000,
    });
  };

  const isLinkActive = (itemHref: string) => {
    if (!isHydrated) return false;
    
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground border-b print:hidden">
      <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-1 w-full">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background text-foreground w-[300px] p-0">
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
                  <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${pathname === '/dashboard' ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'}`}>
                    <LayoutDashboard className="h-5 w-5" />
                    Owner Dashboard
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
                </nav>
                 <div className="p-4 border-t space-y-2">
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
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-2xl font-extrabold text-primary mx-auto">
            RoamFree
          </Link>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" aria-label="Notifications" onClick={() => toast({title: "Notifications (Demo)", description: "You have no new notifications."})}>
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}>
              <ShieldAlert className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                 <Link href="/" className="text-3xl font-extrabold text-primary">
                    RoamFree
                </Link>
                <nav>
                    <ul className="flex items-center gap-1 h-full">
                    {mainNavItems.slice(0, 4).map((item) => ( // Show first 4 items
                        <li key={item.label}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                            ${
                                isLinkActive(item.href)
                                ? 'bg-primary/10 text-primary'
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
            </div>
          
            <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={100}>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Select language, region, or currency</p>
                    </TooltipContent>
                </Tooltip>
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

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" aria-label="Notifications" onClick={() => toast({title: "Notifications (Demo)", description: "You have no new notifications."})}>
                        <Bell className="h-6 w-6" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Notifications</p>
                </TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted" aria-label="Messages" onClick={() => toast({title: "Messages (Demo)", description: "You have no new messages."})}>
                        <MessageSquare className="h-6 w-6" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Messages</p>
                </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary px-3 py-1.5 rounded-sm">
                            Owner Dashboard
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent><p>Manage your listings</p></TooltipContent>
                </Tooltip>
            
                <Separator orientation="vertical" className="h-6"/>

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
            </TooltipProvider>
            </div>
        </div>
      </div>
    </header>
  );
}
