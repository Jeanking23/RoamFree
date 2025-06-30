// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { Car, Bike, Shield, Users, User, Clock, ArrowLeft, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


const rideOptions = [
    { 
        id: 'uberx',
        name: 'UberX', 
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:02 PM',
        price: 23.15,
        originalPrice: 28.94,
        tags: ['20% off', 'Faster'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'white sedan',
        description: 'Affordable, everyday rides'
    },
    { 
        id: 'share',
        name: 'Share', 
        capacity: 1, 
        eta: '5 mins away', 
        arrivalTime: '12:03 PM',
        price: 20.06,
        originalPrice: 25.07,
        tags: ['20% off'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'white sedan person',
        description: 'Walk up to 3 min, one seat only'
    },
    { 
        id: 'uberxl',
        name: 'UberXL', 
        capacity: 6, 
        eta: '9 mins away', 
        arrivalTime: '12:06 PM',
        price: 32.77,
        originalPrice: 40.96,
        tags: ['20% off'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'minivan luggage',
        description: 'Affordable rides for groups up to 6'
    },
    { 
        id: 'comfort',
        name: 'Comfort', 
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:05 PM',
        price: 29.83,
        originalPrice: 37.29,
        tags: ['20% off'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'luxury sedan',
        description: 'Newer cars with extra legroom'
    },
     { 
        id: 'bike',
        name: 'Bike', 
        capacity: 1, 
        eta: '2 mins away', 
        arrivalTime: '12:00 PM',
        price: 15.50,
        originalPrice: 18.00,
        tags: ['Quickest'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'scooter transport',
        description: 'Get there faster on a motorbike'
    },
    { 
        id: 'pet',
        name: 'Pet', 
        capacity: 4, 
        eta: '6 mins away', 
        arrivalTime: '12:02 PM',
        price: 26.35,
        originalPrice: 32.94,
        tags: ['20% off'],
        image: 'https://placehold.co/100x50.png',
        dataAiHint: 'sedan dog',
        description: 'For you and your pet'
    },
];

function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';
    const [selectedRide, setSelectedRide] = useState<string | null>(rideOptions[0].id);

    const handleRideSelection = (rideId: string) => {
        setSelectedRide(rideId);
    };

    const handleConfirmRide = () => {
         const ride = rideOptions.find(r => r.id === selectedRide);
        toast({
            title: `Confirming ${ride?.name} Ride`,
            description: `Booking ride from ${from} to ${to}. Proceeding to confirmation...`,
        });
        // In a real app, navigate to a booking confirmation page
    }

    return (
        <div className="container mx-auto py-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-4 lg:hidden">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Ride Options */}
                <div className="lg:col-span-1 space-y-4">
                     <h1 className="text-2xl font-bold">Choose a ride</h1>
                     <p className="text-sm text-muted-foreground">From: {from} &bull; To: {to}</p>

                    <div className="space-y-2">
                        {rideOptions.map((ride) => (
                             <Card 
                                key={ride.id} 
                                className={cn(
                                    "hover:bg-accent/10 cursor-pointer transition-all duration-200 border-2",
                                    selectedRide === ride.id ? "border-primary bg-accent/10" : "border-transparent"
                                )} 
                                onClick={() => handleRideSelection(ride.id)}
                            >
                                <CardContent className="p-3 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <Image src={ride.image} alt={ride.name} width={80} height={40} className="object-contain" data-ai-hint={ride.dataAiHint}/>
                                        <div>
                                            <p className="font-bold text-base flex items-center gap-1.5">
                                                {ride.name} 
                                                <span className="text-xs text-muted-foreground font-normal flex items-center"><Users className="h-3 w-3 mr-0.5"/>{ride.capacity}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {ride.eta} &bull; {ride.arrivalTime}
                                            </p>
                                             {ride.tags.includes('Faster') && <Badge variant="outline" className="text-blue-600 border-blue-300 h-5 mt-1">Faster</Badge>}
                                             {ride.tags.includes('Quickest') && <Badge variant="outline" className="text-purple-600 border-purple-300 h-5 mt-1">Quickest</Badge>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {ride.tags.includes('20% off') && <span className="text-xs text-green-600 font-medium">20% off</span>}
                                        <p className="font-semibold text-lg">${ride.price.toFixed(2)}</p>
                                        {ride.originalPrice && <p className="text-sm text-muted-foreground line-through">${ride.originalPrice.toFixed(2)}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={handleConfirmRide} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">Confirm {rideOptions.find(r => r.id === selectedRide)?.name}</Button>
                </div>

                {/* Right Column: Map */}
                <div className="lg:col-span-2 rounded-lg overflow-hidden h-64 lg:h-[calc(100vh-10rem)] sticky top-24">
                     <InteractiveMapPlaceholder pickup={from} dropoff={to} />
                </div>
            </div>
        </div>
    );
}


export default function RideSearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RideSearchResults />
        </Suspense>
    );
}
