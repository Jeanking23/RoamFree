
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
  Users as UsersIcon, // Renamed to avoid conflict with Users component
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
  Filter
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

const transportSchema = z.object({
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

type TransportFormValues = z.infer<typeof transportSchema>;

const intercityTransportSchema = z.object({
    originCity: z.string().min(2, "Origin city is required."),
    destinationCity: z.string().min(2, "Destination city is required."),
    departureDate: z.date({ required_error: "Departure date is required." }),
    passengers: z.coerce.number().min(1, "At least one passenger required."),
    serviceType: z.enum(["SHUTTLE", "PRIVATE_CAR", "LUXURY_VAN", "TRAIN", "BUS"]),
});
type IntercityTransportFormValues = z.infer<typeof intercityTransportSchema>;

interface RideOption {
  id: string;
  vehicleType: string;
  vehicleImage: string;
  dataAiHint: string;
  estimatedFare: number;
  eta: string; 
  fareBreakdown?: string; 
  features?: string[]; 
  userPreferenceMatch?: string;
}

const destinationSuggestions = [
  { id: 1, name: 'Philadelphia International Airport (PHL)', address: '8000 Essington Ave, Philadelphia, PA' },
  { id: 2, name: 'William H. Gray III 30th Street Amtrak Train Station', address: '2955 Market St, Philadelphia, PA' },
  { id: 3, name: 'Philadelphia Museum of Art', address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA' },
];

export default function TransportPage() {
  const { toast } = useToast();
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingRides, setIsFetchingRides] = useState(false);

  const rideForm = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      pickupLocation: "", 
      dropoffLocation: "",
      pickupDate: new Date(), 
      pickupTime: format(new Date(), "HH:mm"),        
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
  
  const intercityForm = useForm<IntercityTransportFormValues>({
    resolver: zodResolver(intercityTransportSchema),
    defaultValues: {
        originCity: "", 
        destinationCity: "", 
        passengers: 1, 
        serviceType: "SHUTTLE", 
        departureDate: new Date() 
    }
  });

  async function onRideSubmit(data: TransportFormValues) {
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
    
    // Basic filtering based on form values (for demo purposes)
    const filteredOptions = mockOptions.filter(option => {
        if (!data.filterEconomy && option.vehicleType === 'Economy') return false;
        if (!data.filterComfort && option.vehicleType === 'Comfort') return false;
        if (!data.filterSuv && (option.vehicleType === 'SUV/XL' || option.vehicleType === 'Pickup')) return false;
        if (!data.filterPremium && option.vehicleType === 'Premium') return false;
        if (data.wheelchairAccessible && !option.features?.includes('Wheelchair Accessible Option')) return false;
        if (data.petFriendly && !option.features?.includes('Pet-friendly')) return false;
        if (data.filterWifi && !option.features?.includes('Wi-Fi')) return false;
        if (data.filterAC && !option.features?.includes('AC')) return false;
        // Baby seat and Quiet ride features can be added to mock data / filtering
        return true;
    });


    setRideOptions(filteredOptions);
    setIsFetchingRides(false);

    toast({
      title: filteredOptions.length > 0 ? "Ride Options Found!" : "No Rides Found",
      description: filteredOptions.length > 0 ? `Showing available rides from ${data.pickupLocation} to ${data.dropoffLocation}.` : "Try adjusting your filters or try again later.",
    });
  }
  
  function onIntercitySubmit(data: IntercityTransportFormValues) {
    console.log("Intercity Transport Request:", data);
    toast({ title: "Intercity Search (Demo)", description: `Searching for ${data.serviceType} from ${data.originCity} to ${data.destinationCity}. Results will appear below.`});
  }

  const handleSuggestionClick = (name: string) => {
    rideForm.setValue("dropoffLocation", name, { shouldValidate: true });
  };

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

  const handleShareTrip = () => {
    toast({ title: "Share My Trip (Demo)", description: "Trip details shared with emergency contacts (simulation)." });
  };

  const handleNavigationAssistant = () => {
    toast({ title: "Navigation Assistant (Demo)", description: "Starting GPS voice navigation to destination (simulation)." });
  };
  
  const handleChooseRide = (ride: RideOption) => {
    toast({
        title: `Ride Selected: ${ride.vehicleType}`,
        description: `Fare: $${ride.estimatedFare.toFixed(2)}. Driver details and real-time tracking would appear now. Price lock for 3 mins (Demo).`,
        duration: 7000,
    });
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Plan Your Journey
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Request a ride, schedule in advance, or explore various transport options including intercity travel.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Request or Schedule a Ride</CardTitle>
                  <CardDescription>Auto-fill destination from accommodation/calendar (Demo feature). Trip reminders for scheduled rides (Demo).</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...rideForm}>
                    <form onSubmit={rideForm.handleSubmit(onRideSubmit)} className="space-y-6">
                      <div className="relative space-y-4">
                        <FormField control={rideForm.control} name="pickupLocation" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><CircleDot className="h-5 w-5 text-primary" /> Pickup Location</FormLabel><div className="flex items-center gap-2"><FormControl><Input placeholder="Enter pickup location" {...field} value={field.value || ''} /></FormControl><Button type="button" variant="outline" size="icon" onClick={handleGeolocate} disabled={isLocating} aria-label="Use current location">{isLocating ? <Clock className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}</Button></div><FormMessage /></FormItem>)} />
                        <div className="absolute left-[9px] top-[calc(2.5rem+10px)] h-[calc(100%-5rem-20px)] w-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>
                        <FormField control={rideForm.control} name="dropoffLocation" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-2"><SquareDot className="h-5 w-5 text-primary" /> Dropoff Location</FormLabel><FormControl><Input placeholder="Enter dropoff location" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                       <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Button variant="link" size="sm" className="p-0 h-auto" disabled><PlusCircle className="h-3 w-3 mr-1"/>Add multiple stops (Coming Soon)</Button>
                            <Separator orientation="vertical" className="h-3"/>
                            <Button variant="link" size="sm" className="p-0 h-auto" disabled><RefreshCcw className="h-3 w-3 mr-1"/>Schedule return trip (Coming Soon)</Button>
                        </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={rideForm.control} name="pickupDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Pickup Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); if (date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) { const currentTime = format(new Date(), "HH:mm"); if (!rideForm.getValues("pickupTime") || rideForm.getValues("pickupTime")! < currentTime) { rideForm.setValue("pickupTime", currentTime, {shouldValidate: true}); } } }} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                        <FormField control={rideForm.control} name="pickupTime" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Pickup Time</FormLabel><FormControl><Input type="time" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={rideForm.control} name="scheduleRide" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value || false} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Schedule this ride in advance</FormLabel></FormItem>)} />
                      
                      <Card className="border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2"><Filter className="h-5 w-5"/>Filters &amp; Preferences (Demo)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <FormLabel className="text-xs font-medium">Ride Types</FormLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                                    <FormField control={rideForm.control} name="filterEconomy" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">Economy</FormLabel></FormItem>)} />
                                    <FormField control={rideForm.control} name="filterComfort" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">Comfort</FormLabel></FormItem>)} />
                                    <FormField control={rideForm.control} name="filterSuv" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">SUV/XL</FormLabel></FormItem>)} />
                                    <FormField control={rideForm.control} name="filterPremium" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal">Premium</FormLabel></FormItem>)} />
                                </div>
                            </div>
                             <div>
                                <FormLabel className="text-xs font-medium">Accessibility &amp; Needs</FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                                   <FormField control={rideForm.control} name="wheelchairAccessible" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Accessibility className="h-4 w-4"/>Wheelchair</FormLabel></FormItem>)} />
                                   <FormField control={rideForm.control} name="babySeat" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Baby className="h-4 w-4"/>Baby Seat</FormLabel></FormItem>)} />
                                   <FormField control={rideForm.control} name="petFriendly" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Dog className="h-4 w-4"/>Pet Friendly</FormLabel></FormItem>)} />
                                </div>
                            </div>
                             <div>
                                <FormLabel className="text-xs font-medium">Ride Preferences</FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                                   <FormField control={rideForm.control} name="filterQuietRide" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><VolumeX className="h-4 w-4"/>Quiet Ride</FormLabel></FormItem>)} />
                                   <FormField control={rideForm.control} name="filterWifi" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Wifi className="h-4 w-4"/>Wi-Fi</FormLabel></FormItem>)} />
                                   <FormField control={rideForm.control} name="filterAC" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Snowflake className="h-4 w-4"/>AC</FormLabel></FormItem>)} />
                                </div>
                            </div>
                        </CardContent>
                      </Card>


                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isFetchingRides}>
                        <Search className="mr-2 h-5 w-5" /> {isFetchingRides ? "Fetching Rides..." : "See Prices"}
                      </Button>
                    </form>
                  </Form>

                  {isFetchingRides && (
                    <div className="text-center py-6">
                        <Car className="h-10 w-10 text-primary animate-bounce mx-auto mb-2"/>
                        <p className="text-muted-foreground">Finding best rides for you...</p>
                    </div>
                  )}

                  {!isFetchingRides && rideOptions.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-xl font-semibold">Available Ride Options ({rideOptions.length})</h3>
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
                                                    let Icon = Settings; // Default
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
                                        <p className="text-lg font-bold text-primary">${option.estimatedFare.toFixed(2)}</p>
                                        {option.fareBreakdown && <p className="text-xs text-muted-foreground cursor-pointer hover:underline" onClick={() => toast({title: "Fare Breakdown (Demo)", description: option.fareBreakdown})}>Fare Details</p> }
                                        <Button size="sm" className="mt-2 w-full sm:w-auto" onClick={() => handleChooseRide(option)}>Choose</Button>
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
                            <p className="text-md font-semibold">No rides match your current filters.</p>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your preferences or location.</p>
                        </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary"/>Real-Time Interactive Map</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">View live vehicle locations, estimated arrival times, and route previews. (Full real-time map functionality requires backend services and mapping APIs like Google Maps or Mapbox.)</p>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                        <Image src="https://placehold.co/800x450.png?text=Live+Map+View+Placeholder" alt="Real-time map placeholder" width={800} height={450} className="object-cover w-full h-full" data-ai-hint="city map vehicles" />
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleShareTrip}><Share2 className="mr-2 h-4 w-4"/> Share My Trip (Demo)</Button>
                        <Button variant="outline" size="sm" onClick={handleNavigationAssistant}><Navigation className="mr-2 h-4 w-4"/> Navigation Assistant (Demo)</Button>
                    </div>
                </CardContent>
                 <CardFooter><p className="text-xs text-muted-foreground">Interactive map simulation.</p></CardFooter>
              </Card>
              
               <Card>
                <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Truck className="h-5 w-5 text-primary"/>Intercity &amp; Group Transport</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Book long-distance transportation between cities or for groups.</p>
                    <Form {...intercityForm}>
                        <form onSubmit={intercityForm.handleSubmit(onIntercitySubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={intercityForm.control} name="originCity" render={({ field }) => (<FormItem><FormLabel>Origin City/Airport</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={intercityForm.control} name="destinationCity" render={({ field }) => (<FormItem><FormLabel>Destination City/Airport</FormLabel><FormControl><Input placeholder="e.g., Boston" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                             <FormField control={intercityForm.control} name="departureDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Departure Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={intercityForm.control} name="passengers" render={({ field }) => (<FormItem><FormLabel>Passengers</FormLabel><FormControl><Input type="number" min="1" placeholder="1" {...field} value={field.value ?? 1} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={intercityForm.control} name="serviceType" render={({ field }) => ( <FormItem><FormLabel>Service Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SHUTTLE">Shared Shuttle</SelectItem><SelectItem value="PRIVATE_CAR">Private Car (Chauffeur)</SelectItem><SelectItem value="LUXURY_VAN">Luxury Van</SelectItem><SelectItem value="TRAIN">Train Booking (Demo)</SelectItem><SelectItem value="BUS">Bus Booking (Demo)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <Button type="submit" className="w-full">Search Intercity Transport (Demo)</Button>
                        </form>
                    </Form>
                </CardContent>
              </Card>
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><UsersIcon className="h-5 w-5 text-primary"/>Carpool &amp; Ride Sharing</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Feature coming soon! Find travelers with similar routes to share rides and split fares.</p>
                        <Button variant="outline" className="w-full mt-2" disabled>Explore Carpool Options (Demo)</Button>
                    </CardContent>
              </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-xl">Destination Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {destinationSuggestions.map((suggestion) => (<Button key={suggestion.id} variant="ghost" className="flex flex-col items-start space-x-0 p-3 w-full h-auto text-left hover:bg-muted/80" onClick={() => handleSuggestionClick(suggestion.name)}><p className="font-medium text-foreground group-hover:text-primary">{suggestion.name}</p><p className="text-sm text-muted-foreground">{suggestion.address}</p></Button>))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-xl">Other Transport Options</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild><Link href="/car-rent">Rent a Car</Link></Button>
                    <Button variant="outline" className="w-full justify-start" asChild><Link href="/bus-transportation">Bus Tickets</Link></Button>
                    <Button variant="outline" className="w-full justify-start" disabled>Flight Search &amp; Booking (Coming Soon)</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-xl">Platform Features</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/> Driver Verification &amp; Ratings (Demo)</p>
                    <p className="flex items-center gap-2"><Compass className="h-4 w-4 text-primary"/> Real-time GPS Tracking (Demo)</p>
                    <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary"/> In-app Driver Communication (Demo)</p>
                    <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary"/> Secure In-app Payments (Demo)</p>
                    <p className="flex items-center gap-2"><Users2 className="h-4 w-4 text-primary"/> Baggage Assistance Option (Demo)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
