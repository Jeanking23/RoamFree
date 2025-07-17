// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, Calendar, CreditCard, ChevronDown, UserPlus, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';
    const forSomeoneElse = searchParams.get('forSomeoneElse') === 'true';

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

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 rounded-lg overflow-hidden h-96 lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
                 <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>
            <div className="lg:col-span-1">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                </Button>
                <Card className="rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Choose a ride</CardTitle>
                        <p className="text-sm text-muted-foreground">Trip from {from} to {to}.</p>
                         {forSomeoneElse && 
                            <div className="flex items-center gap-2 text-sm text-accent-foreground bg-accent/20 p-2 rounded-md">
                                <Info className="h-4 w-4"/>
                                <p>This ride is being booked for someone else.</p>
                            </div>
                        }
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[50vh] overflow-y-auto">
                        {rideOptions.map((ride) => (
                            <RideOptionCard
                                key={ride.id}
                                ride={ride}
                                isSelected={selectedRide === ride.id}
                                onSelect={handleRideSelection}
                            />
                        ))}
                    </CardContent>
                    <div className="p-4 border-t flex items-center justify-between">
                        <Button variant="ghost" className="p-1 h-auto">
                            <CreditCard className="mr-2 h-5 w-5 text-primary"/>
                            <span className="font-semibold">Wallet</span>
                            <ChevronDown className="h-4 w-4 ml-1"/>
                        </Button>
                        <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg">
                            Confirm {selectedRideDetails?.name}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}


export default function RideSearchPage() {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading search results...</div>}>
            <RideSearchResults />
        </Suspense>
    );
}
