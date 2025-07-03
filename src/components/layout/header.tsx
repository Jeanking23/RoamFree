
'use client';

import Link from 'next/link';
import {
  BedDouble, Car, KeyRound, Landmark, Home, ClipboardList, HelpCircle, Building,
  UserCircle, LayoutDashboard, Heart, Award, MessageSquare, ShieldAlert, Search, Bell,
  CalendarCheck2, Globe, MapPin, LogOut, Menu, Users, Phone, CarFront, Bus, Truck, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useState, useCallback } from 'react';
import { languages, currencies, type Language, type Currency } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/context/locale-provider';


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

const navTranslations: Record<string, Record<string, string>> = {
  'Stays': { 'en-US': 'Stays', 'es-ES': 'Estancias', 'fr-FR': 'Séjours' },
  'Transport': { 'en-US': 'Transport', 'es-ES': 'Transporte', 'fr-FR': 'Transport' },
  'Car Rent': { 'en-US': 'Car Rent', 'es-ES': 'Alquiler de Coches', 'fr-FR': 'Location Voiture' },
  'Attractions': { 'en-US': 'Attractions', 'es-ES': 'Atracciones', 'fr-FR': 'Attractions' },
  'Rent Home': { 'en-US': 'Rent Home', 'es-ES': 'Alquilar Casa', 'fr-FR': 'Louer Maison' },
  'Buy Property': { 'en-US': 'Buy Property', 'es-ES': 'Comprar Propiedad', 'fr-FR': 'Acheter Propriété' },
  'Buy Car': { 'en-US': 'Buy Car', 'es-ES': 'Comprar Coche', 'fr-FR': 'Acheter Voiture' },
};

const sosTranslations = {
  sosTitle: {
    'en-US': 'SOS Activated (Demo)',
    'es-ES': 'SOS Activado (Demo)',
    'fr-FR': 'SOS Activé (Démo)',
  },
  sosDescription: {
    'en-US': 'Emergency services are being contacted. This is a simulation.',
    'es-ES': 'Se está contactando a los servicios de emergencia. Esto es una simulación.',
    'fr-FR': "Les services d'urgence sont en cours de contact. Ceci est une simulation.",
  }
};


function LanguageCurrencySelector({ isMobile = false }) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, currency, setCurrency } = useLocale();

  const handleLangSelect = useCallback((lang: Language) => {
    setLanguage(lang);
    toast({ title: "Language Updated", description: `Language set to ${lang.name}.` });
  }, [setLanguage]);

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setCurrency(currency);
    toast({ title: "Currency Updated", description: `Currency set to ${currency.name} (${currency.code}).` });
  }, [setCurrency]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground group-hover:text-foreground/90">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select Language & Currency</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="p-2">
            <h4 className="font-medium text-sm text-foreground">Language & Currency</h4>
            <p className="text-xs text-muted-foreground">Choose your preferred language and currency.</p>
        </div>
        <Tabs defaultValue="language">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
          </TabsList>
          <TabsContent value="language">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang) => (
                    <CommandItem
                      key={lang.code}
                      value={lang.name}
                      onSelect={() => {
                        handleLangSelect(lang);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", language.code === lang.code ? "opacity-100" : "opacity-0")} />
                      {lang.nativeName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>
          <TabsContent value="currency">
            <Command>
              <CommandInput placeholder="Search currency..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {currencies.map((curr) => (
                    <CommandItem
                      key={curr.code}
                      value={curr.name}
                      onSelect={() => {
                        handleCurrencySelect(curr);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", currency.code === curr.code ? "opacity-100" : "opacity-0")} />
                      <span className="font-mono text-xs w-10">{curr.code}</span>
                      <span>{curr.name} ({curr.symbol})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}


export default function Header() {
  const pathname = usePathname();
  const { language } = useLocale();

  const t = (key: keyof typeof sosTranslations) => {
    return sosTranslations[key][language.code as keyof typeof sosTranslations[keyof typeof sosTranslations]] || sosTranslations[key]['en-US'];
  };

  const handleSosClick = () => {
    toast({
      title: t('sosTitle'),
      description: t('sosDescription'),
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
    <header className="group sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors hover:bg-[rgba(211,211,211,0.1)]">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-6">
                 <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
                <nav className="flex items-center gap-1">
                {mainNavItems.map((item) => {
                    const translatedLabel = navTranslations[item.label]?.[language.code] || item.label;
                    return (
                    <Button key={item.label} variant="ghost" asChild className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${isLinkActive(item.href) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/90'}`}>
                        <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {translatedLabel}
                        </Link>
                    </Button>
                    )
                })}
                </nav>
            </div>
        </div>
        <div className="hidden md:flex flex-none items-center justify-end gap-1">
            <LanguageCurrencySelector />
            
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground group-hover:text-foreground/90" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground group-hover:text-foreground/90" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar"/>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
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

            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-1 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left">
                  <Link href="/" className="text-3xl font-extrabold text-primary mb-8 block">RoamFree</Link>
                  <nav className="flex flex-col gap-4">
                    {mainNavItems.map((item) => {
                      const translatedLabel = navTranslations[item.label]?.[language.code] || item.label;
                      return (
                        <Link key={item.label} href={item.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted ${isLinkActive(item.href) ? 'bg-muted font-semibold' : ''}`}>
                            <item.icon className="h-5 w-5 text-primary" />
                            <span className="text-lg">{translatedLabel}</span>
                        </Link>
                      )
                    })}
                    <Separator className="my-2" />
                      <Link href="/bus-transportation" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Bus className="h-5 w-5 text-primary" /><span className="text-lg">Bus Tickets</span></Link>
                      <Link href="/courier-delivery" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Truck className="h-5 w-5 text-primary" /><span className="text-lg">Courier</span></Link>
                    <Separator className="my-2"/>
                      <div className="px-0">
                          <Button variant="ghost" className='w-full justify-start flex items-center gap-2 p-2 h-auto text-base' onClick={() => {
                              const popoverTrigger = document.querySelector('#desktop-lang-currency-selector');
                              if(popoverTrigger) (popoverTrigger as HTMLElement).click();
                           }}>
                            <Globe className="h-5 w-5 text-primary" />Language & Currency
                          </Button>
                      </div>
                    <Separator className="my-2"/>
                      <Link href="/community-forum-demo" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Users className="h-5 w-5 text-primary" /><span className="text-lg">Forum</span></Link>
                      <Link href="/contact-support" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Phone className="h-5 w-5 text-primary" /><span className="text-lg">Contact</span></Link>
                      <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><UserCircle className="h-5 w-5 text-primary" /><span className="text-lg">My Account</span></Link>
                  </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="text-2xl font-extrabold text-primary">RoamFree</Link>
          
          <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button>
              <Button variant="ghost" size="icon" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
          </div>
        </div>
         <div id="desktop-lang-currency-selector" className="hidden">
            <LanguageCurrencySelector />
        </div>
      </div>
    </header>
  );
}
