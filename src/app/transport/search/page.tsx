// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';

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
    const primaryOptions = rideOptions.slice(0, 4); // Standard, Wait & Save, Comfort, Moto
    const secondaryOptions = rideOptions.slice(4); // The rest


    return (
        <div className="container mx-auto p-0 h-[calc(100vh-4rem)] md:h-auto md:p-4">
             <div className="relative h-full w-full flex flex-col lg:flex-row lg:gap-8">
                {/* Back Button for Mobile */}
                <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4 z-10 lg:hidden bg-background/60 hover:bg-background/80 rounded-full h-10 w-10 p-0">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Button>

                {/* Map Area */}
                <div className="flex-grow h-1/2 lg:h-auto lg:w-2/3">
                    <div className="rounded-lg overflow-hidden h-full lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
                        <InteractiveMapPlaceholder pickup={from} dropoff={to} />
                    </div>
                </div>

                {/* Ride Options Panel */}
                 <div className="flex-shrink-0 lg:w-1/3 p-4 bg-background shadow-lg rounded-t-2xl lg:rounded-lg -mt-4 lg:mt-0 z-10 flex flex-col h-1/2 lg:h-auto">
                     <div className='lg:space-y-4'>
                         <h1 className="text-xl lg:text-3xl font-bold lg:font-headline lg:text-primary text-center lg:text-left">Choose a ride</h1>
                         <p className="hidden lg:block text-muted-foreground">Trip from <strong>{from}</strong> to <strong>{to}</strong>.</p>
                     </div>

                    <div className="flex-grow space-y-3 overflow-y-auto pr-2 mt-4 lg:mt-0">
                        {/* Primary Options */}
                         {primaryOptions.map((ride) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                        
                        {/* Secondary Options Divider (optional, good for UI clarity) */}
                        {secondaryOptions.length > 0 && <div className="py-2 hidden"><h2 className="text-md font-bold">More ways to get there</h2></div>}
                        
                        {/* Secondary Options */}
                        {secondaryOptions.map((ride) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                    </div>

                    <div className="mt-auto pt-2">
                        <Button onClick={handleConfirmRide} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                            Confirm {selectedRideDetails?.name}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function RideSearchPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <RideSearchResults />
        </Suspense>
    );
}
