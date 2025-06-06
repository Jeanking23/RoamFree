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
  Map as MapIcon, // Renamed to avoid conflict with native Map
  Building,
  Phone,
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
import Image from 'next/image'; // Added for map placeholder

const transportSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location must be at least 3 characters."),
  dropoffLocation: z.string().min(3, "Dropoff location must be at least 3 characters."),
  pickupDate: z.date({ required_error: "Pickup date is required." }).optional(),
  pickupTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM).").optional(),
});

type TransportFormValues = z.infer<typeof transportSchema>;

const destinationSuggestions = [
  {
    id: 1,
    name: 'Philadelphia International Airport (PHL)',
    address: '8000 Essington Ave, Philadelphia, PA',
  },
  {
    id: 2,
    name: 'William H. Gray III 30th Street Amtrak Train Station',
    address: '2955 Market St, Philadelphia, PA',
  },
  {
    id: 3,
    name: 'Philadelphia Museum of Art',
    address: '2600 Benjamin Franklin Pkwy, Philadelphia, PA',
  },
];

export default function TransportPage() {
  const { toast } = useToast();
  const [priceResult, setPriceResult] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      pickupDate: undefined,
      pickupTime: undefined,
    },
  });

  const { setValue, getValues } = form;

   useEffect(() => {
    // Set default date and time only on the client-side
    setValue("pickupDate", new Date(), { shouldValidate: false });
    setValue("pickupTime", format(new Date(), "HH:mm"), { shouldValidate: false });
  }, [setValue]);


  async function onSubmit(data: TransportFormValues) {
    console.log("Transport Request Submitted:", data);
    setPriceResult(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const randomPrice = (Math.random() * 50 + 10).toFixed(2);
    setPriceResult(`Estimated price for your ride: $${randomPrice}. This is a simulation.`);
    toast({
      title: "Price Estimated!",
      description: `Your ride from ${data.pickupLocation} to ${data.dropoffLocation} is estimated at $${randomPrice}.`,
    });
  }

  const handleSuggestionClick = (name: string) => {
    setValue("dropoffLocation", name, { shouldValidate: true });
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, you'd use a reverse geocoding service here
        const demoAddress = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Demo Address)`;
        setValue("pickupLocation", demoAddress, { shouldValidate: true });
        toast({
          title: "Location Found!",
          description: "Pickup location set to your current position (simulated address).",
        });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Could not get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Geolocation permission denied. Please enable it in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
        }
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: errorMessage,
        });
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Plan Your Journey
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Request a ride, reserve in advance, or explore various transport options.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Request a Ride</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="relative space-y-4">
                        <FormField
                          control={form.control}
                          name="pickupLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><CircleDot className="h-5 w-5 text-primary" /> Pickup Location</FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input placeholder="Enter pickup location" {...field} />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleGeolocate}
                                  disabled={isLocating}
                                  aria-label="Use current location"
                                >
                                  {isLocating ? <Clock className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="absolute left-[9px] top-[calc(2.5rem+10px)] h-[calc(100%-5rem-20px)] w-0.5 bg-gray-300 -translate-y-1/2 z-0"></div>
                        <FormField
                          control={form.control}
                          name="dropoffLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><SquareDot className="h-5 w-5 text-primary" /> Dropoff Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter dropoff location" {...field} />
                              </FormControl>
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
                              <FormLabel className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Pickup Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      field.onChange(date);
                                      if (date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                                        const currentTime = format(new Date(), "HH:mm");
                                        if (!getValues("pickupTime") || getValues("pickupTime") < currentTime) {
                                          setValue("pickupTime", currentTime, {shouldValidate: true});
                                        }
                                      }
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                  />
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
                            <FormItem className="flex flex-col">
                              <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Pickup Time</FormLabel>
                              <FormControl><Input type="time" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        See Prices
                      </Button>
                    </form>
                  </Form>
                  {priceResult && (
                    <Card className="mt-6 p-4 bg-green-50 border-green-200">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-lg text-green-700">Price Estimation</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-green-600">{priceResult}</p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary"/>Real-Time Interactive Map</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        View live vehicle locations, estimated arrival times, and route previews on an interactive map.
                        (Full real-time map functionality requires backend services and mapping APIs like Google Maps or Mapbox, which are beyond the scope of this prototype.)
                    </p>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                        <Image 
                            src="https://placehold.co/800x450.png?text=Live+Map+View+Placeholder" 
                            alt="Real-time map placeholder" 
                            width={800} 
                            height={450} 
                            className="object-cover w-full h-full"
                            data-ai-hint="city map vehicles"
                        />
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">Interactive map simulation.</p>
                </CardFooter>
              </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Destination Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {destinationSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      className="flex flex-col items-start space-x-0 p-3 w-full h-auto text-left hover:bg-muted/80"
                      onClick={() => handleSuggestionClick(suggestion.name)}
                    >
                      <p className="font-medium text-foreground group-hover:text-primary">
                        {suggestion.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.address}
                      </p>
                    </Button>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Other Transport Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild><Link href="/car-rent">Rent a Car</Link></Button>
                    <Button variant="outline" className="w-full justify-start" disabled>Flight Search & Booking (Coming Soon)</Button>
                    <Button variant="outline" className="w-full justify-start" disabled>Reserve Ride in Advance (Coming Soon)</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Platform Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/> Driver Verification & Ratings</p>
                    <p className="flex items-center gap-2"><Compass className="h-4 w-4 text-primary"/> Real-time GPS Tracking (Demo)</p>
                    <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary"/> In-app Driver Communication (Demo)</p>
                    <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary"/> Secure In-app Payments (Demo)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
            <Sparkles className="h-7 w-7" />
            Enhance Your Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Schedule Rides", desc: "Plan your airport transfers or important trips in advance.", icon: CalendarDays, pageLink: "/transport#schedule" },
            { title: "Multiple Vehicle Types", desc: "Choose from standard, premium, or XL vehicles.", icon: Users2, pageLink: "/transport#vehicles" },
            { title: "Group Travel Coordination", desc: "Share ride details and costs easily with your group.", icon: Briefcase, pageLink: "/transport#group" }
          ].map((item, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><item.icon className="h-5 w-5 text-accent"/>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc} (Coming Soon)</p>
                 {/* <Button variant="link" asChild className="px-0"><Link href={item.pageLink}>Learn More</Link></Button> */}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
    
