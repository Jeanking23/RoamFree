// src/app/transport/search/ride-option-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, Clock, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';

// Simplified Ride Icons for a cleaner look
const CarVIPicon = () => ( // VIP
     <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 90,25 A 15 15, 0, 0, 1, 75, 40 L 25, 40 A 15 15, 0, 0, 1, 10, 25 L 20,10 A 10 10, 0, 0, 1, 30, 5 L 70, 5 A 10 10, 0, 0, 1, 80, 10 Z" fill="currentColor"/>
        <path d="M 80, 10 L 70, 25 L 30, 25 L 20,10 Z" fill="hsl(var(--background))" opacity="0.3"/>
        <polygon points="45,0 55,0 52,5 48,5" fill="currentColor" stroke="hsl(var(--background))" strokeWidth="1"/>
    </svg>
);
const CarSuvIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 90,30 A 15 15, 0, 0, 1, 75, 45 L 25, 45 A 15 15, 0, 0, 1, 10, 30 L 15,20 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 75, 5 A 10 10, 0, 0, 1, 85, 10 L 90,25 Z" fill="currentColor"/>
        <path d="M 85, 10 L 75, 30 L 50, 30 L 45,10 Z" fill="hsl(var(--background))" opacity="0.3"/>
        <path d="M 45,10 L 25, 30 L 20, 30 L 25, 10 Z" fill="hsl(var(--background))" opacity="0.3"/>
    </svg>
);
const VanIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 90,40 L 90,20 A 10 10 0 0 0 80,10 L 30,10 A 10 10 0 0 0 20,20 L 15,40 L 10,40 A 15 15 0 0 0 10,45 L 20,45 A 5 5 0 0 0 25,40 L 75,40 A 5 5 0 0 0 80,45 L 90,45 A 15 15 0 0 0 90,40 Z" fill="currentColor" />
        <rect x="35" y="15" width="15" height="15" rx="2" fill="hsl(var(--background))" opacity="0.3" />
        <rect x="55" y="15" width="15" height="15" rx="2" fill="hsl(var(--background))" opacity="0.3" />
    </svg>
);
const MinibusIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 95,40 L 95,20 A 10 10 0 0 0 85,10 L 20,10 A 10 10 0 0 0 10,20 L 5,30 L 5,40 A 15 15 0 0 0 5,45 L 15,45 A 5 5 0 0 0 20,40 L 80,40 A 5 5 0 0 0 85,45 L 95,45 A 15 15 0 0 0 95,40 Z" fill="currentColor" />
        <rect x="25" y="15" width="15" height="15" rx="2" fill="hsl(var(--background))" opacity="0.3" />
        <rect x="45" y="15" width="15" height="15" rx="2" fill="hsl(var(--background))" opacity="0.3" />
        <rect x="65" y="15" width="15" height="15" rx="2" fill="hsl(var(--background))" opacity="0.3" />
    </svg>
);
const BusIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 98,35 A 10 10 0 0 0 88,25 L 88,15 A 10 10 0 0 0 78,5 L 22,5 A 10 10 0 0 0 12,15 L 12,25 A 10 10 0 0 0 2,35 L 2,40 A 15 15 0 0 0 2,45 L 12,45 A 5 5 0 0 0 17,40 L 83,40 A 5 5 0 0 0 88,45 L 98,45 A 15 15 0 0 0 98,40 Z" fill="currentColor" />
        <rect x="20" y="10" width="56" height="12" fill="hsl(var(--background))" opacity="0.3" />
    </svg>
);
const MotorbikeIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 75,43 A 10 10, 0, 1, 1, 75, 42" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M 25,43 A 10 10, 0, 1, 1, 25, 42" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M 25,43 L 35,25 L 45,25 L 60,30 L 75,43" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M 40,25 L 50,10 L 60,10" fill="none" stroke="currentColor" strokeWidth="6" />
    </svg>
);

const PopularBadge = () => (
    <div className="absolute top-1 right-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
        <Star className="h-3 w-3" /> Popular
    </div>
);
const SurgeBadge = () => (
    <div className="absolute top-1 right-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> Higher demand
    </div>
);

// Generic Car Image Component
const CarImage = ({ src, 'data-ai-hint': dataAiHint }: { src: string; 'data-ai-hint': string }) => (
    <div className="relative w-full h-full">
        <Image src={src} alt="Car" fill className="object-contain" data-ai-hint={dataAiHint} />
    </div>
);


export const rideOptions = [
    { 
        id: 'economy_motorbike',
        name: 'Motorbike Economy', 
        icon: MotorbikeIcon,
        capacity: 1, 
        eta: '4:36 PM', 
        price: 15.50,
        originalPrice: null,
        description: 'Quickest way there, basic ride'
    },
     { 
        id: 'comfort_motorbike',
        name: 'Motorbike Comfort', 
        icon: MotorbikeIcon,
        capacity: 1, 
        eta: '4:35 PM', 
        price: 18.25,
        originalPrice: null,
        description: 'More experienced riders'
    },
    { 
        id: 'economy',
        name: 'Economy', 
        icon: () => <CarImage src="https://placehold.co/120x60/000000/FFFFFF/png?text=Economy" data-ai-hint="economy sedan" />,
        capacity: 4, 
        eta: '4:39 PM', 
        price: 32.84,
        originalPrice: null,
        description: 'Affordable, everyday rides',
        isPopular: true,
    },
    { 
        id: 'comfort',
        name: 'Comfort', 
        icon: () => <CarImage src="https://placehold.co/120x60/000000/FFFFFF/png?text=Comfort" data-ai-hint="comfort sedan" />,
        capacity: 4, 
        eta: '4:38 PM', 
        price: 39.53,
        originalPrice: 42.10,
        description: 'Newer cars with extra legroom'
    },
     { 
        id: 'business',
        name: 'Business', 
        icon: () => <CarImage src="https://placehold.co/120x60/000000/FFFFFF/png?text=Business" data-ai-hint="business sedan" />,
        capacity: 3, 
        eta: '4:41 PM',
        price: 65.20,
        originalPrice: null,
        description: 'Premium cars for business travel'
    },
    { 
        id: 'premium',
        name: 'Premium', 
        icon: () => <CarImage src="https://placehold.co/120x60/000000/FFFFFF/png?text=Premium" data-ai-hint="premium luxury sedan" />,
        capacity: 4, 
        eta: '4:43 PM',
        price: 71.68,
        originalPrice: null,
        description: 'Premium rides with professional drivers',
        isSurge: true,
    },
    { 
        id: 'vip',
        name: 'VIP', 
        icon: CarVIPicon,
        capacity: 4, 
        eta: '4:45 PM',
        price: 95.50,
        originalPrice: null,
        description: 'Luxury cars and top-rated drivers'
    },
    { 
        id: 'suv',
        name: 'SUV', 
        icon: CarSuvIcon,
        capacity: 6, 
        eta: '4:42 PM',
        price: 50.49,
        originalPrice: 55.00,
        description: 'Affordable rides for groups up to 6'
    },
    { 
        id: 'van',
        name: 'Van', 
        icon: VanIcon,
        capacity: 8, 
        eta: '4:48 PM',
        price: 68.75,
        originalPrice: null,
        description: 'For larger groups and luggage'
    },
    { 
        id: 'minibus',
        name: 'Minibus', 
        icon: MinibusIcon,
        capacity: 12, 
        eta: '4:52 PM',
        price: 85.00,
        originalPrice: null,
        description: 'Ideal for small corporate or family groups'
    },
    { 
        id: 'bus',
        name: 'Bus', 
        icon: BusIcon,
        capacity: 20, 
        eta: '4:55 PM',
        price: 120.00,
        originalPrice: null,
        description: 'Private bus for large events'
    },
];

export type RideOption = typeof rideOptions[0];

interface RideOptionCardProps {
  ride: RideOption;
  isSelected: boolean;
  onSelect: (rideId: string) => void;
}

export default function RideOptionCard({ ride, isSelected, onSelect }: RideOptionCardProps) {
  
  const cardClasses = cn(
    "hover:bg-muted cursor-pointer transition-colors duration-200 border-2",
    isSelected ? "bg-muted border-primary" : "bg-card border-transparent"
  );
  
  return (
    <Card 
        className={cardClasses} 
        onClick={() => onSelect(ride.id)}
    >
        <CardContent className="p-3 flex items-center gap-4 relative">
             {ride.isPopular && <PopularBadge />}
             {ride.isSurge && <SurgeBadge />}
             <div className="flex-shrink-0 w-[80px] h-[40px] flex items-center justify-center text-primary">
                <ride.icon />
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-base">{ride.name}</h4>
                 <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{ride.eta}</span>
                    <span className="mx-1">·</span>
                    <User className="h-3.5 w-3.5" />
                    <span>{ride.capacity}</span>
                </p>
            </div>
            <div className="text-right">
                <p className="font-bold text-base">${ride.price.toFixed(2)}</p>
                {ride.originalPrice && <p className="text-xs text-muted-foreground line-through">${ride.originalPrice.toFixed(2)}</p>}
            </div>
        </CardContent>
    </Card>
  );
}
