
'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-muted/50 py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {currentYear} RoamFree. All rights reserved.</p>
        <p className="text-sm mt-1">Travel with freedom, explore with joy.</p>
      </div>
    </footer>
  );
}
