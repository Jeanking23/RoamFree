// src/app/transport/search/ride-option-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Shield, Users, User, Clock, ArrowLeft, Star, PawPrint } from 'lucide-react';
import React from 'react';

// Custom SVG Icons to match the image style
const CarStandardIcon = () => (
    <svg width="90" height="60" viewBox="0 0 100 60">
        <path d="M 85,30 A 15 15, 0, 0, 1, 70, 45 L 30, 45 A 15 15, 0, 0, 1, 15, 30 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 65, 5 A 10 10, 0, 0, 1, 75, 10 Z" fill="#E0E0E0"/>
        <path d="M 75, 10 L 65, 30 L 35, 30 L 25,10 Z" fill="#A455FF"/>
        <ellipse cx="30" cy="45" rx="8" ry="8" fill="#505050"/>
        <ellipse cx="70" cy="45" rx="8" ry="8" fill="#505050"/>
        <path d="M 73, 12 L 65, 28 L 35, 28 L 27, 12 Z" fill="#C77DFF" />
        <path d="M 28,15 L 36,28 L 45,28 L 40,15 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M 72,15 L 64,28 L 55,28 L 60,15 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M 84,29 A 14 14, 0, 0, 1, 70, 43 L 30, 43 A 14 14, 0, 0, 1, 16, 29 L 26,11 A 9 9, 0, 0, 1, 35, 7 L 65, 7 A 9 9, 0, 0, 1, 74, 11 Z" fill="none" stroke="#B0B0B0" stroke-width="1"/>
    </svg>
);
const CarBlackIcon = () => (
     <svg width="90" height="60" viewBox="0 0 100 60">
        <path d="M 85,30 A 15 15, 0, 0, 1, 70, 45 L 30, 45 A 15 15, 0, 0, 1, 15, 30 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 65, 5 A 10 10, 0, 0, 1, 75, 10 Z" fill="#333333"/>
        <path d="M 75, 10 L 65, 30 L 35, 30 L 25,10 Z" fill="#111111"/>
        <ellipse cx="30" cy="45" rx="8" ry="8" fill="#222222"/>
        <ellipse cx="70" cy="45" rx="8" ry="8" fill="#222222"/>
        <path d="M 73, 12 L 65, 28 L 35, 28 L 27, 12 Z" fill="#222222" />
        <path d="M 28,15 L 36,28 L 45,28 L 40,15 Z" fill="#555555" opacity="0.8" />
        <path d="M 72,15 L 64,28 L 55,28 L 60,15 Z" fill="#555555" opacity="0.8" />
        <path d="M 84,29 A 14 14, 0, 0, 1, 70, 43 L 30, 43 A 14 14, 0, 0, 1, 16, 29 L 26,11 A 9 9, 0, 0, 1, 35, 7 L 65, 7 A 9 9, 0, 0, 1, 74, 11 Z" fill="none" stroke="#444444" stroke-width="1"/>
    </svg>
);
const CarSuvIcon = () => (
    <svg width="90" height="60" viewBox="0 0 100 60">
        <path d="M 90,35 A 15 15, 0, 0, 1, 75, 50 L 25, 50 A 15 15, 0, 0, 1, 10, 35 L 15,20 L 25,10 A 10 10, 0, 0, 1, 35, 5 L 75, 5 A 10 10, 0, 0, 1, 85, 10 L 90,30 Z" fill="#333333"/>
        <path d="M 85, 10 L 75, 35 L 50, 35 L 45,10 Z" fill="#111111"/>
        <path d="M 45,10 L 25, 35 L 20, 35 L 25, 10 Z" fill="#111111"/>
        <ellipse cx="30" cy="50" rx="8" ry="8" fill="#222222"/>
        <ellipse cx="75" cy="50" rx="8" ry="8" fill="#222222"/>
        <path d="M 83, 12 L 75, 33 L 50, 33 L 47, 12 Z" fill="#222222" />
        <path d="M 45, 12 L 27, 33 L 22, 33 L 27, 12 Z" fill="#222222" />
        <path d="M 48,15 L 50,33 L 60,33 L 58,15 Z" fill="#555555" opacity="0.8" />
        <path d="M 82,15 L 74,33 L 64,33 L 68,15 Z" fill="#555555" opacity="0.8" />
    </svg>
);
const MotorbikeIcon = () => (
    <svg width="90" height="60" viewBox="0 0 100 60">
        <path d="M 75,48 A 10 10, 0, 1, 1, 75, 47" fill="none" stroke="#A0A0A0" strokeWidth="6" />
        <path d="M 25,48 A 10 10, 0, 1, 1, 25, 47" fill="none" stroke="#A0A0A0" strokeWidth="6" />
        <path d="M 25,48 L 35,30 L 45,30 L 60,35 L 75,48" fill="none" stroke="#A0A0A0" strokeWidth="6" />
        <path d="M 40,30 L 50,15 L 60,15" fill="none" stroke="#A0A0A0" strokeWidth="6" />
        <path d="M 25,48 L 75,48" fill="none" stroke="#A0A0A0" strokeWidth="4" />
        <path d="M 25,48 A 10 10, 0, 1, 1, 75, 48" fill="none" />
        <path d="M 38,28 L 42,22 L 55,22 L 52,28 Z" fill="#A455FF" />
        <path d="M 25,48 A 10 10, 0, 1, 1, 25, 47" fill="#505050" />
        <path d="M 75,48 A 10 10, 0, 1, 1, 75, 47" fill="#505050" />
        <path d="M 25,48 A 10 10, 0, 1, 1, 75, 48" fill="none" />
        <path d="M 30,45 L 70,45" fill="none" stroke="#808080" strokeWidth="4" />
    </svg>
);


const ClockIcon = () => (
  <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground rounded-full p-0.5">
    <Clock className="h-3 w-3" />
  </div>
);
const SparklesIcon = () => (
    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground rounded-full p-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3zM20 3L19 5M5 3L4 5"/></svg>
    </div>
);
const PetIcon = () => (
    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground rounded-full p-1">
       <PawPrint className="h-4 w-4"/>
    </div>
);


export const rideOptions = [
    { 
        id: 'standard',
        name: 'Standard', 
        icon: CarStandardIcon,
        capacity: 4, 
        eta: 'in 6 min', 
        arrivalTime: '4:39 PM',
        price: 32.84,
        description: ''
    },
    { 
        id: 'wait_save',
        name: 'Wait & Save', 
        icon: CarStandardIcon,
        specialIcon: ClockIcon,
        capacity: 4, 
        eta: 'within 15 min',
        arrivalTime: '4:39–4:48 PM',
        price: 27.89,
        description: ''
    },
    { 
        id: 'comfort',
        name: 'Extra Comfort', 
        icon: CarStandardIcon,
        specialIcon: SparklesIcon,
        capacity: 4, 
        eta: 'in 5 min', 
        arrivalTime: '4:38 PM',
        price: 39.53,
        description: 'Roomier, cleaner & newer'
    },
    { 
        id: 'moto',
        name: 'Moto',
        icon: MotorbikeIcon,
        capacity: 1,
        eta: 'in 3 min',
        arrivalTime: '4:36 PM',
        price: 15.50,
        description: 'Quickest way there'
    },
    { 
        id: 'xl',
        name: 'XL', 
        icon: CarSuvIcon,
        capacity: 6, 
        eta: 'in 9 min', 
        arrivalTime: '4:42 PM',
        price: 50.49,
        description: 'Fits up to 6'
    },
    { 
        id: 'black',
        name: 'Black', 
        icon: CarBlackIcon,
        capacity: 4, 
        eta: 'in 10 min', 
        arrivalTime: '4:43 PM',
        price: 71.68,
        description: 'VIP style'
    },
    { 
        id: 'black_suv',
        name: 'Black SUV', 
        icon: CarSuvIcon,
        capacity: 6, 
        eta: 'in 16 min', 
        arrivalTime: '4:49 PM',
        price: 89.13,
        description: 'VIP style for up to 6'
    },
    { 
        id: 'pet',
        name: 'Pet', 
        icon: CarStandardIcon,
        specialIcon: PetIcon,
        capacity: 4, 
        eta: 'in 6 min', 
        arrivalTime: '4:39 PM',
        price: 36.68,
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
    "hover:shadow-md cursor-pointer transition-all duration-200 border-2",
    isSelected ? "border-primary bg-primary/5" : "bg-card border-transparent"
  );
  
  const content = (
    <>
      <div className="relative w-[90px] h-[60px] flex-shrink-0">
        <ride.icon />
        {ride.specialIcon && <ride.specialIcon />}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg">{ride.name}</h4>
            <span className="text-sm text-muted-foreground flex items-center gap-1"><User/>{ride.capacity}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {ride.description ? `${ride.description} \u00B7 ${ride.eta}` : ride.eta}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">${ride.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">{ride.arrivalTime}</p>
      </div>
    </>
  );

  return (
    <Card 
        className={cardClasses} 
        onClick={() => onSelect(ride.id)}
    >
        <CardContent className={cn("p-3 flex items-center gap-4", isSelected ? "py-5" : "")}>
            {isSelected ? (
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-4">
                        {content}
                    </div>
                </div>
            ) : (
                content
            )}
        </CardContent>
    </Card>
  );
}
