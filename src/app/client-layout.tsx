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

  // Ensure these values are stable during hydration by checking hasMounted.
  const isAuthPage = hasMounted && (pathname === '/signin' || pathname === '/signup');
  const isTransportSearch = hasMounted && pathname === '/transport/search';
  const hideNavElements = isAuthPage || isTransportSearch;
  
  const showPartnerHelpBot = hasMounted && (
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/list-property') || 
    pathname?.startsWith('/cars-for-sale/new') || 
    pathname?.startsWith('/for-partners')
  );
    
  const isListProperty = hasMounted && pathname?.startsWith('/list-property');
  
  // Deterministic rendering for the initial hydration pass.
  // Both server and initial client render must match.
  // We gate the conditional layout logic behind hasMounted to ensure this.
  const useContainer = !hideNavElements && !isListProperty;

  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <LocaleProvider>
          <div className="relative flex min-h-screen flex-col">
            {!hideNavElements && hasMounted && <Header />}
            {!hideNavElements && !hasMounted && <div className="h-16 w-full border-b bg-background/95" />}
            
            <main className="flex-1 flex flex-col">
              <div 
                className={cn(
                  "flex-1 flex flex-col",
                  useContainer && "container mx-auto px-4 py-8 pb-24 md:pb-8"
                )}
              >
                {children}
              </div>
            </main>

            {hasMounted && !hideNavElements && (
              <>
                <Footer />
                <BottomNavBar />
              </>
            )}
            {hasMounted && showPartnerHelpBot && <PartnerHelpBot />}
          </div>
          <Toaster />
        </LocaleProvider>
      </GoogleMapsProvider>
    </AuthProvider>
  );
}
