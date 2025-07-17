// src/app/transport/search/layout.tsx
import { Toaster } from "@/components/ui/toaster";
import BottomNavBar from '@/components/layout/bottom-nav-bar';

// This layout is minimal to allow the search page to be full-screen on mobile.
export default function RideSearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
        {children}
        <Toaster />
        <BottomNavBar />
    </div>
  );
}
