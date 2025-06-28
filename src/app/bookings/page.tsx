// src/app/bookings/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck2, Search, Car, BedDouble, Landmark, Ticket, FileText } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const mockBookings = [
    { id: 'stay123', type: 'Stay', name: 'Sunny Beachfront Villa', date: 'Oct 10-17, 2024', status: 'Upcoming', icon: BedDouble },
    { id: 'car456', type: 'Car Rental', name: 'Toyota Camry', date: 'Sep 05-08, 2024', status: 'Completed', icon: Car },
    { id: 'attr789', type: 'Attraction', name: 'City Museum of Art Ticket', date: 'Sep 01, 2024', status: 'Completed', icon: Landmark },
];

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
            View your upcoming, past, and canceled bookings for stays, transport, and attractions all in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="mt-6">
                    {mockBookings.filter(b => b.status === 'Upcoming').map(booking => (
                        <Card key={booking.id} className="mb-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl"><booking.icon className="h-6 w-6 text-primary"/>{booking.name}</CardTitle>
                                <CardDescription>{booking.type} &bull; {booking.date}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline">Manage Booking (Demo)</Button>
                                <Button variant="ghost">View Details (Demo)</Button>
                            </CardFooter>
                        </Card>
                    ))}
                     {mockBookings.filter(b => b.status === 'Upcoming').length === 0 && (
                        <div className="text-center py-12 bg-muted/30 rounded-md">
                            <p className="font-semibold">No upcoming bookings.</p>
                        </div>
                     )}
                </TabsContent>
                <TabsContent value="past" className="mt-6">
                     {mockBookings.filter(b => b.status === 'Completed').map(booking => (
                        <Card key={booking.id} className="mb-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl"><booking.icon className="h-6 w-6 text-primary"/>{booking.name}</CardTitle>
                                <CardDescription>{booking.type} &bull; {booking.date}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline">Leave a Review (Demo)</Button>
                                <Button variant="ghost">View Receipt (Demo)</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                 <TabsContent value="canceled" className="mt-6">
                     <div className="text-center py-12 bg-muted/30 rounded-md">
                        <p className="font-semibold">You have no canceled bookings.</p>
                    </div>
                </TabsContent>
            </Tabs>

            {mockBookings.length === 0 && (
                <div className="text-center py-12 bg-muted/30 rounded-md mt-6">
                    <CalendarCheck2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-xl font-semibold">You have no bookings yet.</p>
                    <p className="text-muted-foreground mb-4">Your next adventure awaits! Once you book a trip, it will appear here.</p>
                    <Button asChild>
                    <Link href="/"><Search className="mr-2 h-4 w-4" /> Explore RoamFree</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
