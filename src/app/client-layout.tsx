
'use client';

import { Toaster } from "@/components/ui/toaster";
import { MainHeader as Header } from '@/components/layout/header';
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

  if (!hasMounted) {
    // Return a static, non-interactive version that won't cause hydration errors.
    // This ensures the server-rendered output and the initial client render are identical.
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Static placeholder for the header */}
            <div className="h-16 w-full border-b bg-background/95" />
            <main className="flex-1 flex flex-col">
              {/* Static container that matches the most common layout */}
              <div className="flex-1 flex flex-col container mx-auto px-4 py-8 pb-24 md:pb-8" />
            </main>
        </div>
    );
  }

  // Once mounted, render the full client-side layout with dynamic content
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isTransportSearch = pathname === '/transport/search';
  const hideNavElements = isAuthPage || isTransportSearch;
  
  const showPartnerHelpBot = (
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/list-property') || 
    pathname?.startsWith('/cars-for-sale/new') || 
    pathname?.startsWith('/for-partners')
  );
    
  const isListProperty = pathname?.startsWith('/list-property');
  
  const useContainer = !hideNavElements && !isListProperty;

  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <LocaleProvider>
          <div className="relative flex min-h-screen flex-col">
            {!hideNavElements && <Header />}
            
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

            {!hideNavElements && (
              <>
                <Footer />
                <BottomNavBar />
              </>
            )}
            {showPartnerHelpBot && <PartnerHelpBot />}
          </div>
          <Toaster />
        </LocaleProvider>
      </GoogleMapsProvider>
    </AuthProvider>
  );
}
