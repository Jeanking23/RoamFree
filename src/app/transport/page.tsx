
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
  Users,
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
  scheduleRide: z.boolean().default(false),
  wheelchairAccessible: z.boolean().default(false),
  babySeat: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
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


const destinationSuggestions = [
  { id: 1, name: 'Philadelphia International Airport (PHL)', address: '8000 Essington Ave, Philadelphia, PA' },
  { id: 2, name: 'William H. Gray III 30th Street Amtrak Train Station', address: '2955 Market St, Philadelphia, PA' },
  { id: 3, name: 'Philadelphia Museum of Art', address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA' },
];

export default function TransportPage() {
  const { toast } = useToast();
  const [priceResult, setPriceResult] = useState<{ price: string, time: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const rideForm = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      pickupLocation: "", 
      dropoffLocation: "",
      pickupDate: undefined, // Initialize as undefined, set in useEffect
      pickupTime: "",        // Initialize as empty, set in useEffect
      scheduleRide: false, 
      wheelchairAccessible: false, 
      babySeat: false, 
      petFriendly: false,
    },
  });
  
  const intercityForm = useForm<IntercityTransportFormValues>({
    resolver: zodResolver(intercityTransportSchema),
    defaultValues: {
        originCity: "", 
        destinationCity: "", 
        passengers: 1, 
        serviceType: "SHUTTLE", 
        departureDate: undefined // Initialize as undefined, set in useEffect
    }
  });

  // Effect for rideForm to set initial date/time client-side
  useEffect(() => {
    const now = new Date();
    rideForm.setValue("pickupDate", now, { shouldValidate: true });
    rideForm.setValue("pickupTime", format(now, "HH:mm"), { shouldValidate: true });
  }, [rideForm.setValue]);

  // Effect for intercityForm to set initial date client-side
  useEffect(() => {
    intercityForm.setValue("departureDate", new Date(), { shouldValidate: true });
  }, [intercityForm.setValue]);


  async function onRideSubmit(data: TransportFormValues) {
    console.log("Transport Request Submitted:", data);
    setPriceResult(null);
    setShowRatingForm(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const randomPrice = (Math.random() * 50 + 10).toFixed(2);
    const randomTime = Math.floor(Math.random() * 30 + 10); // Mins
    const waitTime = Math.floor(Math.random() * 10 + 5);
    setPriceResult({ price: randomPrice, time: `${randomTime + waitTime} mins (Wait: ${waitTime} mins, Ride: ${randomTime} mins)` });
    toast({
      title: "Price Estimated!",
      description: `Your ride from ${data.pickupLocation} to ${data.dropoffLocation} is estimated at $${randomPrice}. Total time: ${randomTime + waitTime} mins. ${data.scheduleRide ? 'Your ride is scheduled. Reminders will be sent (Demo).' : ''}`,
    });
    setShowRatingForm(true); 
  }
  
  function onIntercitySubmit(data: IntercityTransportFormValues) {
    console.log("Intercity Transport Request:", data);
    toast({ title: "Intercity Search (Demo)", description: `Searching for ${data.serviceType} from ${data.originCity} to ${data.destinationCity}.`});
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
  
  const handleDriverRating = (isThumbsUp: boolean) => {
    toast({ title: "Feedback Submitted (Demo)", description: `Driver rated ${isThumbsUp ? 'positively' : 'negatively'}. Thank you!`});
    setShowRatingForm(false);
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={rideForm.control} name="pickupDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Pickup Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); if (date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) { const currentTime = format(new Date(), "HH:mm"); if (!rideForm.getValues("pickupTime") || rideForm.getValues("pickupTime")! < currentTime) { rideForm.setValue("pickupTime", currentTime, {shouldValidate: true}); } } }} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                        <FormField control={rideForm.control} name="pickupTime" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Pickup Time</FormLabel><FormControl><Input type="time" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={rideForm.control} name="scheduleRide" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Schedule this ride in advance</FormLabel></FormItem>)} />
                      
                      <div>
                        <FormLabel className="text-sm font-medium">Safety &amp; Accessibility Options (Demo)</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                           <FormField control={rideForm.control} name="wheelchairAccessible" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Accessibility className="h-4 w-4"/>Wheelchair</FormLabel></FormItem>)} />
                           <FormField control={rideForm.control} name="babySeat" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Baby className="h-4 w-4"/>Baby Seat</FormLabel></FormItem>)} />
                           <FormField control={rideForm.control} name="petFriendly" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="text-xs font-normal flex items-center gap-1"><Dog className="h-4 w-4"/>Pet Friendly</FormLabel></FormItem>)} />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"> See Prices </Button>
                    </form>
                  </Form>
                  {priceResult && (
                    <Card className="mt-6 p-4 bg-green-50 border-green-200">
                      <CardHeader className="p-0 pb-2"><CardTitle className="text-lg text-green-700">Ride Estimation (Demo)</CardTitle></CardHeader>
                      <CardContent className="p-0 space-y-1">
                        <p className="text-green-600"><strong>Estimated Price:</strong> ${priceResult.price}</p>
                        <p className="text-green-600"><strong>Estimated Total Time:</strong> {priceResult.time}</p>
                        <p className="text-xs text-muted-foreground">Real-time alerts for traffic, route changes, or delays (Coming Soon).</p>
                      </CardContent>
                    </Card>
                  )}
                   {showRatingForm && (
                    <Card className="mt-6">
                        <CardHeader><CardTitle className="text-lg">Rate Your Driver (Demo)</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Button variant="outline" onClick={() => handleDriverRating(true)}><ThumbsUp className="mr-2 h-4 w-4 text-green-500"/>Good</Button>
                            <Button variant="outline" onClick={() => handleDriverRating(false)}><ThumbsDown className="mr-2 h-4 w-4 text-red-500"/>Bad</Button>
                            <Textarea placeholder="Optional comments..."/>
                        </CardContent>
                        <CardFooter><p className="text-xs text-muted-foreground">Drivers can also rate passengers (Demo).</p></CardFooter>
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
                                <FormField control={intercityForm.control} name="passengers" render={({ field }) => (<FormItem><FormLabel>Passengers</FormLabel><FormControl><Input type="number" min="1" placeholder="1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={intercityForm.control} name="serviceType" render={({ field }) => ( <FormItem><FormLabel>Service Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger></FormControl><SelectContent><SelectItem value="SHUTTLE">Shared Shuttle</SelectItem><SelectItem value="PRIVATE_CAR">Private Car (Chauffeur)</SelectItem><SelectItem value="LUXURY_VAN">Luxury Van</SelectItem><SelectItem value="TRAIN">Train Booking (Demo)</SelectItem><SelectItem value="BUS">Bus Booking (Demo)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <Button type="submit" className="w-full">Search Intercity Transport (Demo)</Button>
                        </form>
                    </Form>
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
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Carpool &amp; Ride Sharing</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Feature coming soon! Find travelers with similar routes to share rides and split fares.</p>
                    <Button variant="outline" className="w-full mt-2" disabled>Explore Carpool Options (Demo)</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
