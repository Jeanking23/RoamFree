
import Image from 'next/image';
import { Map } from 'lucide-react';
import type { MockStay } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


interface PropertiesMapPlaceholderProps {
  rentals: MockStay[];
}

// Simple hash function to get a deterministic "random" position for a given ID
const pseudoRandomPosition = (id: string, max: number) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
};


export default function PropertiesMapPlaceholder({ rentals }: PropertiesMapPlaceholderProps) {
  return (
    <Card className="shadow-lg rounded-lg border overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-headline font-semibold text-primary flex items-center gap-2">
            <Map className="h-5 w-5" />
            Rentals Map View
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <Image 
          src="https://placehold.co/800x600.png" 
          alt="Map Placeholder showing rental locations" 
          width={800} 
          height={600} 
          className="object-cover w-full h-full"
          data-ai-hint="city map properties" 
        />
         {rentals.map((rental) => {
            const top = pseudoRandomPosition(rental.id + 'top', 85) + 5; // 5-90%
            const left = pseudoRandomPosition(rental.id + 'left', 85) + 5; // 5-90%

            return (
                <div key={rental.id} className="absolute" style={{ top: `${top}%`, left: `${left}%` }}>
                      <Link href={`/rent-home/${rental.id}`}>
                        <Badge
                            variant="default"
                            className="cursor-pointer text-sm font-bold shadow-lg hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
                            title={`${rental.name} - ${(rental.price ?? rental.pricePerNight).toLocaleString()}${rental.price ? '/month' : '/night'}`}
                        >
                            ${(rental.price ?? rental.pricePerNight).toLocaleString()}
                        </Badge>
                      </Link>
                </div>
            )
         })}
      </CardContent>
    </Card>
  );
}
