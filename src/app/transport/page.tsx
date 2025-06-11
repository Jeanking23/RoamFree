
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
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalization } from '@/contexts/LocalizationContext';


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
    returnDate: z.date().optional(),
    passengers: z.coerce.number().min(1, "At least one passenger required.").max(50, "Max 50 passengers for group booking demo."),
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
  busType: string; // Luxury, Standard, Sleeper
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
}


const destinationSuggestions = [
  { id: 1, name: 'Philadelphia International Airport (PHL)', address: '8000 Essington Ave, Philadelphia, PA' },
  { id: 2, name: 'William H. Gray III 30th Street Amtrak Train Station', address: '2955 Market St, Philadelphia, PA' },
  { id: 3, name: 'Philadelphia Museum of Art', address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA' },
];


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
                <FormField control={rideForm.control} name="pickupLocation" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><CircleDot className="h-5 w-5 text-primary" /> {getTranslatedText('transport.pickupLocation', 'Pickup Location')}</FormLabel><div className="flex items-center gap-2"><FormControl><Input placeholder={getTranslatedText('transport.pickupPlaceholder', "Enter pickup location")} {...field} value={field.value || ''} /></FormControl><TooltipProvider><Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" onClick={handleGeolocate} disabled={isLocating} aria-label={getTranslatedText('transport.useCurrentLocation', "Use current location")}><IconCARGps className="h-5 w-5 animate-spin" IconLACLocateFixed className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{getTranslatedText('transport.useCurrentLocation', 'Use my current location')}</p></TooltipContent></Tooltip></TooltipProvider></div><FormMessage /></FormItem>)} />
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

function IntercityBusSearchForm() {
  const { toast } = useToast();
  const { selectedCurrency, getTranslatedText } = useLocalization();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IntercityBusRoute[]>([]);

  const form = useForm<IntercityBusSearchFormValues>({
    resolver: zodResolver(intercityBusSearchSchema),
    defaultValues: {
      originCity: "",
      destinationCity: "",
      passengers: 1,
    },
  });

  useEffect(() => {
    if (!form.getValues("departureDate")) {
      form.setValue("departureDate", new Date(), { shouldValidate: true });
    }
  }, [form]);

  async function onSubmit(data: IntercityBusSearchFormValues) {
    setIsSearching(true);
    setSearchResults([]);
    console.log("Intercity Bus Search Submitted:", data);
    const tripTypeMessage = data.returnDate ? getTranslatedText('transport.roundTrip', "round trip") : getTranslatedText('transport.oneWay', "one-way");

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResults: IntercityBusRoute[] = [
      { id: "ibus001", operator: "CityLink Express", busType: "Luxury Coach", departureTime: "09:00 AM", arrivalTime: "03:00 PM", duration: "6h 0m", price: 35, availableSeats: 22 },
      { id: "ibus002", operator: "RoadRunner Connect", busType: "Standard AC", departureTime: "01:30 PM", arrivalTime: "08:00 PM", duration: "6h 30m", price: 28, availableSeats: 40 },
      { id: "ibus003", operator: "NightOwl Transits", busType: "Sleeper", departureTime: "10:00 PM", arrivalTime: "05:00 AM", duration: "7h 0m", price: 45, availableSeats: 15 },
    ];
    setSearchResults(mockResults);
    setIsSearching(false);
    toast({ title: getTranslatedText('transport.intercityBusRoutesFound', "Intercity Bus Routes Found!"), description: `Showing ${mockResults.length} options for your ${tripTypeMessage} trip.` });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{getTranslatedText('transport.searchIntercityBusTitle', 'Search Intercity Bus Tickets')}</CardTitle>
        <CardDescription>{getTranslatedText('transport.searchIntercityBusDescription', 'Find bus routes between cities, with various operators and options.')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="originCity" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>{getTranslatedText('transport.originCity', 'Origin City')}</FormLabel><FormControl><Input placeholder={getTranslatedText('transport.originCityPlaceholder', 'e.g., Douala')} {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="destinationCity" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>{getTranslatedText('transport.destinationCity', 'Destination City')}</FormLabel><FormControl><Input placeholder={getTranslatedText('transport.destinationCityPlaceholder', 'e.g., Yaoundé')} {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="departureDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/>{getTranslatedText('transport.departureDate', 'Departure Date')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="returnDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/>{getTranslatedText('transport.returnDateOptional', 'Return Date (Optional)')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>{getTranslatedText('transport.pickDate', 'Pick a date')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem> )} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="passengers" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><UsersIcon className="h-4 w-4 text-primary"/>{getTranslatedText('transport.passengers', 'Passengers')}</FormLabel><FormControl><Input type="number" min="1" placeholder="1" {...field} value={field.value ?? 1} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            
            <Card className="border-dashed mt-4">
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><ListFilter className="h-5 w-5"/>{getTranslatedText('transport.filters', 'Filters')} ({getTranslatedText('transport.comingSoon', 'Coming Soon')})</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>{getTranslatedText('transport.busFeatures', 'Bus Features: AC, Wi-Fi, USB, Recliner, Restroom')}</p>
                    <p>{getTranslatedText('transport.tripType', 'Trip Type: Day / Night')}</p>
                    <p>{getTranslatedText('transport.operatorRating', 'Operator Rating')}</p>
                    <p>{getTranslatedText('transport.fareType', 'Fare Type: Pay Now / Reserve Now, Pay Later')}</p>
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
                <CardContent className="p-4 grid sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <CardTitle className="text-lg">{route.operator} - {route.busType}</CardTitle>
                    <p className="text-sm text-muted-foreground">{getTranslatedText('transport.departs', 'Departs')}: {route.departureTime} &bull; {getTranslatedText('transport.arrives', 'Arrives')}: {route.arrivalTime} ({route.duration})</p>
                    <p className="text-sm text-muted-foreground">{route.availableSeats} {getTranslatedText('transport.seatsAvailable', 'seats available')}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xl font-bold text-primary">{selectedCurrency.symbol}{route.price.toFixed(2)} <span className="text-xs text-muted-foreground">({selectedCurrency.code})</span></p>
                    <Button size="sm" className="mt-1 w-full sm:w-auto" onClick={() => toast({ title: getTranslatedText('transport.viewDetailsTitle', "View Details (Demo)"), description: `${getTranslatedText('transport.selectedOperator', 'Selected')} ${route.operator}. ${getTranslatedText('transport.seatSelectionNext', 'Seat selection & booking next.')}` })}>{getTranslatedText('transport.viewDetailsBook', 'View Details & Book')}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isSearching && form.formState.isSubmitted && searchResults.length === 0 && (
          <Card className="mt-8 text-center py-8 bg-muted/30"><CardContent><Bus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" /><p className="text-md font-semibold">{getTranslatedText('transport.noIntercityBusRoutesFound', 'No intercity bus routes found.')}</p><p className="text-sm text-muted-foreground mt-1">{getTranslatedText('transport.tryDifferentCitiesDates', 'Try different cities or dates.')}</p></CardContent></Card>
        )}
        
        <Card className="mt-10">
            <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Settings className="h-5 w-5"/>{getTranslatedText('transport.intercityBusFeaturesTitle', 'Intercity Bus Features')} ({getTranslatedText('transport.comingSoonDemo', 'Coming Soon / Demo')})</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-1"><DollarSign className="h-4 w-4"/>{getTranslatedText('transport.featureFareBreakdown', 'Fare Breakdown (base, taxes, add-ons)')}</p>
                <p className="flex items-center gap-1"><Clock className="h-4 w-4"/>{getTranslatedText('transport.featureReservePayLater', 'Reserve Now, Pay Later (1-hour hold)')}</p>
                <p className="flex items-center gap-1"><Users2 className="h-4 w-4"/>{getTranslatedText('transport.featureGroupBooking', 'Group Booking (multiple passengers, saved profiles, ID upload)')}</p>
                <p className="flex items-center gap-1"><Armchair className="h-4 w-4"/>{getTranslatedText('transport.feature3DSeatSelection', 'Interactive 3D Seat Selection (real-time availability, filters)')}</p>
                <p className="flex items-center gap-1"><QrCode className="h-4 w-4"/>{getTranslatedText('transport.featureETicketQR', 'E-Ticket & QR Boarding Pass (offline access, countdown)')}</p>
                <p className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{getTranslatedText('transport.featureStationInfoNav', 'Station Info & Live Navigation to terminal')}</p>
                <p className="flex items-center gap-1"><BadgeCheck className="h-4 w-4"/>{getTranslatedText('transport.featureOperatorProfiles', 'Bus Operator Profiles (ratings, reviews, photos, policies)')}</p>
                <p className="flex items-center gap-1"><Navigation className="h-4 w-4"/>{getTranslatedText('transport.featureLiveBusTracking', 'Live Bus Tracking (GPS, ETA, delay notifications)')}</p>
                <p className="flex items-center gap-1"><UserCog className="h-4 w-4"/>{getTranslatedText('transport.featurePassengerInfoManagement', 'Passenger Info Management (saved profiles, doc upload)')}</p>
                <p className="flex items-center gap-1"><ShoppingBag className="h-4 w-4"/>{getTranslatedText('transport.featureAddons', 'Add-ons: Snacks, Insurance, WiFi, Luggage, Carbon Offset')}</p>
                <p className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/>{getTranslatedText('transport.featureBusChatAnnouncements', 'Bus Chat & Operator Announcements')}</p>
                <p className="flex items-center gap-1"><ShieldCheck className="h-4 w-4"/>{getTranslatedText('transport.featureSafetyFilters', 'Safety Filters: Female-only seating, Wheelchair accessible, Child-friendly')}</p>
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
                    {/* Link to /bus-transportation (legacy) removed previously, functionality now in "Intercity Bus" tab */}
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
    
