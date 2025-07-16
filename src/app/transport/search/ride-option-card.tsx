// src/app/transport/search/ride-option-card.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Shield, Users, User, Clock, ArrowLeft, Star, PawPrint } from 'lucide-react';

export const MotorcycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18.9,3.1c-0.6-0.3-1.3-0.1-1.7,0.4l-3.3,4.1H8.1l-3.3-4.1C4.4,2.9,3.7,2.8,3.1,3.1C2.5,3.4,2.3,4.1,2.6,4.7l3.7,4.7v5.8c0,0.5,0.4,1,1,1h1.5c0.5,0,1-0.4,1-1v-2.1h2.5v2.1c0,0.5,0.4,1,1,1H15c0.5,0,1-0.4,1-1v-5.8l3.7-4.7C20.2,4.1,19.5,3.4,18.9,3.1z M8.9,7.3h6.2L12,3.9L8.9,7.3z M7,21.8c-1.5,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S8.5,21.8,7,21.8z M17,21.8c-1.5,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S18.5,21.8,17,21.8z"/>
    </svg>
);

const Car = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.7-2.4-1-3.6c-.2-.7-.8-1.1-1.5-1.1h-14c-.7 0-1.3.5-1.5 1.1l-1 3.6c-.1.2-.1.5 0 .7.1.3.4.5.7.5h1.3c.5 0 .9-.3 1.1-.7l.9-3.2h11l.9 3.2c.2.4.6.7 1.1.7h1.3c.3 0 .6-.2.7-.5.1-.2.1-.5 0-.7zM4.3 9.4l.6-2.1h14.2l.6 2.1H4.3zM2.8 20.3c-.6.2-1 .7-1 1.3v1.6c0 .5.4.9.9.9h.9c.4 0 .8-.4.9-.8l.4-1.6H5c.4 0 .7-.3.8-.7l.6-2.2h-3c-.4 0-.7.3-.8.7l-.3 1.1zM21.2 20.3c-.1-.4-.4-.7-.8-.7h-3l.6 2.2c.1.4.4.7.8.7h.6l.4 1.6c.1.4.5.8.9.8h.9c.5 0 .9-.4.9-.9v-1.6c0-.6-.4-1.1-1-1.3zM4.9 14.1h14.2c.5 0 .9-.4.9-.9V9.6c0-.5-.4-.9-.9-.9H4.9c-.5 0-.9.4-.9.9v3.6c0 .5.4.9.9.9z"/>
    </svg>
);

const CarFront = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19,17h2c0.6,0,1-0.4,1-1v-3c0-0.9-0.7-1.7-1.5-1.9C18.7,10.6,16,10,16,10s-1.3-1.4-2.2-2.3c-0.5-0.4-1.1-0.7-1.8-0.7H5c-0.6,0-1.1,0.4-1.4,0.9l-1.4,2.9C2.1,11.5,2,11.7,2,12v4c0,0.6,0.4,1,1,1h2"/><path d="M12,10V7h1.8c0.4,0,0.9,0.1,1.2,0.3"/><path d="M5,10h1"/><circle cx="7" cy="17" r="2"/><path d="M9,17h6"/><circle cx="17" cy="17" r="2"/>
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
