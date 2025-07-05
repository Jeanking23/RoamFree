// src/app/cars-for-sale/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, Search, DollarSign, Gauge, CalendarDays, Info, ShieldCheck, MessageCircle, GitCompareArrows, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const mockCarsForSale = [
  { id: "carSale1", name: "Well-Maintained Toyota Corolla 2018", price: 15000, location: "Cityville", mileage: "45,000 miles", year: 2018, image: "https://placehold.co/600x400.png?text=Toyota+Corolla", dataAiHint: "sedan toyota", vin: "DEMOVIN12345", historyHighlights: "No accidents, Regular service", sellerRating: 4.8 },
  { id: "carSale2", name: "Ford F-150 XLT 2020", price: 32000, location: "Suburbia", mileage: "30,000 miles", year: 2020, image: "https://placehold.co/600x400.png?text=Ford+F-150", dataAiHint: "pickup truck ford", vin: "DEMOVIN67890", historyHighlights: "One owner, Clean title", sellerRating: 4.5 },
  { id: "carSale3", name: "Honda Civic LX 2019", price: 17500, location: "Townsburd", mileage: "38,000 miles", year: 2019, image: "https://placehold.co/600x400.png?text=Honda+Civic", dataAiHint: "sedan honda", vin: "DEMOVIN11223", historyHighlights: "Fuel efficient, Great condition", sellerRating: 4.9 },
];

export default function CarsForSalePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);

  const handleMakeOffer = (carName: string) => {
    toast({ title: "Make Offer (Demo)", description: `Initiating offer process for ${carName}. You can negotiate price here.` });
  };
  const handleRequestTestDrive = (carName: string) => {
    toast({ title: "Test Drive Request (Demo)", description: `Scheduling test drive for ${carName}.` });
  };
  const handleViewCarHistory = (vin: string) => {
    toast({ title: "Car History (Demo)", description: `Displaying full vehicle history report for VIN: ${vin}. (Includes accidents, repairs, past owners)` });
  };
   const handleToggleCompare = (itemId: string) => {
    setSelectedToCompare(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCompareSelected = () => {
    if (selectedToCompare.length < 2) {
      toast({ title: "Select More Cars", description: "Please select at least two cars to compare.", variant: "destructive" });
      return;
    }
    toast({ title: "Compare Cars (Demo)", description: `Comparing ${selectedToCompare.length} cars. Showing specs, price, mileage side-by-side.` });
    console.log("Comparing cars:", selectedToCompare);
  };


  const filteredCars = mockCarsForSale.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <CarFront className="h-8 w-8" />
            Cars for Sale
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Browse and buy new or used cars. Verified sellers and secure transactions (Demo).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-grow">
                <Label htmlFor="search-cars">Search Cars</Label>
                <div className="relative">
                  <Input
                    id="search-cars"
                    type="text"
                    placeholder="e.g., Toyota Corolla, SUV in Cityville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
               <Button onClick={handleCompareSelected} disabled={selectedToCompare.length < 2} className="w-full sm:w-auto">
                  <GitCompareArrows className="mr-2 h-4 w-4" /> Compare Selected ({selectedToCompare.length})
                </Button>
            </div>
             {/* Add more filter options here: Make, Model, Price Range, Year, Mileage etc. (Placeholder) */}
             <p className="text-xs text-muted-foreground mt-2">Advanced filters for make, model, price, etc. coming soon.</p>
          </div>

          {filteredCars.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible no-scrollbar">
              {filteredCars.map(car => (
                <Card key={car.id} className="flex flex-col overflow-hidden w-[85vw] sm:w-[50vw] md:w-full flex-shrink-0">
                  <Link href={`/cars-for-sale/${car.id}`} className="block relative w-full h-48 group">
                    <Image src={car.image} alt={car.name} layout="fill" objectFit="cover" data-ai-hint={car.dataAiHint}/>
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Search className="h-10 w-10 text-white opacity-0 group-hover:opacity-75 transition-opacity" />
                    </div>
                  </Link>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl hover:text-primary">
                        <Link href={`/cars-for-sale/${car.id}`}>{car.name}</Link>
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-primary" /> ${car.price.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1 text-sm">
                    <p className="text-muted-foreground"><Gauge className="inline h-4 w-4 mr-1"/>Mileage: {car.mileage}</p>
                    <p className="text-muted-foreground"><CalendarDays className="inline h-4 w-4 mr-1"/>Year: {car.year}</p>
                    <p className="text-muted-foreground"><Info className="inline h-4 w-4 mr-1"/>VIN: {car.vin} (Demo)</p>
                    <p className="text-muted-foreground"><ShieldCheck className="inline h-4 w-4 mr-1 text-green-600"/>Seller Rating: {car.sellerRating}/5 (Demo)</p>
                    <p className="text-xs text-muted-foreground">{car.historyHighlights}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2 w-full justify-start">
                        <Checkbox
                            id={`compare-car-${car.id}`}
                            checked={selectedToCompare.includes(car.id)}
                            onCheckedChange={() => handleToggleCompare(car.id)}
                        />
                        <Label htmlFor={`compare-car-${car.id}`} className="font-normal text-sm">Compare</Label>
                    </div>
                    <Button variant="link" size="sm" onClick={() => handleViewCarHistory(car.vin)}>View Full Car History (Demo)</Button>
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleMakeOffer(car.name)}>
                         <DollarSign className="mr-2 h-4 w-4" /> Make Offer (Demo)
                        </Button>
                        <Button variant="outline" onClick={() => handleRequestTestDrive(car.name)}>
                         <CarFront className="mr-2 h-4 w-4" /> Test Drive (Demo)
                        </Button>
                    </div>
                    <Button variant="secondary" className="w-full" onClick={() => toast({title: "Chat with Seller (Demo)", description: "Opening secure chat..."})}>
                      <MessageCircle className="mr-2 h-4 w-4"/> Chat with Seller (Demo)
                    </Button>
                     <p className="text-xs text-muted-foreground text-center mt-1">Secure Escrow Payment Available (Demo)</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
              <p className="text-xl font-semibold text-foreground">No cars match your criteria.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search.</p>
            </div>
          )}
           <div className="mt-8 text-center">
            <Button variant="outline" asChild>
                <Link href="/dashboard"><Users className="mr-2 h-4 w-4"/> List Your Car for Sale (Demo)</Link>
            </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
