import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

export default function TransportPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Car className="h-8 w-8" />
            Book Your Transport
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground">
            Find and book flights, trains, buses, and airport taxis. All your travel connections in one place.
          </p>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">Transport booking features are coming soon!</p>
            <p className="text-muted-foreground mt-2">Check back later for updates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
