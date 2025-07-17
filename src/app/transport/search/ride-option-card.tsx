// src/app/transport/search/ride-option-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, Clock, Star, PawPrint, TrendingUp } from 'lucide-react';

// Simplified Ride Icons for a cleaner look
const CarStandardIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50" className="opacity-80">
        <path d="M 85,25 A 15 15, 0, 0, 1, 70, 40 L 30, 40 A 15 15, 0, 0, 1, 15, 25 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 65, 5 A 10 10, 0, 0, 1, 75, 10 Z" fill="currentColor"/>
        <path d="M 75, 10 L 65, 25 L 35, 25 L 25,10 Z" fill="hsl(var(--background))" opacity="0.3"/>
    </svg>
);
const CarBlackIcon = () => (
     <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 85,25 A 15 15, 0, 0, 1, 70, 40 L 30, 40 A 15 15, 0, 0, 1, 15, 25 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 65, 5 A 10 10, 0, 0, 1, 75, 10 Z" fill="currentColor"/>
        <path d="M 75, 10 L 65, 25 L 35, 25 L 25,10 Z" fill="hsl(var(--background))" opacity="0.3"/>
    </svg>
);
const CarSuvIcon = () => (
    <svg width="80" height="40" viewBox="0 0 100 50">
        <path d="M 90,30 A 15 15, 0, 0, 1, 75, 45 L 25, 45 A 15 15, 0, 0, 1, 10, 30 L 15,20 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 75, 5 A 10 10, 0, 0, 1, 85, 10 L 90,25 Z" fill="currentColor"/>
        <path d="M 85, 10 L 75, 30 L 50, 30 L 45,10 Z" fill="hsl(var(--background))" opacity="0.3"/>
        <path d="M 45,10 L 25, 30 L 20, 30 L 25, 10 Z" fill="hsl(var(--background))" opacity="0.3"/>
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
    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
        <Star className="h-3 w-3" /> Popular
    </div>
);
const SurgeBadge = () => (
    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> Higher demand
    </div>
);


export const rideOptions = [
    { 
        id: 'standard',
        name: 'Standard', 
        icon: CarStandardIcon,
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
        icon: CarStandardIcon,
        capacity: 4, 
        eta: '4:38 PM', 
        price: 39.53,
        originalPrice: 42.10,
        description: 'Newer cars with extra legroom'
    },
    { 
        id: 'moto',
        name: 'Moto',
        icon: MotorbikeIcon,
        capacity: 1,
        eta: '4:36 PM',
        price: 15.50,
        originalPrice: null,
        description: 'Quickest way there'
    },
    { 
        id: 'xl',
        name: 'XL', 
        icon: CarSuvIcon,
        capacity: 6, 
        eta: '4:42 PM',
        price: 50.49,
        originalPrice: 55.00,
        description: 'Affordable rides for groups up to 6'
    },
    { 
        id: 'black',
        name: 'Black', 
        icon: CarBlackIcon,
        capacity: 4, 
        eta: '4:43 PM',
        price: 71.68,
        originalPrice: null,
        description: 'Premium rides with professional drivers',
        isSurge: true,
    },
    { 
        id: 'black_suv',
        name: 'Black SUV', 
        icon: CarSuvIcon,
        capacity: 6, 
        eta: '4:49 PM',
        price: 89.13,
        originalPrice: null,
        description: 'Premium rides for groups up to 6',
        isSurge: true,
    },
    { 
        id: 'pet',
        name: 'Pet', 
        icon: CarStandardIcon,
        capacity: 4, 
        eta: '4:39 PM',
        price: 36.68,
        originalPrice: null,
        description: 'Ride with your furry friend'
    },
];

interface RideOptionCardProps {
  ride: typeof rideOptions[0];
  isSelected: boolean;
  onSelect: (rideId: string) => void;
}

export default function RideOptionCard({ ride, isSelected, onSelect }: RideOptionCardProps) {
  
  const cardClasses = cn(
    "hover:bg-muted cursor-pointer transition-colors duration-200 border",
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
