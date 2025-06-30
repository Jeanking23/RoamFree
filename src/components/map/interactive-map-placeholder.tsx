import Image from 'next/image';
import { Map } from 'lucide-react';

export default function InteractiveMapPlaceholder() {
  return (
    <div className="bg-card shadow-lg rounded-lg border overflow-hidden h-full">
      <div className="p-6">
        <h3 className="text-xl font-headline font-semibold text-primary flex items-center gap-2">
          <Map className="h-6 w-6" />
          Interactive Map
        </h3>
        <p className="text-muted-foreground mt-2">
          Enter pickup and dropoff locations to see the route.
        </p>
      </div>
      <div className="aspect-video bg-muted flex items-center justify-center flex-grow">
        <Image 
          src="https://placehold.co/800x450.png" 
          alt="Map Placeholder" 
          width={800} 
          height={450} 
          className="object-cover w-full h-full"
          data-ai-hint="world map" 
        />
      </div>
    </div>
  );
}
