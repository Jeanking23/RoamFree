
// src/app/buy-property/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bed, Bath, Maximize, Home as HomeIcon, DollarSign, MapPin, Search, Phone, Heart, Info, SlidersHorizontal, List, Map as MapIcon, Plus, Check, Filter, X, Building } from 'lucide-react';
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
import Image from 'next/image';
import Link from 'next/link';
import { mockSaleProperties } from '@/lib/mock-data'; // Import mock data
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PropertiesMap from '@/components/map/properties-map';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';


const propertySearchSchema = z.object({
  location: z.string().optional(),
  priceRange: z.array(z.number()).optional(),
  propertyType: z.array(z.string()).optional(),
  bedrooms: z.enum(["ANY", "1+", "2+", "3+", "4+", "5+"]).default("ANY").optional(),
  bathrooms: z.enum(["ANY", "1+", "2+", "3+", "4+", "5+"]).default("ANY").optional(),
  sqft: z.array(z.number()).optional(),
});

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;

const propertyTypes = [
  { id: 'HOUSE', label: 'House', icon: HomeIcon },
  { id: 'LAND', label: 'Land', icon: Maximize },
  { id: 'APARTMENT', label: 'Apartment', icon: Building },
];

const priceOptions = [0, 100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000];


export default function BuyPropertyPage() {
  const [properties, setProperties] = useState(mockSaleProperties);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const propertySearchForm = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: { 
        propertyType: [], 
        location: "", 
        priceRange: [0, 2000000],
        bedrooms: "ANY",
        bathrooms: "ANY",
        sqft: [0, 5000],
    },
  });
  
  function onPropertySearchSubmit(data: PropertySearchFormValues) {
    console.log("Property Search Filters:", data);
    const filteredProperties = mockSaleProperties.filter(prop => {
        let matches = true;
        if (data.location && prop.location && !prop.location.toLowerCase().includes(data.location.toLowerCase())) matches = false;
        if (data.priceRange) {
            const [minPrice, maxPrice] = data.priceRange;
            if (prop.price && (prop.price < minPrice || (maxPrice < 2000000 && prop.price > maxPrice))) matches = false;
        }
        if (data.propertyType && data.propertyType.length > 0 && !data.propertyType.includes(prop.propertyType?.toUpperCase() as string)) matches = false;
        
        const requiredBeds = data.bedrooms ? parseInt(data.bedrooms.replace('+', ''), 10) : 0;
        if (requiredBeds > 0 && (prop.bedrooms ?? 0) < requiredBeds) matches = false;

        const requiredBaths = data.bathrooms ? parseInt(data.bathrooms.replace('+', ''), 10) : 0;
        if (requiredBaths > 0 && (prop.bathrooms ?? 0) < requiredBaths) matches = false;

        if (data.sqft) {
            const [minSqft, maxSqft] = data.sqft;
            const propSqft = parseInt(prop.sizeSqft?.toString().replace(/,/g, '') || '0', 10);
            if (maxSqft < 10000 && (propSqft < minSqft || propSqft > maxSqft)) matches = false;
        }

        return matches;
    });
    setProperties(filteredProperties);
    setSearchPerformed(true);
    toast({ title: "Search Submitted (Demo)", description: `Found ${filteredProperties.length} properties.` });
  }

  const handleContactAgent = (propertyName: string) => {
    toast({ title: "Contacting Agent (Demo)", description: `Connecting you with an agent for ${propertyName}.` });
  };
  
  const locationValue = propertySearchForm.watch('location');
  const bathroomsValue = propertySearchForm.watch('bathrooms');
  const bedroomsValue = propertySearchForm.watch('bedrooms');
  const propertyTypeValues = propertySearchForm.watch('propertyType') || [];
  const priceRangeValue = propertySearchForm.watch('priceRange') || [0, 2000000];
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <HomeIcon className="h-8 w-8" />
            Buy Land or House
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find properties for sale, including land and houses.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...propertySearchForm}>
            <form onSubmit={propertySearchForm.handleSubmit(onPropertySearchSubmit)}>
              {/* Desktop & Tablet Search Form */}
              <div className="hidden md:flex flex-wrap items-center gap-2 mb-4">
                  <FormField control={propertySearchForm.control} name="location" render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="City, State, Zip..." {...field} value={field.value || ''} className="h-11 pl-4 pr-16 rounded-full"/>
                            {field.value && ( <Button type="button" variant="ghost" size="icon" className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => field.onChange('')}> <X className="h-4 w-4"/> </Button> )}
                            <Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-full"> <Search className="h-4 w-4"/> </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                  )}/>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="h-11">Price</Button>
                    </PopoverTrigger>
                     <PopoverContent className="w-96 p-0">
                       <div className="p-4 border-b">
                         <h4 className="font-medium">Price</h4>
                         <p className="text-sm text-muted-foreground">Select your budget.</p>
                       </div>
                       <div className="p-4 space-y-4">
                            <FormField control={propertySearchForm.control} name="priceRange" render={({ field }) => (<FormItem><FormControl><Slider defaultValue={[0, 2000000]} min={0} max={5000000} step={50000} onValueChange={field.onChange} value={field.value} /></FormControl></FormItem>)} />
                            <div className="flex items-center gap-2">
                                <Select onValueChange={(val) => propertySearchForm.setValue('priceRange', [Number(val), priceRangeValue[1]])} value={priceRangeValue[0].toString()}>
                                    <SelectTrigger><SelectValue placeholder="No min"/></SelectTrigger>
                                    <SelectContent> <SelectItem value="0">No min</SelectItem> {priceOptions.map(p => <SelectItem key={`min-${p}`} value={p.toString()}>${p.toLocaleString()}</SelectItem>)} </SelectContent>
                                </Select>
                                <span>-</span>
                                <Select onValueChange={(val) => propertySearchForm.setValue('priceRange', [priceRangeValue[0], Number(val)])} value={priceRangeValue[1].toString()}>
                                    <SelectTrigger><SelectValue placeholder="No max"/></SelectTrigger>
                                    <SelectContent> <SelectItem value="5000000">No max</SelectItem> {priceOptions.map(p => p > 0 && <SelectItem key={`max-${p}`} value={p.toString()}>${p.toLocaleString()}</SelectItem>)} </SelectContent>
                                </Select>
                            </div>
                       </div>
                       <div className="flex justify-between items-center p-4 border-t bg-muted/50">
                            <Button type="button" variant="ghost" onClick={() => propertySearchForm.setValue('priceRange', [0, 5000000])}>Reset</Button>
                            <Button type="submit">View {properties.length} results</Button>
                       </div>
                    </PopoverContent>
                  </Popover>
                  <FormField control={propertySearchForm.control} name="propertyType" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="h-11">
                                    {propertyTypeValues.length === 0 ? 'Property type' : propertyTypeValues.length === 1 ? propertyTypes.find(p => p.id === propertyTypeValues[0])?.label : `${propertyTypeValues.length} types`}
                                </Button>
                            </PopoverTrigger>
                             <PopoverContent className="w-80 p-0">
                                <div className="p-4 border-b"><h4 className="font-medium">Property type</h4></div>
                                <div className="p-2 space-y-1">
                                    <Button type="button" variant="ghost" onClick={() => field.onChange([])} className={cn("w-full justify-between h-12 text-base", propertyTypeValues.length === 0 && "bg-accent text-accent-foreground")}>
                                        <div className="flex items-center gap-2"><HomeIcon className="h-5 w-5"/> Any</div>
                                        {propertyTypeValues.length === 0 && <Check className="h-5 w-5"/>}
                                    </Button>
                                    {propertyTypes.map(item => (
                                        <FormField key={item.id} control={propertySearchForm.control} name="propertyType" render={({ field: typeField }) => (
                                            <Button type="button" variant="ghost" className="w-full justify-between h-12 text-base font-normal"
                                                onClick={() => {
                                                    const currentValues = typeField.value || [];
                                                    const newValues = currentValues.includes(item.id) ? currentValues.filter(v => v !== item.id) : [...currentValues, item.id];
                                                    typeField.onChange(newValues);
                                                }}>
                                                <div className="flex items-center gap-2"><item.icon className="h-5 w-5"/> {item.label}</div>
                                                <Checkbox checked={typeField.value?.includes(item.id)} className="h-5 w-5"/>
                                            </Button>
                                        )}/>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center p-4 border-t bg-muted/50">
                                    <Button type="button" variant="link" className="px-0" onClick={() => field.onChange([])}>Reset</Button>
                                    <Button type="submit">View {properties.length} results</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                  )} />
                  <FormField control={propertySearchForm.control} name="bedrooms" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="h-11">{bedroomsValue === 'ANY' ? 'Beds' : `${bedroomsValue} Beds`}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80"><div className="space-y-4"><h4 className="font-medium">Bedrooms</h4><div className="flex rounded-md border p-1 bg-muted">{(["ANY", "1+", "2+", "3+", "4+", "5+"] as const).map(val => (<Button key={val} type="button" variant={field.value === val ? "secondary" : "ghost"} onClick={() => field.onChange(val)} className="flex-1 h-8 text-sm">{val === "ANY" ? "Any" : val}</Button>))}</div></div></PopoverContent>
                        </Popover>
                    </FormItem>
                  )} />
                  <FormField control={propertySearchForm.control} name="bathrooms" render={({ field }) => (
                    <FormItem>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="h-11">{bathroomsValue === 'ANY' ? 'Baths' : `${bathroomsValue} Baths`}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80"><div className="space-y-4"><h4 className="font-medium">Bathrooms</h4><div className="flex rounded-md border p-1 bg-muted">{(["ANY", "1+", "2+", "3+", "4+", "5+"] as const).map(val => (<Button key={val} type="button" variant={field.value === val ? "secondary" : "ghost"} onClick={() => field.onChange(val)} className="flex-1 h-8 text-sm">{val === "ANY" ? "Any" : val}</Button>))}</div></div></PopoverContent>
                        </Popover>
                    </FormItem>
                  )} />
                   <Popover>
                    <PopoverTrigger asChild><Button type="button" variant="outline" className="h-11"><SlidersHorizontal className="mr-2 h-4 w-4"/>More</Button></PopoverTrigger>
                    <PopoverContent className="w-96 p-0">
                       <div className="p-4 border-b"><h4 className="font-medium">More Filters</h4><p className="text-sm text-muted-foreground">Refine your search.</p></div>
                       <div className="p-4 space-y-4">
                            <FormField control={propertySearchForm.control} name="sqft" render={({ field }) => (<FormItem><FormLabel>Square Feet</FormLabel><FormControl><Slider defaultValue={[0, 5000]} min={0} max={10000} step={100} onValueChange={field.onChange} value={field.value} /></FormControl><div className="flex justify-between text-xs text-muted-foreground"><span>{field.value?.[0] ?? 0} sqft</span><span>{field.value?.[1] ?? 5000}{field.value?.[1] === 10000 ? '+' : ''} sqft</span></div></FormItem>)} />
                       </div>
                       <div className="flex justify-between items-center p-4 border-t bg-muted/50"><Button type="button" variant="ghost">Reset</Button><Button type="submit">View {properties.length} results</Button></div>
                    </PopoverContent>
                  </Popover>
                  <Button type="button" variant="outline" className="h-11 rounded-full" onClick={() => toast({title: "Search Saved!", description: "Your current search filters have been saved."})}>Save Search</Button>
              </div>
              {/* Mobile Search Form */}
               <div className="md:hidden flex items-center gap-2 mb-4">
                  <FormField control={propertySearchForm.control} name="location" render={({ field }) => (
                      <FormItem className="flex-grow"><FormControl><div className="relative"><Input placeholder="Newark, DE" {...field} value={field.value || ''} className="h-11 pl-4 pr-16 rounded-full"/>{field.value && (<Button type="button" variant="ghost" size="icon" className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => field.onChange('')}><X className="h-4 w-4"/></Button>)}<Button type="submit" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-foreground hover:bg-foreground/80 rounded-full"><Search className="h-4 w-4 text-background"/></Button></div></FormControl></FormItem>
                  )}/>
                  <Sheet>
                      <SheetTrigger asChild><Button type="button" variant="outline" className="h-11 flex-shrink-0"><Filter className="h-4 w-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">Filter</span></Button></SheetTrigger>
                      <SheetContent><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="py-4 space-y-6 overflow-y-auto h-[calc(100%-120px)] pr-4">{/* Filters go here */}</div><SheetFooter><SheetClose asChild><Button type="submit" className="w-full">View {properties.length} results</Button></SheetClose></SheetFooter></SheetContent>
                  </Sheet>
               </div>
            </form>
          </Form>

           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="text-center sm:text-left">
                <h3 className="text-2xl font-semibold text-foreground">
                    {searchPerformed ? `${properties.length} Homes For Sale` : `Homes For Sale ${locationValue ? `in ${locationValue}`: ''}`}
                </h3>
                <p className="text-sm text-muted-foreground">Based on your search criteria</p>
             </div>
             <div className="bg-muted p-1 rounded-full flex items-center self-center sm:self-end">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-full"><List className="mr-2 h-4 w-4"/>List</Button>
                <Button variant={viewMode === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('map')} className="rounded-full"><MapIcon className="mr-2 h-4 w-4"/>Map</Button>
            </div>
          </div>
          
          {searchPerformed && properties.length === 0 ? (
            <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-foreground">No matching properties found.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
            </div>
           ) : viewMode === 'list' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {properties.map(prop => (
                <Card key={prop.id} className="overflow-hidden flex flex-col group rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                      <Link href={`/buy-property/${prop.id}`}>
                          <Image src={prop.image} alt={prop.name} width={600} height={400} className="w-full h-56 object-cover" data-ai-hint={prop.dataAiHint}/>
                      </Link>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full">
                          <Heart className="h-5 w-5"/>
                          <span className="sr-only">Add to wishlist</span>
                      </Button>
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <p className="text-2xl font-bold text-foreground mb-1">${(prop.price ?? 0).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                        {prop.bedrooms && <span><Bed className="inline h-4 w-4 mr-1"/> {prop.bedrooms} bds</span>}
                        {prop.bathrooms && <span><Bath className="inline h-4 w-4 mr-1"/> {prop.bathrooms} ba</span>}
                        {prop.sizeSqft && <span><Maximize className="inline h-4 w-4 mr-1"/> {prop.sizeSqft} sqft</span>}
                        {prop.sizeAcres && <span><Maximize className="inline h-4 w-4 mr-1"/> {prop.sizeAcres} acre lot</span>}
                    </div>
                    <p className="text-sm text-foreground truncate">{prop.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{prop.location}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 mt-auto">
                     <Button variant="outline" size="sm" className="w-full" onClick={() => handleContactAgent(prop.name)}>
                      <Phone className="mr-2 h-4 w-4" /> Contact Agent
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="mt-8">
                {properties.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <div className="lg:sticky lg:top-24 h-[600px] lg:h-[calc(100vh-8rem)]">
                            <PropertiesMap properties={properties} basePath="buy-property" />
                        </div>
                        <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                            {properties.map(prop => (
                                <Card key={prop.id} className="overflow-hidden flex flex-row shadow-md hover:shadow-lg transition-shadow">
                                    <Link href={`/buy-property/${prop.id}`} className="block w-1/3 flex-shrink-0 relative">
                                        <Image src={prop.image} alt={prop.name} fill className="object-cover" data-ai-hint={prop.dataAiHint}/>
                                    </Link>
                                    <div className="flex flex-col flex-grow">
                                        <CardHeader className="p-3">
                                            <CardTitle className="text-md hover:text-primary"><Link href={`/buy-property/${prop.id}`}>{prop.name}</Link></CardTitle>
                                            <CardDescription className="text-primary font-semibold text-base">${(prop.price ?? 0).toLocaleString()}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0 space-y-2 text-sm flex-grow">
                                            <p className="text-muted-foreground flex items-center gap-1 truncate"><MapPin className="h-4 w-4 flex-shrink-0"/>{prop.location}</p>
                                            <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3">
                                                <span><Bed className="inline h-3 w-3 mr-1"/>{prop.bedrooms} bds</span>
                                                <span><Bath className="inline h-3 w-3 mr-1"/>{prop.bathrooms} ba</span>
                                                <span><Maximize className="inline h-3 w-3 mr-1"/>{prop.sizeSqft} sqft</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-2 border-t bg-muted/30">
                                            <Button asChild variant="default" size="sm" className="w-full">
                                                <Link href={`/buy-property/${prop.id}`}>View Details</Link>
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                        <p className="text-xl font-semibold text-foreground">No matching properties found for map view.</p>
                        <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
