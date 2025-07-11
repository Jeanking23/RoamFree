// src/app/transport/search/ride-option-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Car, Bike, Shield, Users, User, Clock, ArrowLeft, Star, CarFront, PawPrint } from 'lucide-react';

export const MotorcycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 14h1"/><path d="M18 14h1"/><path d="m18 19-3-3 1-2h-5l1 2-3 3"/><path d="m14 14-2-3-2 3"/><path d="M8 10h8"/><path d="M5.5 10.5C4 11 3 13 3 14a2 2 0 0 0 2 2h.5"/><path d="M18.5 10.5c1.5.5 2.5 2.5 2.5 3.5a2 2 0 0 1-2 2h-.5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
    </svg>
);

export const rideOptions = [
    { 
        id: 'uberx',
        name: 'RoamFree Standard', 
        icon: Car,
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:02 PM',
        price: 23.15,
        originalPrice: 28.94,
        tags: ['20% off', 'Popular'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'white sedan',
        description: 'Affordable, everyday rides'
    },
    { 
        id: 'share',
        name: 'RoamFree Share', 
        icon: Users,
        capacity: 1, 
        eta: '5 mins away', 
        arrivalTime: '12:03 PM',
        price: 20.06,
        originalPrice: 25.07,
        tags: ['20% off', 'Eco-friendly'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'electric car',
        description: 'Walk up to 3 min, one seat only'
    },
    { 
        id: 'uberxl',
        name: 'RoamFree XL', 
        icon: CarFront,
        capacity: 6, 
        eta: '9 mins away', 
        arrivalTime: '12:06 PM',
        price: 32.77,
        originalPrice: 40.96,
        tags: ['20% off'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'minivan luggage',
        description: 'Affordable rides for groups up to 6'
    },
    { 
        id: 'comfort',
        name: 'RoamFree Comfort', 
        icon: Star,
        capacity: 4, 
        eta: '4 mins away', 
        arrivalTime: '12:05 PM',
        price: 29.83,
        originalPrice: 37.29,
        tags: ['Top-rated drivers'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'luxury sedan',
        description: 'Newer cars with extra legroom'
    },
     { 
        id: 'bike',
        name: 'RoamFree Moto', 
        icon: MotorcycleIcon,
        capacity: 1, 
        eta: '2 mins away', 
        arrivalTime: '12:00 PM',
        price: 15.50,
        originalPrice: 18.00,
        tags: ['Quickest'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'scooter transport',
        description: 'Get there faster on a motorbike'
    },
    { 
        id: 'pet',
        name: 'RoamFree Pet', 
        icon: PawPrint,
        capacity: 4, 
        eta: '6 mins away', 
        arrivalTime: '12:02 PM',
        price: 26.35,
        originalPrice: 32.94,
        tags: ['Pet-friendly'],
        image: 'https://placehold.co/100x60.png',
        dataAiHint: 'sedan dog',
        description: 'For you and your furry friend'
    },
];


interface RideOptionCardProps {
  ride: typeof rideOptions[0];
  isSelected: boolean;
  onSelect: (rideId: string) => void;
}

export default function RideOptionCard({ ride, isSelected, onSelect }: RideOptionCardProps) {
  return (
    <Card 
        className={cn(
            "hover:shadow-md cursor-pointer transition-all duration-200 border-2",
            isSelected ? "border-primary bg-primary/5" : "bg-card"
        )} 
        onClick={() => onSelect(ride.id)}
    >
        <CardContent className="p-3">
            <div className="flex items-center gap-4">
                <Image src={ride.image} alt={ride.name} width={80} height={50} className="object-contain rounded-md bg-muted/50" data-ai-hint={ride.dataAiHint}/>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base flex items-center gap-2">
                            <ride.icon className="h-5 w-5 text-primary" />
                            {ride.name}
                        </h4>
                        <p className="font-semibold text-lg text-primary">${ride.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3"/>{ride.capacity}</span>
                            <span>{ride.arrivalTime} dropoff</span>
                        </p>
                        {ride.originalPrice && <p className="text-sm text-muted-foreground line-through">${ride.originalPrice.toFixed(2)}</p>}
                    </div>
                    <div className="flex gap-1 mt-1">
                        {ride.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className={cn(
                                'text-xs px-1.5 py-0.5 font-semibold',
                                tag.includes('off') && 'bg-green-600/20 text-green-300 border-green-600/30',
                                tag === 'Popular' && 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
                                tag === 'Quickest' && 'bg-purple-600/20 text-purple-300 border-purple-600/30'
                            )}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
