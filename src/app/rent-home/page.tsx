
// src/app/rent-home/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, HomeIcon, DollarSign, MapPin, Maximize, Layers, CalendarDays, Phone, Search, Bed, Bath, Smile, TvIcon, FileText, CheckCircle, School, Building, Leaf, ShieldCheck, Users, Star, X, SlidersHorizontal, List, Map as MapIcon, Plus } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


const rentalSearchSchema = z.object({
  location: z.string().optional(),
  priceRange: z.array(z.number()).optional(),
  propertyType: z.enum(["ANY", "APARTMENT", "HOUSE", "TOWNHOUSE", "CONDO"]).default("ANY").optional(),
  bedrooms: z.enum(["ANY", "1+", "2+", "3+", "4+"]).default("ANY").optional(),
  bathrooms: z.enum(["ANY", "1+", "2+", "3+"]).default("ANY").optional(),
  amenities: z.array(z.string()).optional(),
  moveInDate: z.date().optional(),
});

type RentalSearchFormValues = z.infer<typeof rentalSearchSchema>;

export default function RentHomePage() {
  const [rentals, setRentals] = useState(mockRentalProperties);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');


  const rentalSearchForm = useForm<RentalSearchFormValues>({
    resolver: zodResolver(rentalSearchSchema),
    defaultValues: { 
        propertyType: "ANY", 
        location: "", 
        priceRange: [0, 5000],
        bedrooms: "ANY",
        bathrooms: "ANY",
        amenities: [],
        moveInDate: undefined,
    },
  });

  function onRentalSearchSubmit(data: RentalSearchFormValues) {
    console.log("Rental Search Filters:", data);
    // Filter logic based on form data
    const filteredRentals = mockRentalProperties.filter(rental => {
        let matches = true;
        if (data.location && rental.location && !rental.location.toLowerCase().includes(data.location.toLowerCase())) {
            matches = false;
        }
        if (data.priceRange) {
            const [minPrice, maxPrice] = data.priceRange;
            if (rental.price && (rental.price < minPrice || (maxPrice < 5000 && rental.price > maxPrice))) {
                matches = false;
            }
        }
        if (data.propertyType !== "ANY" && rental.category?.toLowerCase() !== data.propertyType?.toLowerCase()) {
            matches = false;
        }
        
        const requiredBeds = data.bedrooms ? parseInt(data.bedrooms.replace('+', ''), 10) : 0;
        if (requiredBeds > 0 && (rental.bedrooms ?? 0) < requiredBeds) matches = false;

        const requiredBaths = data.bathrooms ? parseInt(data.bathrooms.replace('+', ''), 10) : 0;
        if (requiredBaths > 0 && (rental.bathrooms ?? 0) < requiredBaths) matches = false;
        
        return matches;
    });
    setRentals(filteredRentals);
    setSearchPerformed(true);
    toast({ title: "Search Submitted", description: `Found ${filteredRentals.length} rentals.` });
  }
  
  const locationValue = rentalSearchForm.watch('location');

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
          <Form {...rentalSearchForm}>
            <form onSubmit={rentalSearchForm.handleSubmit(onRentalSearchSubmit)}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                  <FormField
                    control={rentalSearchForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="e.g., City, Neighborhood, Zip" {...field} value={field.value || ''} className="h-11 pl-4 pr-16 rounded-full"/>
                            {field.value && (
                                <Button type="button" variant="ghost" size="icon" className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => field.onChange('')}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            )}
                            <Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-full">
                                <Search className="h-4 w-4"/>
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="h-11">Price</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                          <h4 className="font-medium">Price Range (/month)</h4>
                           <FormField
                              control={rentalSearchForm.control}
                              name="priceRange"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Slider
                                        defaultValue={[0, 5000]}
                                        min={0}
                                        max={10000}
                                        step={100}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    />
                                  </FormControl>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>${field.value?.[0]?.toLocaleString() ?? '0'}</span>
                                      <span>${field.value?.[1]?.toLocaleString() ?? '5000'}{field.value?.[1] === 10000 ? '+' : ''}</span>
                                  </div>
                                </FormItem>
                              )}
                            />
                      </div>
                    </PopoverContent>
                  </Popover>

                   <FormField
                    control={rentalSearchForm.control}
                    name="moveInDate"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-11 w-[150px] justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM dd, yyyy")
                                ) : (
                                  <span>Move-in by</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField control={rentalSearchForm.control} name="propertyType" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Property Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any Type</SelectItem><SelectItem value="APARTMENT">Apartment</SelectItem><SelectItem value="HOUSE">House</SelectItem><SelectItem value="TOWNHOUSE">Townhouse</SelectItem><SelectItem value="CONDO">Condo</SelectItem></SelectContent></Select></FormItem>)} />
                  <FormField control={rentalSearchForm.control} name="bedrooms" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Beds" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any Beds</SelectItem><SelectItem value="1+">1+</SelectItem><SelectItem value="2+">2+</SelectItem><SelectItem value="3+">3+</SelectItem><SelectItem value="4+">4+</SelectItem></SelectContent></Select></FormItem>)} />
                  <FormField control={rentalSearchForm.control} name="bathrooms" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Baths" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any Baths</SelectItem><SelectItem value="1+">1+</SelectItem><SelectItem value="2+">2+</SelectItem><SelectItem value="3+">3+</SelectItem></SelectContent></Select></FormItem>)} />

                   <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="h-11"><SlidersHorizontal className="mr-2 h-4 w-4"/>More</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0">
                       <div className="p-4 border-b">
                         <h4 className="font-medium">More Filters</h4>
                         <p className="text-sm text-muted-foreground">Refine your search with more options.</p>
                       </div>
                       <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Pet friendly</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="None selected" /></SelectTrigger>
                                    <SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="dogs">Dogs allowed</SelectItem><SelectItem value="cats">Cats allowed</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Square feet</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Any" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="any">Any</SelectItem>
                                      <SelectItem value="500+">500+ sqft</SelectItem>
                                      <SelectItem value="1000+">1000+ sqft</SelectItem>
                                      <SelectItem value="1500+">1500+ sqft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <Label>Accepts online applications</Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>3D Tours</Label>
                                <Switch />
                            </div>
                             <Separator />
                            <div>
                                <h5 className="font-semibold mb-2">Keyword search</h5>
                                <Input placeholder="Select a keyword below or type here"/>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Pool", "Water front", "Basement", "Gated", "Pond"].map(keyword => (
                                        <Button key={keyword} variant="outline" size="sm" type="button"><Plus className="h-4 w-4 mr-1"/>{keyword}</Button>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Note: To increase accuracy, the keyword filter suggests the most commonly searched terms. Results may vary.</p>
                            </div>
                       </div>
                       <div className="flex justify-between items-center p-4 border-t bg-muted/50">
                            <Button type="button" variant="ghost">Reset</Button>
                            <Button type="submit">View {rentals.length} results</Button>
                       </div>
                    </PopoverContent>
                  </Popover>

                  <Button type="button" variant="outline" className="h-11 rounded-full" onClick={() => toast({title: "Search Saved!", description: "Your current search filters have been saved."})}>Save Search</Button>
              </div>
            </form>
          </Form>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
             <div>
                <h3 className="text-2xl font-semibold text-foreground">
                    Apartments and homes for rent {locationValue ? `in ${locationValue}`: ''}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{rentals.length} Rentals</span>
                    <Select defaultValue="best_match">
                        <SelectTrigger className="h-auto p-0 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                            <span className="mr-1">Sort by:</span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="best_match">Best match</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
             <div className="bg-muted p-1 rounded-full flex items-center self-end">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-full"><List className="mr-2 h-4 w-4"/>List</Button>
                <Button variant={viewMode === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('map')} className="rounded-full"><MapIcon className="mr-2 h-4 w-4"/>Map</Button>
            </div>
          </div>


          {searchPerformed && rentals.length === 0 ? (
            <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-foreground">No matching rentals found.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
            </div>
           ) : viewMode === 'list' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.map(prop => (
                        <Card key={prop.id} className="overflow-hidden flex flex-col">
                            <Link href={`/rent-home/${prop.id}`} className="block relative w-full h-48">
                                <Image src={prop.image} alt={prop.name} fill className="object-cover" data-ai-hint={prop.dataAiHint}/>
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
            ) : (
                 <div className="mt-8">
                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <div className="lg:sticky lg:top-24 h-[600px] lg:h-[calc(100vh-8rem)]">
                            <PropertiesMapPlaceholder rentals={rentals} />
                        </div>
                        <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                            {rentals.map(prop => (
                                <Card key={prop.id} className="overflow-hidden flex flex-row shadow-md hover:shadow-lg transition-shadow">
                                    <Link href={`/rent-home/${prop.id}`} className="block w-1/3 flex-shrink-0 relative">
                                        <Image src={prop.image} alt={prop.name} fill className="object-cover" data-ai-hint={prop.dataAiHint}/>
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
                </div>
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
