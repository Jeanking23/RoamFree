// src/app/flights/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane } from 'lucide-react';

export default function FlightsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Search Flights
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This is a placeholder page for flight searches.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md mt-8">
            <p className="text-xl font-semibold">Flight search functionality coming soon!</p>
            <p className="text-muted-foreground mt-2">You will be able to search and book flights from major airlines here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
