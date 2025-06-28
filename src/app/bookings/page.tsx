// src/app/bookings/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck2, Search } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <CalendarCheck2 className="h-10 w-10" />
            My Bookings
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            View your upcoming, past, and canceled bookings for stays, transport, and attractions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="text-center py-12 bg-muted/30 rounded-md">
                <CalendarCheck2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-xl font-semibold">You have no bookings yet.</p>
                <p className="text-muted-foreground mb-4">Your next adventure awaits! Once you book a trip, it will appear here.</p>
                <Button asChild>
                <Link href="/"><Search className="mr-2 h-4 w-4" /> Explore RoamFree</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
