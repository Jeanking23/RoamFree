// src/app/transport/search/layout.tsx
import { Toaster } from "@/components/ui/toaster";
import { GoogleMapsProvider } from '@/context/google-maps-provider';
import { LocaleProvider } from '@/context/locale-provider';

// This is a special layout for the ride search page to provide a full-screen map experience.
// It intentionally does not include the standard Header, Footer, or BottomNavBar.
export default function RideSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleMapsProvider>
      <LocaleProvider>
        <div className="min-h-screen h-screen bg-background">
          <main className="h-full">{children}</main>
        </div>
        <Toaster />
      </LocaleProvider>
    </GoogleMapsProvider>
  );
}
