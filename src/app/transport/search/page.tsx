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
    const primaryOptions = rideOptions.slice(0, 4);
    const secondaryOptions = rideOptions.slice(4);


    return (
        <div className="h-screen w-screen relative lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start lg:p-8">
            {/* Back Button - Floating on mobile, standard on desktop */}
            <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4 z-20 bg-background/60 backdrop-blur-sm rounded-full h-10 w-10 p-0 text-foreground hover:bg-background/80 lg:static lg:bg-transparent lg:h-auto lg:w-auto lg:p-2 lg:mb-4">
                <ArrowLeft className="h-5 w-5 lg:mr-2" /> 
                <span className="hidden lg:inline">Back to Search</span>
            </Button>
            
            {/* Map - Fills screen on mobile, takes 2/3 on desktop */}
            <div className="absolute inset-0 z-0 lg:col-span-2 lg:static lg:rounded-lg lg:overflow-hidden lg:h-[calc(100vh-6rem)]">
                 <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>

            {/* Ride Selection Panel - Floating on mobile, takes 1/3 on desktop */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pt-10 bg-gradient-to-t from-background via-background to-transparent lg:static lg:col-span-1 lg:bg-transparent lg:p-0 lg:pt-0">
                <Card className="rounded-t-2xl lg:rounded-lg shadow-2xl lg:shadow-md bg-background max-h-[70vh] flex flex-col">
                    <CardHeader className="flex-shrink-0">
                         <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-2 lg:hidden"></div>
                        <CardTitle className="text-2xl font-bold">Choose a ride</CardTitle>
                        {forSomeoneElse && 
                            <div className="flex items-center gap-2 text-sm text-accent-foreground bg-accent/20 p-2 rounded-md">
                                <Info className="h-4 w-4"/>
                                <p>This ride is being booked for someone else.</p>
                            </div>
                        }
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto space-y-2 pr-2">
                        {primaryOptions.map((ride) => (
                            <RideOptionCard
                                key={ride.id}
                                ride={ride}
                                isSelected={selectedRide === ride.id}
                                onSelect={handleRideSelection}
                            />
                        ))}
                        
                        <h2 className="text-lg font-semibold pt-4">More ways to get there</h2>

                        {secondaryOptions.map((ride) => (
                            <RideOptionCard
                                key={ride.id}
                                ride={ride}
                                isSelected={selectedRide === ride.id}
                                onSelect={handleRideSelection}
                            />
                        ))}
                    </CardContent>
                    <div className="flex-shrink-0 mt-auto p-4 border-t flex items-center justify-between">
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
