// src/app/cars-for-sale/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, Search, DollarSign, Gauge, CalendarDays, Info, ShieldCheck, MessageCircle, GitCompareArrows, Users, ChevronLeft, ChevronRight, SlidersHorizontal, MapPin, Heart, Filter, X, Building, List, Map as MapIcon, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { mockCarsForSale } from '@/lib/mock-data';

const sellCarSchema = z.object({
  vin: z.string().length(17, "VIN must be 17 characters."),
  make: z.string().min(2, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  mileage: z.coerce.number().min(0, "Mileage must be positive."),
});
type SellCarFormValues = z.infer<typeof sellCarSchema>;

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

const carMakesAndModels = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'],
  'Ford': ['F-150', 'Explorer', 'Mustang', 'Escape', 'Bronco'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Traverse'],
  'Nissan': ['Altima', 'Rogue', 'Sentra', 'Titan', 'Frontier'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe'],
  'Kia': ['Forte', 'Optima', 'Sorento', 'Telluride'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
};

const FilterContent = () => {
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);

    const toggleMake = (make: string) => {
        setSelectedMakes(prev => 
            prev.includes(make) ? prev.filter(m => m !== make) : [...prev, make]
        );
    };

    return (
    <div className="space-y-4">
        <Accordion type="multiple" defaultValue={['payment_price', 'make_model', 'body_type']} className="w-full">
            <AccordionItem value="payment_price">
                <AccordionTrigger>Payment & Price</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Price Range</Label>
                        <div className="flex gap-2">
                            <Input type="number" placeholder="Min" />
                            <Input type="number" placeholder="Max" />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="make_model">
                <AccordionTrigger>Make & Model</AccordionTrigger>
                <AccordionContent className="space-y-2">
                    <Input placeholder="Search Make..." />
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                        {Object.keys(carMakesAndModels).map(make => (
                            <div key={make}>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={`make-${make}`} onCheckedChange={() => toggleMake(make)} />
                                    <Label htmlFor={`make-${make}`} className="font-medium">{make}</Label>
                                </div>
                                {selectedMakes.includes(make) && (
                                    <div className="pl-6 pt-2 space-y-1">
                                        {(carMakesAndModels[make as keyof typeof carMakesAndModels]).map(model => (
                                            <div key={model} className="flex items-center space-x-2">
                                                <Checkbox id={`model-${make}-${model}`} />
                                                <Label htmlFor={`model-${make}-${model}`} className="font-normal">{model}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="body_type">
                <AccordionTrigger>Body Type</AccordionTrigger>
                <AccordionContent className="space-y-2">
                    {['SUV', 'Sedan', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van'].map(type => (
                        <div key={type} className="flex items-center space-x-2"><Checkbox id={`body-${type}`} /><Label htmlFor={`body-${type}`}>{type}</Label></div>
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="year_mileage">
                <AccordionTrigger>Year & Mileage</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <div className="space-y-2"><Label>Year</Label><div className="flex gap-2"><Select><SelectTrigger><SelectValue placeholder="Min"/></SelectTrigger></Select><Select><SelectTrigger><SelectValue placeholder="Max"/></SelectTrigger></Select></div></div>
                    <div className="space-y-2"><Label>Mileage</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="great_deals">
                <AccordionTrigger>Great Deals</AccordionTrigger>
                <AccordionContent className="space-y-2">
                    <div className="flex items-center space-x-2"><Checkbox id="deals-price"/><Label htmlFor="deals-price">Good/Great Price</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="deals-specials"/><Label htmlFor="deals-specials">Dealer Specials</Label></div>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="fuel_type">
                <AccordionTrigger>Fuel Type & MPG</AccordionTrigger>
                <AccordionContent className="space-y-4">
                     <div className="space-y-2"><Label>Fuel Type</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                     <div className="space-y-2"><Label>MPG (City/Hwy)</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="features">
                <AccordionTrigger>Features & Colors</AccordionTrigger>
                <AccordionContent className="space-y-4">
                     <div className="space-y-2"><Label>Features</Label><Input placeholder="e.g., Sunroof, AWD"/></div>
                     <div className="space-y-2"><Label>Exterior Color</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                     <div className="space-y-2"><Label>Interior Color</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
                <AccordionTrigger>Seating, Drivetrain & More</AccordionTrigger>
                <AccordionContent className="space-y-4">
                     <div className="space-y-2"><Label>Seating Capacity</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                     <div className="space-y-2"><Label>Drivetrain</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                     <div className="space-y-2"><Label>Transmission</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                     <div className="space-y-2"><Label>Cylinders</Label><Select><SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger></Select></div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
    );
};

export default function CarsForSalePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [offerValue, setOfferValue] = useState<number | null>(null);
  const [isOfferLoading, setIsOfferLoading] = useState(false);

  const sellCarForm = useForm<SellCarFormValues>({
    resolver: zodResolver(sellCarSchema),
  });

  const handleGetOffer = async (values: SellCarFormValues) => {
    setIsOfferLoading(true);
    setOfferValue(null);
    console.log("Getting offer for:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const basePrice = 20000;
    const yearFactor = (values.year - 2018) * 1000;
    const mileageFactor = values.mileage * -0.1;
    const randomFactor = (Math.random() - 0.5) * 2000;
    const calculatedOffer = basePrice + yearFactor + mileageFactor + randomFactor;
    setOfferValue(Math.max(500, Math.round(calculatedOffer / 100) * 100)); // Round to nearest 100
    setIsOfferLoading(false);
  };


  const handleMakeOffer = (carName: string) => {
    toast({ title: "Make Offer (Demo)", description: `Initiating offer process for ${carName}. You can negotiate price here.` });
  };
  const handleRequestTestDrive = (carName: string) => {
    toast({ title: "Test Drive Request (Demo)", description: `Scheduling test drive for ${carName}.` });
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
                <TabsTrigger value="sell_trade" className="text-base data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 py-2">Sell/Trade</TabsTrigger>
                <TabsTrigger value="financing" onClick={() => toast({title: "Feature Coming Soon"})} className="text-base data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 py-2">Financing</TabsTrigger>
              </TabsList>
              <TabsContent value="search" className="space-y-4">
                <h4 className="font-semibold text-foreground">USED CARS IN YOUR AREA</h4>
                 <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Input
                        id="search-cars"
                        type="text"
                        placeholder="Search Make, Model, or Keyword"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 h-11 rounded-full pl-10"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                     <Sheet>
                        <SheetTrigger asChild>
                             <Button variant="outline" className="h-11 rounded-full text-sm shrink-0">
                                <Filter className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                            <SheetHeader className="p-6 pb-4">
                                <SheetTitle>Filters</SheetTitle>
                                <SheetDescription>
                                    Refine your search to find the perfect car.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex-grow overflow-y-auto px-6">
                                <FilterContent />
                            </div>
                            <SheetFooter className="p-6 pt-4 bg-background border-t">
                                <Button variant="outline" className="flex-1">Clear all</Button>
                                <SheetClose asChild><Button type="submit" className="flex-1 w-full">View Results</Button></SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
              </TabsContent>
              <TabsContent value="sell_trade">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h4 className="font-semibold text-foreground text-xl mb-2">Get a Real Offer in Minutes</h4>
                    <p className="text-muted-foreground mb-4">Tell us about your car and we'll provide a competitive offer. It's fast, easy, and free.</p>
                    <Form {...sellCarForm}>
                        <form onSubmit={sellCarForm.handleSubmit(handleGetOffer)} className="space-y-4">
                            <FormField control={sellCarForm.control} name="vin" render={({ field }) => (<FormItem><FormLabel>VIN</FormLabel><FormControl><Input placeholder="Enter 17-character VIN" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <div className="grid grid-cols-2 gap-4">
                               <FormField control={sellCarForm.control} name="make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Toyota" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                               <FormField control={sellCarForm.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Camry" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={sellCarForm.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2022" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={sellCarForm.control} name="mileage" render={({ field }) => (<FormItem><FormLabel>Mileage</FormLabel><FormControl><Input type="number" placeholder="e.g., 30000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            </div>
                            <Button type="submit" className="w-full" disabled={isOfferLoading}>
                               {isOfferLoading ? 'Calculating...' : 'Get My Offer'}
                            </Button>
                        </form>
                    </Form>
                  </div>
                  <div className="text-center p-8 bg-background rounded-lg border">
                    {offerValue ? (
                      <>
                        <p className="text-muted-foreground">Your Estimated Offer</p>
                        <p className="text-4xl font-bold text-primary my-2">${offerValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mb-4">This offer is valid for 7 days. We will contact you to schedule a quick inspection and finalize the sale.</p>
                        <Button className="w-full" onClick={() => toast({title: "Sale Initiated!", description: "We will contact you shortly."})}>Accept & Continue</Button>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4"/>
                        <p className="font-semibold">Your offer will appear here.</p>
                        <p className="text-sm text-muted-foreground">Fill out the form to see your car's estimated value.</p>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
           <div className="mb-4">
            <div className="flex flex-nowrap items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 text-sm shrink-0">
                    <MapPin className="h-4 w-4"/>
                    <span>Your Location (Demo)</span>
                </div>
                <Select defaultValue="best_match">
                    <SelectTrigger className="w-auto sm:w-[180px] h-9 text-sm shrink-0">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="best_match">Sort: Best Match</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => toast({title: "Saved!"})} className="shrink-0"><Heart className="mr-2 h-4 w-4"/>Save</Button>
            </div>
            
            <div className="flex flex-nowrap gap-2 items-center justify-between mt-4">
                <div className="flex flex-nowrap gap-2 items-center overflow-x-auto no-scrollbar">
                    <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full shrink-0">Third Row Seating</Button>
                    <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full shrink-0">All-Wheel Drive</Button>
                    <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full shrink-0">Sunroof / Moonroof</Button>
                     <Button variant="secondary" size="sm" onClick={() => toast({title: "Filter Applied"})} className="rounded-full shrink-0">Apple CarPlay</Button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-semibold">{filteredCars.length} cars found</p>
                </div>
            </div>
          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <Card key={car.id} className="flex flex-col overflow-hidden">
                <CarImageSlider car={car} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl hover:text-primary">
                      <Link href={`/cars-for-sale/${car.id}`}>{car.name}</Link>
                  </CardTitle>
                  <CardDescription className="text-lg font-bold text-primary">${car.price.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span><Gauge className="inline h-4 w-4 mr-1"/>{car.mileage}</span>
                    <span><CalendarDays className="inline h-4 w-4 mr-1"/>{car.year}</span>
                    <span><MapPin className="inline h-4 w-4 mr-1"/>{car.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p><Info className="inline h-3 w-3 mr-1"/>{car.historyHighlights}</p>
                    <p><ShieldCheck className="inline h-3 w-3 mr-1"/>Seller Rating: {car.sellerRating}/5</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                  <div className="flex w-full gap-2">
                     <Button variant="outline" size="sm" className="flex-1" onClick={() => handleRequestTestDrive(car.name)}>Test Drive</Button>
                     <Button variant="outline" size="sm" className="flex-1" onClick={() => handleMakeOffer(car.name)}>Make Offer</Button>
                  </div>
                   <Button asChild variant="link" size="sm" className="w-full">
                     <Link href={`/cars-for-sale/history/${car.vin}`}>
                        View Car History
                     </Link>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
