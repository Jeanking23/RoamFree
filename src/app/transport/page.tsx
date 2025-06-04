
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CircleDot,
  SquareDot,
  CalendarDays,
  Clock,
  ChevronDown,
  MapPin,
  LocateFixed,
  User,
  UserCog,
  ShieldCheck,
  DollarSign,
  Map as MapIcon, // Renamed to avoid conflict with Map component
  MessageSquare,
  Star,
  Settings,
  Gift,
  CalendarClock,
  Car,
  PhoneCall,
  AlertTriangle,
  Users,
  ListChecks,
  BarChart3,
  Percent,
  Pocket,
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const transportSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location must be at least 3 characters."),
  dropoffLocation: z.string().min(3, "Dropoff location must be at least 3 characters."),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
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

const FeatureItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <li className="flex items-start gap-3 py-2">
    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
    <span>{text}</span>
  </li>
);


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

  const { watch, setValue, getValues } = form;
  const watchPickupDate = watch("pickupDate");
  const watchPickupTime = watch("pickupTime");

  useEffect(() => {
    setValue("pickupDate", new Date(), { shouldValidate: false });
    setValue("pickupTime", format(new Date(), "HH:mm"), { shouldValidate: false });
  }, [setValue]);


  async function onSubmit(data: TransportFormValues) {
    console.log("Transport Request Submitted:", data);
    setPriceResult(null);
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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="mb-8">
        <ul className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="#" className="hover:text-primary font-medium text-primary">
              Request a ride
            </Link>
          </li>
          <li><Link href="#" className="hover:text-primary">Reserve a ride</Link></li>
          <li><Link href="#" className="hover:text-primary">See prices</Link></li>
          <li><Link href="#" className="hover:text-primary">Explore ride options</Link></li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Request a ride</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="relative p-4 shadow rounded-lg">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <CircleDot className="h-6 w-6 text-black flex-shrink-0" />
                      <FormControl>
                        <div className="relative w-full">
                        <Input
                          placeholder="Pickup location"
                          className="bg-gray-100 border-0 focus-visible:ring-primary text-base h-12 pr-10"
                          {...field}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleGeolocate}
                            disabled={isLocating}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-primary"
                            aria-label="Use current location"
                          >
                            {isLocating ? <Clock className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-9 text-xs" />
                    </FormItem>
                  )}
                />
                <div className="absolute left-[11px] top-[38px] h-[calc(100%-100px)] min-h-[20px] w-0.5 bg-gray-300 z-0"></div>
                <FormField
                  control={form.control}
                  name="dropoffLocation"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 pt-4">
                       <SquareDot className="h-6 w-6 text-black flex-shrink-0" />
                      <FormControl>
                        <Input
                          placeholder="Dropoff location"
                          className="bg-gray-100 border-0 focus-visible:ring-primary text-base h-12"
                          {...field}
                        />
                      </FormControl>
                       <FormMessage className="absolute -bottom-5 left-9 text-xs" />
                    </FormItem>
                  )}
                />
              </Card>

              <Card className="p-4 rounded-lg shadow">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "bg-gray-100 border-0 justify-start text-foreground hover:bg-gray-200 h-12 text-base",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
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
                        <FormMessage className="text-xs pt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                               <Button
                                variant="outline"
                                className="bg-gray-100 border-0 justify-start text-foreground hover:bg-gray-200 h-12 text-base"
                              >
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                                {field.value ? format(new Date(`1970-01-01T${field.value}`), "p") : <span>Pick a time</span>}
                                <ChevronDown className="ml-auto h-5 w-5 text-muted-foreground" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <Input
                              type="time"
                              value={field.value || ""}
                              onChange={(e) => {
                                const newTime = e.target.value;
                                const currentDateValue = getValues("pickupDate") || new Date();
                                const currentDate = format(currentDateValue, 'yyyy-MM-dd');
                                const todayDate = format(new Date(), 'yyyy-MM-dd');

                                if (currentDate === todayDate && newTime < format(new Date(), "HH:mm")) {
                                  const nowTime = format(new Date(), "HH:mm");
                                  field.onChange(nowTime);
                                   toast({
                                    variant: "destructive",
                                    title: "Invalid Time",
                                    description: "Cannot select a past time for today. Set to current time.",
                                  });
                                } else {
                                  field.onChange(newTime);
                                }
                              }}
                              className="bg-background border-input focus-visible:ring-primary"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs pt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-3 h-12 text-base font-medium">
                See prices
              </Button>
            </form>
          </Form>

          {priceResult && (
            <Card className="mt-6 p-4 shadow rounded-lg bg-accent/10 border-accent">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg text-accent-foreground">Price Estimation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-accent-foreground/90">{priceResult}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Destination suggestions
            </h2>
            <div className="space-y-4">
              {destinationSuggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="ghost"
                  className="flex items-start space-x-3 cursor-pointer group w-full h-auto justify-start p-2 text-left"
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.address}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

        </div>

        <div className="lg:col-span-2 h-[400px] md:h-[600px] lg:h-auto">
          <Image
            src="https://placehold.co/800x1000.png"
            alt="Map of Philadelphia"
            width={800}
            height={1000}
            className="rounded-lg object-cover w-full h-full shadow-md"
            data-ai-hint="city map Philadelphia"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Reserve for later", desc: "Schedule your rides in advance." },
            { title: "Group rides", desc: "Share your ride and save money." },
            { title: "Airport transfers", desc: "Reliable rides to and from the airport." }
          ].map((item, i) => (
            <Card key={i} className="shadow-lg rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <Button variant="link" className="px-0 pt-3 text-primary">Learn more</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Transport Service Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-xl rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
                  <User className="h-7 w-7" /> Rider App
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <FeatureItem icon={MapPin} text="Ride Booking (pickup, drop-off, fare estimate)" />
                  <FeatureItem icon={MapIcon} text="Real-time GPS Tracking" />
                  <FeatureItem icon={Clock} text="Driver ETA and Communication" />
                  <FeatureItem icon={ListChecks} text="Ride History" />
                  <FeatureItem icon={DollarSign} text="In-app Payment" />
                  <FeatureItem icon={Star} text="Rating & Review Drivers" />
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
                  <UserCog className="h-7 w-7" /> Driver App
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <FeatureItem icon={ShieldCheck} text="Driver Registration/Verification" />
                  <FeatureItem icon={Pocket} text="Accept/Reject Ride Requests" />
                  <FeatureItem icon={MapIcon} text="Navigation via Maps" />
                  <FeatureItem icon={BarChart3} text="Earnings Dashboard" />
                  <FeatureItem icon={Settings} text="Availability Toggle (Online/Offline)" />
                  <FeatureItem icon={Star} text="Ratings and Reviews from Riders" />
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
                  <Settings className="h-7 w-7" /> Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <FeatureItem icon={Users} text="User and Driver Management" />
                  <FeatureItem icon={MapIcon} text="Ride Tracking & Monitoring" />
                  <FeatureItem icon={ShieldCheck} text="Dispute Handling" />
                  <FeatureItem icon={DollarSign} text="Payment/Commission Reports" />
                  <FeatureItem icon={Percent} text="Promotions & Discounts Management" />
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧪 Optional Add-ons</h2>
          <Card className="shadow-xl rounded-lg">
            <CardContent className="p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-muted-foreground">
                <FeatureItem icon={CalendarClock} text="Schedule Rides in Advance" />
                <FeatureItem icon={Car} text="Multiple Vehicle Types (Sedan, SUV, Luxury)" />
                <FeatureItem icon={MessageSquare} text="In-app Chat/Call between Rider and Driver" />
                <FeatureItem icon={AlertTriangle} text="SOS Button for Safety Emergencies" />
                <FeatureItem icon={Gift} text="Loyalty or Referral Program" />
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

    