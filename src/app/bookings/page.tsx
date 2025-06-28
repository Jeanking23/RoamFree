// src/app/bookings/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck2, Ticket, Car, BedDouble } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockBookings = [
  { id: 'stay1', type: 'Stay', name: 'Sunny Beachfront Villa', date: '2024-08-15 to 2024-08-22', link: '/stays/stay1' },
  { id: 'car1', type: 'Car Rental', name: 'Toyota Camry Hybrid', date: '2024-09-01 to 2024-09-05', link: '/car-rent' },
];

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <CalendarCheck2 className="h-8 w-8" />
            My Bookings
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            View and manage your upcoming and past trips. (This is a placeholder page)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {mockBookings.length > 0 ? (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {booking.type === 'Stay' && <BedDouble className="h-8 w-8 text-primary" />}
                      {booking.type === 'Car Rental' && <Car className="h-8 w-8 text-primary" />}
                      {booking.type === 'Attraction' && <Ticket className="h-8 w-8 text-primary" />}
                      <div>
                        <h4 className="font-semibold">{booking.name}</h4>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={booking.link}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-md">
              <p className="text-xl font-semibold">You have no bookings yet.</p>
              <p className="text-muted-foreground mt-2">Time to plan your next adventure!</p>
              <Button asChild className="mt-4">
                <Link href="/">Start Exploring</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
