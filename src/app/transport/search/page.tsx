// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, CarFront, PawPrint, Star, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Separator } from '@/components/ui/separator';

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
            description: `Proceeding to payment for ride from ${from} to ${to}. Using default payment method via RoamFree Wallet.`,
        });
        // In a real app, this would trigger the payment processing flow and navigate to a confirmation/tracking page.
    }

    const selectedRideDetails = rideOptions.find(r => r.id === selectedRide);
    
    // Split options for display logic
    const primaryOptions = rideOptions.slice(0, 3);
    const secondaryOptions = rideOptions.slice(3);


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
                         {primaryOptions.map((ride, index) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                        <div className="py-4">
                            <h2 className="text-xl font-bold">More ways to get there</h2>
                        </div>
                        {secondaryOptions.map((ride, index) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                    </div>
                    <Button onClick={handleConfirmRide} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                        Confirm {selectedRideDetails?.name}
                    </Button>
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
