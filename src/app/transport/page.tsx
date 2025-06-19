
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  MapPin,
  CalendarDays,
  Clock,
  LocateFixed,
  Sparkles,
  CircleDot,
  SquareDot,
  Plane,
  User,
  ShieldCheck,
  Compass,
  Briefcase,
  Settings,
  Tv,
  Globe,
  CreditCard,
  MessageCircle,
  Users2,
  Map as MapIcon,
  Building,
  Phone,
  Car,
  Users as UsersIcon,
  Share2,
  Navigation,
  ThumbsUp,
  ThumbsDown,
  Accessibility,
  Baby,
  Dog,
  Truck, 
  Ship, 
  Train, 
  PlusCircle,
  RefreshCcw,
  Wifi,
  Snowflake,
  VolumeX,
  Filter,
  Search,
  CarFront,
  Bus,
  Armchair,
  Ticket as TicketIcon,
  ListFilter,
  ShoppingBag,
  BadgeCheck,
  FileText as FileTextIcon,
  QrCode,
  UserCog,
  DollarSign,
  Info,
  Award,
  Contact,
  Receipt,
  Route,
  Moon,
  Sun,
  Wind, // For restroom
  Sofa, // For recliner seats
  PersonStanding // For female-only seating
} from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addDays, differenceInDays } from "date-fns";
import { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalization } from '@/contexts/LocalizationContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';


const rideBookingSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location must be at least 3 characters."),
  dropoffLocation: z.string().min(3, "Dropoff location must be at least 3 characters."),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  scheduleRide: z.boolean().default(false).optional(),
  wheelchairAccessible: z.boolean().default(false).optional(),
  babySeat: z.boolean().default(false).optional(),
  petFriendly: z.boolean().default(false).optional(),
  filterEconomy: z.boolean().default(true).optional(),
  filterComfort: z.boolean().default(true).optional(),
  filterSuv: z.boolean().default(true).optional(),
  filterPremium: z.boolean().default(false).optional(),
  filterQuietRide: z.boolean().default(false).optional(),
  filterWifi: z.boolean().default(false).optional(),
  filterAC: z.boolean().default(false).optional(),
});

type RideBookingFormValues = z.infer<typeof rideBookingSchema>;

const rentalCarSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().optional(),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().min(1, "Pickup time is required (e.g., HH:MM)"),
  dropoffDate: z.date({ required_error: "Dropoff date is required." }),
  dropoffTime: z.string().min(1, "Dropoff time is required (e.g., HH:MM)"),
}).refine(data => !data.dropoffDate || !data.pickupDate || data.dropoffDate >= data.pickupDate, {
  message: "Dropoff date must be on or after pickup date.",
  path: ["dropoffDate"],
});

type RentalCarFormValues = z.infer<typeof rentalCarSchema>;

const flightSearchSchema = z.object({
  origin: z.string().min(3, "Origin airport/city code is required (e.g., JFK).").max(50),
  destination: z.string().min(3, "Destination airport/city code is required (e.g., LHR).").max(50),
  departureDate: z.date({ required_error: "Departure date is required."}),
  returnDate: z.date().optional(),
}).refine(data => !data.returnDate || data.returnDate >= data.departureDate, {
  message: "Return date must be on or after departure date.",
  path: ["returnDate"],
});

type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;

const intercityBusSearchSchema = z.object({
    originCity: z.string().min(2, "Origin city is required."),
    destinationCity: z.string().min(2, "Destination city is required."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    departureTime: z.string().optional(),
    returnDate: z.date().optional(),
    passengers: z.coerce.number().min(1, "At least one passenger required.").max(50, "Max 50 passengers for group booking demo."),
    // Filters
    busFeatures: z.object({
      ac: z.boolean().default(false).optional(),
      wifi: z.boolean().default(false).optional(),
      usb: z.boolean().default(false).optional(),
      reclinerSeats: z.boolean().default(false).optional(),
      onboardRestroom: z.boolean().default(false).optional(),
    }).default({}).optional(),
    tripType: z.enum(["ANY", "DAY", "NIGHT"]).default("ANY").optional(),
    operatorRating: z.coerce.number().min(0).max(5).default(0).optional(),
    fareType: z.enum(["ANY", "PAY_NOW", "RESERVE_LATER"]).default("ANY").optional(),
    safetyFeatures: z.object({
        femaleOnlySeating: z.boolean().default(false).optional(),
        wheelchairAccessible: z.boolean().default(false).optional(),
        childFriendlySeating: z.boolean().default(false).optional(),
    }).default({}).optional(),
}).refine(data => !data.returnDate || data.returnDate >= data.departureDate, {
  message: "Return date must be on or after departure date.",
  path: ["returnDate"],
});
type IntercityBusSearchFormValues = z.infer<typeof intercityBusSearchSchema>;


interface RideOption {
  id: string;
  vehicleType: string;
  vehicleImage: string;
  dataAiHint: string;
  estimatedFare: number;
  eta: string; 
  fareBreakdown: string; 
  features: string[]; 
  userPreferenceMatch?: string;
}

interface IntercityBusRoute {
  id: string;
  operator: string;
  operatorLogo?: string;
  dataAiHintOperatorLogo?: string;
  busType: "Luxury" | "Standard" | "Sleeper"; 
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  rating?: number; 
  fareType?: "PAY_NOW" | "RESERVE_LATER";
  amenities: {
    ac: boolean;
    wifi: boolean;
    usb: boolean;
    reclinerSeats?: boolean;
    onboardRestroom?: boolean;
    tv?: boolean;
  };
  tripType: "Day" | "Night";
  stops?: number;
  departureStation: string;
  arrivalStation: string;
  safetyFeatures?: {
    femaleOnlySeatingAvailable?: boolean;
    wheelchairAccessible?: boolean;
    childFriendlySeatingAvailable?: boolean;
  };
  totalSeats?: number;
  seatsLayout?: { rows: number, cols: number, aisleAfter: number, seatTypes?: Record<string, "window" | "aisle" | "recliner" | "extraLegroom"> };
  operatorPolicies?: { refund: string, luggage: string };
  operatorImages?: {src: string, alt: string, dataAiHint: string}[];
}


const destinationSuggestions = [
  { id: 1, name: 'Philadelphia International Airport (PHL)', address: '8000 Essington Ave, Philadelphia, PA' },
  { id: 2, name: 'William H. Gray III 30th Street Amtrak Train Station', address: '2955 Market St, Philadelphia, PA' },
  { id: 3, name: 'Philadelphia Museum of Art', address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA' },
];

const mockIntercityBusRoutes: IntercityBusRoute[] = [
  {
    id: "ibus001", operator: "CityLink Express", busType: "Luxury", departureTime: "09:00 AM", arrivalTime: "03:00 PM", duration: "6h 0m", price: 35, availableSeats: 22, rating: 4.5, fareType: "PAY_NOW",
    amenities: { ac: true, wifi: true, usb: true, reclinerSeats: true, onboardRestroom: true, tv: true }, tripType: "Day", stops: 1, departureStation: "Douala Central", arrivalStation: "Yaoundé Main",
    operatorLogo: "https://placehold.co/100x50.png?text=CityLink", dataAiHintOperatorLogo: "bus logo",
    safetyFeatures: { femaleOnlySeatingAvailable: true, wheelchairAccessible: true },
    totalSeats: 40, seatsLayout: { rows: 10, cols: 4, aisleAfter: 2, seatTypes: {"1A": "extraLegroom", "5B": "recliner"} },
    operatorPolicies: { refund: "70% refund up to 24h before", luggage: "1 large bag, 1 carry-on free" },
    operatorImages: [{src:"https://placehold.co/300x200.png?text=Luxury+Bus+Interior", alt: "Luxury Bus Interior", dataAiHint: "bus interior luxury"}]
  },
  {
    id: "ibus002", operator: "RoadRunner Connect", busType: "Standard", departureTime: "01:30 PM", arrivalTime: "08:00 PM", duration: "6h 30m", price: 28, availableSeats: 40, rating: 3.8, fareType: "RESERVE_LATER",
    amenities: { ac: true, wifi: false, usb: true, reclinerSeats: false, onboardRestroom: true }, tripType: "Day", stops: 2, departureStation: "Douala North", arrivalStation: "Yaoundé South",
    operatorLogo: "https://placehold.co/100x50.png?text=RoadRunner", dataAiHintOperatorLogo: "bus logo",
    safetyFeatures: { childFriendlySeatingAvailable: true },
    totalSeats: 50, seatsLayout: { rows: 13, cols: 4, aisleAfter: 2 },
    operatorPolicies: { refund: "No refund within 48h", luggage: "Per kg charge for >20kg" },
  },
  {
    id: "ibus003", operator: "NightOwl Transits", busType: "Sleeper", departureTime: "10:00 PM", arrivalTime: "05:00 AM", duration: "7h 0m", price: 45, availableSeats: 15, rating: 4.2, fareType: "PAY_NOW",
    amenities: { ac: true, wifi: true, usb: true, reclinerSeats: true, onboardRestroom: true }, tripType: "Night", stops: 0, departureStation: "Douala Express", arrivalStation: "Yaoundé Capital",
    operatorLogo: "https://placehold.co/100x50.png?text=NightOwl", dataAiHintOperatorLogo: "bus logo",
    totalSeats: 30, seatsLayout: { rows: 8, cols: 4, aisleAfter: 2, seatTypes: {"S1": "recliner"}},
    operatorPolicies: { refund: "50% refund up to 12h before", luggage: "2 bags free" },
    operatorImages: [{src:"https://placehold.co/300x200.png?text=Sleeper+Bus+Berth", alt: "Sleeper Bus Berth", dataAiHint: "bus sleeper berth"}]
  },
   {
    id: "ibus004", operator: "Budget Ways", busType: "Standard", departureTime: "07:00 AM", arrivalTime: "02:30 PM", duration: "7h 30m", price: 20, availableSeats: 50, rating: 3.2, fareType: "RESERVE_LATER",
    amenities: { ac: false, wifi: false, usb: false, reclinerSeats: false, onboardRestroom: false }, tripType: "Day", stops: 3, departureStation: "Douala Public", arrivalStation: "Yaoundé East",
    safetyFeatures: { femaleOnlySeatingAvailable: false, wheelchairAccessible: false, childFriendlySeatingAvailable: false },
  }
];

const getSeatLabel = (rowIndex: number, colIndex: number, layout: {cols: number, aisleAfter: number}) => {
  const row = rowIndex + 1;
  let letter = String.fromCharCode(65 + colIndex); 
  if (layout && layout.cols && colIndex >= layout.aisleAfter) { // check layout exists
      letter = String.fromCharCode(65 + colIndex); 
  }
  return `${row}${letter}`;
};


function RideBookingForm() {
  const { toast } = useToast();
  const { selectedCurrency, getTranslatedText } = useLocalization();
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingRides, setIsFetchingRides] = useState(false);

  const rideForm = useForm<RideBookingFormValues>({
    resolver: zodResolver(rideBookingSchema),
    defaultValues: {
      pickupLocation: "", 
      dropoffLocation: "",
      scheduleRide: false, 
      wheelchairAccessible: false, 
      babySeat: false, 
      petFriendly: false,
      filterEconomy: true,
      filterComfort: true,
      filterSuv: true,
      filterPremium: false,
      filterQuietRide: false,
      filterWifi: false,
      filterAC: false,
    },
  });

  useEffect(() => {
    if (!rideForm.getValues("pickupDate")) {
      rideForm.setValue("pickupDate", new Date(), { shouldValidate: true });
    }
    if (!rideForm.getValues("pickupTime")) {
      rideForm.setValue("pickupTime", format(new Date(), "HH:mm"), { shouldValidate: true });
    }
  }, [rideForm]);

  async function onRideSubmit(data: RideBookingFormValues) {
    setIsFetchingRides(true);
    setRideOptions([]);
    console.log("Transport Request Submitted:", data);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const mockOptions: RideOption[] = [
      { 
        id: 'eco1', vehicleType: 'Economy', vehicleImage: 'https://placehold.co/120x80.png?text=Economy+Car', dataAiHint: 'sedan compact', estimatedFare: 4.50, eta: '3 min', 
        fareBreakdown: 'Base: $2, Dist: $1.5, Time: $1, Fee: $0.5 (Demo)', 
        features: ['AC', 'Radio', 'Max 3 Passengers'],
        userPreferenceMatch: data.filterQuietRide ? 'Matches your quiet ride preference (Demo)' : undefined
      },
      { 
        id: 'comf1', vehicleType: 'Comfort', vehicleImage: 'https://placehold.co/120x80.png?text=Comfort+Car', dataAiHint: 'sedan comfort', estimatedFare: 6.75, eta: '5 min',
        fareBreakdown: 'Base: $3, Dist: $2, Time: $1.75, Fee: $0.5 (Demo)', 
        features: ['AC', 'Wi-Fi', 'Quiet Ride Option', 'Phone Charger'],
      },
      { 
        id: 'suv1', vehicleType: 'SUV/XL', vehicleImage: 'https://placehold.co/120x80.png?text=SUV', dataAiHint: 'suv vehicle black', estimatedFare: 9.00, eta: '7 min',
        fareBreakdown: 'Base: $4, Dist: $3, Time: $2, Fee: $1 (Demo)', 
        features: ['AC', 'Extra Space', 'Luggage Rack', 'Pet-friendly'],
        userPreferenceMatch: data.petFriendly ? 'Matches your pet-friendly preference (Demo)' : undefined
      },
      { 
        id: 'pick1', vehicleType: 'Pickup', vehicleImage: 'https://placehold.co/120x80.png?text=Pickup+Truck', dataAiHint: 'pickup truck red', estimatedFare: 12.00, eta: '10 min',
        fareBreakdown: 'Base: $5, Dist: $4, Time: $3, Fee: $1 (Demo)',
        features: ['AC', 'Cargo Space', 'Towing Capable', 'Wheelchair Accessible Option'],
        userPreferenceMatch: data.wheelchairAccessible ? 'Matches your accessibility preference (Demo)' : undefined
      },
      { 
        id: 'prem1', vehicleType: 'Premium', vehicleImage: 'https://placehold.co/120x80.png?text=Premium+Car', dataAiHint: 'luxury car black', estimatedFare: 15.00, eta: '6 min',
        fareBreakdown: 'Base: $6, Dist: $5, Time: $3, Fee: $1 (Demo)',
        features: ['AC', 'Wi-Fi', 'Leather Seats', 'Bottled Water', 'Premium Sound'],
      },
    ];
    
    const filteredOptions = mockOptions.filter(option => {
        if (!data.filterEconomy && option.vehicleType === 'Economy') return false;
        if (!data.filterComfort && option.vehicleType === 'Comfort') return false;
        if (!data.filterSuv && (option.vehicleType === 'SUV/XL' || option.vehicleType === 'Pickup')) return false;
        if (!data.filterPremium && option.vehicleType === 'Premium') return false;
        if (data.wheelchairAccessible && !option.features?.includes('Wheelchair Accessible Option')) return false; 
        if (data.petFriendly && !option.features?.includes('Pet-friendly')) return false; 
        if (data.filterWifi && !option.features?.includes('Wi-Fi')) return false;
        if (data.filterAC && !option.features?.includes('AC')) return false;
        if (data.filterQuietRide && !option.features?.includes('Quiet Ride Option')) return false;
        return true;
    });

    setRideOptions(filteredOptions);
    setIsFetchingRides(false);

    toast({
      title: filteredOptions.length > 0 ? "Ride Options Found!" : "No Rides Found",
      description: filteredOptions.length > 0 ? `Showing available rides from ${data.pickupLocation} to ${data.dropoffLocation}.` : "Try adjusting your filters or try again later.",
    });
  }
  
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "Geolocation Error", description: "Geolocation is not supported by your browser." });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const demoAddress = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Demo Address)`;
        rideForm.setValue("pickupLocation", demoAddress, { shouldValidate: true });
        toast({ title: "Location Found!", description: "Pickup location set to your current position (simulated address)." });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Could not get your location.";
        if (error.code === error.PERMISSION_DENIED) errorMessage = "Geolocation permission denied.";
        setIsLocating(false);
        toast({ variant: "destructive", title: "Geolocation Error", description: errorMessage });
      }
    );
  };

  const handleChooseRide = (ride: RideOption) => {
    toast({
        title: `Ride Selected: ${ride.vehicleType}`,
        description: `Fare: ${selectedCurrency.symbol}${ride.estimatedFare.toFixed(2)} (${selectedCurrency.code}). Driver details and real-time tracking would appear now. Price lock for 3 mins (Demo).`,
        duration: 7000,
    });
  }

  return (
     <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{getTranslatedText('transport.requestRideTitle', 'Request or Schedule a Ride')}</CardTitle>
          <CardDescription>{getTranslatedText('transport.requestRideDescription', 'Auto-fill destination from accommodation/calendar (Demo feature). Trip reminders for scheduled rides (Demo).')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...rideForm}>
            <form onSubmit={rideForm.handleSubmit(onRideSubmit)} className="space-y-6">
              <div className="relative space-y-4">
                <FormField control={rideForm.control} name="pickupLocation" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><CircleDot className="h-5 w-5 text-primary" /> {getTranslatedText('transport.pickupLocation', 'Pickup Location')}</FormLabel><div className="flex items-center gap-2"><FormControl><Input placeholder={getTranslatedText('transport.pickupPlaceholder', "Enter pickup location")} {...field} value={field.value || ''} /></FormControl><TooltipProvider><Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" onClick={handleGeolocate} disabled={isLocating} aria-label={getTranslatedText('transport.useCurrentLocation', "Use current location")}><LocateFixed className={`h-5 w-5 ${isLocating ? 'animate-spin' : ''}`} /></Button></TooltipTrigger><TooltipContent><p>{getTranslatedText('transport.useCurrentLocation', 'Use my current location')}</p></TooltipContent></Tooltip></TooltipProvider></div><FormMessage /></FormItem>)} />
                <div className="absolute left-[9px] top-[calc(2.5rem+10px)] h-[calc(100%-5rem-20px)] w-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>
                <FormField control={rideForm.control} name="dropoffLocation" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><SquareDot className="h-5 w-5 text-primary" /> {getTranslatedText('transport.dropoffLocation', 'Dropoff Location')}</FormLabel><FormControl><Input placeholder={getTranslatedText('transport.dropoffPlaceholder', "Enter dropoff location")} {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Button variant="link" size="sm" className="p-0 h-auto" disabled><PlusCircle className="h-3 w-3 mr-1"/>{getTranslatedText('transport.addStops', 'Add multiple stops')} ({getTranslatedText('transport.comingSoon', 'Coming Soon')})</Button>
                    <Separator orientation="vertical" className="h-3"/>
                    <Button variant="link" size="sm" className="p-0 h-auto" disabled><RefreshCcw className="h-3 w-3 mr-1"/>{getTranslatedText('transport.scheduleReturn', 'Schedule return trip')} ({getTranslatedText('transport.comingSoon', 'Coming Soon')})</Button>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={rideForm.control} name="pickupDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{getTranslatedText('transport.pickupDate', 'Pickup Date')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); if (date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) { const currentTime = format(new Date(), "HH:mm"); if (!rideForm.getValues("pickupTime") || rideForm.getValues("pickupTime")! < currentTime) { rideForm.setValue("pickupTime", currentTime, {shouldValidate: true}); } } }} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={rideForm.control} name="pickupTime" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{getTranslatedText('transport.pickupTime', 'Pickup Time')}</FormLabel><FormControl><Input type="time" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={rideForm.control} name="scheduleRide" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value || false} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">{getTranslatedText('transport.scheduleAdvance', 'Schedule this ride in advance')}</FormLabel></FormItem>)} />
              
              <Card className="border-dashed">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Filter className="h-5 w-5"/>{getTranslatedText('transport.filtersPreferences', 'Filters & Preferences')} ({getTranslatedText('transport.demo', 'Demo')})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <FormLabel className="text-xs font-medium">{getTranslatedText('transport.rideTypes', 'Ride Types')}</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                            <FormField control={rideForm.control} name="filterEconomy" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">{getTranslatedText('transport.economy', 'Economy')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="filterComfort" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">{getTranslatedText('transport.comfort', 'Comfort')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="filterSuv" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">{getTranslatedText('transport.suvXl', 'SUV/XL')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="filterPremium" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">{getTranslatedText('transport.premium', 'Premium')}</FormLabel></FormItem>)} />
                        </div>
                    </div>
                      <div>
                        <FormLabel className="text-xs font-medium">{getTranslatedText('transport.accessibilityNeeds', 'Accessibility & Needs')}</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                            <FormField control={rideForm.control} name="wheelchairAccessible" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Accessibility className="h-4 w-4"/>{getTranslatedText('transport.wheelchair', 'Wheelchair')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="babySeat" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Baby className="h-4 w-4"/>{getTranslatedText('transport.babySeat', 'Baby Seat')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="petFriendly" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Dog className="h-4 w-4"/>{getTranslatedText('transport.petFriendly', 'Pet Friendly')}</FormLabel></FormItem>)} />
                        </div>
                    </div>
                      <div>
                        <FormLabel className="text-xs font-medium">{getTranslatedText('transport.ridePreferences', 'Ride Preferences')}</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                            <FormField control={rideForm.control} name="filterQuietRide" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><VolumeX className="h-4 w-4"/>{getTranslatedText('transport.quietRide', 'Quiet Ride')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="filterWifi" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Wifi className="h-4 w-4"/>{getTranslatedText('transport.wifi', 'Wi-Fi')}</FormLabel></FormItem>)} />
                            <FormField control={rideForm.control} name="filterAC" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Snowflake className="h-4 w-4"/>{getTranslatedText('transport.ac', 'AC')}</FormLabel></FormItem>)} />
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isFetchingRides}>
                <Search className="mr-2 h-5 w-5" /> {isFetchingRides ? getTranslatedText('transport.fetchingRides', "Fetching Rides...") : getTranslatedText('transport.seePrices', "See Prices")}
              </Button>
            </form>
          </Form>

          {isFetchingRides && (
            <div className="text-center py-6">
                <Car className="h-10 w-10 text-primary animate-bounce mx-auto mb-2"/>
                <p className="text-muted-foreground">{getTranslatedText('transport.findingBestRides', 'Finding best rides for you...')}</p>
            </div>
          )}

          {!isFetchingRides && rideOptions.length > 0 && (
            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold">{getTranslatedText('transport.availableRideOptions', 'Available Ride Options')} ({rideOptions.length})</h3>
                {rideOptions.map((option) => (
                    <Card key={option.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 p-3">
                            <div className="sm:col-span-3 relative w-full h-24 sm:h-full rounded-md overflow-hidden">
                                <Image src={option.vehicleImage} alt={option.vehicleType} layout="fill" objectFit="cover" data-ai-hint={option.dataAiHint} />
                            </div>
                            <div className="sm:col-span-6">
                                <CardTitle className="text-md font-semibold">{option.vehicleType}</CardTitle>
                                <CardDescription className="text-xs">ETA: {option.eta}</CardDescription>
                                {option.features && option.features.length > 0 && (
                                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground">
                                        {option.features.map(feat => {
                                            let Icon = Settings; 
                                            if (feat.toLowerCase().includes('ac')) Icon = Snowflake;
                                            else if (feat.toLowerCase().includes('wi-fi')) Icon = Wifi;
                                            else if (feat.toLowerCase().includes('pet-friendly')) Icon = Dog;
                                            else if (feat.toLowerCase().includes('wheelchair')) Icon = Accessibility;
                                            else if (feat.toLowerCase().includes('quiet')) Icon = VolumeX;
                                            return <span key={feat} className="flex items-center gap-1"><Icon className="h-3.5 w-3.5"/>{feat}</span>
                                        })}
                                    </div>
                                )}
                                {option.userPreferenceMatch && <p className="text-xs text-green-600 mt-1">{option.userPreferenceMatch}</p>}
                            </div>
                            <div className="sm:col-span-3 text-left sm:text-right">
                                <p className="text-lg font-bold text-primary">{selectedCurrency.symbol}{option.estimatedFare.toFixed(2)} <span className="text-xs text-muted-foreground">({selectedCurrency.code})</span></p>
                                {option.fareBreakdown && <p className="text-xs text-muted-foreground cursor-pointer hover:underline" onClick={() => toast({title: getTranslatedText('transport.fareBreakdownTitle', "Fare Breakdown (Demo)"), description: option.fareBreakdown})}>{getTranslatedText('transport.fareDetails', 'Fare Details')}</p> }
                                <Button size="sm" className="mt-2 w-full sm:w-auto" onClick={() => handleChooseRide(option)}>{getTranslatedText('transport.choose', 'Choose')}</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
          )}
            {!isFetchingRides && rideForm.formState.isSubmitted && rideOptions.length === 0 && (
              <Card className="mt-8 text-center py-8 bg-muted/30">
                <CardContent>
                    <Car className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-md font-semibold">{getTranslatedText('transport.noRidesMatch', 'No rides match your current filters.')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{getTranslatedText('transport.tryAdjustingFilters', 'Try adjusting your preferences or location.')}</p>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
  );
}

function RentalCarForm() {
  const { toast } = useToast();
  const { getTranslatedText } = useLocalization();
  const form = useForm<RentalCarFormValues>({
    resolver: zodResolver(rentalCarSchema),
    defaultValues: { pickupLocation: "" },
  });

  useEffect(() => {
    if (!form.getValues("pickupDate")) {
      form.setValue("pickupDate", new Date(), { shouldValidate: true });
    }
    if (!form.getValues("dropoffDate")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      form.setValue("dropoffDate", tomorrow, { shouldValidate: true });
    }
    if (!form.getValues("pickupTime")) {
        form.setValue("pickupTime", "10:00", { shouldValidate: true });
    }
    if (!form.getValues("dropoffTime")) {
        form.setValue("dropoffTime", "10:00", { shouldValidate: true });
    }
  }, [form]);


  function onSubmit(values: RentalCarFormValues) {
    console.log("Rental Car:", values);
    toast({title: getTranslatedText('transport.carRentalSearchTitle', "Car Rental Search (Demo)"), description: getTranslatedText('transport.searchingCars', "Searching for available rental cars...")});
  }
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{getTranslatedText('transport.pickupLocation', 'Pickup Location')}</FormLabel>
                <FormControl><Input placeholder={getTranslatedText('transport.pickupCityAirport', "Enter pickup city or airport")} {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{getTranslatedText('transport.dropoffLocationOptional', 'Dropoff Location (Optional)')}</FormLabel>
                <FormControl><Input placeholder={getTranslatedText('transport.dropoffSameAsPickup', "Leave blank if same as pickup")} {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{getTranslatedText('transport.pickupDate', 'Pickup Date')}</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="pickupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{getTranslatedText('transport.pickupTime', 'Pickup Time')}</FormLabel>
                <FormControl><Input type="time" {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dropoffDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{getTranslatedText('transport.dropoffDate', 'Dropoff Date')}</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("pickupDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="dropoffTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{getTranslatedText('transport.dropoffTime', 'Dropoff Time')}</FormLabel>
                <FormControl><Input type="time" {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
           <Search className="mr-2 h-4 w-4" /> {getTranslatedText('transport.searchCars', 'Search Cars')}
        </Button>
      </form>
    </Form>
  );
}

function FlightSearchForm() {
  const { toast } = useToast();
  const { getTranslatedText } = useLocalization();
  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: { origin: "", destination: ""},
  });

   useEffect(() => {
    if (!form.getValues("departureDate")) {
      form.setValue("departureDate", new Date(), { shouldValidate: true });
    }
  }, [form]);


  function onSubmit(values: FlightSearchFormValues) {
    console.log("Flight Search:", values);
    toast({title: getTranslatedText('transport.flightSearchTitle', "Flight Search (Demo)"), description: getTranslatedText('transport.searchingFlights', "Searching for available flights...")});
  }
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Plane className="h-4 w-4 text-primary transform -rotate-45" />{getTranslatedText('transport.origin', 'Origin')}</FormLabel>
                <FormControl><Input placeholder={getTranslatedText('transport.originPlaceholder', "Enter origin airport/city (e.g., JFK)")} {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Plane className="h-4 w-4 text-primary transform rotate-45" />{getTranslatedText('transport.destination', 'Destination')}</FormLabel>
                <FormControl><Input placeholder={getTranslatedText('transport.destinationPlaceholder', "Enter destination airport/city (e.g., LHR)")} {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{getTranslatedText('transport.departureDate', 'Departure Date')}</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{getTranslatedText('transport.returnDateOptional', 'Return Date (Optional)')}</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
           <Search className="mr-2 h-4 w-4" /> {getTranslatedText('transport.searchFlights', 'Search Flights')}
        </Button>
      </form>
    </Form>
  );
}

interface PassengerDetail {
  id: string;
  name: string;
  idType: string;
  idNumber: string;
  seatPreference?: string;
}


function IntercityBusSearchForm() {
  const { toast } = useToast();
  const { selectedCurrency, getTranslatedText } = useLocalization();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IntercityBusRoute[]>([]);

  const [isSeatSelectionDialogOpen, setIsSeatSelectionDialogOpen] = useState(false);
  const [selectedRouteForSeats, setSelectedRouteForSeats] = useState<IntercityBusRoute | null>(null);
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<string[]>([]);
  
  const [isPassengerDetailsDialogOpen, setIsPassengerDetailsDialogOpen] = useState(false);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);

  const [isFareBreakdownDialogOpen, setIsFareBreakdownDialogOpen] = useState(false);
  const [addOns, setAddOns] = useState({snacks: false, insurance: false, priorityBoarding: false, extraBaggage: false, wifiVoucher: false, carbonOffset: false });

  const [isETicketDialogOpen, setIsETicketDialogOpen] = useState(false);
  const [boardingTimeRemaining, setBoardingTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  
  const [isStationInfoDialogOpen, setIsStationInfoDialogOpen] = useState(false);
  const [selectedStationInfo, setSelectedStationInfo] = useState<{name:string, amenities: string[]}|null>(null);

  const [isOperatorProfileDialogOpen, setIsOperatorProfileDialogOpen] = useState(false);
  const [selectedOperatorProfile, setSelectedOperatorProfile] = useState<IntercityBusRoute | null>(null);

  const [isLiveTrackingDialogOpen, setIsLiveTrackingDialogOpen] = useState(false);
  const [currentTrackingStatusIndex, setCurrentTrackingStatusIndex] = useState(-1);
  const mockTrackingStatuses = [
    "Trip Confirmed. Preparing for departure.",
    "Bus is at the terminal. Boarding will begin soon.",
    "Now Boarding Gate 5. Please have your E-Ticket ready.",
    "Bus Departed from Douala Central.",
    "En route to Yaoundé. Current Location: Edéa (Approx.)",
    "Short stop ahead for 10 mins at Boumnyébel.",
    "Resuming journey. Next stop: Yaoundé Main.",
    "Approaching Yaoundé. Estimated arrival in 30 minutes.",
    "Bus is 10 minutes away from Yaoundé Main.",
    "Arrived at Yaoundé Main. Thank you for choosing CityLink Express!"
  ];


  const form = useForm<IntercityBusSearchFormValues>({
    resolver: zodResolver(intercityBusSearchSchema),
    defaultValues: {
      originCity: "",
      destinationCity: "",
      passengers: 1,
      departureTime: "ANY",
      busFeatures: { ac: false, wifi: false, usb: false, reclinerSeats: false, onboardRestroom: false },
      tripType: "ANY",
      operatorRating: 0,
      fareType: "ANY",
      safetyFeatures: { femaleOnlySeating: false, wheelchairAccessible: false, childFriendlySeating: false },
    },
  });
  
  useEffect(() => {
    if (!form.getValues("departureDate")) {
      form.setValue("departureDate", new Date(), { shouldValidate: true });
    }
     if (!form.getValues("departureTime")) {
      form.setValue("departureTime", "ANY", { shouldValidate: true });
    }
  }, [form]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isETicketDialogOpen && boardingTimeRemaining > 0) {
      timer = setInterval(() => {
        setBoardingTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isETicketDialogOpen, boardingTimeRemaining]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveTrackingDialogOpen && currentTrackingStatusIndex < mockTrackingStatuses.length -1) {
        timer = setTimeout(() => {
            setCurrentTrackingStatusIndex(prev => prev + 1);
        }, 5000); // Simulate status update every 5 seconds
    }
    return () => clearTimeout(timer);
  }, [isLiveTrackingDialogOpen, currentTrackingStatusIndex, mockTrackingStatuses.length]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  async function onIntercityBusSubmit(data: IntercityBusSearchFormValues) {
    setIsSearching(true);
    setSearchResults([]);
    console.log("Intercity Bus Search Submitted:", data);
    const tripTypeMessage = data.returnDate ? getTranslatedText('transport.roundTrip', "round trip") : getTranslatedText('transport.oneWay', "one-way");

    await new Promise(resolve => setTimeout(resolve, 1500));

    const filteredResults = mockIntercityBusRoutes.filter(route => {
        let matches = true;
        // Basic match for origin/destination (simplified for demo)
        // if (data.originCity && !route.departureStation.toLowerCase().includes(data.originCity.toLowerCase())) matches = false;
        // if (data.destinationCity && !route.arrivalStation.toLowerCase().includes(data.destinationCity.toLowerCase())) matches = false;
        
        if (data.busFeatures?.ac && !route.amenities.ac) matches = false;
        if (data.busFeatures?.wifi && !route.amenities.wifi) matches = false;
        if (data.busFeatures?.usb && !route.amenities.usb) matches = false;
        if (data.busFeatures?.reclinerSeats && !route.amenities.reclinerSeats) matches = false;
        if (data.busFeatures?.onboardRestroom && !route.amenities.onboardRestroom) matches = false;
        
        if (data.tripType !== "ANY" && route.tripType.toUpperCase() !== data.tripType) matches = false;
        if (data.operatorRating && data.operatorRating > 0 && (route.rating || 0) < data.operatorRating) matches = false;
        if (data.fareType !== "ANY" && route.fareType !== data.fareType) matches = false;

        if (data.safetyFeatures?.femaleOnlySeating && !route.safetyFeatures?.femaleOnlySeatingAvailable) matches = false;
        if (data.safetyFeatures?.wheelchairAccessible && !route.safetyFeatures?.wheelchairAccessible) matches = false;
        if (data.safetyFeatures?.childFriendlySeating && !route.safetyFeatures?.childFriendlySeatingAvailable) matches = false;

        return matches;
    });
    
    setSearchResults(filteredResults);
    setIsSearching(false);
    toast({ title: getTranslatedText('transport.intercityBusRoutesFound', "Intercity Bus Routes Found!"), description: `Showing ${filteredResults.length} options for your ${tripTypeMessage} trip.` });
  }

  const handleViewSeats = (route: IntercityBusRoute) => {
    setSelectedRouteForSeats(route);
    const numPassengers = form.getValues("passengers") || 1;
    setPassengers(Array(numPassengers).fill(null).map((_, i) => ({ id: `p${i}`, name: '', idType: '', idNumber: '' })));
    setCurrentSelectedSeats([]);
    setIsSeatSelectionDialogOpen(true);
  }

  const toggleSeatSelection = (seatId: string) => {
    const passengerCount = form.getValues("passengers") || 1;
    setCurrentSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        if (prev.length < passengerCount) {
          return [...prev, seatId];
        }
        toast({
          title: "Seat Limit Reached",
          description: `You can only select up to ${passengerCount} seat(s). Deselect one to choose another.`,
          variant: "default",
        });
        return prev;
      }
    });
  };
  
  const handleSeatHover = (seatId: string, seatType?: string) => {
    let typeInfo = seatType ? `Type: ${seatType}` : 'Standard Seat';
    if (selectedRouteForSeats?.seatsLayout?.seatTypes?.[seatId]) {
        typeInfo = `Type: ${selectedRouteForSeats.seatsLayout.seatTypes[seatId]}`;
    }
    toast({
        title: `Seat ${seatId}`,
        description: `${typeInfo}. Click to select/deselect. (Demo info)`,
        duration: 2000,
    });
  };

  const handleConfirmSeats = () => {
    const passengerCount = form.getValues("passengers") || 1;
    if (currentSelectedSeats.length !== passengerCount) {
      toast({ title: "Seat Count Mismatch", description: `Please select exactly ${passengerCount} seat(s).`, variant: "destructive" });
      return;
    }
    setIsSeatSelectionDialogOpen(false);
    setIsPassengerDetailsDialogOpen(true);
  };
  
  const handlePassengerDetailChange = (index: number, field: keyof PassengerDetail, value: string) => {
    setPassengers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleConfirmPassengerDetails = () => {
    // Basic validation for demo
    if (passengers.some(p => !p.name || !p.idType || !p.idNumber)) {
        toast({ title: "Incomplete Passenger Details", description: "Please fill in all required fields for each passenger.", variant: "destructive"});
        return;
    }
    setIsPassengerDetailsDialogOpen(false);
    setIsFareBreakdownDialogOpen(true);
  };

  const handleAddOnToggle = (addOnKey: keyof typeof addOns) => {
    setAddOns(prev => ({...prev, [addOnKey]: !prev[addOnKey]}));
  };

  const calculateTotalPrice = useMemo(() => {
    if (!selectedRouteForSeats) return 0;
    let total = selectedRouteForSeats.price * (form.getValues("passengers") || 1);
    if (addOns.snacks) total += 5 * (form.getValues("passengers") || 1); // $5 per passenger
    if (addOns.insurance) total += 10; // Flat $10
    if (addOns.priorityBoarding) total += 3 * (form.getValues("passengers") || 1);
    if (addOns.extraBaggage) total += 15; // Flat $15 for extra bag
    if (addOns.wifiVoucher) total += 2;
    if (addOns.carbonOffset) total += 1;
    return total;
  }, [selectedRouteForSeats, addOns, form]);

  const handleConfirmBookingAndPay = () => {
    setIsFareBreakdownDialogOpen(false);
    setBoardingTimeRemaining(45*60); // Reset countdown
    setCurrentTrackingStatusIndex(0); // Reset tracking
    setIsETicketDialogOpen(true);
    toast({ title: "Booking Confirmed & Paid (Demo)!", description: `Total: ${selectedCurrency.symbol}${calculateTotalPrice.toFixed(2)}. Your E-Ticket is ready.` });
  };

  const handleViewStationInfo = (stationName: string) => {
      setSelectedStationInfo({name: stationName, amenities: ["Restrooms", "Waiting Area", "Snack Bar", "Ticket Office", "Parking (Paid)"]});
      setIsStationInfoDialogOpen(true);
  };
  
  const handleViewOperatorProfile = (route: IntercityBusRoute) => {
      setSelectedOperatorProfile(route);
      setIsOperatorProfileDialogOpen(true);
  };

  const handleViewLiveTracking = () => {
    setCurrentTrackingStatusIndex(0);
    setIsLiveTrackingDialogOpen(true);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{getTranslatedText('transport.searchIntercityBusTitle', 'Search Intercity Bus Tickets')}</CardTitle>
        <CardDescription>{getTranslatedText('transport.searchIntercityBusDescription', 'Find bus routes between cities, with various operators and options.')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onIntercityBusSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="originCity" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>{getTranslatedText('transport.originCity', 'Origin City')}</FormLabel><FormControl><Input placeholder={getTranslatedText('transport.originCityPlaceholder', 'e.g., Douala')} {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="destinationCity" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>{getTranslatedText('transport.destinationCity', 'Destination City')}</FormLabel><FormControl><Input placeholder={getTranslatedText('transport.destinationCityPlaceholder', 'e.g., Yaoundé')} {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="departureDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/>{getTranslatedText('transport.departureDate', 'Departure Date')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="departureTime" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary"/>{getTranslatedText('transport.time', 'Time (Optional)')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any Time" /></SelectTrigger></FormControl><SelectContent>{["ANY","06:00","09:00","12:00","15:00","18:00","21:00"].map(t=><SelectItem key={t} value={t}>{t === "ANY" ? "Any Time" : t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="passengers" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><UsersIcon className="h-4 w-4 text-primary"/>{getTranslatedText('transport.passengers', 'Passengers')}</FormLabel><FormControl><Input type="number" min="1" placeholder="1" {...field} value={field.value ?? 1} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="returnDate" render={({ field }) => ( <FormItem className="flex flex-col md:w-1/3"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/>{getTranslatedText('transport.returnDateOptional', 'Return Date (Optional)')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
            
            <Card className="border-dashed mt-4">
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><ListFilter className="h-5 w-5"/>{getTranslatedText('transport.filters', 'Filters')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <FormLabel className="text-sm font-medium block mb-1">{getTranslatedText('transport.busFeatures', 'Bus Features')}</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                            <FormField control={form.control} name="busFeatures.ac" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Snowflake className="h-4 w-4"/>{getTranslatedText('transport.ac', 'AC')}</Label></FormItem>)} />
                            <FormField control={form.control} name="busFeatures.wifi" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Wifi className="h-4 w-4"/>{getTranslatedText('transport.wifi', 'Wi-Fi')}</Label></FormItem>)} />
                            <FormField control={form.control} name="busFeatures.usb" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Power className="h-4 w-4"/>{getTranslatedText('transport.usbCharging', 'USB Charging')}</Label></FormItem>)} />
                            <FormField control={form.control} name="busFeatures.reclinerSeats" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Sofa className="h-4 w-4"/>{getTranslatedText('transport.reclinerSeats', 'Recliner Seats')}</Label></FormItem>)} />
                            <FormField control={form.control} name="busFeatures.onboardRestroom" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Wind className="h-4 w-4"/>{getTranslatedText('transport.onboardRestroom', 'Onboard Restroom')}</Label></FormItem>)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <FormField control={form.control} name="tripType" render={({ field }) => (<FormItem><FormLabel className="text-sm">{getTranslatedText('transport.tripType', 'Trip Type')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY"><Sun className="inline h-4 w-4 mr-1"/><Moon className="inline h-4 w-4 mr-1"/>Any</SelectItem><SelectItem value="DAY"><Sun className="inline h-4 w-4 mr-1"/>Day</SelectItem><SelectItem value="NIGHT"><Moon className="inline h-4 w-4 mr-1"/>Night</SelectItem></SelectContent></Select></FormItem>)} />
                        <FormField control={form.control} name="operatorRating" render={({ field }) => (<FormItem><FormLabel className="text-sm">{getTranslatedText('transport.operatorRating', 'Min. Operator Rating')}</FormLabel><Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}><FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl><SelectContent>{[0,1,2,3,4,5].map(r=><SelectItem key={r} value={r.toString()}>{r === 0 ? "Any" : `${r}+ Stars`}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                        <FormField control={form.control} name="fareType" render={({ field }) => (<FormItem><FormLabel className="text-sm">{getTranslatedText('transport.fareType', 'Fare Type')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any</SelectItem><SelectItem value="PAY_NOW">Pay Now</SelectItem><SelectItem value="RESERVE_LATER">Reserve (Pay Later)</SelectItem></SelectContent></Select><FormDescription className="text-xs">Reserve holds seat for 1hr (Demo).</FormDescription></FormItem>)} />
                    </div>
                     <div>
                        <FormLabel className="text-sm font-medium block mb-1">{getTranslatedText('transport.safetyAccessibility', 'Safety & Accessibility')}</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
                            <FormField control={form.control} name="safetyFeatures.femaleOnlySeating" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><PersonStanding className="h-4 w-4"/>{getTranslatedText('transport.femaleOnlySeating', 'Female-Only Area')}</Label></FormItem>)} />
                            <FormField control={form.control} name="safetyFeatures.wheelchairAccessible" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Accessibility className="h-4 w-4"/>{getTranslatedText('transport.wheelchairAccessibleBus', 'Wheelchair Accessible')}</Label></FormItem>)} />
                            <FormField control={form.control} name="safetyFeatures.childFriendlySeating" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label className="text-xs font-normal flex items-center gap-1"><Baby className="h-4 w-4"/>{getTranslatedText('transport.childFriendlySeating', 'Child-Friendly')}</Label></FormItem>)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" /> {isSearching ? getTranslatedText('transport.searchingBuses', 'Searching Buses...') : getTranslatedText('transport.searchIntercityBuses', 'Search Intercity Buses')}
            </Button>
          </form>
        </Form>

        {isSearching && ( <div className="text-center py-6"><Bus className="h-10 w-10 text-primary animate-pulse mx-auto mb-2"/><p className="text-muted-foreground">{getTranslatedText('transport.findingIntercityBusRoutes', 'Finding intercity bus routes...')}</p></div> )}

        {!isSearching && searchResults.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">{getTranslatedText('transport.availableIntercityRoutes', 'Available Intercity Routes')} ({searchResults.length})</h3>
            {searchResults.map((route) => (
              <Card key={route.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-stretch">
                    <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                        {route.operatorLogo && <Image src={route.operatorLogo} alt={`${route.operator} logo`} width={80} height={40} className="object-contain mb-1 rounded" data-ai-hint={route.dataAiHintOperatorLogo || "bus company logo"} />}
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleViewOperatorProfile(route)}>{route.operator}</Button>
                        {route.rating && ( <div className="flex items-center text-xs text-muted-foreground"> <Star className="h-3 w-3 mr-0.5 text-yellow-400 fill-yellow-400" /> {route.rating}/5 </div>)}
                    </div>
                     <div className="md:col-span-7 space-y-1">
                        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
                            <div className="font-semibold text-md flex items-center"> {route.departureTime} <MapPin className="inline h-3.5 w-3.5 text-muted-foreground mx-1"/> <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground font-normal" onClick={() => handleViewStationInfo(route.departureStation)}>{route.departureStation}</Button> </div>
                            <div className="text-xs text-muted-foreground hidden sm:block self-center">➔</div>
                            <div className="font-semibold text-md flex items-center"> {route.arrivalTime} <MapPin className="inline h-3.5 w-3.5 text-muted-foreground mx-1"/> <Button variant="link" size="sm" className="p-0 h-auto text-xs text-muted-foreground font-normal" onClick={() => handleViewStationInfo(route.arrivalStation)}>{route.arrivalStation}</Button></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{getTranslatedText('transport.duration', 'Duration')}: {route.duration}</span>
                            <span>{route.stops !== undefined ? (route.stops > 0 ? `${route.stops} Stop(s)` : "Direct") : ""}</span>
                             <Button variant="link" size="sm" className="p-0 h-auto text-xs"><Route className="inline h-3 w-3 mr-0.5"/>{getTranslatedText('transport.viewRouteMap', 'View Route Map (Demo)')}</Button>
                        </div>
                        <p className="text-xs"><Info className="inline h-3.5 w-3.5 mr-1 text-primary"/>{getTranslatedText('transport.busType', 'Bus Type')}: {route.busType}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs pt-1">
                            {route.amenities.ac && <span className="flex items-center"><Snowflake className="h-3.5 w-3.5 mr-1 text-blue-500"/>AC</span>}
                            {route.amenities.wifi && <span className="flex items-center"><Wifi className="h-3.5 w-3.5 mr-1 text-sky-500"/>WiFi</span>}
                            {route.amenities.usb && <span className="flex items-center"><Power className="h-3.5 w-3.5 mr-1 text-yellow-500"/>USB</span>}
                            {route.amenities.tv && <span className="flex items-center"><Tv className="h-3.5 w-3.5 mr-1 text-gray-500"/>TV</span>}
                            {route.amenities.reclinerSeats && <span className="flex items-center"><Sofa className="h-3.5 w-3.5 mr-1 text-purple-500"/>Recliners</span>}
                            {route.amenities.onboardRestroom && <span className="flex items-center"><Wind className="h-3.5 w-3.5 mr-1 text-teal-500"/>Restroom</span>}
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">{route.tripType} Trip | {route.availableSeats} seats available</p>
                        {route.fareType === "RESERVE_LATER" && <Badge variant="outline" className="text-xs mt-1">Reserve Now, Pay Later</Badge>}
                    </div>
                     <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center space-y-2 pt-2 md:pt-0">
                        <p className="text-2xl font-bold text-primary">{selectedCurrency.symbol}{route.price.toFixed(2)}</p>
                        <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleViewSeats(route)}> <Armchair className="mr-2 h-4 w-4"/>{getTranslatedText('transport.viewSeatsBook', 'View Seats & Book')} </Button>
                        <p className="text-xs text-muted-foreground">{getTranslatedText('transport.pricePerPassenger', 'Price per passenger')}</p>
                    </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {!isSearching && form.formState.isSubmitted && searchResults.length === 0 && (
          <Card className="mt-8 text-center py-8 bg-muted/30"><CardContent><Bus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" /><p className="text-md font-semibold">{getTranslatedText('transport.noIntercityBusRoutesFound', 'No intercity bus routes found.')}</p><p className="text-sm text-muted-foreground mt-1">{getTranslatedText('transport.tryDifferentCitiesDates', 'Try different cities or dates.')}</p></CardContent></Card>
        )}
        
        {/* Seat Selection Dialog */}
        {selectedRouteForSeats && (
            <Dialog open={isSeatSelectionDialogOpen} onOpenChange={setIsSeatSelectionDialogOpen}>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{getTranslatedText('transport.selectSeatsFor', 'Select Your Seats for')} {selectedRouteForSeats.operator}</DialogTitle>
                    <DialogDescription>
                        {getTranslatedText('transport.busType', 'Bus Type')}: {selectedRouteForSeats.busType}. {getTranslatedText('transport.pleaseSelectSeats', 'Please select')} {form.getValues("passengers") || 1} {getTranslatedText('transport.seatOrSeats', 'seat(s)')}.
                         <br/>{getTranslatedText('transport.seatAvailabilityNote', 'Seat availability is illustrative and updates in real-time (Demo). Hover for seat type (Window, Aisle, Recliner, Extra Legroom - Demo).')}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="mb-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
                        <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-green-500" />{getTranslatedText('transport.seatAvailable', 'Available')}</span>
                        <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-yellow-400" />{getTranslatedText('transport.seatReserved', 'Reserved (Demo)')}</span>
                        <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-blue-500" />{getTranslatedText('transport.seatSelected', 'Selected')}</span>
                        <span className="flex items-center"><Armchair className="h-5 w-5 mr-1 text-red-500 opacity-50" />{getTranslatedText('transport.seatTaken', 'Taken')}</span>
                    </div>
                    <div className="w-16 h-8 bg-gray-300 rounded-t-md mx-auto mb-2 flex items-center justify-center text-xs">{getTranslatedText('transport.front', 'Front')}</div>
                    <div className="bg-muted/30 p-2 sm:p-4 rounded-md flex justify-center">
                    <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${selectedRouteForSeats.seatsLayout?.cols || 4}, minmax(0, 1fr))` }}>
                        {Array.from({ length: selectedRouteForSeats.totalSeats || 40 }).map((_, index) => {
                            const layout = selectedRouteForSeats.seatsLayout || { rows: 10, cols: 4, aisleAfter: 2, seatTypes: {} };
                            const rowIndex = Math.floor(index / layout.cols);
                            const colIndex = index % layout.cols;
                            const seatId = getSeatLabel(rowIndex, colIndex, layout);
                            const seatType = layout.seatTypes?.[seatId];
                            
                            const isTaken = index % 5 === 0 || ["2A", "3C"].includes(seatId); 
                            const isSelected = currentSelectedSeats.includes(seatId);
                            const isReserved = ["1D"].includes(seatId) && !isSelected && !isTaken;

                            let seatVariant: "default" | "destructive" | "secondary" | "outline" = "outline";
                            let seatColorClass = "border-green-500 text-green-600 hover:bg-green-100 focus-visible:ring-green-400";

                            if (isTaken) { seatVariant = "secondary"; seatColorClass = "border-destructive/30 text-destructive/50 opacity-60 cursor-not-allowed bg-destructive/10"; } 
                            else if (isReserved) { seatVariant = "secondary"; seatColorClass = "border-yellow-500/50 text-yellow-600/70 opacity-70 cursor-not-allowed bg-yellow-400/20"; } 
                            else if (isSelected) { seatVariant = "default"; seatColorClass = "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary"; }

                            return ( <TooltipProvider key={seatId} delayDuration={100}><Tooltip><TooltipTrigger asChild>
                                <Button
                                    variant={seatVariant} size="icon"
                                    className={cn("h-8 w-8 sm:h-10 sm:w-10 transition-all duration-150", seatColorClass, colIndex === (layout.aisleAfter || 2) -1 ? "mr-3 sm:mr-6" : "" )}
                                    onClick={() => !isTaken && !isReserved && toggleSeatSelection(seatId)}
                                    onMouseEnter={() => !isTaken && !isReserved && handleSeatHover(seatId, seatType)}
                                    disabled={isTaken || isReserved}
                                    aria-label={`Seat ${seatId}${isTaken ? ' (Taken)' : isReserved ? ' (Reserved)' : isSelected ? ' (Selected)' : ' (Available)'}`}
                                ><Armchair className="h-4 w-4 sm:h-5 sm:w-5" /><span className="sr-only">{seatId}</span></Button>
                            </TooltipTrigger><TooltipContent><p>{getTranslatedText('transport.seat', 'Seat')} {seatId} ({seatType || 'Standard'})</p></TooltipContent></Tooltip></TooltipProvider> );
                        })}
                    </div>
                    </div>
                    <div className="mt-6">
                        <Label className="text-sm font-medium flex items-center gap-1 mb-2"><Filter className="h-4 w-4"/>{getTranslatedText('transport.seatPreferenceFilters', 'Seat Preference Filters')} ({getTranslatedText('transport.demo', 'Demo')})</Label>
                        <div className="flex flex-wrap gap-3">
                            {[getTranslatedText('transport.window', 'Window'), getTranslatedText('transport.aisle', 'Aisle'), getTranslatedText('transport.frontRow', 'Front Row'), getTranslatedText('transport.exitRow', 'Exit Row'), getTranslatedText('transport.recliner', 'Recliner'), getTranslatedText('transport.extraLegroom', 'Extra Legroom')].map(pref => (
                                <div key={pref} className="flex items-center space-x-2"><Checkbox id={`filter-${pref.toLowerCase()}`} disabled /><Label htmlFor={`filter-${pref.toLowerCase()}`} className="text-xs text-muted-foreground">{pref}</Label></div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between items-center">
                    <p className="text-sm text-muted-foreground">{getTranslatedText('transport.selected', 'Selected')}: {currentSelectedSeats.length} {getTranslatedText('transport.seatOrSeats', 'seat(s)')} - {currentSelectedSeats.join(', ')}</p>
                    <div className="flex gap-2">
                    <DialogClose asChild><Button type="button" variant="outline">{getTranslatedText('transport.cancel', 'Cancel')}</Button></DialogClose>
                    <Button type="button" onClick={handleConfirmSeats} disabled={currentSelectedSeats.length === 0 || currentSelectedSeats.length !== (form.getValues("passengers") || 1)}>{getTranslatedText('transport.confirmSeatsProceed', 'Confirm Seats & Proceed')}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}

        {/* Passenger Details Dialog */}
        {selectedRouteForSeats && (
            <Dialog open={isPassengerDetailsDialogOpen} onOpenChange={setIsPassengerDetailsDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{getTranslatedText('transport.passengerDetailsFor', 'Passenger Details for')} {form.getValues("passengers")} {getTranslatedText('transport.seatOrSeats', 'seat(s)')}</DialogTitle>
                    <DialogDescription>{getTranslatedText('transport.passengerDetailsDesc', 'Enter details for each passenger. Seats selected:')} {currentSelectedSeats.join(', ')}. <Button variant="link" size="sm" className="p-0 h-auto" disabled>{getTranslatedText('transport.loadFromSavedProfiles', 'Load from saved profiles (Demo)')}</Button></DialogDescription>
                </DialogHeader>
                <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                {passengers.map((passenger, index) => (
                    <Card key={passenger.id} className="p-4">
                        <Label className="font-semibold block mb-2">{getTranslatedText('transport.passenger', 'Passenger')} {index + 1} (Seat: {currentSelectedSeats[index]})</Label>
                        <div className="space-y-3">
                            <Input placeholder={getTranslatedText('transport.fullName', 'Full Name')} value={passenger.name} onChange={(e) => handlePassengerDetailChange(index, 'name', e.target.value)} />
                            <div className="grid grid-cols-2 gap-3">
                                <Select value={passenger.idType} onValueChange={(val) => handlePassengerDetailChange(index, 'idType', val)}>
                                    <SelectTrigger><SelectValue placeholder={getTranslatedText('transport.idType', 'ID Type')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PASSPORT">{getTranslatedText('transport.passport', 'Passport')}</SelectItem>
                                        <SelectItem value="NATIONAL_ID">{getTranslatedText('transport.nationalId', 'National ID')}</SelectItem>
                                        <SelectItem value="DRIVER_LICENSE">{getTranslatedText('transport.driverLicense', "Driver's License")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder={getTranslatedText('transport.idNumber', 'ID Number')} value={passenger.idNumber} onChange={(e) => handlePassengerDetailChange(index, 'idNumber', e.target.value)} />
                            </div>
                            <p className="text-xs text-muted-foreground">{getTranslatedText('transport.saveSeatingPrefNote', 'Seating preferences can be saved to profiles (Demo).')}</p>
                            <Button variant="outline" size="sm" disabled className="w-full"><FileTextIcon className="mr-2 h-4 w-4"/>{getTranslatedText('transport.uploadIdPassportDemo', 'Upload ID/Passport (Demo)')}</Button>
                        </div>
                    </Card>
                ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">{getTranslatedText('transport.cancel', 'Cancel')}</Button></DialogClose>
                    <Button type="button" onClick={handleConfirmPassengerDetails}>{getTranslatedText('transport.confirmDetailsProceed', 'Confirm Details & Proceed')}</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}

        {/* Fare Breakdown & Add-ons Dialog */}
        {selectedRouteForSeats && (
            <Dialog open={isFareBreakdownDialogOpen} onOpenChange={setIsFareBreakdownDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{getTranslatedText('transport.fareBreakdownAddons', 'Fare Breakdown & Add-ons')}</DialogTitle>
                    <DialogDescription>{getTranslatedText('transport.reviewFareAddExtras', 'Review your fare and add any extras for your trip.')}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <Card className="p-3">
                        <p><strong>{getTranslatedText('transport.baseFare', 'Base Fare:')}</strong> {selectedCurrency.symbol}{(selectedRouteForSeats.price * (form.getValues("passengers") || 1)).toFixed(2)} ({form.getValues("passengers")} x {selectedCurrency.symbol}{selectedRouteForSeats.price.toFixed(2)})</p>
                        <p><strong>{getTranslatedText('transport.taxesSurcharges', 'Taxes & Surcharges (Demo):')}</strong> {selectedCurrency.symbol}{(selectedRouteForSeats.price * 0.1 * (form.getValues("passengers") || 1)).toFixed(2)}</p>
                    </Card>
                     <Card className="p-3">
                        <Label className="font-semibold block mb-2">{getTranslatedText('transport.addOns', 'Add-ons (Demo):')}</Label>
                        <div className="space-y-2">
                           {[
                             {key: 'snacks', label: getTranslatedText('transport.addOnSnacks', 'Snacks/Water/Pillows'), price: 5, icon: ShoppingBag},
                             {key: 'insurance', label: getTranslatedText('transport.addOnInsurance', 'Travel Insurance'), price: 10, icon: ShieldCheck},
                             {key: 'priorityBoarding', label: getTranslatedText('transport.addOnPriorityBoarding', 'Priority Boarding'), price: 3, icon: Award},
                             {key: 'extraBaggage', label: getTranslatedText('transport.addOnExtraBaggage', 'Extra Baggage (1 piece)'), price: 15, icon: Briefcase},
                             {key: 'wifiVoucher', label: getTranslatedText('transport.addOnWifi', 'Wi-Fi Voucher'), price: 2, icon: Wifi},
                             {key: 'carbonOffset', label: getTranslatedText('transport.addOnCarbonOffset', 'Carbon Offset Donation'), price: 1, icon: Leaf},
                           ].map(item => (
                                <FormItem key={item.key} className="flex items-center justify-between space-x-2 p-2 border rounded-md">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id={item.key} checked={addOns[item.key as keyof typeof addOns]} onCheckedChange={() => handleAddOnToggle(item.key as keyof typeof addOns)} />
                                        <Label htmlFor={item.key} className="text-xs font-normal flex items-center gap-1"><item.icon className="h-4 w-4"/>{item.label}</Label>
                                    </div>
                                    <span className="text-xs">{item.price > 0 ? `+${selectedCurrency.symbol}${item.price.toFixed(2)}` : getTranslatedText('transport.included', 'Included')}</span>
                                </FormItem>
                           ))}
                        </div>
                    </Card>
                    <p className="text-lg font-bold text-right pt-2">{getTranslatedText('transport.totalPrice', 'Total Price:')} {selectedCurrency.symbol}{calculateTotalPrice.toFixed(2)}</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">{getTranslatedText('transport.cancel', 'Cancel')}</Button></DialogClose>
                    <Button type="button" onClick={handleConfirmBookingAndPay}>{getTranslatedText('transport.confirmAndPay', 'Confirm & Pay')}</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}
        
        {/* E-Ticket Dialog */}
        {selectedRouteForSeats && (
            <Dialog open={isETicketDialogOpen} onOpenChange={setIsETicketDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><TicketIcon className="h-6 w-6 text-primary"/>{getTranslatedText('transport.eTicketBoardingPass', 'E-Ticket / Boarding Pass')}</DialogTitle>
                        <DialogDescription>{getTranslatedText('transport.eTicketDesc', 'Your ticket for')} {selectedRouteForSeats.operator}. {getTranslatedText('transport.eTicketOfflineNote', 'This E-Ticket is offline accessible (Demo). Screenshot for easy access.')}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 text-center">
                        <div className="bg-muted p-4 rounded-md">
                            <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TRIPID:${selectedRouteForSeats.id}-PASSENGERS:${passengers.map(p=>p.name).join(',')}-SEATS:${currentSelectedSeats.join(',')}`} alt="QR Code" width={150} height={150} className="mx-auto rounded-md border" data-ai-hint="qr code ticket" />
                        </div>
                        <p><strong>{getTranslatedText('transport.passengerName', 'Passenger(s):')}</strong> {passengers.map(p => p.name).join(', ')}</p>
                        <p><strong>{getTranslatedText('transport.seatNumber', 'Seat(s):')}</strong> {currentSelectedSeats.join(', ')}</p>
                        <p><strong>{getTranslatedText('transport.tripId', 'Trip ID:')}</strong> {selectedRouteForSeats.id}</p>
                        <p><strong>{getTranslatedText('transport.route', 'Route:')}</strong> {selectedRouteForSeats.departureStation} to {selectedRouteForSeats.arrivalStation}</p>
                        <p><strong>{getTranslatedText('transport.departure', 'Departure:')}</strong> {format(form.getValues("departureDate"), "PPP")} at {selectedRouteForSeats.departureTime}</p>
                         <Card className="mt-3 p-3 bg-accent/20">
                            <p className="text-lg font-semibold text-accent-foreground">{getTranslatedText('transport.boardingIn', 'Boarding in:')} <span className="tabular-nums">{formatTime(boardingTimeRemaining)}</span></p>
                        </Card>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                         <Button variant="outline" className="w-full sm:w-auto" onClick={handleViewLiveTracking}><Navigation className="mr-2 h-4 w-4"/> {getTranslatedText('transport.liveTrackBus', 'Live Track Bus')}</Button>
                        <DialogClose asChild><Button type="button" className="w-full sm:w-auto">{getTranslatedText('transport.close', 'Close')}</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        
        {/* Station Info Dialog */}
        {selectedStationInfo && (
            <Dialog open={isStationInfoDialogOpen} onOpenChange={setIsStationInfoDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary"/>{selectedStationInfo.name} - {getTranslatedText('transport.stationInformation', 'Station Information')}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <p><strong>{getTranslatedText('transport.gateNumberDemo', 'Gate Number (Demo):')}</strong> B5 / Platform 2</p>
                        <p><strong>{getTranslatedText('transport.parkingInfoDemo', 'Parking Info (Demo):')}</strong> Short-term & Long-term available, $5/hr</p>
                        <div><strong>{getTranslatedText('transport.amenities', 'Amenities:')}</strong>
                            <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground">
                                {selectedStationInfo.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
                            </ul>
                        </div>
                        <Button className="w-full mt-3" onClick={() => toast({title: getTranslatedText('transport.liveNavigationDemo', 'Live Navigation (Demo)'), description: `${getTranslatedText('transport.startingNavigationTo', 'Starting turn-by-turn navigation to')} ${selectedStationInfo.name} ${getTranslatedText('transport.viaGoogleMaps', 'via Google Maps/OpenStreetMap.')}`})}>
                           <Navigation className="mr-2 h-4 w-4"/> {getTranslatedText('transport.getDirectionsToStation', 'Get Directions to Station (Demo)')}
                        </Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button">{getTranslatedText('transport.close', 'Close')}</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        
        {/* Operator Profile Dialog */}
        {selectedOperatorProfile && (
             <Dialog open={isOperatorProfileDialogOpen} onOpenChange={setIsOperatorProfileDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedOperatorProfile.operatorLogo && <Image src={selectedOperatorProfile.operatorLogo} alt={`${selectedOperatorProfile.operator} logo`} width={40} height={20} className="object-contain rounded" data-ai-hint={selectedOperatorProfile.dataAiHintOperatorLogo || "bus company logo"} />}
                            {selectedOperatorProfile.operator} - {getTranslatedText('transport.operatorProfile', 'Operator Profile')}
                            <BadgeCheck className="h-6 w-6 text-green-500 ml-2" /> <span className="text-sm font-normal text-green-600">{getTranslatedText('transport.verifiedProviderDemo', 'Verified Provider (Demo)')}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <h4 className="font-semibold mb-1">{getTranslatedText('transport.ratingsDemo', 'Ratings (Demo):')}</h4>
                            <p className="text-sm ml-2"><strong>{getTranslatedText('transport.overall', 'Overall:')}</strong> {selectedOperatorProfile.rating || 'N/A'}/5 <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400"/></p>
                            <p className="text-sm ml-2"><strong>{getTranslatedText('transport.punctuality', 'Punctuality:')}</strong> 4.2/5</p>
                            <p className="text-sm ml-2"><strong>{getTranslatedText('transport.comfort', 'Comfort:')}</strong> 4.0/5</p>
                            <p className="text-sm ml-2"><strong>{getTranslatedText('transport.cleanliness', 'Cleanliness:')}</strong> 4.3/5</p>
                        </div>
                        {selectedOperatorProfile.operatorImages && selectedOperatorProfile.operatorImages.length > 0 && (
                             <div>
                                <h4 className="font-semibold mb-1">{getTranslatedText('transport.busImagesTypes', 'Bus Images & Types (Demo):')}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                {selectedOperatorProfile.operatorImages.map(img => (
                                    <Image key={img.src} src={img.src} alt={img.alt} width={200} height={120} className="rounded-md object-cover" data-ai-hint={img.dataAiHint}/>
                                ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Types: {selectedOperatorProfile.busType}, Standard AC, Mini-bus</p>
                            </div>
                        )}
                        {selectedOperatorProfile.operatorPolicies && (
                            <div>
                                <h4 className="font-semibold mb-1">{getTranslatedText('transport.policies', 'Policies:')}</h4>
                                <p className="text-sm ml-2"><strong>{getTranslatedText('transport.refundPolicy', 'Refund:')}</strong> {selectedOperatorProfile.operatorPolicies.refund}</p>
                                <p className="text-sm ml-2"><strong>{getTranslatedText('transport.luggagePolicy', 'Luggage:')}</strong> {selectedOperatorProfile.operatorPolicies.luggage}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter> <DialogClose asChild><Button type="button">{getTranslatedText('transport.close', 'Close')}</Button></DialogClose> </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

        {/* Live Tracking Dialog */}
        {isLiveTrackingDialogOpen && selectedRouteForSeats && (
            <Dialog open={isLiveTrackingDialogOpen} onOpenChange={setIsLiveTrackingDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Navigation className="h-6 w-6 text-primary"/>{getTranslatedText('transport.liveBusTracking', 'Live Bus Tracking')}</DialogTitle>
                        <DialogDescription>{getTranslatedText('transport.trackingTrip', 'Tracking trip')} {selectedRouteForSeats.id} ({selectedRouteForSeats.departureStation} to {selectedRouteForSeats.arrivalStation})</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center border mb-3">
                           <Image src={`https://placehold.co/600x338.png?text=Live+Map+ETA+${currentTrackingStatusIndex >= 0 ? mockTrackingStatuses[currentTrackingStatusIndex].match(/ETA: (\d{1,2}:\d{2} [AP]M)/i)?.[1]?.replace(':','-') || 'On+Time' : 'Loading...'}`} alt="Live map with ETA" width={600} height={338} className="object-cover w-full h-full" data-ai-hint="city map bus route"/>
                        </div>
                        <h4 className="font-semibold">{getTranslatedText('transport.currentStatus', 'Current Status:')}</h4>
                        {currentTrackingStatusIndex === -1 && <p className="text-muted-foreground">{getTranslatedText('transport.initializingTracking', 'Initializing tracking...')}</p>}
                        {currentTrackingStatusIndex >=0 && <p className="text-primary animate-pulse">{mockTrackingStatuses[currentTrackingStatusIndex]}</p>}
                        <Progress value={((currentTrackingStatusIndex + 1) / mockTrackingStatuses.length) * 100} className="w-full h-2 mt-1" />
                        
                        <Card className="mt-4 p-3 bg-muted/50">
                            <h5 className="font-medium text-sm mb-1">{getTranslatedText('transport.alertsDemo', 'Alerts (Demo):')}</h5>
                            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                                <li>{getTranslatedText('transport.alertBus10Min', 'Bus is 10 minutes away (Notification Sent)')}</li>
                                <li>{getTranslatedText('transport.alertNowBoarding', 'Now Boarding (Notification Sent)')}</li>
                                {currentTrackingStatusIndex > 5 && <li>{getTranslatedText('transport.alertTripDelayed', 'Trip Delayed – New ETA: 3:55 PM (Example Alert)')}</li>}
                            </ul>
                        </Card>
                    </div>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => toast({title: getTranslatedText('transport.contactOperatorDemo', 'Contact Operator (Demo)'), description: getTranslatedText('transport.openingChatWith', 'Opening chat with operator...')})}><MessageCircle className="mr-2 h-4 w-4"/>{getTranslatedText('transport.chatWithOperator', 'Chat with Operator')}</Button>
                        <DialogClose asChild><Button type="button">{getTranslatedText('transport.close', 'Close')}</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}


        <Card className="mt-10">
            <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Settings className="h-5 w-5"/>{getTranslatedText('transport.intercityBusFeaturesTitle', 'Intercity Bus Features')} ({getTranslatedText('transport.comingSoonDemo', 'Coming Soon / Demo')})</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-1"><Contact className="h-4 w-4"/>{getTranslatedText('transport.featurePassengerInfoManagement', 'Passenger Info Management (saved profiles, doc upload)')}</p>
                <p className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/>{getTranslatedText('transport.featureBusChatAnnouncements', 'Bus Chat (passengers) & Operator Announcements (short stop, delay, gate change, seat adjustment)')}</p>
                 <p className="text-xs pt-2">{getTranslatedText('transport.emergencySosNote', 'Emergency SOS button is available in the main app header.')}</p>
            </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}


function TransportationSearchForm() {
  const { getTranslatedText } = useLocalization();
  return (
    <Tabs defaultValue="rides" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="rides" className="py-2.5 gap-2"><Car className="h-5 w-5" />{getTranslatedText('transport.tabRideBooking', 'Ride Booking')}</TabsTrigger>
          <TabsTrigger value="intercity-bus" className="py-2.5 gap-2"><Bus className="h-5 w-5" />{getTranslatedText('transport.tabIntercityBus', 'Intercity Bus')}</TabsTrigger>
          <TabsTrigger value="cars" className="py-2.5 gap-2"><CarFront className="h-5 w-5" />{getTranslatedText('transport.tabRentalCars', 'Rental Cars')}</TabsTrigger>
          <TabsTrigger value="flights" className="py-2.5 gap-2"><Plane className="h-5 w-5" />{getTranslatedText('transport.tabFlights', 'Flights')}</TabsTrigger>
        </TabsList>
        <TabsContent value="rides">
          <RideBookingForm />
        </TabsContent>
        <TabsContent value="intercity-bus">
          <IntercityBusSearchForm />
        </TabsContent>
        <TabsContent value="cars">
          <RentalCarForm />
        </TabsContent>
        <TabsContent value="flights">
          <FlightSearchForm />
        </TabsContent>
      </Tabs>
  );
}

export default function TransportPage() {
  const { toast } = useToast();
  const { getTranslatedText } = useLocalization();
  
  const handleShareTrip = () => {
    toast({ title: getTranslatedText('transport.shareTripTitle', "Share My Trip (Demo)"), description: getTranslatedText('transport.shareTripDescription', "Trip details shared with emergency contacts (simulation).") });
  };

  const handleNavigationAssistant = () => {
    toast({ title: getTranslatedText('transport.navAssistantTitle', "Navigation Assistant (Demo)"), description: getTranslatedText('transport.navAssistantDescription', "Starting GPS voice navigation to destination (simulation).") });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" /> {/* Using Plane as a general transport icon */}
            {getTranslatedText('transport.pageTitle', 'Plan Your Journey')}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {getTranslatedText('transport.pageDescription', 'Request a ride, book intercity bus tickets, find rental cars, or explore various transport options.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <TransportationSearchForm />
              
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary"/>{getTranslatedText('transport.realTimeMapTitle', 'Real-Time Interactive Map')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{getTranslatedText('transport.realTimeMapDescription', 'View live vehicle locations, estimated arrival times, and route previews. (Full real-time map functionality requires backend services and mapping APIs like Google Maps or Mapbox.)')}</p>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                        <Image src="https://placehold.co/800x450.png?text=Live+Map+View+Placeholder" alt="Real-time map placeholder" width={800} height={450} className="object-cover w-full h-full" data-ai-hint="city map vehicles" />
                    </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleShareTrip}><Share2 className="mr-2 h-4 w-4"/> {getTranslatedText('transport.shareMyTrip', 'Share My Trip')} ({getTranslatedText('transport.demo', 'Demo')})</Button>
                        <Button variant="outline" size="sm" onClick={handleNavigationAssistant}><Navigation className="mr-2 h-4 w-4"/> {getTranslatedText('transport.navigationAssistant', 'Navigation Assistant')} ({getTranslatedText('transport.demo', 'Demo')})</Button>
                    </div>
                </CardContent>
                  <CardFooter><p className="text-xs text-muted-foreground">{getTranslatedText('transport.interactiveMapSimulation', 'Interactive map simulation.')}</p></CardFooter>
              </Card>
              
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><UsersIcon className="h-5 w-5 text-primary"/>{getTranslatedText('transport.carpoolTitle', 'Carpool & Ride Sharing')}</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{getTranslatedText('transport.carpoolDescription', 'Feature coming soon! Find travelers with similar routes to share rides and split fares.')}</p>
                        <Button variant="outline" className="w-full mt-2" disabled>{getTranslatedText('transport.exploreCarpool', 'Explore Carpool Options')} ({getTranslatedText('transport.demo', 'Demo')})</Button>
                    </CardContent>
              </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-xl">{getTranslatedText('transport.destinationSuggestionsTitle', 'Destination Suggestions')}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {destinationSuggestions.map((suggestion) => (<Button key={suggestion.id} variant="ghost" className="flex flex-col items-start space-x-0 p-3 w-full h-auto text-left hover:bg-muted/80" onClick={() => { const rideFormEl = document.querySelector('input[name="pickupLocation"]')?.closest('form'); if(rideFormEl) { const dropoffInput = rideFormEl.elements.namedItem('dropoffLocation') as HTMLInputElement | null; if(dropoffInput) dropoffInput.value = suggestion.name; } toast({title: getTranslatedText('transport.destinationSet', "Destination Set"), description: `${suggestion.name} ${getTranslatedText('transport.destinationSetAsDropoff', 'set as dropoff for ride booking.')}`}) } }><p className="font-medium text-foreground group-hover:text-primary">{suggestion.name}</p><p className="text-sm text-muted-foreground">{suggestion.address}</p></Button>))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-xl">{getTranslatedText('transport.otherTransportOptionsTitle', 'Other Transport Options')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild><Link href="/car-rent">{getTranslatedText('transport.rentACarLink', 'Rent a Car')}</Link></Button>
                     <Button variant="outline" className="w-full justify-start" asChild><Link href="/bus-transportation">{getTranslatedText('transport.bookBusTicketLink', 'Book Bus Ticket (Old Page)')}</Link></Button>
                    <Button variant="outline" className="w-full justify-start" disabled>{getTranslatedText('transport.flightSearchLink', 'Flight Search & Booking')} ({getTranslatedText('transport.comingSoon', 'Coming Soon')})</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-xl">{getTranslatedText('transport.platformFeaturesTitle', 'Platform Features')}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/> {getTranslatedText('transport.featureDriverVerification', 'Driver/Operator Verification & Ratings (Demo)')}</p>
                    <p className="flex items-center gap-2"><Compass className="h-4 w-4 text-primary"/> {getTranslatedText('transport.featureGpsTracking', 'Real-time GPS Tracking (Demo)')}</p>
                    <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary"/> {getTranslatedText('transport.featureInAppCommunication', 'In-app Driver/Operator Communication (Demo)')}</p>
                    <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary"/> {getTranslatedText('transport.featureSecurePayments', 'Secure In-app Payments (Demo)')}</p>
                    <p className="flex items-center gap-2"><Users2 className="h-4 w-4 text-primary"/> {getTranslatedText('transport.featureBaggageAssistance', 'Baggage Assistance Option (Demo for rides)')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

