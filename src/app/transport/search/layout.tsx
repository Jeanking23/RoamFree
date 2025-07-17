// src/app/transport/search/layout.tsx
import React from 'react';

// This layout removes the default header and footer for a more app-like experience on the ride search page.
export default function RideSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
