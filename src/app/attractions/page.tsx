import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

export default function AttractionsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Landmark className="h-8 w-8" />
            Discover Attractions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground">
            Find tickets for tours, activities, and must-see local attractions. Make your trip unforgettable.
          </p>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">Attraction booking is on its way!</p>
            <p className="text-muted-foreground mt-2">Get ready to explore.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
