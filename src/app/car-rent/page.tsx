
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { KeyRound, Car, User, CheckCircle, CalendarDays, Users, Briefcase, ShieldCheck, Star, Luggage, TvIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; // Added import

const carListings = [
  {
    id: 1,
    name: "Toyota Camry Hybrid",
    type: "Sedan",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 55,
    image: "https://placehold.co/600x400.png?text=Camry+Hybrid",
    dataAiHint: "sedan car",
    features: ["Hybrid Fuel Efficiency", "Advanced Safety Suite", "Spacious Interior"],
    rating: 4.8,
    reviews: 120,
    insuranceIncluded: true,
    ecoFriendly: true, // Demo
  },
  {
    id: 2,
    name: "Ford Explorer XLT",
    type: "SUV",
    year: 2022,
    seats: 7,
    transmission: "Automatic",
    pricePerDay: 85,
    image: "https://placehold.co/600x400.png?text=Ford+Explorer",
    dataAiHint: "suv car",
    features: ["Third-Row Seating", "All-Wheel Drive", "Panoramic Sunroof"],
    rating: 4.5,
    reviews: 95,
    insuranceIncluded: true,
    ecoFriendly: false,
  },
  {
    id: 3,
    name: "Mercedes-Benz Sprinter",
    type: "Van",
    year: 2023,
    seats: 12,
    transmission: "Automatic",
    pricePerDay: 150,
    image: "https://placehold.co/600x400.png?text=Sprinter+Van",
    dataAiHint: "van vehicle",
    features: ["High Roof", "Ample Cargo Space", "Comfortable for Groups"],
    rating: 4.9,
    reviews: 70,
    insuranceIncluded: false,
    ecoFriendly: false,
  }
];


export default function CarRentPage() {
  const [includeDriver, setIncludeDriver] = useState(false);
  const [baggageAssistance, setBaggageAssistance] = useState(false);

  const handleRentNow = (carName: string) => {
    toast({
      title: "Rental Initiated (Demo)",
      description: `You've started the rental process for ${carName}. ${includeDriver ? 'Driver service requested.' : ''} ${baggageAssistance ? 'Baggage assistance requested.' : ''}`,
    });
  };

  const handle360View = (carName: string) => {
    toast({ title: `360° View (Demo) - ${carName}`, description: "Showing immersive 360° view of the vehicle." });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <KeyRound className="h-8 w-8" />
            Rent a Car
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Explore a wide range of rental cars, including eco-friendly options, to suit your travel needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 border rounded-md bg-muted/30 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDriver"
                checked={includeDriver}
                onCheckedChange={(checked) => setIncludeDriver(checked as boolean)}
              />
              <Label htmlFor="includeDriver" className="text-base font-medium text-foreground">
                Include a Driver (for intercity trips, airport transfers, or convenience)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="baggageAssistance"
                checked={baggageAssistance}
                onCheckedChange={(checked) => setBaggageAssistance(checked as boolean)}
              />
              <Label htmlFor="baggageAssistance" className="text-base font-medium text-foreground">
                Include Baggage Assistance (Help for seniors or families)
              </Label>
            </div>
          </div>


          {includeDriver && (
            <div className="mb-6 p-4 border border-accent rounded-md bg-accent/10">
              <p className="text-accent-foreground font-semibold">
                <Briefcase className="inline h-5 w-5 mr-2" /> Professional driver service selected. Additional charges may apply.
              </p>
            </div>
          )}
          {baggageAssistance && (
            <div className="mb-6 p-4 border border-blue-500 rounded-md bg-blue-500/10">
              <p className="text-blue-700 font-semibold">
                <Luggage className="inline h-5 w-5 mr-2" /> Baggage assistance service selected.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carListings.map((car) => (
              <Card key={car.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-56">
                  <Image src={car.image} alt={car.name} layout="fill" objectFit="cover" data-ai-hint={car.dataAiHint} />
                   {car.ecoFriendly && <Badge variant="secondary" className="absolute top-2 right-2 bg-green-500 text-white border-green-600">Eco-Friendly</Badge>}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">{car.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{car.year} &bull; {car.type}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" /> {car.seats} Seats
                    <span className="mx-2">|</span>
                    <Car className="h-4 w-4 mr-2 text-primary" /> {car.transmission}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {car.features.slice(0,2).map(feature => (
                       <li key={feature} className="flex items-center">
                         <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                       </li>
                    ))}
                  </ul>
                   <div className="flex items-center text-sm">
                    <ShieldCheck className={`h-4 w-4 mr-2 ${car.insuranceIncluded ? 'text-green-600' : 'text-orange-500'}`} />
                    Insurance: {car.insuranceIncluded ? "Included" : "Available"}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({car.reviews} reviews)</span>
                  </div>
                   <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handle360View(car.name)}>
                    <TvIcon className="mr-2 h-4 w-4" /> 360° View (Demo)
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col items-start bg-muted/50 p-4">
                  <p className="text-2xl font-bold text-primary mb-2">${car.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleRentNow(car.name)}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Rent Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">More vehicles arriving soon!</p>
            <p className="text-muted-foreground mt-2">Find the perfect ride for any occasion.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
