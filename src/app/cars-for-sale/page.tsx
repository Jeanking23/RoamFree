// src/app/cars-for-sale/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, Search, DollarSign, Gauge, CalendarDays, Info, ShieldCheck, MessageCircle, GitCompareArrows, Users, ChevronLeft, ChevronRight, SlidersHorizontal, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const mockCarsForSale = [
  { id: "carSale1", name: "Well-Maintained Toyota Corolla 2018", price: 15000, location: "Cityville", mileage: "45,000 miles", year: 2018, image: "https://images.unsplash.com/photo-1648197295778-433b7bed847d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMHRveW90YXxlbnwwfHx8fDE3NTUwMjMyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "sedan toyota", vin: "DEMOVIN12345", historyHighlights: "No accidents, Regular service", sellerRating: 4.8, photos: [{id: 'p1', src: "https://images.unsplash.com/photo-1648197295778-433b7bed847d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMHRveW90YXxlbnwwfHx8fDE3NTUwMjMyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "sedan toyota"}, {id: 'p2', src: "https://images.unsplash.com/photo-1754471174693-e535c8ebcad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzZWRhbiUyMHNpZGV8ZW58MHx8fHwxNzU1MDIzMzYwfDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "sedan side"}] },
  { id: "carSale2", name: "Ford F-150 XLT 2020", price: 32000, location: "Suburbia", mileage: "30,000 miles", year: 2020, image: "https://images.unsplash.com/photo-1624339024061-b435d9261c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwaWNrdXAlMjB0cnVja3xlbnwwfHx8fDE3NTUwMjMzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "pickup truck", vin: "DEMOVIN67890", historyHighlights: "One owner, Clean title", sellerRating: 4.5, photos: [{id: 'p1', src: "https://images.unsplash.com/photo-1624339024061-b435d9261c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwaWNrdXAlMjB0cnVja3xlbnwwfHx8fDE3NTUwMjMzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "pickup truck"}, {id: 'p2', src: "https://images.unsplash.com/photo-1656110073986-ccf23039e402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8dHJ1Y2slMjBiZWR8ZW58MHx8fHwxNzU1MDIzMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "truck bed"}] },
  { id: "carSale3", name: "Honda Civic LX 2019", price: 17500, location: "Townsburd", mileage: "38,000 miles", year: 2019, image: "https://images.unsplash.com/photo-1742230376664-ce990c7d7bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzZWRhbiUyMGhvbmRhfGVufDB8fHx8MTc1NTAyMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "sedan honda", vin: "DEMOVIN11223", historyHighlights: "Fuel efficient, Great condition", sellerRating: 4.9, photos: [{id: 'p1', src: "https://images.unsplash.com/photo-1742230376664-ce990c7d7bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzZWRhbiUyMGhvbmRhfGVufDB8fHx8MTc1NTAyMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "sedan honda"}, {id: 'p2', src: "https://images.unsplash.com/photo-1549064233-945d7063292f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NTUwMjMzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint: "car interior"}] },
];

function CarImageSlider({ car }: { car: typeof mockCarsForSale[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % car.photos.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + car.photos.length) % car.photos.length);
  };

  return (
    <div className="relative w-full h-48 group">
      <Link href={`/cars-for-sale/${car.id}`} className="block w-full h-full">
        <Image 
          src={car.photos[currentIndex].src} 
          alt={car.name} 
          fill 
          className="object-cover" 
          data-ai-hint={car.photos[currentIndex].dataAiHint}
        />
      </Link>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <Search className="h-10 w-10 text-white opacity-0 group-hover:opacity-75 transition-opacity" />
      </div>
       {car.photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 hover:bg-background/80"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 hover:bg-background/80"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}

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
    console.log("Comparing items:", selectedToCompare);
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
          <div className="mb-8 p-4 border rounded-lg bg-muted/30">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="mb-4 bg-transparent p-0 h-auto">
                <TabsTrigger value="search" className="text-base data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 py-2"><Search className="mr-2 h-4 w-4"/>Search</TabsTrigger>
                <TabsTrigger value="sell_trade" onClick={() => toast({title: "Feature Coming Soon"})} className="text-base data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 py-2">Sell/Trade</TabsTrigger>
                <TabsTrigger value="financing" onClick={() => toast({title: "Feature Coming Soon"})} className="text-base data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 py-2">Financing</TabsTrigger>
              </TabsList>
              <TabsContent value="search" className="space-y-4">
                <h4 className="font-semibold text-foreground">USED CARS IN YOUR AREA</h4>
                <div className="flex flex-row gap-2 items-center">
                  <div className="relative flex-grow">
                    <Input
                      id="search-cars"
                      type="text"
                      placeholder="Search Make, Model, or Keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 h-10 rounded-full pl-10"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="h-10 rounded-full text-sm shrink-0">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast({title: "Filter by Price (Demo)"})} className="rounded-full">Price Range &gt;</Button>
                  <Button variant="outline" size="sm" onClick={() => toast({title: "Filter by Make/Model (Demo)"})} className="rounded-full">Make/Model &gt;</Button>
                  <Button variant="outline" size="sm" onClick={() => toast({title: "Filter by Body Type (Demo)"})} className="rounded-full">Body Type &gt;</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Separator />

          <div className="my-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1 order-2 sm:order-1">
                <p className="text-sm text-muted-foreground font-medium">{filteredCars.length} cars found</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap order-1 sm:order-2">
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4"/>
                  <span>Your Location (Demo)</span>
                </div>
                <Select defaultValue="best_match">
                    <SelectTrigger className="w-[180px] h-9 text-sm">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="best_match">Sort: Best Match</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="ghost" size="sm" onClick={() => toast({title: "Saved!"})}><Heart className="mr-2 h-4 w-4"/>Save</Button>
              </div>
            </div>
            
             <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full">Third Row Seat</Button>
                <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full">Under $25,000</Button>
                <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full">SUVs</Button>
            </div>
          </div>


          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <Card key={car.id} className="flex flex-col overflow-hidden">
                  <CarImageSlider car={car} />
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
                  <CardFooter className="flex flex-col gap-3 p-4">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`compare-car-${car.id}`}
                                checked={selectedToCompare.includes(car.id)}
                                onCheckedChange={() => handleToggleCompare(car.id)}
                            />
                            <Label htmlFor={`compare-car-${car.id}`} className="font-normal text-sm">Compare</Label>
                        </div>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleViewCarHistory(car.vin)}>
                            View History
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <Button variant="accent" size="default" className="w-full" onClick={() => handleMakeOffer(car.name)}>
                         <DollarSign className="mr-2 h-4 w-4" /> Make Offer
                        </Button>
                        <Button variant="outline" size="default" className="w-full" onClick={() => handleRequestTestDrive(car.name)}>
                         <CarFront className="mr-2 h-4 w-4" /> Test Drive
                        </Button>
                    </div>
                    <Button variant="secondary" className="w-full" onClick={() => toast({title: "Chat with Seller (Demo)", description: "Opening secure chat..."})}>
                      <MessageCircle className="mr-2 h-4 w-4"/> Chat with Seller
                    </Button>
                     <p className="text-xs text-muted-foreground text-center pt-1">Secure Escrow Payment Available</p>
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
