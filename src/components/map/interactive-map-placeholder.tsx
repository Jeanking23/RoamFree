import Image from 'next/image';
import { Map, MapPin } from 'lucide-react';

interface InteractiveMapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
}

export default function InteractiveMapPlaceholder({ pickup, dropoff }: InteractiveMapPlaceholderProps) {
  return (
    <div className="bg-card shadow-lg rounded-lg border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-headline font-semibold text-primary flex items-center gap-2">
          <Map className="h-5 w-5" />
          Live Route
        </h3>
        {pickup && dropoff ? (
          <div className="text-xs text-muted-foreground mt-1">
            <p>From: <strong>{pickup}</strong></p>
            <p>To: <strong>{dropoff}</strong></p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Enter pickup and dropoff to see the route.
          </p>
        )}
      </div>
      <div className="flex-grow bg-muted flex items-center justify-center relative">
        <Image 
          src="https://placehold.co/800x600.png" 
          alt="Map Placeholder with a route from one point to another" 
          width={800} 
          height={600} 
          className="object-cover w-full h-full"
          data-ai-hint="city map route" 
        />
         <div className="absolute top-1/4 left-1/4 text-primary">
            <MapPin className="h-8 w-8" fill="currentColor" />
         </div>
         <div className="absolute bottom-1/4 right-1/4 text-destructive">
            <MapPin className="h-8 w-8" fill="currentColor"/>
         </div>
      </div>
    </div>
  );
}
