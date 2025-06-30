// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Bike, Shield, ShoppingBag, Utensils, Star, LocateFixed, Clock, CalendarDays, CircleDot, Square, Users, Package, Wand2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';

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

const rideTypes = [
    { name: 'Bike', icon: Bike, eta: '5 min', price: '$5-7', description: 'Quickest for short trips' },
    { name: 'Economy', icon: Car, eta: '7 min', price: '$10-12', description: 'Most affordable option' },
    { name: 'Premium', icon: Shield, eta: '6 min', price: '$18-22', description: 'Luxury or comfort ride' },
];

const followUpSuggestions = [
    { name: 'Courier Delivery', image: 'https://placehold.co/400x300.png', dataAiHint: "courier package", link: '/courier-delivery', description: 'Quick package delivery' },
    { name: 'Rent a Car', image: 'https://placehold.co/400x300.png', dataAiHint: "rental car", link: '/car-rent', description: 'Explore on your own time' },
    { name: 'Buy a Car', image: 'https://placehold.co/400x300.png', dataAiHint: "car dealership", link: '/cars-for-sale', description: 'Find your next vehicle' },
    { name: 'Food Delivery', image: 'https://placehold.co/400x300.png', dataAiHint: "food meal", link: '#', description: 'From local restaurants' },
];

const visualSuggestions = [
    { name: 'Top Places to Eat', image: 'https://placehold.co/400x300.png', dataAiHint: "restaurant food", link: '#' },
    { name: 'Weekend Getaways', image: 'https://placehold.co/400x300.png', dataAiHint: "beach resort", link: '/stays/search' },
    { name: 'Attractions With Delivery', image: 'https://placehold.co/400x300.png', dataAiHint: "museum exterior", link: '/attractions' },
    { name: 'Recommended Drivers', image: 'https://placehold.co/400x300.png', dataAiHint: "driver portrait", link: '#' },
    { name: 'Popular Rentals Nearby', image: 'https://placehold.co/400x300.png', dataAiHint: "sports car", link: '/car-rent' },
];


export default function TransportPage() {
    const [showResults, setShowResults] = useState(false);
    const [dropoffLocation, setDropoffLocation] = useState('');

    const handleSearch = () => {
        setShowResults(true);
        toast({ title: 'Ride Search (Demo)', description: "Showing AI-suggested rides we think you'll like." });
        const rideResultsSection = document.getElementById('ride-results');
        if (rideResultsSection) {
            rideResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleSuggestionClick = (destination: string) => {
        setDropoffLocation(destination);
        handleSearch();
    };

    const handleRideForSomeoneElse = () => {
        toast({
            title: "Ride for Someone Else (Demo)",
            description: "You can now enter the passenger's details. This is a placeholder action."
        });
    }

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
          <div id="ride-booking" className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Book a Ride</h3>
                <div className="relative">
                    <div className="absolute left-3.5 top-11 h-8 w-px bg-muted-foreground"></div>
                    <div className="space-y-2">
                        <div className="relative">
                            <CircleDot className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-primary"/>
                            <Input id="pickup-location" placeholder="Pickup location" className="pl-9"/>
                        </div>
                        <div className="relative">
                            <Square className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-primary"/>
                            <Input 
                                id="dropoff-location" 
                                placeholder="Dropoff location" 
                                className="pl-9"
                                value={dropoffLocation}
                                onChange={(e) => setDropoffLocation(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="date-input" className="text-xs text-muted-foreground">Date</label>
                        <Input id="date-input" type="text" defaultValue="Today" icon={<CalendarDays className="h-4 w-4 text-muted-foreground"/>} />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="time-input" className="text-xs text-muted-foreground">Time</label>
                        <Input id="time-input" type="text" defaultValue="Now" icon={<Clock className="h-4 w-4 text-muted-foreground"/>} />
                    </div>
                </div>
                
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="w-full sm:w-auto" onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search Rides</Button>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleRideForSomeoneElse}><Users className="mr-2 h-4 w-4"/>For Someone Else</Button>
                </div>

                <div className="pt-4 space-y-3">
                    <h4 className="font-semibold text-foreground">Destination suggestions</h4>
                    {destinationSuggestions.map((dest) => (
                        <button key={dest.name} onClick={() => handleSuggestionClick(dest.name)} className="flex items-start gap-3 w-full text-left p-2 rounded-md hover:bg-muted">
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

            <div className="hidden md:block">
              <InteractiveMapPlaceholder />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search Results (Conditional) */}
      {showResults && (
        <Card id="ride-results">
            <CardHeader>
                <CardTitle>Rides we think you&apos;ll like (Demo)</CardTitle>
                <CardDescription>AI-suggested rides based on your preferences and location.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {rideTypes.map(ride => (
                <Card key={ride.name} className="hover:bg-accent/10 cursor-pointer" onClick={() => toast({title: `Selected ${ride.name}`, description: "Proceeding to confirmation..."})}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ride.icon className="h-10 w-10 text-primary"/>
                            <div>
                                <p className="font-bold text-lg">{ride.name}</p>
                                <p className="text-sm text-muted-foreground">{ride.eta} away &bull; {ride.description}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-lg">{ride.price}</p>
                    </CardContent>
                </Card>
            ))}
            </CardContent>
        </Card>
      )}
      
      {/* Follow-Up Suggestions */}
       <div className="space-y-6 pt-8">
        <h3 className="text-2xl font-semibold">Need Something Else?</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {followUpSuggestions.map(suggestion => (
                <Link key={suggestion.name} href={suggestion.link} passHref>
                    <Card className="overflow-hidden group cursor-pointer h-full">
                        <div className="relative h-32 w-full">
                            <Image src={suggestion.image} alt={suggestion.name} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform" data-ai-hint={suggestion.dataAiHint}/>
                        </div>
                        <CardContent className="p-3">
                             <p className="font-semibold group-hover:text-primary">{suggestion.name}</p>
                             <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                        </CardContent>
                    </Card>
                 </Link>
            ))}
        </div>
      </div>

       {/* Visual Suggestions */}
       <div className="space-y-6 pt-8">
         <h3 className="text-2xl font-semibold">Inspiration for Your Trip</h3>
         <div className="relative">
             <div className="flex space-x-4 overflow-x-auto pb-4">
                {visualSuggestions.map((item) => (
                    <Link key={item.name} href={item.link} passHref>
                        <div className="flex-shrink-0 w-64 group cursor-pointer">
                            <Card className="overflow-hidden">
                                <div className="relative h-40">
                                    <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.dataAiHint}/>
                                </div>
                                <CardContent className="p-3">
                                    <p className="font-semibold truncate group-hover:text-primary">{item.name}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </Link>
                ))}
             </div>
         </div>
       </div>

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
