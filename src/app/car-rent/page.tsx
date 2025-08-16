
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { KeyRound, Car, User, CheckCircle, CalendarDays, Users, Briefcase, ShieldCheck, Star, Luggage, TvIcon, Settings, FileText, MapPin, Edit, AlertTriangle, Camera, X, Search, ChevronLeft, ChevronRight, Filter, CarIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { carListings, type CarListing } from '@/lib/mock-data';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { addDays, format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';


function CarImageSlider({ car }: { car: CarListing }) {
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
    <div className="relative w-full h-56 group">
      <Image 
        src={car.photos[currentIndex].src} 
        alt={car.photos[currentIndex].alt} 
        fill 
        className="object-cover transition-transform duration-300 ease-in-out" 
        data-ai-hint={car.photos[currentIndex].dataAiHint}
      />
      {car.ecoFriendly && <Badge variant="secondary" className="absolute top-2 right-2 bg-green-500 text-white border-green-600">Eco-Friendly</Badge>}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white font-bold">View Details</span>
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

const carTypes = ['Sedan', 'SUV', 'Van', 'Truck', 'Coupe', 'Convertible'];
const carFeatures = ['GPS', 'Bluetooth', 'Sunroof', 'Child Seat', 'All-Wheel Drive'];

const FilterContent = () => (
    <Accordion type="multiple" defaultValue={['price', 'car_type']} className="w-full">
        <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent className="space-y-4">
                <Slider defaultValue={[0, 200]} min={0} max={500} step={10} />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$500+</span>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="car_type">
            <AccordionTrigger>Car Type</AccordionTrigger>
            <AccordionContent className="space-y-2">
                {carTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} />
                        <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent className="space-y-2">
                {carFeatures.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                        <Checkbox id={`feature-${feature}`} />
                        <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>
         <AccordionItem value="seating">
            <AccordionTrigger>Seating Capacity</AccordionTrigger>
            <AccordionContent>
                 <Input type="number" min="2" placeholder="Any" />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);


export default function CarRentPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [hasMounted, setHasMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for dialogs and their options
  const [selectedCarForAction, setSelectedCarForAction] = useState<CarListing | null>(null);
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  const [is360DialogOpen, setIs360DialogOpen] = useState(false);
  const [isDamageDialogOpen, setIsDamageDialogOpen] = useState(false);
  
  // State for rental options inside the dialog
  const [includeDriver, setIncludeDriver] = useState(false);
  const [baggageAssistance, setBaggageAssistance] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState("basic");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
    setDateRange({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
  }, []);

  useEffect(() => {
    if (!selectedCarForAction || !dateRange?.from || !dateRange?.to) {
      setTotalPrice(null);
      return;
    }

    const nights = differenceInDays(dateRange.to, dateRange.from) || 1;
    let price = selectedCarForAction.pricePerDay * nights;
    
    // Add-on prices (demo values)
    if (includeDriver) price += 50 * nights;
    if (baggageAssistance) price += 10 * nights;
    if (selectedInsurance === 'full') price += 25 * nights;
    
    setTotalPrice(price);
  }, [selectedCarForAction, dateRange, includeDriver, baggageAssistance, selectedInsurance]);

  const getPrice = (car: typeof carListings[0]) => car.pricePerDay;
  const getPriceSuffix = () => "/day";
  
  const handleRentClick = (car: CarListing) => {
    setSelectedCarForAction(car);
    // Reset options to default when opening the dialog
    setIncludeDriver(false);
    setBaggageAssistance(false);
    setSelectedInsurance('basic');
    setIsRentDialogOpen(true);
  };

  const handleConfirmRental = () => {
    if (!selectedCarForAction) return;
    let durationString = '';
    if (dateRange?.from && dateRange?.to) {
        const days = differenceInDays(dateRange.to, dateRange.from) || 1;
        durationString = `from ${format(dateRange.from, 'PPP')} to ${format(dateRange.to, 'PPP')} (${days} day${days > 1 ? 's' : ''})`;
    }
    toast({
      title: "Rental Initiated",
      description: `You've started the rental process for ${selectedCarForAction.name}. ${durationString}. Insurance: ${selectedInsurance}. ${includeDriver ? 'Driver service requested.' : ''} ${baggageAssistance ? 'Baggage assistance requested.' : ''} Total: $${totalPrice?.toFixed(2)}. Driver's license upload would be required here.`,
      duration: 10000,
    });
    setIsRentDialogOpen(false);
  };
  
  const handle360ViewClick = (car: CarListing) => {
    setSelectedCarForAction(car);
    setIs360DialogOpen(true);
  };

  const handleReportDamageClick = (car: CarListing) => {
    setSelectedCarForAction(car);
    setIsDamageDialogOpen(true);
  };

  const handleDamageReportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const damageDetails = formData.get('damageDetails');
    toast({
        title: "Damage Report Submitted",
        description: `Thank you for reporting. Your notes: "${damageDetails}". This has been logged for car: ${selectedCarForAction?.name}`
    });
    setIsDamageDialogOpen(false);
  }

  const filteredCarListings = carListings.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
              <KeyRound className="h-8 w-8" />
              Rent a Car
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Explore a wide range of rental cars, including eco-friendly options, to suit your travel needs. Hourly, daily, or weekly rentals.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 p-4 border rounded-md bg-muted/30 space-y-4">
               <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <Input
                        id="search-cars"
                        type="text"
                        placeholder="Search by name, model, or type..."
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
                <div className="space-y-2">
                    <div>
                        <Label>Pickup & Return Dates</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button id="rental-dates" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {hasMounted && dateRange?.from ? ( dateRange.to ? ( <> {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")} </> ) : ( format(dateRange.from, "LLL dd, y") ) ) : ( <span>Pick a date range</span> )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}/>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        <div>
                            <Label>Insurance Coverage</Label>
                            <Select><SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger><SelectContent><SelectItem value="basic">Basic (Included where stated)</SelectItem><SelectItem value="full">Full Coverage</SelectItem></SelectContent></Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox id="includeDriver" />
                            <Label htmlFor="includeDriver" className="font-normal text-sm">Include a Driver <span className="text-xs text-muted-foreground">(for intercity trips, airport transfers, or convenience)</span></Label>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox id="baggageAssistance" />
                            <Label htmlFor="baggageAssistance" className="font-normal text-sm">Include Baggage Assistance <span className="text-xs text-muted-foreground">(Help for seniors or families)</span></Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCarListings.map((car) => (
                <Card key={car.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <Link href={`/car-rent/${car.id}`} className="block group flex-grow">
                        <CarImageSlider car={car} />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold group-hover:text-primary">{car.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">{car.year} &bull; {car.type} &bull; {car.mileage}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-4 w-4 mr-2 text-primary" /> {car.seats} Seats
                                <span className="mx-2">|</span>
                                <Settings className="h-4 w-4 mr-2 text-primary" /> {car.transmission}
                            </div>
                            <ul className="space-y-1 text-sm">
                                {car.features.slice(0, 3).map(feature => (
                                <li key={feature} className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                                </li>
                                ))}
                                {car.features.length > 3 && <li className="text-xs text-muted-foreground pl-6">...and more</li>}
                            </ul>
                            <div className="text-sm space-y-1">
                                <p><ShieldCheck className={`inline h-4 w-4 mr-1 ${car.insuranceIncluded ? 'text-green-600' : 'text-orange-500'}`} />Insurance: {car.insuranceIncluded ? "Basic Included" : "Available"}</p>
                                <p><FileText className="inline h-4 w-4 mr-1 text-primary"/>Fuel Policy: {car.fuelPolicy}</p>
                                <p><User className="inline h-4 w-4 mr-1 text-primary"/>Requirements: {car.licenseRequired}</p>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                <span className="font-semibold">{car.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({car.reviews} reviews)</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handle360ViewClick(car); }}>
                                <TvIcon className="mr-2 h-4 w-4" /> 360° View
                            </Button>
                            <Separator className="my-2"/>
                            <p className="text-xs text-muted-foreground font-medium">Pickup/Drop-off Locations:</p>
                            <div className="flex flex-wrap gap-1">
                                {car.pickupLocations.map(loc => <Badge key={loc} variant="outline">{loc}</Badge>)}
                            </div>
                            <p className="text-xs text-muted-foreground">One-way rentals & delivery options available.</p>
                        </CardContent>
                    </Link>
                    <CardFooter className="flex flex-col items-start bg-muted/50 p-4 mt-auto">
                        <p className="text-2xl font-bold text-primary mb-2">${getPrice(car)}<span className="text-sm font-normal text-muted-foreground">{getPriceSuffix()}</span></p>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={(e) => { e.stopPropagation(); handleRentClick(car); }}>
                            <CalendarDays className="mr-2 h-4 w-4" /> Rent Now
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full mt-1 text-destructive" onClick={(e) => { e.stopPropagation(); handleReportDamageClick(car); }}>
                            <AlertTriangle className="mr-2 h-4 w-4" /> Report Pre/Post-Trip Damage
                        </Button>
                    </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-12 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
              <p className="text-xl font-semibold text-foreground">More vehicles arriving soon!</p>
              <p className="text-muted-foreground mt-2">Find the perfect ride for any occasion. Long-term rental discounts available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rent Now Dialog */}
      <Dialog open={isRentDialogOpen} onOpenChange={setIsRentDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Confirm Your Rental</DialogTitle>
                  <DialogDescription>
                      Review the details below and confirm your rental for the {selectedCarForAction?.name}.
                  </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                  <div>
                    <Label>Pickup & Return Dates</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button id="rental-dates-dialog" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {hasMounted && dateRange?.from ? ( dateRange.to ? ( <> {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")} </> ) : ( format(dateRange.from, "LLL dd, y") ) ) : ( <span>Pick a date range</span> )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}/>
                        </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                      <Label>Insurance Coverage</Label>
                      <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="basic">Basic (Included)</SelectItem>
                              <SelectItem value="full">Full Coverage (+$25/day)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Checkbox id="includeDriverDialog" checked={includeDriver} onCheckedChange={(checked) => setIncludeDriver(checked as boolean)} />
                      <Label htmlFor="includeDriverDialog" className="font-normal">Include a Driver (+$50/day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Checkbox id="baggageAssistanceDialog" checked={baggageAssistance} onCheckedChange={(checked) => setBaggageAssistance(checked as boolean)} />
                      <Label htmlFor="baggageAssistanceDialog" className="font-normal">Baggage Assistance (+$10/day)</Label>
                  </div>
                   <Separator />
                  <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Base Price ({differenceInDays(dateRange?.to || new Date(), dateRange?.from || new Date()) || 1} days)</span>
                          <span>${selectedCarForAction ? ((differenceInDays(dateRange?.to || new Date(), dateRange?.from || new Date()) || 1) * selectedCarForAction.pricePerDay).toFixed(2) : '0.00'}</span>
                      </div>
                      {selectedInsurance === 'full' && <div className="flex justify-between text-sm text-muted-foreground"><span>Full Coverage</span><span>+$25.00/day</span></div>}
                      {includeDriver && <div className="flex justify-between text-sm text-muted-foreground"><span>Driver Service</span><span>+$50.00/day</span></div>}
                      {baggageAssistance && <div className="flex justify-between text-sm text-muted-foreground"><span>Baggage Help</span><span>+$10.00/day</span></div>}
                      <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t">
                          <span>Total Estimated Price</span>
                          <span>${totalPrice ? totalPrice.toFixed(2) : '...'}</span>
                      </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleConfirmRental} disabled={!totalPrice}>Confirm & Proceed</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* 360 View Dialog */}
      <Dialog open={is360DialogOpen} onOpenChange={setIs360DialogOpen}>
          <DialogContent className="max-w-3xl">
              <DialogHeader>
                  <DialogTitle>360° Interior View: {selectedCarForAction?.name}</DialogTitle>
                  <DialogDescription>This is a simulation of the 360° vehicle interior view.</DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center border">
                      <Image src="https://placehold.co/800x450.png" alt="360 view placeholder" width={800} height={450} className="w-full h-full object-cover" data-ai-hint="car interior wide"/>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Drag to explore the vehicle's interior.</p>
              </div>
          </DialogContent>
      </Dialog>

      {/* Report Damage Dialog */}
      <Dialog open={isDamageDialogOpen} onOpenChange={setIsDamageDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Report Damage for {selectedCarForAction?.name}</DialogTitle>
                  <DialogDescription>Please describe the damage and upload a photo if possible.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleDamageReportSubmit}>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="damage-type">Damage Type</Label>
                        <Select defaultValue="exterior">
                            <SelectTrigger id="damage-type"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="exterior">Exterior (Scratch, Dent)</SelectItem>
                                <SelectItem value="interior">Interior (Stain, Tear)</SelectItem>
                                <SelectItem value="mechanical">Mechanical Issue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="damageDetails">Description of Damage</Label>
                        <Textarea id="damageDetails" name="damageDetails" placeholder="e.g., Small scratch on the front passenger door." required />
                    </div>
                    <div>
                        <Label htmlFor="damage-photo">Upload Photo</Label>
                        <Input id="damage-photo" type="file" accept="image/*" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Submit Report</Button>
                </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
