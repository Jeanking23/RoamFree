// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { Car, Bike, Shield, Users, User, Clock, ArrowLeft, Star, CarFront, PawPrint } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define the custom Motorcycle icon component using an inline SVG
const MotorcycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 14h1"/><path d="M18 14h1"/><path d="m18 19-3-3 1-2h-5l1 2-3 3"/><path d="m14 14-2-3-2 3"/><path d="M8 10h8"/><path d="M5.5 10.5C4 11 3 13 3 14a2 2 0 0 0 2 2h.5"/><path d="M18.5 10.5c1.5.5 2.5 2.5 2.5 3.5a2 2 0 0 1-2 2h-.5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
    </svg>
  );


const rideOptions = [
    { 
        id: 'uberx',
        name: 'RoamFree Standard', 
        icon: Car,
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:02 PM',
        price: 23.15,
        originalPrice: 28.94,
        tags: ['20% off', 'Popular'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'white sedan',
        description: 'Affordable, everyday rides'
    },
    { 
        id: 'share',
        name: 'RoamFree Share', 
        icon: Users,
        capacity: 1, 
        eta: '5 mins away', 
        arrivalTime: '12:03 PM',
        price: 20.06,
        originalPrice: 25.07,
        tags: ['20% off', 'Eco-friendly'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'electric car',
        description: 'Walk up to 3 min, one seat only'
    },
    { 
        id: 'uberxl',
        name: 'RoamFree XL', 
        icon: CarFront,
        capacity: 6, 
        eta: '9 mins away', 
        arrivalTime: '12:06 PM',
        price: 32.77,
        originalPrice: 40.96,
        tags: ['20% off'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'minivan luggage',
        description: 'Affordable rides for groups up to 6'
    },
    { 
        id: 'comfort',
        name: 'RoamFree Comfort', 
        icon: Star,
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:05 PM',
        price: 29.83,
        originalPrice: 37.29,
        tags: ['Top-rated drivers'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'luxury sedan',
        description: 'Newer cars with extra legroom'
    },
     { 
        id: 'bike',
        name: 'RoamFree Moto', 
        icon: MotorcycleIcon,
        capacity: 1, 
        eta: '2 mins away', 
        arrivalTime: '12:00 PM',
        price: 15.50,
        originalPrice: 18.00,
        tags: ['Quickest'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'scooter transport',
        description: 'Get there faster on a motorbike'
    },
    { 
        id: 'pet',
        name: 'RoamFree Pet', 
        icon: PawPrint,
        capacity: 4, 
        eta: '6 mins away', 
        arrivalTime: '12:02 PM',
        price: 26.35,
        originalPrice: 32.94,
        tags: ['Pet-friendly'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'sedan dog',
        description: 'For you and your furry friend'
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
        <div className="container mx-auto">
            <Button variant="outline" onClick={() => router.back()} className="mb-4 lg:hidden">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Button>
            <div className="flex flex-col lg:flex-row lg:gap-8">
                
                {/* Map: First on mobile, last on desktop */}
                <div className="order-first lg:order-last lg:w-2/3">
                    <div className="rounded-lg overflow-hidden h-80 lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
                        <InteractiveMapPlaceholder pickup={from} dropoff={to} />
                    </div>
                </div>

                {/* Ride Options: Second on mobile, first on desktop */}
                <div className="lg:w-1/3 space-y-4 mt-8 lg:mt-0">
                     <h1 className="text-3xl font-headline font-bold text-primary">Choose a ride</h1>
                     <p className="text-muted-foreground">Trip from <strong>{from}</strong> to <strong>{to}</strong>.</p>
                     
                     <div className="flex items-center space-x-2 py-2">
                        <Switch id="ride-for-other" />
                        <Label htmlFor="ride-for-other">Ride for someone else</Label>
                    </div>

                    <div className="space-y-3 max-h-[calc(100vh-30rem)] lg:max-h-[calc(100vh-22rem)] overflow-y-auto pr-2">
                        {rideOptions.map((ride) => (
                             <Card 
                                key={ride.id} 
                                className={cn(
                                    "hover:shadow-md cursor-pointer transition-all duration-200 border-2",
                                    selectedRide === ride.id ? "border-primary bg-primary/5" : "bg-card"
                                )} 
                                onClick={() => handleRideSelection(ride.id)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-4">
                                        <Image src={ride.image} alt={ride.name} width={80} height={50} className="object-contain rounded-md bg-muted/50" data-ai-hint={ride.dataAiHint}/>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-base flex items-center gap-2">
                                                    <ride.icon className="h-5 w-5 text-primary" />
                                                    {ride.name}
                                                </h4>
                                                <p className="font-semibold text-lg text-primary">${ride.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span className="flex items-center gap-1"><Users className="h-3 w-3"/>{ride.capacity}</span>
                                                    <span>{ride.arrivalTime} dropoff</span>
                                                </p>
                                                {ride.originalPrice && <p className="text-sm text-muted-foreground line-through">${ride.originalPrice.toFixed(2)}</p>}
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                {ride.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className={cn(
                                                        'text-xs px-1.5 py-0.5 font-semibold',
                                                        tag.includes('off') && 'bg-green-600/20 text-green-300 border-green-600/30',
                                                        tag === 'Popular' && 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
                                                        tag === 'Quickest' && 'bg-purple-600/20 text-purple-300 border-purple-600/30'
                                                    )}>
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={handleConfirmRide} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">Confirm {rideOptions.find(r => r.id === selectedRide)?.name}</Button>
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
