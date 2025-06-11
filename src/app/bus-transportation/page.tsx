
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { BusIcon, CalendarIcon, MapPin, Users, Search, Clock, DollarSign, Wifi, Power, Snowflake, Sun, Moon, Wind, Zap, Tv, BaggageClaim, AlertCircle, Armchair, Info, ListFilter, ShieldCheck, MessageSquare, Edit3, Languages, Star as StarIcon, Filter } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const busSearchSchema = z.object({
  originCity: z.string().min(2, "Origin city is required."),
  destinationCity: z.string().min(2, "Destination city is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  passengers: z.coerce.number().min(1, "At least one passenger required.").max(20, "Max 20 passengers."),
  hasAC: z.boolean().default(false).optional(),
  hasWifi: z.boolean().default(false).optional(),
  hasUsb: z.boolean().default(false).optional(),
  tripType: z.enum(["ANY", "DAY", "OVERNIGHT"]).default("ANY").optional(),
});

type BusSearchFormValues = z.infer<typeof busSearchSchema>;

interface BusRoute {
  id: string;
  operator: string;
  operatorLogo?: string;
  dataAiHint?: string;
  operatorRating?: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  amenities: {
    ac: boolean;
    wifi: boolean;
    usb: boolean;
    tv?: boolean;
    toilet?: boolean;
  };
  availableSeats: number;
  tripType: "Day" | "Overnight";
  departureStation: string;
  arrivalStation: string;
  stops?: number;
  totalSeats?: number; 
  seatsLayout?: { rows: number, cols: number, aisleAfter: number }; 
}

const mockBusRoutes: BusRoute[] = [
  {
    id: "route001",
    operator: "ComfortLines Express",
    operatorLogo: "https://placehold.co/100x50.png?text=ComfortLines",
    dataAiHint: "bus company logo",
    operatorRating: 4.5,
    departureTime: "08:00 AM",
    arrivalTime: "02:00 PM",
    duration: "6h 00m",
    price: 25,
    busType: "Luxury AC Coach",
    amenities: { ac: true, wifi: true, usb: true, tv: true, toilet: true },
    availableSeats: 32,
    tripType: "Day",
    departureStation: "Central Bus Terminal, Douala",
    arrivalStation: "Main Station, Yaoundé",
    stops: 1,
    totalSeats: 40,
    seatsLayout: { rows: 10, cols: 4, aisleAfter: 2 },
  },
  {
    id: "route002",
    operator: "Speedy Ways",
    operatorLogo: "https://placehold.co/100x50.png?text=SpeedyWays",
    dataAiHint: "bus company logo",
    operatorRating: 4.2,
    departureTime: "10:30 PM",
    arrivalTime: "05:30 AM",
    duration: "7h 00m",
    price: 22,
    busType: "Standard AC Sleeper",
    amenities: { ac: true, wifi: false, usb: true, toilet: true, tv: false },
    availableSeats: 20,
    tripType: "Overnight",
    departureStation: "North Terminal, Douala",
    arrivalStation: "South Station, Yaoundé",
    stops: 0,
    totalSeats: 30,
    seatsLayout: { rows: 8, cols: 4, aisleAfter: 2 },
  },
  {
    id: "route003",
    operator: "Budget Bus Co.",
    operatorLogo: "https://placehold.co/100x50.png?text=BudgetBus",
    dataAiHint: "bus company logo",
    operatorRating: 3.8,
    departureTime: "02:00 PM",
    arrivalTime: "09:00 PM",
    duration: "7h 00m",
    price: 18,
    busType: "Non-AC Standard",
    amenities: { ac: false, wifi: false, usb: false, tv: false, toilet: false },
    availableSeats: 45,
    tripType: "Day",
    departureStation: "City Center Hub, Douala",
    arrivalStation: "West End Terminal, Yaoundé",
    stops: 2,
    totalSeats: 50,
    seatsLayout: { rows: 13, cols: 4, aisleAfter: 2 },
  },
   {
    id: "route004",
    operator: "Prestige Travel",
    operatorLogo: "https://placehold.co/100x50.png?text=Prestige",
    dataAiHint: "bus company logo",
    operatorRating: 4.8,
    departureTime: "11:00 AM",
    arrivalTime: "05:30 PM",
    duration: "6h 30m",
    price: 30,
    busType: "VIP Executive Coach",
    amenities: { ac: true, wifi: true, usb: true, tv: true, toilet: false },
    availableSeats: 15,
    tripType: "Day",
    departureStation: "Airport Shuttle Stop, Douala",
    arrivalStation: "Capital Square, Yaoundé",
    stops: 0,
    totalSeats: 20,
    seatsLayout: { rows: 5, cols: 4, aisleAfter: 2 }, 
  },
];

const getSeatLabel = (rowIndex: number, colIndex: number, layout: {cols: number, aisleAfter: number}) => {
  const row = rowIndex + 1;
  let letter = String.fromCharCode(65 + colIndex); 
  if (colIndex >= layout.aisleAfter) {
      letter = String.fromCharCode(65 + colIndex); 
  }
  return `${row}${letter}`;
};


export default function BusTransportationPage() {
  const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRouteForSeats, setSelectedRouteForSeats] = useState<BusRoute | null>(null);
  const [isSeatSelectionDialogOpen, setIsSeatSelectionDialogOpen] = useState(false);
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<string[]>([]);


  const form = useForm<BusSearchFormValues>({
    resolver: zodResolver(busSearchSchema),
    defaultValues: {
      originCity: "",
      destinationCity: "",
      passengers: 1,
      hasAC: false,
      hasWifi: false,
      hasUsb: false,
      tripType: "ANY",
    },
  });
  
  useEffect(() => {
    if (!form.getValues("departureDate")) {
        form.setValue("departureDate", new Date(), { shouldValidate: true });
    }
  }, [form]);


  async function onBusSearchSubmit(data: BusSearchFormValues) {
    setIsLoading(true);
    setSearchResults([]);
    console.log("Bus Search Submitted:", data);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const filteredResults = mockBusRoutes.filter(route => {
      let matches = true;
      if (data.hasAC && !route.amenities.ac) matches = false;
      if (data.hasWifi && !route.amenities.wifi) matches = false;
      if (data.hasUsb && !route.amenities.usb) matches = false;
      if (data.tripType !== "ANY" && route.tripType.toUpperCase() !== data.tripType) matches = false;
      return matches;
    });

    setSearchResults(filteredResults);
    setIsLoading(false);
    if (filteredResults.length > 0) {
        toast({ title: "Bus Search Results", description: `Found ${filteredResults.length} routes for your criteria.` });
    } else {
        toast({ title: "No Buses Found", description: "Try adjusting your search criteria.", variant: "destructive" });
    }
  }

  const handleViewSeats = (route: BusRoute) => {
    setSelectedRouteForSeats(route);
    setCurrentSelectedSeats([]); 
    setIsSeatSelectionDialogOpen(true);
  }

  const toggleSeatSelection = (seatId: string) => {
    const passengerCount = form.getValues("passengers") || 1;
    setCurrentSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId); // Deselect
      } else {
        if (prev.length < passengerCount) {
          return [...prev, seatId]; // Select if limit not reached
        }
        toast({
          title: "Seat Limit Reached",
          description: `You can only select up to ${passengerCount} seat(s). Please deselect a seat if you want to choose a different one.`,
          variant: "default",
        });
        return prev; // Limit reached, do not add new seat
      }
    });
  };

  const handleConfirmSeats = () => {
    const passengerCount = form.getValues("passengers") || 1;
    if (currentSelectedSeats.length === 0) {
        toast({ title: "No Seats Selected", description: "Please select your seat(s).", variant: "destructive" });
        return;
    }
    if (currentSelectedSeats.length !== passengerCount) {
        toast({ title: "Seat Count Mismatch", description: `Please select exactly ${passengerCount} seat(s) for ${passengerCount} passenger(s).`, variant: "destructive" });
        return;
    }
    toast({
        title: "Seats Confirmed (Demo)",
        description: `Selected seats: ${currentSelectedSeats.join(', ')}. Proceeding to booking for route ${selectedRouteForSeats?.id}.`
    });
    setIsSeatSelectionDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <BusIcon className="h-8 w-8" />
            Bus Transportation
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Search and book bus tickets for your intercity travel.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onBusSearchSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="originCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Origin City</FormLabel>
                      <FormControl><Input placeholder="e.g., Douala" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Destination City</FormLabel>
                      <FormControl><Input placeholder="e.g., Yaoundé" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-primary" />Departure Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus/>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" />Passengers</FormLabel>
                      <FormControl><Input type="number" min="1" max="20" placeholder="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} value={field.value || 1} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel className="text-base font-medium">Filters (Optional)</FormLabel>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 p-4 border rounded-md">
                  <FormField
                    control={form.control} name="hasAC"
                    render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-1"><Snowflake className="h-4 w-4 text-blue-500" />Air Conditioned</FormLabel></FormItem>)}
                  />
                  <FormField
                    control={form.control} name="hasWifi"
                    render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-1"><Wifi className="h-4 w-4 text-sky-500" />WiFi Onboard</FormLabel></FormItem>)}
                  />
                  <FormField
                    control={form.control} name="hasUsb"
                    render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-1"><Power className="h-4 w-4 text-yellow-500" />USB Charging</FormLabel></FormItem>)}
                  />
                  <FormField
                    control={form.control} name="tripType"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Trip Type (Any)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ANY"><Sun className="inline h-4 w-4 mr-1" /><Moon className="inline h-4 w-4 mr-1" />Any Trip Type</SelectItem>
                            <SelectItem value="DAY"><Sun className="inline h-4 w-4 mr-1" />Day Trip</SelectItem>
                            <SelectItem value="OVERNIGHT"><Moon className="inline h-4 w-4 mr-1" />Overnight Trip</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="mr-2 h-5 w-5" /> {isLoading ? "Searching Buses..." : "Search Buses"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <BusIcon className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Finding available bus routes...</p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold text-foreground">Available Routes ({searchResults.length})</h2>
          {searchResults.map((route) => (
            <Card key={route.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-12 gap-4 p-4 items-stretch">
                <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                   {route.operatorLogo && <Image src={route.operatorLogo} alt={`${route.operator} logo`} width={100} height={50} className="object-contain mb-1" data-ai-hint={route.dataAiHint || "bus company logo"} />}
                  <p className="text-sm font-medium">{route.operator}</p>
                  {route.operatorRating && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <StarIcon className="h-3 w-3 mr-0.5 text-yellow-400 fill-yellow-400" /> {route.operatorRating}/5 (Demo)
                    </div>
                  )}
                </div>
                <div className="md:col-span-7 space-y-1">
                  <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
                    <div className="font-semibold text-lg flex items-center">
                        {route.departureTime}
                        <MapPin className="inline h-4 w-4 text-muted-foreground mx-1"/> 
                        <span className="text-sm text-muted-foreground font-normal">{route.departureStation}</span>
                    </div>
                    <div className="text-sm text-muted-foreground hidden sm:block self-center">➔</div>
                    <div className="font-semibold text-lg flex items-center">
                        {route.arrivalTime}
                        <MapPin className="inline h-4 w-4 text-muted-foreground mx-1"/> 
                        <span className="text-sm text-muted-foreground font-normal">{route.arrivalStation}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Duration: {route.duration}</span>
                    <span>{route.stops !== undefined ? (route.stops > 0 ? `${route.stops} Stop(s)` : "Direct") : ""}</span>
                  </div>
                  <p className="text-sm"><Info className="inline h-4 w-4 mr-1 text-primary"/>Bus Type: {route.busType}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs pt-1">
                    {route.amenities.ac && <span className="flex items-center"><Snowflake className="h-3.5 w-3.5 mr-1 text-blue-500"/>AC</span>}
                    {route.amenities.wifi && <span className="flex items-center"><Wifi className="h-3.5 w-3.5 mr-1 text-sky-500"/>WiFi</span>}
                    {route.amenities.usb && <span className="flex items-center"><Power className="h-3.5 w-3.5 mr-1 text-yellow-500"/>USB</span>}
                    {route.amenities.tv && <span className="flex items-center"><Tv className="h-3.5 w-3.5 mr-1 text-gray-500"/>TV</span>}
                    {route.amenities.toilet && <span className="flex items-center"><Wind className="h-3.5 w-3.5 mr-1 text-teal-500"/>Toilet</span>}
                  </div>
                   <p className="text-xs text-muted-foreground pt-1">{route.tripType} Trip | {route.availableSeats} seats available</p>
                </div>
                <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center space-y-2 pt-2 md:pt-0">
                  <p className="text-2xl font-bold text-primary">${route.price.toFixed(2)}</p>
                  <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleViewSeats(route)}>
                    <Armchair className="mr-2 h-4 w-4"/>View Seats &amp; Book
                  </Button>
                  <p className="text-xs text-muted-foreground">Price per passenger</p>
                </div>
              </div>
              <CardFooter className="bg-muted/30 p-3 text-xs text-muted-foreground">
                Fare includes base fare, taxes. Additional luggage fees may apply. Reserve now, pay later option available (Demo).
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && searchResults.length === 0 && form.formState.isSubmitted && (
         <Card className="mt-8 text-center py-12 bg-muted/50">
            <CardContent>
                <BusIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-xl font-semibold">No bus routes found for your criteria.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters or dates.</p>
            </CardContent>
        </Card>
      )}

      {selectedRouteForSeats && (
        <Dialog open={isSeatSelectionDialogOpen} onOpenChange={setIsSeatSelectionDialogOpen}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Your Seats for {selectedRouteForSeats.operator}</DialogTitle>
              <DialogDescription>
                Bus Type: {selectedRouteForSeats.busType}. 
                Please select {form.getValues("passengers") || 1} seat(s).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 flex justify-center items-center gap-4 text-sm">
                <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-green-500" /> Available</span>
                <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-blue-500" /> Selected</span>
                <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-red-500 opacity-50" /> Taken</span>
              </div>
              <div className="w-16 h-8 bg-gray-300 rounded-t-md mx-auto mb-2 flex items-center justify-center text-xs">Front</div>
              <div className="bg-muted/30 p-2 sm:p-4 rounded-md flex justify-center">
                <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${selectedRouteForSeats.seatsLayout?.cols || 4}, minmax(0, 1fr))` }}>
                  {Array.from({ length: selectedRouteForSeats.totalSeats || 40 }).map((_, index) => {
                    const layout = selectedRouteForSeats.seatsLayout || { rows: 10, cols: 4, aisleAfter: 2 };
                    const rowIndex = Math.floor(index / layout.cols);
                    const colIndex = index % layout.cols;
                    const seatId = getSeatLabel(rowIndex, colIndex, layout);
                    
                    const isTaken = index % 5 === 0 || ["2A", "3C"].includes(seatId); // Simulate some taken seats
                    const isSelected = currentSelectedSeats.includes(seatId);

                    let seatVariant: "default" | "destructive" | "secondary" | "outline" = "outline";
                    let seatDisabled = false;
                    let seatColorClass = "border-green-500 text-green-600 hover:bg-green-100 focus-visible:ring-green-400";

                    if (isTaken) {
                      seatVariant = "secondary";
                      seatDisabled = true;
                      seatColorClass = "border-destructive/30 text-destructive/50 opacity-60 cursor-not-allowed bg-destructive/10";
                    } else if (isSelected) {
                      seatVariant = "default";
                      seatColorClass = "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary";
                    }

                    return (
                      <Button
                        key={seatId}
                        variant={seatVariant}
                        size="icon"
                        className={cn(
                            "h-8 w-8 sm:h-10 sm:w-10 transition-all duration-150", 
                            seatColorClass, 
                            colIndex === layout.aisleAfter -1 ? "mr-3 sm:mr-6" : "" // Aisle spacing
                        )}
                        onClick={() => !isTaken && toggleSeatSelection(seatId)}
                        disabled={seatDisabled}
                        aria-label={`Seat ${seatId}${isTaken ? ' (Taken)' : isSelected ? ' (Selected)' : ' (Available)'}`}
                      >
                        <Armchair className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="sr-only">{seatId}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
               <div className="mt-6">
                <Label className="text-sm font-medium flex items-center gap-1 mb-2"><Filter className="h-4 w-4"/>Seat Preference Filters (Demo)</Label>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2"><Checkbox id="filter-window" disabled /><Label htmlFor="filter-window" className="text-xs text-muted-foreground">Window</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="filter-aisle" disabled /><Label htmlFor="filter-aisle" className="text-xs text-muted-foreground">Aisle</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="filter-front" disabled /><Label htmlFor="filter-front" className="text-xs text-muted-foreground">Front Row</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="filter-exit" disabled /><Label htmlFor="filter-exit" className="text-xs text-muted-foreground">Exit Row</Label></div>
                </div>
               </div>
            </div>
            <DialogFooter className="sm:justify-between items-center">
                <p className="text-sm text-muted-foreground">Selected: {currentSelectedSeats.length} seat(s) - {currentSelectedSeats.join(', ')}</p>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleConfirmSeats} disabled={currentSelectedSeats.length === 0 || currentSelectedSeats.length !== (form.getValues("passengers") || 1)}>
                    Confirm Seats &amp; Proceed (Demo)
                  </Button>
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-xl">More Bus Travel Features (Coming Soon / Demo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><Armchair className="inline h-4 w-4 mr-1 text-primary"/>Interactive 3D Seat Selection with real-time availability & hover details.</p>
            <p><Zap className="inline h-4 w-4 mr-1 text-primary"/>E-Ticket & QR Code Boarding Pass generation (email & in-app, offline access, departure countdown).</p>
            <p><MapPin className="inline h-4 w-4 mr-1 text-primary"/>Station Information (amenities, gates, parking) & Live GPS Navigation to station.</p>
            <p><Info className="inline h-4 w-4 mr-1 text-primary"/>Bus Operator Profiles with reviews, ratings, punctuality scores, and verified badges.</p>
            <p><Clock className="inline h-4 w-4 mr-1 text-primary"/>Live Bus Tracking during trip with ETA and delay notifications.</p>
            <p><Users className="inline h-4 w-4 mr-1 text-primary"/>Save Passenger Profiles for faster bookings (name, ID/passport, preferences). Upload ID/Passport docs.</p>
            <p><BaggageClaim className="inline h-4 w-4 mr-1 text-primary"/>Add-ons: Snacks, extra luggage, travel insurance, WiFi voucher, pillow/blanket, carbon offset.</p>
            <p><ShieldCheck className="inline h-4 w-4 mr-1 text-primary"/>Safety & Accessibility Filters: Female-only seating, wheelchair accessible, child-friendly seats.</p>
            <p><MessageSquare className="inline h-4 w-4 mr-1 text-primary"/>Bus Chat (passengers) & Operator Announcements.</p>
            <p className="text-xs">Fare breakdown (taxes, fees) and advanced payment options (Reserve now/pay later, group bookings) will be integrated into the booking flow.</p>
        </CardContent>
      </Card>

    </div>
  );
}

