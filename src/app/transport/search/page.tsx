// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, CreditCard, ChevronDown, Check, Wallet, Smartphone, PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, useAnimation, useDragControls, PanInfo, useMotionValue } from 'framer-motion';

type PaymentMethodType = 'wallet' | 'card' | 'mobile_money';
interface PaymentMethod {
    id: PaymentMethodType;
    name: string;
    icon: React.ElementType;
    details?: string;
}

const initialPaymentOptions: PaymentMethod[] = [
    { id: 'wallet', name: 'Wallet', icon: Wallet, details: '$75.50 available' },
    { id: 'card', name: 'Add Credit/Debit Card', icon: CreditCard },
    { id: 'mobile_money', name: 'Mobile Money', icon: Smartphone },
];

function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';

    const [selectedRide, setSelectedRide] = useState<string | null>(rideOptions[0].id);
    const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>(initialPaymentOptions);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentOptions[0]);
    
    // Dialog states
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isMobileMoneyOpen, setIsMobileMoneyOpen] = useState(false);

    // Form states for dialogs
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');

    const [hasMounted, setHasMounted] = useState(false);

    // Drag controls for the bottom sheet
    const controls = useAnimation();
    const y = useMotionValue(0);
    const dragControls = useDragControls();
    const sheetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const velocity = info.velocity.y;
        const offset = info.point.y;
        const sheetHeight = sheetRef.current?.clientHeight || 0;
        const screenHeight = window.innerHeight;

        y.set(offset);

        if (velocity > 500) {
            // Dragged down fast, close it
            controls.start({ y: screenHeight * 0.65 });
        } else if (offset > screenHeight * 0.5) {
            // Dragged more than halfway down
            controls.start({ y: screenHeight * 0.65 });
        } else {
            // Otherwise, open it fully
            controls.start({ y: 0 });
        }
    };
    
    useEffect(() => {
        setHasMounted(true);
         // Set initial position after mount
        const initialY = window.innerHeight * 0.65;
        controls.set({ y: initialY });
        y.set(initialY);

    }, [controls, y]);

    const handleRideSelection = (rideId: string) => {
        setSelectedRide(rideId);
    };

    const handleConfirmRide = () => {
         const ride = rideOptions.find(r => r.id === selectedRide);
        toast({
            title: `Confirming ${ride?.name} Ride`,
            description: `Proceeding to payment for ride from ${from} to ${to}. Payment via ${selectedPayment.name}.`,
        });
        // In a real app, this would trigger the payment processing flow and navigate to a confirmation/tracking page.
    }
    
    const handleAddCard = () => {
        if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCVC.length < 3) {
            toast({ title: "Invalid Card Details", description: "Please check your card information.", variant: "destructive" });
            return;
        }
        const last4 = cardNumber.slice(-4);
        const newCard: PaymentMethod = { id: 'card', name: `Visa **** ${last4}`, icon: CreditCard, details: `Expires ${cardExpiry}` };
        setPaymentOptions(prev => {
            const existing = prev.find(p => p.id === 'card' && p.name.includes(last4));
            if (existing) return prev;
            return [...prev, newCard].filter(p => p.name !== 'Add Credit/Debit Card');
        });
        setSelectedPayment(newCard);
        toast({ title: "Card Added", description: `Visa ending in ${last4} has been saved.` });
        setIsAddCardOpen(false);
        setCardNumber(''); setCardExpiry(''); setCardCVC('');
    };
    
    const handleAddMobileMoney = () => {
        if (mobileMoneyNumber.length < 9) {
            toast({ title: "Invalid Phone Number", description: "Please enter a valid phone number.", variant: "destructive" });
            return;
        }
        const newMobileMoney: PaymentMethod = { id: 'mobile_money', name: 'Mobile Money', icon: Smartphone, details: mobileMoneyNumber };
        setPaymentOptions(prev => {
            const existing = prev.find(p => p.id === 'mobile_money' && p.details === mobileMoneyNumber);
            if(existing) return prev;
            // Replace placeholder if it exists, otherwise add new.
            const placeholderExists = prev.some(p => p.name === 'Mobile Money' && !p.details);
            if(placeholderExists) {
                return prev.map(p => p.id === 'mobile_money' ? newMobileMoney : p);
            }
            return [...prev, newMobileMoney];
        });
        setSelectedPayment(newMobileMoney);
        toast({ title: "Mobile Money Added", description: `Using number: ${mobileMoneyNumber}.` });
        setIsMobileMoneyOpen(false);
        setMobileMoneyNumber('');
    };
    
    const handlePaymentSelect = (option: PaymentMethod) => {
        setIsPaymentDialogOpen(false); // Close main payment dialog first
        if (option.name === 'Add Credit/Debit Card') {
            setIsAddCardOpen(true);
        } else if (option.name === 'Mobile Money' && !option.details) { // The initial placeholder
            setIsMobileMoneyOpen(true);
        } else {
            setSelectedPayment(option);
        }
    };

    const selectedRideDetails = rideOptions.find(r => r.id === selectedRide);
    const SelectedPaymentIcon = selectedPayment.icon || Wallet;

    if (!hasMounted) {
        return null; // Or a loading spinner
    }

    const PaymentOptionsDialogContent = () => (
        <div className="space-y-2">
            {paymentOptions.map((option) => (
                <button
                    key={option.name}
                    className={cn(
                        "w-full flex items-center p-3 rounded-lg border text-left transition-colors",
                        selectedPayment.name === option.name
                            ? "border-primary bg-primary/10"
                            : "hover:bg-muted/50"
                    )}
                    onClick={() => handlePaymentSelect(option)}
                >
                    <option.icon className="mr-3 h-6 w-6 text-muted-foreground" />
                    <div className="flex-grow">
                        <p className="font-semibold">{option.name}</p>
                        {option.details && <p className="text-xs text-muted-foreground">{option.details}</p>}
                    </div>
                    {selectedPayment.name === option.name && <Check className="h-5 w-5 text-primary" />}
                </button>
            ))}
        </div>
    );

    const paymentTriggerButton = (
         <Button variant="ghost" className="p-1 h-auto text-left">
            <SelectedPaymentIcon className="mr-2 h-5 w-5 text-primary"/>
            <span className="font-semibold">{selectedPayment.name.split(' ')[0]}</span>
            <ChevronDown className="h-4 w-4 ml-1 opacity-50"/>
        </Button>
    )

    return (
      <>
        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 rounded-lg overflow-hidden h-full">
                 <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>
            <div className="lg:col-span-1">
                 <div className="p-4 border-b">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-start gap-2">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                            <p className="font-medium">{from}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 bg-foreground"></div>
                            <p className="font-medium">{to}</p>
                        </div>
                    </div>
                 </div>
                <div className="p-4">
                    <CardTitle className="text-xl font-bold">Choose a ride</CardTitle>
                    {selectedRideDetails && <p className="text-lg font-semibold pt-2">ETA: {selectedRideDetails.eta}</p>}
                </div>
                <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto px-4">
                    {rideOptions.map((ride) => (
                        <RideOptionCard
                            key={ride.id}
                            ride={ride}
                            isSelected={selectedRide === ride.id}
                            onSelect={handleRideSelection}
                        />
                    ))}
                </div>
                <div className="p-4 border-t flex items-center justify-between mt-2">
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                            {paymentTriggerButton}
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Payment Method</DialogTitle>
                            </DialogHeader>
                            <PaymentOptionsDialogContent />
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg">
                       Confirm {selectedRideDetails?.name}
                    </Button>
                </div>
            </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden h-screen w-screen fixed inset-0 overflow-hidden">
            <div className="h-full w-full">
                <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>
             <div className="absolute top-0 left-0 right-0 p-4 pt-6 bg-gradient-to-b from-black/50 to-transparent">
                 <div className="bg-background/80 rounded-lg p-2 shadow-lg">
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" onClick={() => router.back()} className="h-8 w-8 p-0">
                            <ArrowLeft className="h-5 w-5" /> 
                        </Button>
                         <div className="space-y-1 text-sm overflow-hidden">
                            <p className="font-medium truncate">{from}</p>
                            <p className="font-medium truncate">{to}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <motion.div
                ref={sheetRef}
                className="absolute left-0 right-0 bottom-0 bg-background rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
                style={{ y }}
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: window.innerHeight }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                transition={{ type: "spring", stiffness: 400, damping: 50 }}
            >
                <div onPointerDown={(e) => dragControls.start(e)} className="p-4 cursor-grab active:cursor-grabbing flex-shrink-0">
                    <div className="mx-auto w-8 h-1.5 bg-muted-foreground/50 rounded-full" />
                </div>
                
                <div ref={contentRef} className="flex-grow flex flex-col min-h-0">
                    <div className="px-4 space-y-2 overflow-y-auto no-scrollbar flex-grow">
                        <div className="pb-2 text-center">
                            <CardTitle className="text-xl font-bold">Choose a ride</CardTitle>
                            {selectedRideDetails && <p className="text-base font-semibold pt-1 text-primary">ETA: {selectedRideDetails.eta}</p>}
                        </div>

                        {rideOptions.map((ride) => (
                            <RideOptionCard
                                key={ride.id}
                                ride={ride}
                                isSelected={selectedRide === ride.id}
                                onSelect={handleRideSelection}
                            />
                        ))}
                    </div>

                    <div className="p-4 border-t flex items-center justify-between flex-shrink-0 mt-2">
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                            <DialogTrigger asChild>
                                {paymentTriggerButton}
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] rounded-lg">
                                <DialogHeader>
                                    <DialogTitle>Select Payment Method</DialogTitle>
                                </DialogHeader>
                                <PaymentOptionsDialogContent />
                            </DialogContent>
                        </Dialog>
                        
                        <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold" size="lg">
                           Confirm {selectedRideDetails?.name}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>


        {/* Add Card Dialog */}
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new Card</DialogTitle>
                    <DialogDescription>Your payment information is securely stored.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                            <Input id="cardExpiry" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cardCVC">CVC</Label>
                            <Input id="cardCVC" placeholder="123" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleAddCard}>Save Card</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Mobile Money Dialog */}
        <Dialog open={isMobileMoneyOpen} onOpenChange={setIsMobileMoneyOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mobile Money Payment</DialogTitle>
                    <DialogDescription>Enter your phone number to proceed.</DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="mobileMoneyNumber">Phone Number</Label>
                        <Input id="mobileMoneyNumber" type="tel" placeholder="e.g., +237 6XX XXX XXX" value={mobileMoneyNumber} onChange={(e) => setMobileMoneyNumber(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleAddMobileMoney}>Confirm Number</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </>
    );
}


export default function RideSearchPage() {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading search results...</div>}>
            <RideSearchResults />
        </Suspense>
    );
}
