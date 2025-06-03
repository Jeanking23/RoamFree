import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

export default function CarRentPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <KeyRound className="h-8 w-8" />
            Rent a Car
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground">
            Explore a wide range of rental cars to suit your travel needs. Easy booking and great prices.
          </p>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">Car rental services are being tuned up!</p>
            <p className="text-muted-foreground mt-2">Soon you'll be able to find the perfect ride.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
