
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { KeyRound, Car, User, CheckCircle, CalendarDays, Users, Briefcase, ShieldCheck, Star, Luggage, TvIcon, Settings, FileText, MapPin, Edit, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const carListings = [
  {
    id: 1,
    name: "Toyota Camry Hybrid",
    type: "Sedan",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 55,
    pricePerHour: 10, // New
    pricePerWeek: 350, // New
    image: "https://placehold.co/600x400.png?text=Camry+Hybrid",
    dataAiHint: "sedan car",
    features: ["Hybrid Fuel Efficiency", "Advanced Safety Suite", "Spacious Interior", "Bluetooth Audio"],
    rating: 4.8,
    reviews: 120,
    insuranceIncluded: true,
    ecoFriendly: true,
    mileage: "15,000 miles", // New
    fuelPolicy: "Full-to-Full", // New
    pickupLocations: ["Airport", "Downtown", "Hotel Delivery (Demo)"], // New
    licenseRequired: "Standard Driver's License, Min Age 21", // New
  },
  {
    id: 2,
    name: "Ford Explorer XLT",
    type: "SUV",
    year: 2022,
    seats: 7,
    transmission: "Automatic",
    pricePerDay: 85,
    pricePerHour: 18,
    pricePerWeek: 550,
    image: "https://placehold.co/600x400.png?text=Ford+Explorer",
    dataAiHint: "suv car",
    features: ["Third-Row Seating", "All-Wheel Drive", "Panoramic Sunroof", "Apple CarPlay/Android Auto"],
    rating: 4.5,
    reviews: 95,
    insuranceIncluded: true,
    ecoFriendly: false,
    mileage: "22,000 miles",
    fuelPolicy: "Full-to-Full",
    pickupLocations: ["Airport", "West End Branch", "One-Way to City B (Demo)"],
    licenseRequired: "Standard Driver's License, Min Age 25",
  },
  {
    id: 3,
    name: "Mercedes-Benz Sprinter",
    type: "Van",
    year: 2023,
    seats: 12,
    transmission: "Automatic",
    pricePerDay: 150,
    pricePerHour: 30,
    pricePerWeek: 950,
    image: "https://placehold.co/600x400.png?text=Sprinter+Van",
    dataAiHint: "van vehicle",
    features: ["High Roof", "Ample Cargo Space", "Comfortable for Groups", "Rear AC"],
    rating: 4.9,
    reviews: 70,
    insuranceIncluded: false,
    ecoFriendly: false,
    mileage: "8,000 miles",
    fuelPolicy: "Like-for-Like",
    pickupLocations: ["Business Park Depot", "Custom Location Delivery (Demo)"],
    licenseRequired: "Standard Driver's License, Min Age 25, Commercial Endorsement (Demo if applicable)",
  }
];


export default function CarRentPage() {
  const [includeDriver, setIncludeDriver] = useState(false);
  const [baggageAssistance, setBaggageAssistance] = useState(false);
  const [rentalDuration, setRentalDuration] = useState("daily"); // hourly, daily, weekly
  const [selectedInsurance, setSelectedInsurance] = useState("basic"); // basic, full


  const handleRentNow = (carName: string) => {
    toast({
      title: "Rental Initiated (Demo)",
      description: `You've started the rental process for ${carName}. Duration: ${rentalDuration}. Insurance: ${selectedInsurance}. ${includeDriver ? 'Driver service requested.' : ''} ${baggageAssistance ? 'Baggage assistance requested.' : ''} Driver's license upload would be required here.`,
    });
  };

  const handle360View = (carName: string) => {
    toast({ title: `360° View (Demo) - ${carName}`, description: "Showing immersive 360° view of the vehicle." });
  };

  const handleReportDamage = (carName: string) => {
    toast({ title: `Damage Report (Demo) - ${carName}`, description: "Opening damage report tool. You can upload photos before/after trip."});
  };

  const getPrice = (car: typeof carListings[0]) => {
    if (rentalDuration === "hourly") return car.pricePerHour;
    if (rentalDuration === "weekly") return car.pricePerWeek;
    return car.pricePerDay;
  };
  const getPriceSuffix = () => {
    if (rentalDuration === "hourly") return "/hour";
    if (rentalDuration === "weekly") return "/week";
    return "/day";
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <KeyRound className="h-8 w-8" />
            Rent a Car
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Explore a wide range of rental cars, including eco-friendly options, to suit your travel needs. Hourly, daily, or weekly rentals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 border rounded-md bg-muted/30 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="rental-duration">Rental Duration</Label>
                    <Select value={rentalDuration} onValueChange={setRentalDuration}>
                        <SelectTrigger id="rental-duration">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="insurance-options">Insurance Coverage (Demo)</Label>
                    <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                        <SelectTrigger id="insurance-options">
                            <SelectValue placeholder="Select insurance" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic (Included where stated)</SelectItem>
                            <SelectItem value="full">Full Coverage (+$X/day)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
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
                  <CardDescription className="text-sm text-muted-foreground">{car.year} &bull; {car.type} &bull; {car.mileage}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" /> {car.seats} Seats
                    <span className="mx-2">|</span>
                    <Settings className="h-4 w-4 mr-2 text-primary" /> {car.transmission}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {car.features.slice(0,3).map(feature => (
                       <li key={feature} className="flex items-center">
                         <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                       </li>
                    ))}
                    {car.features.length > 3 && <li className="text-xs text-muted-foreground pl-6">...and more</li>}
                  </ul>
                   <div className="text-sm space-y-1">
                        <p><ShieldCheck className={`inline h-4 w-4 mr-1 ${car.insuranceIncluded ? 'text-green-600' : 'text-orange-500'}`} />Insurance: {car.insuranceIncluded ? "Basic Included" : "Available"}</p>
                        <p><FileText className="inline h-4 w-4 mr-1 text-primary"/>Fuel Policy: {car.fuelPolicy}</p>
                        <p><User className="inline h-4 w-4 mr-1 text-primary"/>Requirements: {car.licenseRequired}</p>
                   </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({car.reviews} reviews)</span>
                  </div>
                   <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handle360View(car.name)}>
                    <TvIcon className="mr-2 h-4 w-4" /> 360° View (Demo)
                  </Button>
                   <Separator className="my-2"/>
                   <p className="text-xs text-muted-foreground font-medium">Pickup/Drop-off Locations (Demo):</p>
                    <div className="flex flex-wrap gap-1">
                        {car.pickupLocations.map(loc => <Badge key={loc} variant="outline">{loc}</Badge>)}
                    </div>
                     <p className="text-xs text-muted-foreground">One-way rentals & delivery options available (Demo).</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start bg-muted/50 p-4">
                  <p className="text-2xl font-bold text-primary mb-2">${getPrice(car)}<span className="text-sm font-normal text-muted-foreground">{getPriceSuffix()}</span></p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleRentNow(car.name)}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Rent Now
                  </Button>
                   <Button variant="ghost" size="sm" className="w-full mt-1 text-destructive" onClick={() => handleReportDamage(car.name)}>
                    <AlertTriangle className="mr-2 h-4 w-4" /> Report Pre/Post-Trip Damage (Demo)
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">More vehicles arriving soon!</p>
            <p className="text-muted-foreground mt-2">Find the perfect ride for any occasion. Long-term rental discounts available.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
