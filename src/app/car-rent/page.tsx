
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { KeyRound, Car, User, CheckCircle, CalendarDays, Users, Briefcase, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

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
    insuranceIncluded: false, // Example
  }
];


export default function CarRentPage() {
  const [includeDriver, setIncludeDriver] = useState(false);

  const handleRentNow = (carName: string) => {
    toast({
      title: "Rental Initiated (Demo)",
      description: `You've started the rental process for ${carName}. ${includeDriver ? 'Driver service requested.' : ''}`,
    });
    // In a real app, this would navigate to a booking confirmation page or open a modal
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
            Explore a wide range of rental cars to suit your travel needs. Easy booking and great prices.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-6 p-4 border rounded-md bg-muted/30">
            <Checkbox
              id="includeDriver"
              checked={includeDriver}
              onCheckedChange={(checked) => setIncludeDriver(checked as boolean)}
            />
            <Label htmlFor="includeDriver" className="text-base font-medium text-foreground">
              Include a Driver (for intercity trips, airport transfers, or convenience)
            </Label>
          </div>

          {includeDriver && (
            <div className="mb-6 p-4 border border-accent rounded-md bg-accent/10">
              <p className="text-accent-foreground font-semibold">
                <Briefcase className="inline h-5 w-5 mr-2" /> Professional driver service selected. Additional charges may apply.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carListings.map((car) => (
              <Card key={car.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-56">
                  <Image src={car.image} alt={car.name} layout="fill" objectFit="cover" data-ai-hint={car.dataAiHint} />
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
                    {car.features.slice(0,2).map(feature => ( // Show first 2 features
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

    