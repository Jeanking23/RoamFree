
'use client';

import Link from 'next/link';
import {
  BedDouble, Car, KeyRound, Landmark, Home, ClipboardList, HelpCircle, Building,
  UserCircle, LayoutDashboard, Heart, Award, MessageSquare, ShieldAlert, Search, Bell,
  CalendarCheck2, Globe, MapPin, LogOut, Menu, Users, Phone, CarFront, Bus, Truck, Check, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useLocale } from '@/context/locale-provider';
import { useAuth } from '@/context/auth-provider';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import LanguageCurrencySelector from './language-currency-selector';


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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLocale();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    router.push('/');
  };

  const t = (key: keyof typeof sosTranslations) => {
    const langCode = language.code as keyof typeof sosTranslations[keyof typeof sosTranslations];
    return sosTranslations[key][langCode] || sosTranslations[key]['en-US'];
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
    return pathname.startsWith(itemHref);
  };

  const renderUserActions = () => {
    if (loading) {
      return null;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1633957897986-70e83293f3ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBhdmF0YXJ8ZW58MHx8fHwxNzUzODk0OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="User Avatar" data-ai-hint="person avatar"/>
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Logged In</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Partner Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/bookings"><CalendarCheck2 className="mr-2 h-4 w-4" />Bookings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/community-forum-demo"><Users className="mr-2 h-4 w-4" />Community Forum</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/contact-support"><Phone className="mr-2 h-4 w-4" />Contact Support</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button asChild variant="outline" size="sm"><Link href="/signin">Sign In</Link></Button>
        <Button asChild size="sm"><Link href="/signup">Register</Link></Button>
      </>
    );
  };

  return (
    <header className="group sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-6">
                 <Link href="/" className="text-3xl font-extrabold text-primary">RoamFree</Link>
                <nav className="flex items-center gap-1">
                {mainNavItems.map((item) => {
                    const translatedLabel = navTranslations[item.label]?.[language.code] || item.label;
                    return (
                    <Button
                      key={item.label}
                      asChild
                      variant="ghost"
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                        isLinkActive(item.href)
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
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
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button>
            {renderUserActions()}
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-9 w-9" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-1 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                  <div className="p-6">
                    <Link href="/" className="text-3xl font-extrabold text-primary mb-8 block">RoamFree</Link>
                  </div>
                  <ScrollArea className="flex-1">
                    <nav className="flex flex-col gap-4 px-6">
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
                            <LanguageCurrencySelector isMobile={true} />
                        </div>
                      <Separator className="my-2"/>
                        <Link href="/community-forum-demo" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Users className="h-5 w-5 text-primary" /><span className="text-lg">Forum</span></Link>
                        <Link href="/contact-support" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><Phone className="h-5 w-5 text-primary" /><span className="text-lg">Contact</span></Link>
                        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"><UserCircle className="h-5 w-5 text-primary" /><span className="text-lg">My Account</span></Link>
                    </nav>
                  </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="text-2xl font-extrabold text-primary">RoamFree</Link>
          
          <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => toast({title: "Notifications (Demo)", description:"No new notifications."})}><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => toast({title: "Messages (Demo)", description:"No new messages."})}><MessageSquare className="h-5 w-5"/></Button>
              {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1724435811349-32d27f4d5806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwZXJzb24lMjBhdmF0YXJ8ZW58MHx8fHwxNzUzODk0OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="User Avatar" data-ai-hint="person avatar"/>
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="icon"><Link href="/signin">
                  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgb(216, 138, 255)', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: 'rgb(85, 85, 255)', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#grad1)" />
                    <circle cx="50" cy="38" r="15" stroke="white" strokeWidth="4" fill="none"/>
                    <path d="M 20 85 A 30 30 0 0 1 80 85" stroke="white" strokeWidth="4" fill="none" />
                  </svg>
                </Link></Button>
              )}
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" aria-label="SOS Emergency" onClick={handleSosClick}><ShieldAlert className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </header>
  );
}
