// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, Calendar, CreditCard, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// New component for the floating trip details header
function TripHeader({ from, to }: { from: string; to: string }) {
    const router = useRouter();
    return (
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="relative bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
                <Button variant="ghost" onClick={() => router.back()} className="absolute top-1/2 -translate-y-1/2 left-1.5 h-9 w-9 p-0 bg-transparent hover:bg-muted/50 rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                </Button>
                <div className="ml-12 space-y-1">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-foreground rounded-full" />
                         <p className="text-sm font-medium truncate">{from}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-foreground" />
                        <p className="text-sm font-medium truncate">{to}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';
    const [selectedRide, setSelectedRide] = useState<string | null>(rideOptions[0].id);
    const [rideForSomeoneElse, setRideForSomeoneElse] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        if (searchParams.get('forSomeoneElse') === 'true') {
            setRideForSomeoneElse(true);
        }
    }, [searchParams]);

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

    if (!hasMounted) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>; // Or a skeleton loader
    }


    return (
        <div className="h-screen w-screen overflow-hidden relative">
            {/* Map Area - Fills the entire screen */}
            <div className="absolute inset-0">
                <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>
            
            {/* Floating UI Elements */}
            <TripHeader from={from} to={to} />

            {/* Ride Options Panel */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pt-0">
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-border flex flex-col max-h-[55vh]">
                    <div className="text-center mb-3">
                         <h1 className="text-lg font-bold">Choose a ride, or schedule one for later</h1>
                    </div>

                    <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                        {primaryOptions.map((ride) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                        {secondaryOptions.map((ride) => (
                               <RideOptionCard
                                   key={ride.id}
                                   ride={ride}
                                   isSelected={selectedRide === ride.id}
                                   onSelect={handleRideSelection}
                               />
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                             <Button variant="ghost" className="p-1 h-auto">
                                <CreditCard className="mr-2 h-5 w-5 text-primary"/>
                                <span className="font-semibold">Wallet</span>
                                <ChevronDown className="h-4 w-4 ml-1"/>
                             </Button>
                             <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg">
                                Confirm {selectedRideDetails?.name}
                            </Button>
                        </div>
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
