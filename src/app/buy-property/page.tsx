import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react'; // Using ClipboardList as per header

export default function BuyPropertyPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <ClipboardList className="h-8 w-8" />
            Buy Land or House
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground">
            Find properties for sale, including land and houses. Invest in your future.
          </p>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">Property listings are coming soon!</p>
            <p className="text-muted-foreground mt-2">Discover your dream property shortly.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
