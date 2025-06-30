
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Bike, Shield, ShoppingBag, Utensils, Star, LocateFixed, Clock, CalendarDays, CircleDot, Square, Users, Package, Wand2, Home, Briefcase, History } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


const serviceCategories = [
  { name: 'Ride', icon: Car, link: '#ride-booking' },
  { name: 'Bus Tickets', icon: Bus, link: '/bus-transportation' },
  { name: 'Rental Car', icon: CarFront, link: '/car-rent' },
  { name: 'Flights', icon: Plane, link: '/flights' },
];

const destinationSuggestions = [
    { name: "City Center Plaza", address: "123 Main St, Cityville" },
    { name: "International Airport (CVA)", address: "456 Airport Rd, Cityville" },
    { name: "Grand Museum of Art", address: "789 Museum Ave, Cityville" },
];

const pickupSuggestions = [
    { name: "Use current location", address: "Detecting your location...", icon: LocateFixed, type: "action" },
    { name: "Home", address: "123 Suburbia Lane", icon: Home, type: "saved" },
    { name: "Work", address: "456 Business Park", icon: Briefcase, type: "saved" },
    { name: "Previous", address: "789 Downtown Street", icon: History, type: "history" }
];

const dropoffSuggestions = [
     { name: "Previous", address: "101 Grand Hotel", icon: History, type: "history" },
     { name: "International Airport (CVA)", address: "456 Airport Rd, Cityville", icon: Plane, type: "popular" },
     { name: "City Center Plaza", address: "123 Main St, Cityville", icon: MapPin, type: "popular" },
];


export default function TransportPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');

    const handleSearch = () => {
        if (!pickupLocation || !dropoffLocation) {
            toast({
                title: 'Missing Information',
                description: 'Please select both pickup and dropoff locations.',
                variant: 'destructive',
            });
            return;
        }
        
        const query = new URLSearchParams({
            from: pickupLocation,
            to: dropoffLocation,
        });

        router.push(`/transport/search?${query.toString()}`);
    };
    
    const handleDestinationSuggestionClick = (destinationName: string) => {
        setDropoffLocation(destinationName);
    };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Car className="h-8 w-8" />
            Transportation Hub
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your one-stop solution for getting around. Book rides, buses, rentals, and flights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Transport Mode Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {serviceCategories.map((service) => (
              <Link key={service.name} href={service.link} passHref>
                 <Card className="text-center p-4 hover:bg-accent/10 hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                  <service.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{service.name}</p>
                </Card>
              </Link>
            ))}
          </div>
          
          <Separator className="my-8" />

          {/* Ride Booking Section */}
          <div id="ride-booking" className="space-y-4">
            <h3 className="text-2xl font-semibold">Book a Ride</h3>
            <div className="max-w-md">
                <div className="relative">
                    <div className="absolute left-3.5 top-5 bottom-5 w-px bg-muted-foreground"></div>
                    <div className="space-y-2">
                        {/* Pickup Location Input */}
                        <div className="relative">
                            <CircleDot className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-primary"/>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Pickup location" className="pl-9"/>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Type an address..." />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup heading="Suggestions">
                                                {pickupSuggestions.map(suggestion => (
                                                    <CommandItem key={suggestion.name} onSelect={() => setPickupLocation(suggestion.address)}>
                                                        <suggestion.icon className="mr-2 h-4 w-4" />
                                                        <span>{suggestion.name} - <span className="text-muted-foreground">{suggestion.address}</span></span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Dropoff Location Input */}
                        <div className="relative">
                            <Square className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-primary"/>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Input value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} placeholder="Dropoff location" className="pl-9"/>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Type an address..." />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup heading="Suggestions">
                                                {dropoffSuggestions.map(suggestion => (
                                                    <CommandItem key={suggestion.name} onSelect={() => setDropoffLocation(suggestion.address)}>
                                                        <suggestion.icon className="mr-2 h-4 w-4" />
                                                        <span>{suggestion.name} - <span className="text-muted-foreground">{suggestion.address}</span></span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button className="w-full sm:w-auto" onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search Rides</Button>
                </div>
            </div>

            <div className="pt-4 space-y-3">
                <h4 className="font-semibold text-foreground">Destination suggestions</h4>
                {destinationSuggestions.map((dest) => (
                    <button key={dest.name} onClick={() => handleDestinationSuggestionClick(dest.name)} className="flex items-start gap-3 w-full text-left p-2 rounded-md hover:bg-muted">
                        <div className="bg-muted p-2 rounded-full mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground"/>
                        </div>
                        <div>
                            <p className="font-medium">{dest.name}</p>
                            <p className="text-sm text-muted-foreground">{dest.address}</p>
                        </div>
                    </button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Planner CTA */}
        <Card className="bg-accent/10 border-accent/30 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-headline text-accent-foreground flex items-center gap-2">
              <Wand2 className="h-7 w-7 text-accent" />Still planning? Let our AI help.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our AI Trip Planner can build a custom itinerary for you, including transport, stays, and activities.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm hover:shadow-md transition-shadow" asChild>
              <Link href="/ai-trip-planner">Start Planning with AI</Link>
            </Button>
          </CardFooter>
        </Card>

    </div>
  );
}
