// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Bike, Shield, ShoppingBag, Utensils, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const serviceCategories = [
  { name: 'Ride', icon: Car, link: '#ride-booking' },
  { name: 'Bus Tickets', icon: Bus, link: '/bus-transportation' },
  { name: 'Rental Car', icon: CarFront, link: '/car-rent' },
  { name: 'Flights', icon: Plane, link: '/flights' },
];

const rideTypes = [
    { name: 'Bike', icon: Bike, eta: '5 min', price: '$5-7' },
    { name: 'Economy', icon: Car, eta: '7 min', price: '$10-12' },
    { name: 'Premium', icon: Shield, eta: '6 min', price: '$18-22' },
];

const followUpSuggestions = [
    { name: 'Courier Delivery', image: 'https://placehold.co/400x300.png?text=Courier', dataAiHint: "courier package", link: '/courier-delivery', description: 'Quick package delivery' },
    { name: 'Rent a Car', image: 'https://placehold.co/400x300.png?text=Car+Rental', dataAiHint: "rental car", link: '/car-rent', description: 'Explore on your own time' },
    { name: 'Buy a Car', image: 'https://placehold.co/400x300.png?text=Car+For+Sale', dataAiHint: "car dealership", link: '/cars-for-sale', description: 'Find your next vehicle' },
    { name: 'Food Delivery', image: 'https://placehold.co/400x300.png?text=Food+Delivery', dataAiHint: "food meal", link: '#', description: 'From local restaurants' },
];

const visualSuggestions = [
    { name: 'Top Places to Eat', image: 'https://placehold.co/400x300.png?text=Restaurant', dataAiHint: "restaurant food", link: '#' },
    { name: 'Weekend Getaways', image: 'https://placehold.co/400x300.png?text=Getaway', dataAiHint: "beach resort", link: '#' },
    { name: 'Attractions With Delivery', image: 'https://placehold.co/400x300.png?text=Attraction', dataAiHint: "museum exterior", link: '#' },
    { name: 'Recommended Drivers', image: 'https://placehold.co/400x300.png?text=Driver', dataAiHint: "driver portrait", link: '#' },
    { name: 'Popular Rentals Nearby', image: 'https://placehold.co/400x300.png?text=Rental+Car', dataAiHint: "sports car", link: '/car-rent' },
];


export default function TransportPage() {
    
    const handleSearch = () => {
        toast({ title: 'Ride Search (Demo)', description: "Showing AI-suggested rides we think you'll like." });
        const rideResultsSection = document.getElementById('ride-results');
        if (rideResultsSection) {
            rideResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleSuggestionClick = (destination: string) => {
        const dropoffInput = document.getElementById('dropoff-location') as HTMLInputElement | null;
        if(dropoffInput) {
            dropoffInput.value = destination;
        }
        handleSearch();
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
                 <Card className="text-center p-4 hover:bg-accent/10 hover:shadow-md transition-all cursor-pointer">
                  <service.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{service.name}</p>
                </Card>
              </Link>
            ))}
          </div>
          
          <Separator className="my-8" />

          {/* Ride Booking Search */}
          <div id="ride-booking" className="space-y-4">
            <h3 className="text-2xl font-semibold">Book a Ride</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickup-location" className="block text-sm font-medium text-muted-foreground mb-1">Pickup Location</label>
                <Input id="pickup-location" placeholder="Enter pickup address" defaultValue="Your Current Location (Demo)" />
              </div>
              <div>
                <label htmlFor="dropoff-location" className="block text-sm font-medium text-muted-foreground mb-1">Dropoff Location</label>
                <Input id="dropoff-location" placeholder="Enter destination" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                 <Button className="w-full sm:w-auto" onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search Rides</Button>
                 <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: "Ride for someone else (Demo)", description: "Functionality to book for another person would be enabled."})}>Ride for Someone Else</Button>
            </div>
             <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground">Suggested Destinations:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="secondary" size="sm" onClick={() => handleSuggestionClick("City Center Plaza")}>City Center Plaza</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleSuggestionClick("International Airport")}>International Airport</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleSuggestionClick("Main Street Market")}>Main Street Market</Button>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search Results (Conditional) */}
      <div id="ride-results" className="space-y-6">
        <h3 className="text-2xl font-semibold">Rides We Think You'll Like (Demo)</h3>
        <div className="grid md:grid-cols-3 gap-4">
            {rideTypes.map(ride => (
                <Card key={ride.name}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ride.icon className="h-8 w-8 text-primary"/>
                            <div>
                                <p className="font-bold">{ride.name}</p>
                                <p className="text-sm text-muted-foreground">{ride.eta} away</p>
                            </div>
                        </div>
                        <p className="font-semibold">{ride.price}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
      
      {/* Follow-Up Suggestions */}
       <div className="space-y-6 pt-8">
        <h3 className="text-2xl font-semibold">Need Something Else?</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {followUpSuggestions.map(suggestion => (
                <Link key={suggestion.name} href={suggestion.link} passHref>
                    <Card className="overflow-hidden group cursor-pointer">
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

    </div>
  );
}
