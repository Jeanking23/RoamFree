
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Bike, Shield, ShoppingBag, Utensils, Star, LocateFixed, Clock, CalendarDays, CircleDot, Square, Users, Package, Wand2, Home, Briefcase, History, Check, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const serviceCategories = [
  { name: 'Ride', icon: Car, link: '#ride-booking' },
  { name: 'Bus Tickets', icon: Bus, link: '/bus-transportation' },
  { name: 'Rental Car', icon: CarFront, link: '/car-rent' },
  { name: 'Flights', icon: Plane, link: '/flights' },
];

const destinationSuggestions = [
    { name: "Philadelphia International Airport (PHL)", address: "8000 Essington Ave, Philadelphia, PA" },
    { name: "William H. Gray III 30th Street Amtrak Station", address: "2955 Market St, Philadelphia, PA" },
    { name: "Grand Museum of Art", address: "789 Museum Ave, Cityville" },
    { name: "Philadelphia Museum of Art", address: "2600 Benjamin Franklin Pkwy, Philadelphia, PA" },
    { name: "Philadelphia City Hall", address: "1400 John F Kennedy Blvd, Philadelphia, PA" },
    { name: "Reading Terminal Market", address: "51 N 12th St, Philadelphia, PA" },
];

const savedPlaces = [
    { name: "Your location", address: "123 Main St, Cityville (GPS)", icon: LocateFixed },
    { name: "Home", address: "123 Suburbia Lane, Newark, DE", icon: Home },
    { name: "Work", address: "456 Business Park, Wilmington, DE", icon: Briefcase },
    { name: "7244 Alexandra Dr, Newark, DE", address: "7244 Alexandra Dr, Newark, DE", icon: History }
];

const suggestionItems = [
    {
      title: 'Ride',
      description: 'Request a ride now, or schedule one for later.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'car road',
      link: '#ride-booking',
    },
    {
      title: 'Reserve',
      description: 'Advance book a ride up to 30 days.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'calendar car',
      link: '#ride-booking',
    },
    {
      title: 'Rental Cars',
      description: 'Rent a car from a variety of models.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'rental cars',
      link: '/car-rent',
    },
    {
      title: 'Courier',
      description: 'Send packages to friends and family.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'delivery package',
      link: '/courier-delivery',
    },
    {
      title: 'Food',
      description: 'Get your favorite meals delivered.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'food delivery',
      link: '#!', // Placeholder link
    },
    {
      title: 'Grocery',
      description: 'Have groceries delivered to your door.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'grocery bag',
      link: '#!', // Placeholder link
    },
];


export default function TransportPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');
    
    const [isPickupPopoverOpen, setIsPickupPopoverOpen] = useState(false);
    const [isDropoffPopoverOpen, setIsDropoffPopoverOpen] = useState(false);

    const [pickupQuery, setPickupQuery] = useState('');
    const [dropoffQuery, setDropoffQuery] = useState('');

    useEffect(() => {
        const now = new Date();
        setDate(now);
        setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, []);

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
            date: date?.toISOString() || new Date().toISOString(),
            time: time,
        });

        router.push(`/transport/search?${query.toString()}`);
    };

    const filteredPickupSuggestions = pickupQuery ? destinationSuggestions.filter(d => 
        d.name.toLowerCase().includes(pickupQuery.toLowerCase()) || 
        d.address.toLowerCase().includes(pickupQuery.toLowerCase())
    ) : destinationSuggestions;
    
    const filteredDropoffSuggestions = dropoffQuery ? destinationSuggestions.filter(d => 
        d.name.toLowerCase().includes(dropoffQuery.toLowerCase()) || 
        d.address.toLowerCase().includes(dropoffQuery.toLowerCase())
    ) : destinationSuggestions;

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

          <div id="ride-booking" className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="hidden lg:block rounded-lg overflow-hidden h-96 sticky top-24">
                <InteractiveMapPlaceholder pickup={pickupLocation} dropoff={dropoffLocation} />
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Book a Ride</h3>
                <div className="max-w-md space-y-4">
                     <Popover open={isPickupPopoverOpen} onOpenChange={setIsPickupPopoverOpen}>
                        <PopoverTrigger asChild>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Pickup location" 
                                    value={pickupLocation}
                                    onChange={(e) => {
                                        setPickupLocation(e.target.value);
                                        setPickupQuery(e.target.value);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                           <Command shouldFilter={false}>
                                <CommandInput placeholder="Search pickup location..." value={pickupQuery} onValueChange={setPickupQuery}/>
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                     <CommandGroup heading="Saved places">
                                        {savedPlaces.map((place) => (
                                            <CommandItem key={place.name} onSelect={() => {
                                                setPickupLocation(place.address);
                                                setPickupQuery(place.address);
                                                setIsPickupPopoverOpen(false);
                                            }}>
                                                <place.icon className="mr-2 h-4 w-4" />
                                                <span>{place.name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandGroup heading="Suggestions">
                                        {filteredPickupSuggestions.map((suggestion) => (
                                             <CommandItem key={suggestion.name} onSelect={() => {
                                                const fullAddress = `${suggestion.name}, ${suggestion.address}`;
                                                setPickupLocation(fullAddress);
                                                setPickupQuery(fullAddress);
                                                setIsPickupPopoverOpen(false);
                                            }}>
                                                <MapPin className="mr-2 h-4 w-4" />
                                                <div>
                                                   <p>{suggestion.name}</p>
                                                   <p className="text-xs text-muted-foreground">{suggestion.address}</p>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                           </Command>
                        </PopoverContent>
                    </Popover>

                    <Popover open={isDropoffPopoverOpen} onOpenChange={setIsDropoffPopoverOpen}>
                        <PopoverTrigger asChild>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Dropoff location" 
                                    value={dropoffLocation}
                                    onChange={(e) => {
                                        setDropoffLocation(e.target.value);
                                        setDropoffQuery(e.target.value);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                           <Command shouldFilter={false}>
                                <CommandInput placeholder="Search dropoff location..." value={dropoffQuery} onValueChange={setDropoffQuery}/>
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="Suggestions">
                                        {filteredDropoffSuggestions.map((suggestion) => (
                                             <CommandItem key={suggestion.name} onSelect={() => {
                                                const fullAddress = `${suggestion.name}, ${suggestion.address}`;
                                                setDropoffLocation(fullAddress);
                                                setDropoffQuery(fullAddress);
                                                setIsDropoffPopoverOpen(false);
                                            }}>
                                                <MapPin className="mr-2 h-4 w-4" />
                                                <div>
                                                   <p>{suggestion.name}</p>
                                                   <p className="text-xs text-muted-foreground">{suggestion.address}</p>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                           </Command>
                        </PopoverContent>
                    </Popover>
                    
                    <div className="grid grid-cols-2 gap-2">
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Today</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                <p className="text-xs p-2 text-muted-foreground">Press Escape to close.</p>
                            </PopoverContent>
                        </Popover>
                        <div className="relative">
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                           <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-9"/>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="w-full" onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search Rides</Button>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />
       
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestionItems.map((item) => (
                    <Card key={item.title} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all">
                        <div className="relative h-40 w-full">
                            <Image src={item.imageSrc} alt={item.title} fill className="object-cover" data-ai-hint={item.dataAiHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" asChild className="w-full">
                                <Link href={item.link}>Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      
      <Separator className="my-8" />

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
