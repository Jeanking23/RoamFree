
// src/app/transport/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { ArrowLeft, CreditCard, ChevronDown, Check, Wallet, Smartphone, PlusCircle, User, Star, Car, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import RideOptionCard, { rideOptions } from './ride-option-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, useAnimation, useDragControls, PanInfo, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

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

const mockDriver = {
    name: 'John D.',
    rating: 4.9,
    vehicle: 'Toyota Camry',
    licensePlate: 'ABC-123',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
};

function RideSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const from = searchParams.get('from') || 'your location';
    const to = searchParams.get('to') || 'your destination';

    const [selectedRide, setSelectedRide] = useState<string | null>(rideOptions[0].id);
    const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>(initialPaymentOptions);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentOptions[0]);
    
    // Dialog states
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
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
    const sheetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();


     const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const velocity = info.velocity.y;
        const offset = info.point.y;
        const sheetHeight = sheetRef.current?.clientHeight || 0;
        const screenHeight = window.innerHeight;

        const finalY = offset + velocity * 0.3;

        // If dragging with significant velocity, snap to top or bottom
        if (Math.abs(velocity) > 500) {
            if (velocity > 0) {
                 controls.start({ y: screenHeight * 0.65, transition: { type: "spring", stiffness: 400, damping: 40 } });
            } else {
                 controls.start({ y: screenHeight * 0.1, transition: { type: "spring", stiffness: 400, damping: 40 } });
            }
        } else {
            // Snap based on position
            if (finalY < (screenHeight * 0.45)) { // Snap to top
                controls.start({ y: screenHeight * 0.1, transition: { type: "spring", stiffness: 400, damping: 40 } });
            } else { // Snap to bottom (partially visible)
                controls.start({ y: screenHeight * 0.65, transition: { type: "spring", stiffness: 400, damping: 40 } });
            }
        }
    }, [controls]);
    
    useEffect(() => {
        setHasMounted(true);
        const initialY = window.innerHeight * 0.65;
        controls.set({ y: initialY });
        y.set(initialY);

    }, [controls, y]);

    const handleRideSelection = (rideId: string) => {
        setSelectedRide(rideId);
    };

    const handleConfirmRide = () => {
        setIsConfirmationOpen(false); // Close the confirmation dialog
        const ride = rideOptions.find(r => r.id === selectedRide);
        toast({
            title: `Ride Confirmed!`,
            description: `${ride?.name} is on the way. Driver: ${mockDriver.name}.`,
        });
        // In a real app, navigate to a live tracking page.
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
        setIsConfirmationOpen(true); // Re-open confirmation dialog
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
            const placeholderExists = prev.some(p => p.name === 'Mobile Money' && !p.details);
            if(placeholderExists) {
                return prev.map(p => p.id === 'mobile_money' ? newMobileMoney : p);
            }
            return [...prev, newMobileMoney];
        });
        setSelectedPayment(newMobileMoney);
        toast({ title: "Mobile Money Added", description: `Using number: ${mobileMoneyNumber}.` });
        setIsMobileMoneyOpen(false);
        setIsConfirmationOpen(true); // Re-open confirmation dialog
        setMobileMoneyNumber('');
    };
    
    const handlePaymentSelect = (option: PaymentMethod) => {
        if (option.name === 'Add Credit/Debit Card') {
            setIsConfirmationOpen(false);
            setIsAddCardOpen(true);
        } else if (option.name === 'Mobile Money' && !option.details) {
            setIsConfirmationOpen(false);
            setIsMobileMoneyOpen(true);
        } else {
            setSelectedPayment(option);
        }
    };

    const selectedRideDetails = rideOptions.find(r => r.id === selectedRide);
    
    if (!hasMounted) {
        return null; 
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
    
    const ConfirmationDialogContent = () => (
        <>
            <DialogHeader>
                <DialogTitle>Confirm your ride</DialogTitle>
                <DialogDescription>Review the details before confirming your booking.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <Card>
                    <CardContent className="p-4 space-y-3">
                         <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                            <p className="font-medium text-sm">{from}</p>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 bg-foreground"></div>
                            <p className="font-medium text-sm">{to}</p>
                        </div>
                        <Separator />
                         <div className="flex items-center justify-between text-sm">
                            <p className="text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/> Est. Trip Duration</p>
                            <p className="font-semibold">25-30 min</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-24 h-12 text-primary">
                                {selectedRideDetails && <selectedRideDetails.icon />}
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold">{selectedRideDetails?.name}</h4>
                                <p className="text-sm text-muted-foreground">{selectedRideDetails?.description}</p>
                            </div>
                            <p className="font-bold text-lg">${selectedRideDetails?.price.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <Image src={mockDriver.avatar} alt={mockDriver.name} width={60} height={60} className="rounded-full" data-ai-hint={mockDriver.dataAiHint} />
                        <div>
                            <p className="font-semibold">Your driver: {mockDriver.name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {mockDriver.rating}
                            </div>
                            <p className="text-xs text-muted-foreground">{mockDriver.vehicle} • {mockDriver.licensePlate}</p>
                        </div>
                    </CardContent>
                </Card>
                <div>
                    <h4 className="font-semibold mb-2">Payment</h4>
                    <PaymentOptionsDialogContent />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleConfirmRide} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                    Confirm & Request Ride
                </Button>
            </DialogFooter>
        </>
    );


    return (
      <>
        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-[2fr,1fr] h-screen">
            <div className="h-full">
                 <InteractiveMapPlaceholder pickup={from} dropoff={to} />
            </div>
            <div className="flex flex-col h-full bg-background border-l">
                 <div className="p-4 border-b flex-shrink-0">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-start gap-2">
                            <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                            <p className="font-medium text-sm">{from}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="mt-1.5 flex-shrink-0 w-2 h-2 bg-foreground"></div>
                            <p className="font-medium text-sm">{to}</p>
                        </div>
                    </div>
                 </div>
                <div className="p-4 flex-shrink-0">
                    <CardTitle className="text-xl font-bold">Choose a ride</CardTitle>
                    {selectedRideDetails && <p className="text-lg font-semibold pt-2 text-primary">ETA: {selectedRideDetails.eta}</p>}
                </div>
                <div className="space-y-2 overflow-y-auto px-4 flex-grow no-scrollbar">
                    {rideOptions.map((ride) => (
                        <RideOptionCard
                            key={ride.id}
                            ride={ride}
                            isSelected={selectedRide === ride.id}
                            onSelect={handleRideSelection}
                        />
                    ))}
                </div>
                <div className="p-4 border-t mt-auto flex-shrink-0">
                    <Button onClick={() => setIsConfirmationOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold w-full" size="lg">
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
                dragListener={false}
                dragControls={dragControls}
                dragConstraints={{ top: 0, bottom: window.innerHeight }}
                dragElastic={{ top: 0.1, bottom: 0.5 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
                <div 
                    onPointerDown={(e) => dragControls.start(e)}
                    className="p-4 cursor-grab active:cursor-grabbing flex-shrink-0"
                >
                    <div className="mx-auto w-8 h-1.5 bg-muted-foreground/50 rounded-full" />
                </div>
                
                <div className="px-4 pb-2 text-center flex-shrink-0">
                    <CardTitle className="text-xl font-bold">Choose a ride</CardTitle>
                    {selectedRideDetails && <p className="text-base font-semibold pt-1 text-primary">ETA: {selectedRideDetails.eta}</p>}
                </div>
                
                <div ref={contentRef} className="px-4 overflow-y-auto space-y-2 no-scrollbar flex-grow">
                    {rideOptions.map((ride) => (
                        <RideOptionCard
                            key={ride.id}
                            ride={ride}
                            isSelected={selectedRide === ride.id}
                            onSelect={handleRideSelection}
                        />
                    ))}
                </div>

                <div className="p-4 border-t mt-auto flex-shrink-0">
                    <Button onClick={() => setIsConfirmationOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold w-full" size="lg">
                        Confirm {selectedRideDetails?.name}
                    </Button>
                </div>
            </motion.div>
        </div>
        
        {/* Confirmation Dialog */}
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
            <DialogContent>
                <ConfirmationDialogContent />
            </DialogContent>
        </Dialog>


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
                    <Button type="button" variant="outline" onClick={() => { setIsAddCardOpen(false); setIsConfirmationOpen(true); }}>Cancel</Button>
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
                    <Button type="button" variant="outline" onClick={() => { setIsMobileMoneyOpen(false); setIsConfirmationOpen(true); }}>Cancel</Button>
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
