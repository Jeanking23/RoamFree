
// src/app/bus-transportation/page.tsx
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
import { BusIcon, CalendarIcon, MapPin, Users, Search, Clock, DollarSign, Wifi, Power, Snowflake, Sun, Moon, Wind, Zap, Tv, BaggageClaim, AlertCircle, Armchair, Info, ListFilter, ShieldCheck, MessageSquare, Edit3, Languages, Star as StarIcon, Filter, CircleDollarSign, TicketIcon, PlusCircle, ArrowRight, Repeat } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const busSearchSchema = z.object({
  originCity: z.string().min(2, "Origin city is required."),
  destinationCity: z.string().min(2, "Destination city is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  passengers: z.coerce.number().min(1, "At least one passenger required.").max(20, "Max 20 passengers."),
  hasAC: z.boolean().default(false).optional(),
  hasWifi: z.boolean().default(false).optional(),
  hasUsb: z.boolean().default(false).optional(),
  tripType: z.enum(["ANY", "DAY", "OVERNIGHT"]).default("ANY").optional(),
  isRoundTrip: z.boolean().default(false),
  returnDate: z.date().optional(),
}).refine(data => !data.isRoundTrip || !!data.returnDate, {
    message: "Return date is required for a round trip.",
    path: ["returnDate"],
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

interface Passenger {
    id: number;
    name: string;
    idType: "Passport" | "National ID" | "Driver's License";
    idNumber: string;
}

interface SelectedTrip {
    route: BusRoute;
    seats: string[];
}

const mockBusRoutes: BusRoute[] = [
  {
    id: "route001",
    operator: "ComfortLines Express",
    operatorLogo: "https://images.unsplash.com/photo-1754782385462-87d3aadabd04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YnVzJTIwY29tcGFueSUyMGxvZ298ZW58MHx8fHwxNzU1Mzk4Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    operatorLogo: "https://images.unsplash.com/photo-1553946357-b1a3a8a20b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxidXMlMjBjb21wYW55JTIwbG9nb3xlbnwwfHx8fDE3NTUzOTgzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    operatorLogo: "https://images.unsplash.com/photo-1553946357-b1a3a8a20b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxidXMlMjBjb21wYW55JTIwbG9nb3xlbnwwfHx8fDE3NTUzOTgzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
    operatorLogo: "https://images.unsplash.com/photo-1754782385462-87d3aadabd04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YnVzJTIwY29tcGFueSUyMGxvZ298ZW58MHx8fHwxNzU1Mzk4Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
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

const savedPassengers: Passenger[] = [
    { id: 1, name: "Alex Johnson", idType: "Passport", idNumber: "A12345678" }
];


export default function BusTransportationPage() {
  const [departureResults, setDepartureResults] = useState<BusRoute[]>([]);
  const [returnResults, setReturnResults] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Seats, 2: Passenger Details, 3: Add-ons & Pay
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Round trip state
  const [roundTripStage, setRoundTripStage] = useState<'departure' | 'return' | 'confirm'>('departure');
  const [departureTrip, setDepartureTrip] = useState<SelectedTrip | null>(null);
  const [returnTrip, setReturnTrip] = useState<SelectedTrip | null>(null);

  // Add-ons state
  const [extraLuggage, setExtraLuggage] = useState(0);
  const [travelInsurance, setTravelInsurance] = useState(false);
  
  const router = useRouter();

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
      isRoundTrip: false,
    },
  });

  const isRoundTrip = form.watch("isRoundTrip");

  useEffect(() => {
    if (!form.getValues("departureDate")) {
        form.setValue("departureDate", new Date(), { shouldValidate: true });
    }
  }, [form]);

  async function onBusSearchSubmit(data: BusSearchFormValues) {
    setIsLoading(true);
    setDepartureResults([]);
    setReturnResults([]);
    setDepartureTrip(null);
    setReturnTrip(null);
    setRoundTripStage('departure');
    console.log("Bus Search Submitted:", data);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const filterRoutes = (routes: BusRoute[], filters: BusSearchFormValues) => {
        return routes.filter(route => {
            let matches = true;
            if (filters.hasAC && !route.amenities.ac) matches = false;
            if (filters.hasWifi && !route.amenities.wifi) matches = false;
            if (filters.hasUsb && !route.amenities.usb) matches = false;
            if (filters.tripType !== "ANY" && route.tripType.toUpperCase() !== filters.tripType) matches = false;
            return matches;
        });
    };
    
    const departure = filterRoutes(mockBusRoutes, data);
    setDepartureResults(departure);
    
    if (data.isRoundTrip) {
        // In a real app, you might fetch return routes separately. Here we just re-filter the mock data.
        const returnRoutes = filterRoutes(mockBusRoutes, data);
        setReturnResults(returnRoutes);
    }
    
    setIsLoading(false);
    if (departure.length > 0) {
        toast({ title: "Bus Search Results", description: `Found ${departure.length} routes for your criteria.` });
    } else {
        toast({ title: "No Buses Found", description: "Try adjusting your search criteria.", variant: "destructive" });
    }
  }

  const handleStartBooking = (route: BusRoute) => {
    setSelectedRoute(route);
    const passengerCount = form.getValues("passengers");
    setPassengers(Array.from({ length: passengerCount }, (_, i) => ({ id: i, name: '', idType: 'National ID', idNumber: '' })));
    setSelectedSeats([]);
    setExtraLuggage(0);
    setTravelInsurance(false);
    
    if (isRoundTrip && !departureTrip) {
        setRoundTripStage('departure');
    } else if (isRoundTrip && departureTrip) {
        setRoundTripStage('return');
    } else {
        setRoundTripStage('confirm');
    }
    
    setCurrentStep(1);
    setIsBookingDialogOpen(true);
  }

  const toggleSeatSelection = (seatId: string) => {
    const passengerCount = form.getValues("passengers") || 1;
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId); // Deselect
      } else {
        if (prev.length < passengerCount) {
          return [...prev, seatId]; // Select if limit not reached
        }
        toast({
          title: "Seat Limit Reached",
          description: `You can only select up to ${passengerCount} seat(s).`,
        });
        return prev; // Limit reached, do not add new seat
      }
    });
  };
  
  const handlePassengerDetailChange = (index: number, field: keyof Passenger, value: string) => {
    setPassengers(prev => {
        const newPassengers = [...prev];
        (newPassengers[index] as any)[field] = value;
        return newPassengers;
    });
  };

  const handleUseSavedPassenger = (index: number, passenger: Passenger) => {
      setPassengers(prev => {
          const newPassengers = [...prev];
          newPassengers[index] = { ...passenger, id: index };
          return newPassengers;
      });
  };

  const handleNextStep = () => {
    if (currentStep === 1) { // Seat selection
      const passengerCount = form.getValues("passengers");
      if (selectedSeats.length !== passengerCount) {
        toast({ title: "Seat Count Mismatch", description: `Please select exactly ${passengerCount} seat(s).`, variant: "destructive" });
        return;
      }
      if (isRoundTrip) {
        if (roundTripStage === 'departure') {
          if (!selectedRoute) return;
          setDepartureTrip({ route: selectedRoute, seats: selectedSeats });
          setRoundTripStage('return');
          setSelectedRoute(null); // Reset for return trip selection
          setSelectedSeats([]);
          setIsBookingDialogOpen(false); // Close dialog to select return trip
          toast({ title: "Departure Trip Saved!", description: "Now, please select your return trip." });
          return;
        } else if (roundTripStage === 'return') {
          if (!selectedRoute) return;
          setReturnTrip({ route: selectedRoute, seats: selectedSeats });
          setRoundTripStage('confirm');
          setCurrentStep(2); // Proceed to passenger details
          return; // Stay in dialog
        }
      }
    }
    if (currentStep === 2) { // Passenger details
        const allPassengersValid = passengers.every(p => p.name.trim() !== '' && p.idNumber.trim() !== '');
        if (!allPassengersValid) {
            toast({ title: "Incomplete Details", description: "Please fill in the name and ID number for all passengers.", variant: "destructive" });
            return;
        }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleConfirmBooking = () => {
      const activeRoute = isRoundTrip ? returnTrip?.route : selectedRoute;
      const bookingId = `RFBUS${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      toast({
          title: "Booking Confirmed!",
          description: `Your booking ID is ${bookingId}. Your e-ticket has been generated.`,
      });
      setIsBookingDialogOpen(false);
      
      router.push(`/bus-transportation/ticket/${bookingId}?routeId=${activeRoute?.id}`);
  };

  const renderCurrentRoutes = () => {
    if (isRoundTrip && roundTripStage === 'return') {
        return returnResults;
    }
    return departureResults;
  };
  
  const getActiveRouteForDialog = () => {
    if (isRoundTrip) {
        if (roundTripStage === 'confirm' && returnTrip) return returnTrip.route;
        // The selectedRoute is the one currently being booked
        return selectedRoute;
    }
    return selectedRoute;
  };
  
  const activeRouteForDialog = getActiveRouteForDialog();


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
                      <FormLabel>&lt;span&gt;&lt;MapPin className="h-4 w-4 text-primary inline-block mr-1" /&gt;Origin City&lt;/span&gt;</FormLabel>
                      <FormControl>&lt;Input placeholder="e.g., Douala" {...field} value={field.value || ''} /&gt;</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>&lt;span&gt;&lt;MapPin className="h-4 w-4 text-primary inline-block mr-1" /&gt;Destination City&lt;/span&gt;</FormLabel>
                      <FormControl>&lt;Input placeholder="e.g., Yaoundé" {...field} value={field.value || ''} /&gt;</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>&lt;span&gt;&lt;CalendarIcon className="h-4 w-4 text-primary inline-block mr-1" /&gt;Departure Date&lt;/span&gt;</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : &lt;span&gt;Pick a date&lt;/span&gt;}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          &lt;Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date &lt; new Date(new Date().setHours(0,0,0,0))} initialFocus/&gt;
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {isRoundTrip && (
                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Return Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : &lt;span&gt;Pick a date&lt;/span&gt;}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            &lt;Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date &lt; (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus /&gt;
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>&lt;span&gt;&lt;Users className="h-4 w-4 text-primary inline-block mr-1" /&gt;Passengers&lt;/span&gt;</FormLabel>
                      <FormControl>&lt;Input type="number" min="1" max="20" placeholder="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} value={field.value || 1} /&gt;</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="isRoundTrip"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 pb-1.5">
                        <FormControl>
                          &lt;Checkbox checked={field.value} onCheckedChange={field.onChange} /&gt;
                        </FormControl>
                        <FormLabel className="font-normal">&lt;span&gt;&lt;Repeat className="h-4 w-4 inline-block mr-1" /&gt;Round Trip&lt;/span&gt;</FormLabel>
                      </FormItem>
                    )}
                  />
              </div>
              <div>
                <FormLabel className="text-base font-medium">Filters (Optional)</FormLabel>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 p-4 border rounded-md">
                  <FormField
                    control={form.control} name="hasAC"
                    render={({ field }) => (&lt;FormItem className="flex flex-row items-center space-x-2 space-y-0"&gt;&lt;FormControl&gt;&lt;Checkbox checked={field.value} onCheckedChange={field.onChange} /&gt;&lt;/FormControl&gt;&lt;FormLabel className="font-normal"&gt;&lt;span&gt;&lt;Snowflake className="h-4 w-4 text-blue-500 inline-block mr-1" /&gt;Air Conditioned&lt;/span&gt;&lt;/FormLabel&gt;&lt;/FormItem&gt;)}
                  />
                  <FormField
                    control={form.control} name="hasWifi"
                    render={({ field }) => (&lt;FormItem className="flex flex-row items-center space-x-2 space-y-0"&gt;&lt;FormControl&gt;&lt;Checkbox checked={field.value} onCheckedChange={field.onChange} /&gt;&lt;/FormControl&gt;&lt;FormLabel className="font-normal"&gt;&lt;span&gt;&lt;Wifi className="h-4 w-4 text-sky-500 inline-block mr-1" /&gt;WiFi Onboard&lt;/span&gt;&lt;/FormLabel&gt;&lt;/FormItem&gt;)}
                  />
                  <FormField
                    control={form.control} name="hasUsb"
                    render={({ field }) => (&lt;FormItem className="flex flex-row items-center space-x-2 space-y-0"&gt;&lt;FormControl&gt;&lt;Checkbox checked={field.value} onCheckedChange={field.onChange} /&gt;&lt;/FormControl&gt;&lt;FormLabel className="font-normal"&gt;&lt;span&gt;&lt;Power className="h-4 w-4 text-yellow-500 inline-block mr-1" /&gt;USB Charging&lt;/span&gt;&lt;/FormLabel&gt;&lt;/FormItem&gt;)}
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
                            &lt;SelectItem value="ANY"&gt;&lt;span&gt;&lt;Sun className="inline h-4 w-4 mr-1" /&gt;&lt;Moon className="inline h-4 w-4 mr-1" /&gt;Any Trip Type&lt;/span&gt;&lt;/SelectItem&gt;
                            &lt;SelectItem value="DAY"&gt;&lt;span&gt;&lt;Sun className="inline h-4 w-4 mr-1" /&gt;Day Trip&lt;/span&gt;&lt;/SelectItem&gt;
                            &lt;SelectItem value="OVERNIGHT"&gt;&lt;span&gt;&lt;Moon className="inline h-4 w-4 mr-1" /&gt;Overnight Trip&lt;/span&gt;&lt;/SelectItem&gt;
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                &lt;span className="flex items-center gap-2"&gt;&lt;Search className="h-5 w-5" /&gt;{isLoading ? "Searching Buses..." : "Search Buses"}&lt;/span&gt;
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          &lt;BusIcon className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" /&gt;
          &lt;p className="text-lg text-muted-foreground"&gt;Finding available bus routes...&lt;/p&gt;
        </div>
      )}
      
      {departureTrip && isRoundTrip && (
          <Card className="mt-8 border-primary">
              <CardHeader>
                  &lt;CardTitle className="flex items-center gap-2 text-primary"&gt;&lt;ArrowRight className="h-5 w-5"/&gt;Departure Trip Selected&lt;/CardTitle&gt;
              </CardHeader>
              <CardContent>
                  &lt;p&gt;&lt;strong&gt;{departureTrip.route.operator}&lt;/strong&gt; from {departureTrip.route.departureStation} at {departureTrip.route.departureTime}&lt;/p&gt;
                  &lt;p&gt;Seats: {departureTrip.seats.join(', ')}&lt;/p&gt;
              </CardContent>
          </Card>
      )}

      {!isLoading && renderCurrentRoutes().length > 0 && (
        <div className="space-y-6 mt-8">
          &lt;h2 className="text-2xl font-semibold text-foreground"&gt;
            {isRoundTrip && roundTripStage === 'return' ? `Select Your Return Trip (${returnResults.length})` : `Available Routes (${departureResults.length})`}
          &lt;/h2&gt;
          {renderCurrentRoutes().map((route) => (
            <Card key={route.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              &lt;div className="grid md:grid-cols-12 gap-4 p-4 items-stretch"&gt;
                &lt;div className="md:col-span-2 flex flex-col items-center justify-center text-center"&gt;
                   {route.operatorLogo && &lt;Image src={route.operatorLogo} alt={`${route.operator} logo`} width={100} height={50} className="object-contain mb-1" data-ai-hint={route.dataAiHint || "bus company logo"} /&gt;}
                  &lt;p className="text-sm font-medium"&gt;{route.operator}&lt;/p&gt;
                  {route.operatorRating && (
                    &lt;div className="flex items-center text-xs text-muted-foreground"&gt;
                        &lt;StarIcon className="h-3 w-3 mr-0.5 text-yellow-400 fill-yellow-400" /&gt; {route.operatorRating}/5 (Demo)
                    &lt;/div&gt;
                  )}
                &lt;/div&gt;
                &lt;div className="md:col-span-7 space-y-1"&gt;
                  &lt;div className="flex flex-col sm:flex-row justify-between items-baseline gap-1"&gt;
                    &lt;div className="font-semibold text-lg flex items-center"&gt;
                        {route.departureTime}
                        &lt;MapPin className="inline h-4 w-4 text-muted-foreground mx-1"/&gt;
                        &lt;span className="text-sm text-muted-foreground font-normal"&gt;{route.departureStation}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="text-sm text-muted-foreground hidden sm:block self-center"&gt;➔&lt;/div&gt;
                    &lt;div className="font-semibold text-lg flex items-center"&gt;
                        {route.arrivalTime}
                        &lt;MapPin className="inline h-4 w-4 text-muted-foreground mx-1"/&gt;
                        &lt;span className="text-sm text-muted-foreground font-normal"&gt;{route.arrivalStation}&lt;/span&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;div className="flex justify-between text-sm text-muted-foreground"&gt;
                    &lt;span&gt;Duration: {route.duration}&lt;/span&gt;
                    &lt;span&gt;{route.stops !== undefined ? (route.stops > 0 ? `${route.stops} Stop(s)` : "Direct") : ""}&lt;/span&gt;
                  &lt;/div&gt;
                  &lt;p className="text-sm"&gt;&lt;span&gt;&lt;Info className="inline h-4 w-4 mr-1 text-primary"/&gt;Bus Type: {route.busType}&lt;/span&gt;&lt;/p&gt;
                  &lt;div className="flex flex-wrap gap-x-3 gap-y-1 text-xs pt-1"&gt;
                    {route.amenities.ac && &lt;span className="flex items-center"&gt;&lt;Snowflake className="h-3.5 w-3.5 mr-1 text-blue-500"/&gt;AC&lt;/span&gt;}
                    {route.amenities.wifi && &lt;span className="flex items-center"&gt;&lt;Wifi className="h-3.5 w-3.5 mr-1 text-sky-500"/&gt;WiFi&lt;/span&gt;}
                    {route.amenities.usb && &lt;span className="flex items-center"&gt;&lt;Power className="h-3.5 w-3.5 mr-1 text-yellow-500"/&gt;USB&lt;/span&gt;}
                    {route.amenities.tv && &lt;span className="flex items-center"&gt;&lt;Tv className="h-3.5 w-3.5 mr-1 text-gray-500"/&gt;TV&lt;/span&gt;}
                    {route.amenities.toilet && &lt;span className="flex items-center"&gt;&lt;Wind className="h-3.5 w-3.5 mr-1 text-teal-500"/&gt;Toilet&lt;/span&gt;}
                  &lt;/div&gt;
                   &lt;p className="text-xs text-muted-foreground pt-1"&gt;{route.tripType} Trip | {route.availableSeats} seats available&lt;/p&gt;
                &lt;/div&gt;
                &lt;div className="md:col-span-3 flex flex-col items-center md:items-end justify-center space-y-2 pt-2 md:pt-0"&gt;
                  &lt;p className="text-2xl font-bold text-primary"&gt;${route.price.toFixed(2)}&lt;/p&gt;
                  <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleStartBooking(route)}>
                    <span><Armchair className="mr-2 h-4 w-4"/>Select Seats &amp; Book</span>
                  </Button>
                  <p className="text-xs text-muted-foreground">Price per passenger</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && departureResults.length === 0 && form.formState.isSubmitted && (
         <Card className="mt-8 text-center py-12 bg-muted/50">
            <CardContent>
                &lt;BusIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" /&gt;
                &lt;p className="text-xl font-semibold"&gt;No bus routes found for your criteria.&lt;/p&gt;
                &lt;p className="text-muted-foreground mt-2"&gt;Try adjusting your search filters or dates.&lt;/p&gt;
            </CardContent>
        </Card>
      )}

      {activeRouteForDialog && (
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {isRoundTrip && roundTripStage === 'return' ? `Select Seats for Return Trip` : isRoundTrip && roundTripStage === 'confirm' ? `Confirm Your Round Trip` : `Book your trip with ${activeRouteForDialog.operator}`}
              </DialogTitle>
              <DialogDescription>
                 Step {currentStep} of 3: {currentStep === 1 ? 'Select Your Seats' : currentStep === 2 ? 'Enter Passenger Details' : 'Add-ons &amp; Payment'}
              </DialogDescription>
            </DialogHeader>
             &lt;AnimatePresence mode="wait"&gt;
             &lt;motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              &gt;
              {currentStep === 1 && (
                  &lt;div&gt;
                    &lt;div className="mb-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm"&gt;
                        &lt;span className="flex items-center"&gt;&lt;Armchair className="h-5 w-5 mr-1 text-green-500" /&gt; Available&lt;/span&gt;
                        &lt;span className="flex items-center"&gt;&lt;Armchair className="h-5 w-5 mr-1 text-blue-500" /&gt; Selected&lt;/span&gt;
                        &lt;span className="flex items-center"&gt;&lt;Armchair className="h-5 w-5 mr-1 text-red-500 opacity-50" /&gt; Taken&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="w-16 h-8 bg-gray-300 rounded-t-md mx-auto mb-2 flex items-center justify-center text-xs"&gt;Front&lt;/div&gt;
                    &lt;div className="bg-muted/30 p-2 sm:p-4 rounded-md flex justify-center"&gt;
                        &lt;div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${activeRouteForDialog.seatsLayout?.cols || 4}, minmax(0, 1fr))` }}&gt;
                        {Array.from({ length: activeRouteForDialog.totalSeats || 40 }).map((_, index) => {
                            const layout = activeRouteForDialog.seatsLayout || { rows: 10, cols: 4, aisleAfter: 2 };
                            const rowIndex = Math.floor(index / layout.cols);
                            const colIndex = index % layout.cols;
                            const seatId = getSeatLabel(rowIndex, colIndex, layout);
                            const isTaken = index % 5 === 0 || ["2A", "3C"].includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);
                            
                            return (
                                &lt;Button
                                key={seatId}
                                variant={isSelected ? "default" : "outline"}
                                size="icon"
                                className={cn(
                                    "h-8 w-8 sm:h-10 sm:w-10 transition-all duration-150",
                                    !isTaken && !isSelected && "border-green-500 text-green-600 hover:bg-green-100",
                                    isTaken && "border-destructive/30 text-destructive/50 opacity-60 cursor-not-allowed bg-destructive/10",
                                    isSelected && "bg-primary text-primary-foreground",
                                    colIndex === layout.aisleAfter -1 ? "mr-3 sm:mr-6" : ""
                                )}
                                onClick={() => !isTaken && toggleSeatSelection(seatId)}
                                disabled={isTaken}
                                title={`Seat ${seatId}`}
                                &gt;
                                &lt;Armchair className="h-4 w-4 sm:h-5 sm:w-5" /&gt;
                                &lt;span className="sr-only"&gt;{seatId}&lt;/span&gt;
                                &lt;/Button&gt;
                            );
                        })}
                        &lt;/div&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
              )}
              {currentStep === 2 && (
                  &lt;div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4"&gt;
                      {passengers.map((p, index) => (
                          <Card key={index} className="p-4">
                              <CardTitle className="text-lg mb-2">
                                  Passenger {index + 1}
                                  {isRoundTrip && departureTrip && returnTrip ? ` (Dep: ${departureTrip.seats[index]}, Ret: ${returnTrip.seats[index]})` : ` (Seat: ${selectedSeats[index]})`}
                              </CardTitle>
                              &lt;div className="grid sm:grid-cols-2 gap-4"&gt;
                                &lt;div className="space-y-2"&gt;
                                    &lt;Label&gt;Full Name&lt;/Label&gt;
                                    &lt;Input value={p.name} onChange={e => handlePassengerDetailChange(index, 'name', e.target.value)} /&gt;
                                &lt;/div&gt;
                                &lt;div className="space-y-2"&gt;
                                    &lt;Label&gt;Use Saved Passenger&lt;/Label&gt;
                                    <Select onValueChange={(val) => handleUseSavedPassenger(index, savedPassengers.find(sp => sp.id.toString() === val)!)}>
                                        <SelectTrigger>&lt;SelectValue placeholder="Select a saved passenger" /&gt;&lt;/SelectTrigger&gt;
                                        <SelectContent>
                                            {savedPassengers.map(sp => &lt;SelectItem key={sp.id} value={sp.id.toString()}&gt;{sp.name}&lt;/SelectItem&gt;)}
                                        </SelectContent>
                                    </Select>
                                &lt;/div&gt;
                                &lt;div className="space-y-2"&gt;
                                    &lt;Label&gt;ID Type&lt;/Label&gt;
                                    <Select value={p.idType} onValueChange={val => handlePassengerDetailChange(index, 'idType', val as any)}>
                                        <SelectTrigger>&lt;SelectValue/&gt;&lt;/SelectTrigger&gt;
                                        <SelectContent>
                                            &lt;SelectItem value="National ID"&gt;National ID&lt;/SelectItem&gt;
                                            &lt;SelectItem value="Passport"&gt;Passport&lt;/SelectItem&gt;
                                            &lt;SelectItem value="Driver's License"&gt;Driver's License&lt;/SelectItem&gt;
                                        </SelectContent>
                                    </Select>
                                &lt;/div&gt;
                                &lt;div className="space-y-2"&gt;
                                    &lt;Label&gt;ID Number&lt;/Label&gt;
                                    &lt;Input value={p.idNumber} onChange={e => handlePassengerDetailChange(index, 'idNumber', e.target.value)} /&gt;
                                &lt;/div&gt;
                              &lt;/div&gt;
                          </Card>
                      ))}
                  &lt;/div&gt;
              )}
              {currentStep === 3 && (
                  &lt;div className="space-y-4"&gt;
                    <Card>
                        <CardHeader>&lt;CardTitle&gt;Add-ons&lt;/CardTitle&gt;&lt;/CardHeader&gt;
                        <CardContent className="space-y-4">
                            &lt;div className="flex items-center justify-between"&gt;
                                &lt;Label htmlFor="extra-luggage" className="flex items-center gap-2"&gt;&lt;BaggageClaim className="h-5 w-5"/&gt;Extra Luggage ($5 per bag)&lt;/Label&gt;
                                &lt;Input id="extra-luggage" type="number" min="0" value={extraLuggage} onChange={e => setExtraLuggage(Number(e.target.value))} className="w-20" /&gt;
                            &lt;/div&gt;
                             &lt;div className="flex items-center justify-between"&gt;
                                &lt;Label htmlFor="travel-insurance" className="flex items-center gap-2"&gt;&lt;ShieldCheck className="h-5 w-5"/&gt;Travel Insurance ($2.50 per person)&lt;/Label&gt;
                                &lt;Checkbox id="travel-insurance" checked={travelInsurance} onCheckedChange={(checked) => setTravelInsurance(checked as boolean)} /&gt;
                            &lt;/div&gt;
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>&lt;CardTitle&gt;Fare Breakdown&lt;/CardTitle&gt;&lt;/CardHeader&gt;
                        <CardContent className="text-sm space-y-1">
                            {isRoundTrip && departureTrip && returnTrip ? (
                                <>
                                &lt;div className="flex justify-between"&gt;&lt;span&gt;Departure Fare ({passengers.length} x ${departureTrip.route.price})&lt;/span&gt;&lt;span&gt;${(passengers.length * departureTrip.route.price).toFixed(2)}&lt;/span&gt;&lt;/div&gt;
                                &lt;div className="flex justify-between"&gt;&lt;span&gt;Return Fare ({passengers.length} x ${returnTrip.route.price})&lt;/span&gt;&lt;span&gt;${(passengers.length * returnTrip.route.price).toFixed(2)}&lt;/span&gt;&lt;/div&gt;
                                </>
                            ) : (
                                &lt;div className="flex justify-between"&gt;&lt;span&gt;Base Fare ({passengers.length} x ${activeRouteForDialog.price})&lt;/span&gt;&lt;span&gt;${(passengers.length * activeRouteForDialog.price).toFixed(2)}&lt;/span&gt;&lt;/div&gt;
                            )}

                            &lt;div className="flex justify-between"&gt;&lt;span&gt;Extra Luggage ({extraLuggage} x $5)&lt;/span&gt;&lt;span&gt;${(extraLuggage * 5).toFixed(2)}&lt;/span&gt;&lt;/div&gt;
                            {travelInsurance && &lt;div className="flex justify-between"&gt;&lt;span&gt;Travel Insurance ({passengers.length} x $2.50)&lt;/span&gt;&lt;span&gt;${(passengers.length * 2.5).toFixed(2)}&lt;/span&gt;&lt;/div&gt;}
                            <Separator className="my-2"/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>
                                    ${
                                        (
                                            (isRoundTrip && departureTrip && returnTrip ? 
                                                (passengers.length * (departureTrip.route.price + returnTrip.route.price)) : 
                                                (passengers.length * activeRouteForDialog.price)
                                            ) + 
                                            extraLuggage * 5 + 
                                            (travelInsurance ? passengers.length * 2.5 : 0)
                                        ).toFixed(2)
                                    }
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">You will be redirected to a secure payment gateway. Reserve now, pay later options available.</p>
                  </div>
              )}
              &lt;/motion.div&gt;
              &lt;/AnimatePresence&gt;
            <DialogFooter className="sm:justify-between items-center">
                <div>
                   {currentStep > 1 && <Button type="button" variant="outline" onClick={handlePrevStep}>Back</Button>}
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel Booking</Button></DialogClose>
                  {currentStep < 3 && &lt;Button type="button" onClick={handleNextStep}&gt;{ isRoundTrip && roundTripStage !== 'confirm' && currentStep === 1 ? 'Confirm Seats & Select Return' : 'Next' }&lt;/Button&gt;}
                  {currentStep === 3 && &lt;Button type="button" onClick={handleConfirmBooking}&gt;Confirm &amp; Pay&lt;/Button&gt;}
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    &lt;/div&gt;
  );
}
