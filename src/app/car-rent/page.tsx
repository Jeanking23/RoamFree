
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { KeyRound, Car, User, CheckCircle, CalendarDays, Users, Briefcase, ShieldCheck, Star, Luggage, TvIcon, Settings, FileText, MapPin, Edit, AlertTriangle, Camera, X } from 'lucide-react';
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


export default function CarRentPage() {
  const [includeDriver, setIncludeDriver] = useState(false);
  const [baggageAssistance, setBaggageAssistance] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedInsurance, setSelectedInsurance] = useState("basic"); // basic, full
  const [hasMounted, setHasMounted] = useState(false);
  
  // State for dialogs
  const [selectedCarForAction, setSelectedCarForAction] = useState<CarListing | null>(null);
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  const [is360DialogOpen, setIs360DialogOpen] = useState(false);
  const [isDamageDialogOpen, setIsDamageDialogOpen] = useState(false);

  useEffect(() => {
    // This prevents hydration errors by ensuring date state is only set on the client
    setHasMounted(true);
    setDateRange({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
  }, []);

  const getPrice = (car: typeof carListings[0]) => car.pricePerDay;
  const getPriceSuffix = () => "/day";
  
  const handleRentClick = (car: CarListing) => {
    setSelectedCarForAction(car);
    setIsRentDialogOpen(true);
  };

  const handleConfirmRental = () => {
    if (!selectedCarForAction) return;
    let durationString = '';
    if (dateRange?.from && dateRange?.to) {
        const days = differenceInDays(dateRange.to, dateRange.from);
        if (days >= 0) {
            const displayDays = days === 0 ? 1 : days;
            durationString = `from ${format(dateRange.from, 'PPP')} to ${format(dateRange.to, 'PPP')} (${displayDays} day${displayDays > 1 ? 's' : ''})`;
        }
    }
    toast({
      title: "Rental Initiated (Demo)",
      description: `You've started the rental process for ${selectedCarForAction.name}. ${durationString}. Insurance: ${selectedInsurance}. ${includeDriver ? 'Driver service requested.' : ''} ${baggageAssistance ? 'Baggage assistance requested.' : ''} Driver's license upload would be required here.`,
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
        title: "Damage Report Submitted (Demo)",
        description: `Thank you for reporting. Your notes: "${damageDetails}". This has been logged for car: ${selectedCarForAction?.name}`
    });
    setIsDamageDialogOpen(false);
  }

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
              <div className="grid sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="rental-dates">Pickup &amp; Return Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="rental-dates"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {hasMounted && dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            />
                        </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                      <Label htmlFor="insurance-options">Insurance Coverage (Demo)</Label>
                      <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                          <SelectTrigger id="insurance-options">
                              <SelectValue placeholder="Select insurance" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="basic">Basic (Included where stated)</SelectItem>
                              <SelectItem value="full">Full Coverage (+$X/day)</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDriver"
                  checked={includeDriver}
                  onCheckedChange={(checked) => setIncludeDriver(checked as boolean)}
                />
                <Label htmlFor="includeDriver" className="text-base font-medium text-foreground">
                  Include a Driver (for intercity trips, airport transfers, or convenience)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="baggageAssistance"
                  checked={baggageAssistance}
                  onCheckedChange={(checked) => setBaggageAssistance(checked as boolean)}
                />
                <Label htmlFor="baggageAssistance" className="text-base font-medium text-foreground">
                  Include Baggage Assistance (Help for seniors or families)
                </Label>
              </div>
            </div>

            {includeDriver && (
              <div className="mb-6 p-4 border border-accent rounded-md bg-accent/10">
                <p className="text-accent-foreground font-semibold">
                  <Briefcase className="inline h-5 w-5 mr-2" /> Professional driver service selected. Additional charges may apply.
                </p>
              </div>
            )}
            {baggageAssistance && (
              <div className="mb-6 p-4 border border-blue-500 rounded-md bg-blue-500/10">
                <p className="text-blue-700 font-semibold">
                  <Luggage className="inline h-5 w-5 mr-2" /> Baggage assistance service selected.
                </p>
              </div>
            )}

            <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible no-scrollbar">
              {carListings.map((car) => (
                <Card key={car.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-[85vw] sm:w-[50vw] md:w-full flex-shrink-0">
                  <Link href={`/car-rent/${car.id}`} className="block relative w-full h-56 group">
                    <Image src={car.image} alt={car.name} fill className="object-cover" data-ai-hint={car.dataAiHint} />
                    {car.ecoFriendly && <Badge variant="secondary" className="absolute top-2 right-2 bg-green-500 text-white border-green-600">Eco-Friendly</Badge>}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold">View Details</span>
                    </div>
                  </Link>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold hover:text-primary"><Link href={`/car-rent/${car.id}`}>{car.name}</Link></CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{car.year} &bull; {car.type} &bull; {car.mileage}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-primary" /> {car.seats} Seats
                      <span className="mx-2">|</span>
                      <Settings className="h-4 w-4 mr-2 text-primary" /> {car.transmission}
                    </div>
                    <ul className="space-y-1 text-sm">
                      {car.features.slice(0,3).map(feature => (
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
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handle360ViewClick(car)}>
                      <TvIcon className="mr-2 h-4 w-4" /> 360° View
                    </Button>
                    <Separator className="my-2"/>
                    <p className="text-xs text-muted-foreground font-medium">Pickup/Drop-off Locations (Demo):</p>
                      <div className="flex flex-wrap gap-1">
                          {car.pickupLocations.map(loc => <Badge key={loc} variant="outline">{loc}</Badge>)}
                      </div>
                      <p className="text-xs text-muted-foreground">One-way rentals & delivery options available (Demo).</p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start bg-muted/50 p-4">
                    <p className="text-2xl font-bold text-primary mb-2">${getPrice(car)}<span className="text-sm font-normal text-muted-foreground">{getPriceSuffix()}</span></p>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleRentClick(car)}>
                      <CalendarDays className="mr-2 h-4 w-4" /> Rent Now
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full mt-1 text-destructive" onClick={() => handleReportDamageClick(car)}>
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
              <div className="py-4 space-y-3">
                  <p><strong>Vehicle:</strong> {selectedCarForAction?.name}</p>
                  <p><strong>Dates:</strong> {dateRange?.from && dateRange?.to ? `${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}` : "N/A"}</p>
                  <p><strong>Insurance:</strong> {selectedInsurance === 'basic' ? 'Basic Coverage' : 'Full Coverage'}</p>
                  {includeDriver && <p><strong>Add-on:</strong> Professional Driver</p>}
                  {baggageAssistance && <p><strong>Add-on:</strong> Baggage Assistance</p>}
                  <p className="text-sm text-muted-foreground pt-4">This is a demo. Clicking confirm will simulate the start of the booking process.</p>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleConfirmRental}>Confirm & Proceed</Button>
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
                        <Label htmlFor="damage-type">Damage Type (Demo)</Label>
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
                        <Label htmlFor="damage-photo">Upload Photo (Demo)</Label>
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
