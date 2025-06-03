import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';

export default function RentHomePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Home className="h-8 w-8" />
            Rent a Home
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground">
            Browse long-term and short-term home rentals. Find your perfect home away from home.
          </p>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">Home rental listings are being prepared!</p>
            <p className="text-muted-foreground mt-2">Your next stay is just around the corner.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
