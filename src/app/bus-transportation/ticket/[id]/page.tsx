
// src/app/bus-transportation/ticket/[id]/page.tsx
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketIcon, User, MapPin, Clock, BusIcon, QrCode, Download, Share2, ArrowLeft, Save, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Mock data, in a real app this would be fetched from a DB using the ID
const mockTicketData = {
    routeId: "route001",
    operator: "ComfortLines Express",
    departureStation: "Central Bus Terminal, Douala",
    arrivalStation: "Main Station, Yaoundé",
    departureTime: "08:00 AM",
    arrivalTime: "02:00 PM",
    date: "2024-08-15",
    passengers: [{ name: "Alex Johnson", seat: "5A" }],
    busType: "Luxury AC Coach",
    isRoundTrip: true, // Flag to indicate a round trip
    returnTrip: {
        routeId: "route002",
        operator: "Speedy Ways",
        departureStation: "Main Station, Yaoundé",
        arrivalStation: "Central Bus Terminal, Douala",
        departureTime: "10:30 PM",
        arrivalTime: "05:30 AM",
        date: "2024-08-22",
        passengers: [{ name: "Alex Johnson", seat: "3B" }],
        busType: "Standard AC Sleeper",
    }
};

export default function BusTicketPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const bookingId = params.id as string;
    const routeId = searchParams.get('routeId');

    // Here you would fetch ticket details using bookingId and routeId
    const ticket = mockTicketData;

    const formattedDate = hasMounted ? format(new Date(ticket.date), 'PPP') : '';
    const formattedReturnDate = hasMounted && ticket.isRoundTrip && ticket.returnTrip ? format(new Date(ticket.returnTrip.date), 'PPP') : '';


    const handleDownload = () => {
        toast({ title: "Downloading Ticket", description: "Your ticket is being downloaded as a PDF." });
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Your Bus Ticket: ${bookingId}`,
                text: `Here is your bus ticket for the trip from ${ticket.departureStation} to ${ticket.arrivalStation}. Booking ID: ${bookingId}`,
                url: window.location.href,
            }).then(() => toast({ title: "Shared successfully!"}))
              .catch(error => console.error('Error sharing:', error));
        } else {
            toast({ title: "Sharing Ticket", description: "Sharing options for your ticket will appear here (e.g., Email, SMS)." });
        }
    }
    
    const handleSaveToBookings = () => {
        // In a real app, this would make an API call to save the ticket to the user's profile.
        toast({
            title: "Ticket Saved!",
            description: "This ticket has been saved to your 'My Bookings' page.",
            action: (
                <Button asChild variant="secondary" size="sm">
                    <Link href="/bookings">View Bookings</Link>
                </Button>
            ),
        });
    };

    if (!hasMounted) {
        return null; // or a loading skeleton
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
                <CardHeader className="bg-primary/10">
                    <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
                        <TicketIcon className="h-8 w-8" />
                        Your E-Ticket
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Booking ID: {bookingId} {ticket.isRoundTrip && <span className="font-semibold text-primary">(Round Trip)</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Departure Trip */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Operator</p>
                                <p className="font-semibold text-lg">{ticket.operator}</p>
                            </div>
                             <div className="text-right">
                                <p className="text-sm font-semibold">Departure Trip</p>
                                <BusIcon className="h-8 w-8 text-primary inline-block" />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4"/> From</p>
                                <p className="font-semibold">{ticket.departureStation}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4"/> To</p>
                                <p className="font-semibold">{ticket.arrivalStation}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Departure</p>
                                <p className="font-semibold">{formattedDate} at {ticket.departureTime}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Arrival (Est.)</p>
                                <p className="font-semibold">{formattedDate} at {ticket.arrivalTime}</p>
                            </div>
                        </div>
                        <Separator className="my-4"/>
                         <div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><User className="h-4 w-4"/> Passengers</p>
                            <div className="space-y-2">
                            {ticket.passengers.map((p, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-sm text-muted-foreground">Seat: <span className="font-bold text-primary">{p.seat}</span></p>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>

                    {/* Return Trip */}
                    {ticket.isRoundTrip && ticket.returnTrip && (
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Operator</p>
                                    <p className="font-semibold text-lg">{ticket.returnTrip.operator}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">Return Trip</p>
                                    <BusIcon className="h-8 w-8 text-primary inline-block" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4"/> From</p>
                                    <p className="font-semibold">{ticket.returnTrip.departureStation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4"/> To</p>
                                    <p className="font-semibold">{ticket.returnTrip.arrivalStation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Departure</p>
                                    <p className="font-semibold">{formattedReturnDate} at {ticket.returnTrip.departureTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Arrival (Est.)</p>
                                    <p className="font-semibold">{formattedReturnDate} at {ticket.returnTrip.arrivalTime}</p>
                                </div>
                            </div>
                             <Separator className="my-4"/>
                             <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><User className="h-4 w-4"/> Passengers</p>
                                <div className="space-y-2">
                                {ticket.returnTrip.passengers.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <p className="font-semibold">{p.name}</p>
                                        <p className="text-sm text-muted-foreground">Seat: <span className="font-bold text-primary">{p.seat}</span></p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Scan this QR code at boarding</p>
                        <div className="p-4 bg-white inline-block rounded-lg shadow-md">
                             <Image src="https://placehold.co/200x200.png" alt="QR Code" width={200} height={200} data-ai-hint="qr code"/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                     <Button variant="outline" asChild className="col-span-2 sm:col-span-1">
                        <Link href="/bus-transportation">
                           <span><ArrowLeft className="mr-2 h-4 w-4" /> Back to Search</span>
                        </Link>
                    </Button>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                        <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/> Share</Button>
                        <Button variant="outline" onClick={handleSaveToBookings}><Save className="mr-2 h-4 w-4"/> Save</Button>
                        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href={`/bus-transportation/tracking/${bookingId}?routeId=${routeId}`}>
                                <span>Track Bus</span>
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
