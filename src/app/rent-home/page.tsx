
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, Home as HomeIcon, DollarSign, MapPin, Maximize, Layers, CalendarDays, Phone, Search, Bed, Bath, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

const rentalSearchSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z.enum(["ANY", "APARTMENT", "HOUSE", "TOWNHOUSE", "CONDO"]).default("ANY").optional(),
  bedrooms: z.coerce.number().optional(),
  amenities: z.string().optional(), // Could be a multi-select or tags in a real app
});

type RentalSearchFormValues = z.infer<typeof rentalSearchSchema>;

const mockRentals = [
  { id: "rent1", name: "Chic Downtown Loft", price: 2200, location: "City Center", type: "Apartment", bedrooms: 1, amenities: "Gym, Pool, In-unit Laundry", image: "https://placehold.co/600x400.png?text=Downtown+Loft", dataAiHint: "loft apartment" },
  { id: "rent2", name: "Suburban Family House", price: 3500, location: "Green Meadows", type: "House", bedrooms: 3, amenities: "Yard, Garage, Pet-friendly", image: "https://placehold.co/600x400.png?text=Suburban+House", dataAiHint: "family house suburban" },
  { id: "rent3", name: "Modern Townhouse", price: 2800, location: "North District", type: "Townhouse", bedrooms: 2, amenities: "Rooftop Deck, Smart Home", image: "https://placehold.co/600x400.png?text=Modern+Townhouse", dataAiHint: "modern townhouse" },
];

export default function RentHomePage() {
  const [rentals, setRentals] = useState(mockRentals);

  const rentalSearchForm = useForm<RentalSearchFormValues>({
    resolver: zodResolver(rentalSearchSchema),
    defaultValues: { propertyType: "ANY" },
  });

  function onRentalSearchSubmit(data: RentalSearchFormValues) {
    console.log("Rental Search Filters:", data);
    toast({ title: "Search Submitted", description: "Filtering rentals (simulation)." });
    // In a real app, you would filter the rentals array or fetch from an API
  }

  const handleScheduleTour = (propertyName: string) => {
    toast({ title: "Tour Scheduled (Demo)", description: `A tour for ${propertyName} has been requested.` });
  };
  const handleVirtualWalkthrough = (propertyName: string) => {
    toast({ title: "Virtual Walkthrough (Demo)", description: `Starting virtual walkthrough for ${propertyName}. This is a placeholder.`});
  };
   const handleContactAgent = (propertyName: string) => {
    toast({ title: "Contacting Agent (Demo)", description: `Connecting you with an agent for ${propertyName}.` });
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <HomeIcon className="h-8 w-8" />
            Rent a Home
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Browse long-term and short-term home rentals. Find your perfect home away from home.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-6 w-6" /> Search Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...rentalSearchForm}>
                <form onSubmit={rentalSearchForm.handleSubmit(onRentalSearchSubmit)} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <FormField
                    control={rentalSearchForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location</FormLabel>
                        <FormControl><Input placeholder="e.g., City, Neighborhood, Zip" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><ClipboardList className="h-4 w-4 text-primary" />Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="ANY">Any Type</SelectItem>
                            <SelectItem value="APARTMENT">Apartment</SelectItem>
                            <SelectItem value="HOUSE">House</SelectItem>
                            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                            <SelectItem value="CONDO">Condo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={rentalSearchForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Min Rent/Month</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Max Rent/Month</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3000" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4 text-primary" />Bedrooms</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="0">Studio / Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Smile className="h-4 w-4 text-primary" />Amenities (Keywords)</FormLabel>
                        <FormControl><Input placeholder="e.g., Pet-friendly, In-unit laundry" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="md:col-span-2 lg:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground self-end">
                    <Search className="mr-2 h-4 w-4" /> Search Rentals
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Rental Listings Placeholder */}
          <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Available Rentals</h3>
          {rentals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map(prop => (
                <Card key={prop.id} className="overflow-hidden">
                  <Image src={prop.image} alt={prop.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={prop.dataAiHint}/>
                  <CardHeader>
                    <CardTitle>{prop.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold text-lg">${prop.price.toLocaleString()}/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 mr-1"/>{prop.location}</p>
                    <p className="text-sm text-muted-foreground"><ClipboardList className="inline h-4 w-4 mr-1"/>Type: {prop.type}</p>
                    <p className="text-sm text-muted-foreground"><Bed className="inline h-4 w-4 mr-1"/>Bedrooms: {prop.bedrooms}</p>
                    <p className="text-sm text-muted-foreground"><Smile className="inline h-4 w-4 mr-1"/>Amenities: {prop.amenities}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleScheduleTour(prop.name)} className="w-full sm:w-auto">
                      <CalendarDays className="mr-2 h-4 w-4" /> Schedule Tour
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleVirtualWalkthrough(prop.name)} className="w-full sm:w-auto">Virtual Walkthrough</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleContactAgent(prop.name)} className="w-full sm:w-auto">
                      <Phone className="mr-2 h-4 w-4" /> Contact Agent
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-foreground">No matching rentals found.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
            </div>
          )}
          
          <div className="mt-8 p-4 border rounded-md bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">Coming Soon:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Secure Document Upload & E-signature for lease agreements.</li>
              <li>Verified Agent Rating & Review System for transparency.</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
