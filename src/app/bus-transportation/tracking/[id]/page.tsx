
// src/app/bus-transportation/tracking/[id]/page.tsx
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, BusIcon, Navigation, User, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data
const mockTrackingData = {
    routeId: "route001",
    operator: "ComfortLines Express",
    driver: { name: "John Doe", rating: 4.8 },
    busPlate: "CE 1234 AB",
    departure: "Central Bus Terminal, Douala",
    arrival: "Main Station, Yaoundé",
    departureTime: "08:00 AM",
    initialEta: "02:00 PM",
    currentStatus: "On the way",
    progress: 0,
    delayMinutes: 0,
};


export default function BusTrackingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const bookingId = params.id as string;
    const routeId = searchParams.get('routeId');

    const [trackingInfo, setTrackingInfo] = useState(mockTrackingData);
    const [currentEta, setCurrentEta] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        
        // Initialize ETA on the client
        if (currentEta === null) {
            setCurrentEta(mockTrackingData.initialEta);
        }

        const interval = setInterval(() => {
            setTrackingInfo(prev => {
                const newProgress = Math.min(prev.progress + 5, 100);
                const isDelayed = newProgress > 40 && newProgress < 60; // Simulate a delay
                const newDelay = isDelayed ? 15 : 0;
                
                // Update ETA based on delay
                const [hourStr, minuteStr] = prev.initialEta.split(/:| /);
                const hour = parseInt(hourStr, 10);
                const minute = parseInt(minuteStr, 10);
                const isPM = prev.initialEta.toUpperCase().includes('PM');

                let newEtaDate = new Date();
                newEtaDate.setHours(isPM && hour !== 12 ? hour + 12 : (isPM === false && hour === 12 ? 0 : hour), minute, 0, 0);
                newEtaDate.setMinutes(newEtaDate.getMinutes() + newDelay);
                setCurrentEta(newEtaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

                return {
                    ...prev,
                    progress: newProgress,
                    delayMinutes: newDelay,
                    currentStatus: newProgress === 100 ? "Arrived" : "On the way",
                };
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [hasMounted, currentEta]);

    const handleContactDriver = () => {
        toast({ title: "Contacting Driver (Demo)", description: "This would open a secure chat with the driver."});
    }

    if (!hasMounted) {
        return null; // or a loading skeleton
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-primary/10">
                    <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
                        <Navigation className="h-8 w-8" />
                        Live Bus Tracking
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Booking ID: {params.id as string}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-6 grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 md:h-[600px]">
                        <InteractiveMapPlaceholder pickup={trackingInfo.departure} dropoff={trackingInfo.arrival} />
                    </div>
                    <div className="lg:col-span-1 p-6 md:p-0 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trip Progress</CardTitle>
                                <CardDescription>{trackingInfo.currentStatus}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={trackingInfo.progress} className="w-full" />
                                <div className="flex justify-between text-xs mt-1">
                                    <span>{trackingInfo.departure.split(',')[0]}</span>
                                    <span>{trackingInfo.arrival.split(',')[0]}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Estimated Time of Arrival</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{currentEta || 'Calculating...'}</p>
                                {trackingInfo.delayMinutes > 0 ? (
                                    <p className="text-sm text-orange-500">Delayed by {trackingInfo.delayMinutes} minutes</p>
                                ) : (
                                    <p className="text-sm text-green-600">On Time</p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Driver & Bus Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><User className="inline h-4 w-4 mr-1"/>Driver: {trackingInfo.driver.name} (⭐ {trackingInfo.driver.rating})</p>
                                <p><BusIcon className="inline h-4 w-4 mr-1"/>Bus Plate: {trackingInfo.busPlate}</p>
                                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleContactDriver}>
                                    <MessageSquare className="mr-2 h-4 w-4"/> Contact Driver
                                </Button>
                                 <Button variant="destructive" size="sm" className="w-full mt-2">
                                    <AlertCircle className="mr-2 h-4 w-4"/> Report Emergency (SOS)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
                 <CardFooter className="bg-muted/50 p-4">
                    <Button variant="outline" asChild>
                        <Link href={`/bus-transportation/ticket/${bookingId}?routeId=${routeId}`}>
                            <span><ArrowLeft className="mr-2 h-4 w-4" /> Back to Ticket</span>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
