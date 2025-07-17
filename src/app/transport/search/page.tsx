// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, Calendar, CreditCard, ChevronDown, UserPlus, Info, Smartphone, Wallet, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type PaymentMethod = 'wallet' | 'card' | 'mobile_money';

const paymentOptions = [
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'card', name: 'Add Credit/Debit Card', icon: CreditCard },
    { id: 'mobile_money', name: 'Mobile Money', icon: Smartphone },
];

function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';

    const [selectedRide, setSelectedRide] = useState<string | null>(rideOptions[0].id);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('wallet');
    const [openPaymentPopover, setOpenPaymentPopover] = useState(false);


    const handleRideSelection = (rideId: string) => {
        setSelectedRide(rideId);
    };

    const handleConfirmRide = () => {
         const ride = rideOptions.find(r => r.id === selectedRide);
         const paymentMethod = paymentOptions.find(p => p.id === selectedPayment);
        toast({
            title: `Confirming ${ride?.name} Ride`,
            description: `Proceeding to payment for ride from ${from} to ${to}. Payment via ${paymentMethod?.name}.`,
        });
        // In a real app, this would trigger the payment processing flow and navigate to a confirmation/tracking page.
    }

    const selectedRideDetails = rideOptions.find(r => r.id === selectedRide);
    const selectedPaymentDetails = paymentOptions.find(p => p.id === selectedPayment);
    const SelectedPaymentIcon = selectedPaymentDetails?.icon || Wallet;


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
                        <CardTitle className="text-xl font-bold">Choose a ride</CardTitle>
                        <CardDescription>Trip from {from} to {to}.</CardDescription>
                        {selectedRideDetails && <p className="text-lg font-semibold pt-2">ETA: {selectedRideDetails.eta}</p>}
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
                    <Separator />
                     <div className="p-4 border-t flex items-center justify-between">
                        <Popover open={openPaymentPopover} onOpenChange={setOpenPaymentPopover}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" role="combobox" aria-expanded={openPaymentPopover} className="p-1 h-auto text-left">
                                    <SelectedPaymentIcon className="mr-2 h-5 w-5 text-primary"/>
                                    <span className="font-semibold">{selectedPaymentDetails?.name.split(' ')[0]}</span>
                                    <ChevronDown className="h-4 w-4 ml-1 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Select payment method..." />
                                    <CommandList>
                                        <CommandEmpty>No payment method found.</CommandEmpty>
                                        <CommandGroup>
                                            {paymentOptions.map((option) => (
                                                <CommandItem
                                                    key={option.id}
                                                    onSelect={() => {
                                                        setSelectedPayment(option.id as PaymentMethod);
                                                        setOpenPaymentPopover(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedPayment === option.id ? "opacity-100" : "opacity-0")}/>
                                                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                                                    {option.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        
                        <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg">
                           Confirm & Pay
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
