import Image from 'next/image';
import { Map } from 'lucide-react';

export default function InteractiveMapPlaceholder() {
  return (
    <div className="bg-card shadow-lg rounded-lg border overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-headline font-semibold text-primary flex items-center gap-2">
          <Map className="h-6 w-6" />
          Interactive Map
        </h3>
        <p className="text-muted-foreground mt-2">
          Discover accommodations, transport options, and points of interest in real-time.
        </p>
      </div>
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Image 
          src="https://placehold.co/800x450.png" 
          alt="Map Placeholder" 
          width={800} 
          height={450} 
          className="object-cover w-full h-full"
          data-ai-hint="world map" 
        />
      </div>
       <div className="p-6 text-center">
        <p className="text-foreground">Map functionality coming soon!</p>
      </div>
    </div>
  );
}
