// src/app/transport/search/layout.tsx
import React from 'react';

// This layout removes the default header and footer for a more app-like experience on the ride search page.
export default function RideSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    // We don't wrap with the standard layout components here
    // The main div is removed from here and handled in page.tsx to allow for full-screen map on mobile
    <>
      {children}
    </>
  );
}
