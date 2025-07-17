// src/app/transport/search/layout.tsx
import React from 'react';

// This layout removes the default header and footer for a more app-like experience on the ride search page.
export default function RideSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    // We don't wrap with the standard layout components here
    <main className="h-screen w-screen overflow-hidden">
      {children}
    </main>
  );
}
