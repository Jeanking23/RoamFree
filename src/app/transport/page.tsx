// src/app/transport/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plane, Car, Bus, CalendarIcon, Clock, Circle, Square, MapPin, Package, Utensils, Star, Bike } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const rideBookingSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().min(1, "Pickup time is required (e.g., HH:MM)"),
});
type RideBookingFormValues = z.infer<typeof rideBookingSchema>;

const transportOptions = [
    { title: "Ride Booking", icon: Car, href: "#ride-booking-form", isCurrent: true },
    { title: "Book a Bus", icon: Bus, href: "/bus-transportation", isCurrent: false },
    { title: "Rental Car", icon: Car, href: "/car-rent", isCurrent: false },
    { title: "Flights", icon: Plane, href: "/flights", isCurrent: false },
];

const mockDestinations = [
    { name: "Philadelphia International Airport (PHL)", address: "8000 Essington Ave, Philadelphia, PA"},
    { name: "William H. Gray III 30th Street Amtrak Station", address: "2955 Market St, Philadelphia, PA"},
    { name: "Center City Convention Center", address: "1101 Arch St, Philadelphia, PA"},
];

const followUpSuggestions = [
    { title: "Ride Courier", description: "Quick delivery via bike/ride", icon: Package, href: "/courier-delivery" },
    { title: "Rent a Car", description: "Explore car rental options", icon: Car, href: "/car-rent" },
    { title: "Buy a Car", description: "Vehicles for sale nearby", icon: Car, href: "/cars-for-sale" },
];

const visualSuggestions = [
    { title: "Top Places to Eat", image: "https://placehold.co/400x300.png", dataAiHint: "restaurant food", href: "#" },
    { title: "Weekend Getaways", image: "https://placehold.co/400x300.png", dataAiHint: "beach resort", href: "#" },
    { title: "Recommended Drivers", image: "https://placehold.co/400x300.png", dataAiHint: "driver portrait", href: "#" },
    { title: "Most Popular Rentals", image: "https://placehold.co/400x300.png", dataAiHint: "modern car", href: "#" },
];


export default function TransportPage() {
    const form = useForm<RideBookingFormValues>({
        resolver: zodResolver(rideBookingSchema),
        defaultValues: {
            pickupLocation: "",
            dropoffLocation: "",
            pickupDate: new Date(),
            pickupTime: "10:00",
        },
    });

    function onRideSubmit(values: RideBookingFormValues) {
        console.log("Ride Booking:", values);
        toast({title: "Ride Search (Demo)", description: "Searching for available rides... Results would be displayed here."});
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Choose Your Transport</CardTitle>
                    <CardDescription>Select a mode of transport to get started.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {transportOptions.map(opt => (
                        <Button key={opt.title} asChild variant={opt.isCurrent ? "default" : "outline"} className="h-20 flex-col gap-2 text-base">
                            <Link href={opt.href}>
                                <opt.icon className="h-6 w-6" />
                                {opt.title}
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Card id="ride-booking-form">
                <CardHeader>
                    <CardTitle>Book a Ride</CardTitle>
                    <CardDescription>Get a ride in minutes, or schedule one for later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onRideSubmit)} className="space-y-6">
                            <div className="relative">
                                <div className="pl-6">
                                    <div className="absolute left-3 top-3 h-[calc(100%-3rem)] w-px bg-muted-foreground/50"></div>
                                    <FormField
                                        control={form.control}
                                        name="pickupLocation"
                                        render={({ field }) => (
                                            <FormItem className="relative mb-2">
                                                <div className="absolute -left-3.5 top-[calc(50%-12px)]">
                                                    <Circle className="h-6 w-6 text-foreground" fill="currentColor"/>
                                                </div>
                                                <FormControl><Input placeholder="Pickup location" {...field} className="h-12 text-base" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dropoffLocation"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <div className="absolute -left-3.5 top-[calc(50%-12px)]">
                                                    <Square className="h-6 w-6 text-foreground" fill="currentColor"/>
                                                </div>
                                                <FormControl><Input placeholder="Dropoff location" {...field} className="h-12 text-base" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pickupDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-12 text-base", !field.value && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : <span>Today</span>}
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
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} className="h-12 text-base" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <h4 className="font-semibold text-foreground">Destination suggestions</h4>
                                <div className="space-y-1">
                                    {mockDestinations.map(dest => (
                                        <div key={dest.name} className="flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-muted" onClick={() => form.setValue('dropoffLocation', dest.name)}>
                                            <div className="bg-muted p-2 rounded-full">
                                                <Clock className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{dest.name}</p>
                                                <p className="text-sm text-muted-foreground">{dest.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                                Search Rides
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>More Services For You</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    {followUpSuggestions.map(suggestion => (
                        <Button key={suggestion.title} variant="outline" className="h-auto p-4 flex flex-col items-start text-left" asChild>
                             <Link href={suggestion.href}>
                                <suggestion.icon className="h-6 w-6 mb-2 text-primary" />
                                <p className="font-semibold">{suggestion.title}</p>
                                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Discover & Go</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visualSuggestions.map(item => (
                        <Card key={item.title} className="overflow-hidden group cursor-pointer">
                            <Link href={item.href}>
                                <div className="relative h-40 w-full">
                                    <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint} className="group-hover:scale-105 transition-transform"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <CardTitle className="absolute bottom-2 left-3 text-white text-lg">{item.title}</CardTitle>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
