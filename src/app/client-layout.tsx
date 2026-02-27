
'use client';

import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BottomNavBar from '@/components/layout/bottom-nav-bar';
import { LocaleProvider } from '@/context/locale-provider';
import { GoogleMapsProvider } from '@/context/google-maps-provider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-provider';
import PartnerHelpBot from '@/components/layout/partner-help-bot';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const hideNavElements = pathname === '/transport/search' || pathname === '/signin' || pathname === '/signup';
  
  const showPartnerHelpBot = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/list-property') || 
    pathname.startsWith('/cars-for-sale/new') || 
    pathname.startsWith('/for-partners');
    
  const useContainer = !hideNavElements && !pathname.startsWith('/list-property');

  // The structured structure is returned immediately to allow SSR to match the client's first pass.
  // Dynamic features like the partner bot or specific nav states are handled deterministically.
  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <LocaleProvider>
          <div className="relative flex min-h-screen flex-col">
            {!hideNavElements && <Header />}
            <main className="flex-1 flex flex-col">
              <div className={cn(
                "flex-1 flex flex-col",
                useContainer && "container mx-auto px-4 py-8 pb-24 md:pb-8"
              )}>
                {children}
              </div>
            </main>
            {!hideNavElements && <Footer />}
            {!hideNavElements && <BottomNavBar />}
            {hasMounted && showPartnerHelpBot && <PartnerHelpBot />}
          </div>
          <Toaster />
        </LocaleProvider>
      </GoogleMapsProvider>
    </AuthProvider>
  );
}
