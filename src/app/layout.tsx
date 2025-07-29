
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BottomNavBar from '@/components/layout/bottom-nav-bar';
import { LocaleProvider } from '@/context/locale-provider';
import { GoogleMapsProvider } from '@/context/google-maps-provider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavElements = pathname === '/transport/search' || pathname === '/signin' || pathname === '/signup';

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>RoamFree</title>
        <meta name="description" content="Your ultimate travel companion for accommodation, transport, and exploration." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <GoogleMapsProvider>
            <LocaleProvider>
              <div className="relative flex min-h-screen flex-col">
                {!hideNavElements && <Header />}
                <main className={cn("flex-1", !hideNavElements && "container mx-auto px-4 py-8 pb-24 md:pb-8")}>
                  {children}
                </main>
                {!hideNavElements && <Footer />}
                {!hideNavElements && <BottomNavBar />}
              </div>
              <Toaster />
            </LocaleProvider>
          </GoogleMapsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
