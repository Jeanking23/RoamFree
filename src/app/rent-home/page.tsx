
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, HomeIcon, DollarSign, MapPin, Maximize, Layers, CalendarDays, Phone, Search, Bed, Bath, Smile, TvIcon, FileText, CheckCircle, School, Building, Leaf, ShieldCheck, Users, Star } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { mockRentalProperties } from '@/lib/mock-data';
import PropertiesMapPlaceholder from '@/components/map/properties-map-placeholder';

const rentalSearchSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z.enum(["ANY", "APARTMENT", "HOUSE", "TOWNHOUSE", "CONDO"]).default("ANY").optional(),
  bedrooms: z.coerce.number().optional(),
  amenities: z.string().optional(), 
});

type RentalSearchFormValues = z.infer<typeof rentalSearchSchema>;

export default function RentHomePage() {
  const [rentals, setRentals] = useState(mockRentalProperties);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const rentalSearchForm = useForm<RentalSearchFormValues>({
    resolver: zodResolver(rentalSearchSchema),
    defaultValues: { propertyType: "ANY", location: "", minPrice: undefined, maxPrice: undefined, bedrooms: undefined, amenities: "" },
  });

  function onRentalSearchSubmit(data: RentalSearchFormValues) {
    console.log("Rental Search Filters:", data);
    // Filter logic based on form data
    const filteredRentals = mockRentalProperties.filter(rental => {
        let matches = true;
        if (data.location && !rental.location.toLowerCase().includes(data.location.toLowerCase())) {
            matches = false;
        }
        if (data.minPrice && rental.price && rental.price < data.minPrice) {
            matches = false;
        }
        if (data.maxPrice && rental.price && rental.price > data.maxPrice) {
            matches = false;
        }
        if (data.propertyType !== "ANY" && rental.category?.toLowerCase() !== data.propertyType?.toLowerCase()) {
            matches = false;
        }
        if (data.bedrooms && rental.bedrooms && rental.bedrooms < data.bedrooms) {
            matches = false;
        }
        if (data.amenities && rental.amenities && !rental.amenities.some(a => a.toLowerCase().includes(data.amenities!.toLowerCase()))) {
            matches = false;
        }
        return matches;
    });
    setRentals(filteredRentals);
    setSearchPerformed(true);
    toast({ title: "Search Submitted", description: `Found ${filteredRentals.length} rentals.` });
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
  const handleViewFloorPlan = (propertyName: string) => {
    toast({ title: "View Floor Plan (Demo)", description: `Displaying 3D floor plan for ${propertyName}.` });
  };
  const handleLeaseManagement = (propertyName: string) => {
    toast({ title: "Lease Management (Demo)", description: `Accessing lease documents and payment options for ${propertyName}. Digital signing and rent reminders would be here.` });
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
                        <FormControl><Input placeholder="e.g., City, Neighborhood, Zip" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={rentalSearchForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Min Rent/Month</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Max Rent/Month</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3000" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4 text-primary" />Bedrooms</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "ALL" ? undefined : Number(value))}
                          value={field.value === undefined ? "ALL" : field.value.toString()}
                        >
                            <FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="ALL">Any</SelectItem>
                                <SelectItem value="0">Studio</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rentalSearchForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Smile className="h-4 w-4 text-primary" />Amenities (Keywords)</FormLabel>
                        <FormControl><Input placeholder="e.g., Pet-friendly, In-unit laundry" {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="md:col-span-full lg:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground self-end">
                    <Search className="mr-2 h-4 w-4" /> Search Rentals
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {searchPerformed ? (
            <div className="mt-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {rentals.length > 0 ? `Found ${rentals.length} Rentals` : 'No Rentals Found'}
                </h3>
                {rentals.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <div className="lg:sticky lg:top-24 h-[600px] lg:h-[calc(100vh-8rem)]">
                            <PropertiesMapPlaceholder rentals={rentals} />
                        </div>
                        <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                            {rentals.map(prop => (
                                <Card key={prop.id} className="overflow-hidden flex flex-row shadow-md hover:shadow-lg transition-shadow">
                                    <Link href={`/rent-home/${prop.id}`} className="block w-1/3 flex-shrink-0 relative">
                                        <Image src={prop.image} alt={prop.name} layout="fill" objectFit="cover" data-ai-hint={prop.dataAiHint}/>
                                    </Link>
                                    <div className="flex flex-col flex-grow">
                                        <CardHeader className="p-3">
                                            <CardTitle className="text-md hover:text-primary"><Link href={`/rent-home/${prop.id}`}>{prop.name}</Link></CardTitle>
                                            <CardDescription className="text-primary font-semibold text-base">${(prop.price ?? prop.pricePerNight).toLocaleString()}{prop.price ? '/month' : '/night'}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0 space-y-2 text-sm flex-grow">
                                            <p className="text-muted-foreground flex items-center gap-1 truncate"><MapPin className="h-4 w-4 flex-shrink-0"/>{prop.location}</p>
                                            <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3">
                                                <span><Bed className="inline h-3 w-3 mr-1"/>{prop.bedrooms} Beds</span>
                                                <span><Bath className="inline h-3 w-3 mr-1"/>{prop.bathrooms} Baths</span>
                                                <span><Maximize className="inline h-3 w-3 mr-1"/>{prop.sizeSqft}</span>
                                            </div>
                                            <div className="flex items-center pt-1">
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                                <span className="text-sm font-semibold">{prop.rating}</span>
                                                <span className="text-xs text-muted-foreground ml-1">({prop.reviewsCount} reviews)</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-2 border-t bg-muted/30">
                                            <Button asChild variant="default" size="sm" className="w-full">
                                                <Link href={`/rent-home/${prop.id}`}>View Details</Link>
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                        <p className="text-xl font-semibold text-foreground">No matching rentals found.</p>
                        <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>
          ) : (
            <>
                <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Featured Rentals</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.map(prop => (
                        <Card key={prop.id} className="overflow-hidden flex flex-col">
                            <Link href={`/rent-home/${prop.id}`}>
                                <Image src={prop.image} alt={prop.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={prop.dataAiHint}/>
                            </Link>
                            <CardHeader>
                                <CardTitle><Link href={`/rent-home/${prop.id}`}>{prop.name}</Link></CardTitle>
                                <CardDescription className="text-primary font-semibold text-lg">${(prop.price ?? prop.pricePerNight).toLocaleString()}{prop.price ? '/month' : '/night'}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 flex-grow">
                                <p className="text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 mr-1"/>{prop.location}</p>
                                <div className="text-sm text-muted-foreground flex items-center justify-between">
                                  <span><Bed className="inline h-4 w-4 mr-1"/>{prop.bedrooms} Beds</span>
                                  <span><Bath className="inline h-4 w-4 mr-1"/>{prop.bathrooms} Baths</span>
                                  <span><Maximize className="inline h-4 w-4 mr-1"/>{prop.sizeSqft}</span>
                                </div>
                                <div className="flex items-center pt-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                    <span className="text-sm font-semibold">{prop.rating}</span>
                                    <span className="text-xs text-muted-foreground ml-1">({prop.reviewsCount} reviews)</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                                <Button asChild className="w-full"><Link href={`/rent-home/${prop.id}`}>View Details & Apply</Link></Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </>
          )}

          <div className="mt-8 p-4 border rounded-md bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">Tenant & Landlord Features (Demo):</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><ShieldCheck className="inline h-4 w-4 mr-1 text-primary"/>Secure Document Upload & E-signature for lease agreements.</li>
              <li><CalendarDays className="inline h-4 w-4 mr-1 text-primary"/>Real-time availability calendar with sync options (Airbnb, Booking.com).</li>
              <li><DollarSign className="inline h-4 w-4 mr-1 text-primary"/>In-app rent payment with due date reminders & recurring billing.</li>
              <li><Users className="inline h-4 w-4 mr-1 text-primary"/>Optional Tenant Background Checks (ID, income, rental history) for hosts.</li>
              <li><Building className="inline h-4 w-4 mr-1 text-primary"/>Detailed neighborhood insights: crime rates, schools, transport, walkability.</li>
            </ul>
             <Button variant="link" asChild className="mt-2 px-0"><Link href="/list-property">List Your Rental Property (Demo)</Link></Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
