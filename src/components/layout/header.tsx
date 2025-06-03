
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
  Building, // Added for mobile "List your property"
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';


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
  const pathname = usePathname();

  // Close popover on route change
  useEffect(() => {
    setIsPopoverOpen(false);
  }, [pathname]);


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
                <nav className="flex-grow p-4 space-y-1">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 ${
                        pathname === item.href ? 'bg-primary/10 border border-primary text-primary' : 'text-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  <Link href="/list-property" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 text-foreground">
                    <Building className="h-5 w-5" />
                    List your property
                  </Link>
                  <Link href="/contact-support" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium hover:bg-muted/80 text-foreground">
                    <HelpCircle className="h-5 w-5" />
                    Customer Service
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-foreground">
                    <Globe className="h-5 w-5" />
                    <span className="text-base font-medium">{selectedLanguage.flag} {selectedLanguage.code.toUpperCase()} / USD</span>
                  </div>

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
                    pathname === item.href
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
