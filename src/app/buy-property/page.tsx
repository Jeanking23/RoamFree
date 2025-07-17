// src/app/buy-property/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bed, Bath, Maximize, Home, DollarSign, MapPin, Search, Phone, Heart, Info, SlidersHorizontal, List, Map } from 'lucide-react';
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

const propertySearchSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z.enum(["ANY", "HOUSE", "LAND", "APARTMENT"]).default("ANY").optional(),
});

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;

// Mortgage Calculator Schema
const mortgageCalculatorSchema = z.object({
  totalAmount: z.coerce.number().positive("Total amount must be positive."),
  downPayment: z.coerce.number().nonnegative("Down payment cannot be negative."),
  interestRate: z.coerce.number().positive("Interest rate must be positive.").max(20, "Rate seems high."),
  loanTerm: z.coerce.number().int().positive("Loan term must be a positive integer."),
});

type MortgageCalculatorFormValues = z.infer<typeof mortgageCalculatorSchema>;


export default function BuyPropertyPage() {
  const [properties, setProperties] = useState(mockSaleProperties);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');


  const propertySearchForm = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: { propertyType: "ANY", location: "", minPrice: undefined, maxPrice: undefined },
  });
  
  const mortgageForm = useForm<MortgageCalculatorFormValues>({
    resolver: zodResolver(mortgageCalculatorSchema),
    defaultValues: { totalAmount: 350000, downPayment: 70000, interestRate: 6.5, loanTerm: 30 },
  });

  function onPropertySearchSubmit(data: PropertySearchFormValues) {
    console.log("Property Search Filters:", data);
    const filteredProperties = mockSaleProperties.filter(prop => {
        let matches = true;
        if (data.location && prop.location && !prop.location.toLowerCase().includes(data.location.toLowerCase())) matches = false;
        if (data.minPrice && prop.price && prop.price < data.minPrice) matches = false;
        if (data.maxPrice && prop.price && prop.price > data.maxPrice) matches = false;
        if (data.propertyType !== "ANY" && prop.propertyType?.toLowerCase() !== data.propertyType?.toLowerCase()) matches = false;
        return matches;
    });
    setProperties(filteredProperties);
    toast({ title: "Search Submitted (Demo)", description: `Found ${filteredProperties.length} properties.` });
  }

  const handleContactAgent = (propertyName: string) => {
    toast({ title: "Contacting Agent (Demo)", description: `Connecting you with an agent for ${propertyName}.` });
  };
  
  function onMortgageCalculate(data: MortgageCalculatorFormValues) {
    const loanAmount = data.totalAmount - data.downPayment;
    if (loanAmount <= 0) {
        setMonthlyPayment(0);
        return;
    }
    const monthlyInterestRate = data.interestRate / 100 / 12;
    const numberOfPayments = data.loanTerm * 12;
    
    const payment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    setMonthlyPayment(payment);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Home className="h-8 w-8" />
            Buy Land or House
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find properties for sale, including land and houses.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Card className="mb-6 bg-muted/50">
            <CardContent className="pt-6">
              <Form {...propertySearchForm}>
                <form onSubmit={propertySearchForm.handleSubmit(onPropertySearchSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        <FormField control={propertySearchForm.control} name="location" render={({ field }) => (<FormItem className="md:col-span-2"><FormControl><Input placeholder="City, State, Zip..." {...field} value={field.value || ""} className="h-11"/></FormControl></FormItem>)} />
                        <FormField control={propertySearchForm.control} name="propertyType" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any Type</SelectItem><SelectItem value="HOUSE">House</SelectItem><SelectItem value="LAND">Land</SelectItem><SelectItem value="APARTMENT">Apartment</SelectItem></SelectContent></Select></FormItem>)} />
                        <FormField control={propertySearchForm.control} name="maxPrice" render={({ field }) => (<FormItem><Select><FormControl><SelectTrigger className="h-11"><SelectValue placeholder="Price" /></SelectTrigger></FormControl><SelectContent><SelectItem value="200000">$200,000</SelectItem><SelectItem value="400000">$400,000</SelectItem><SelectItem value="600000">$600,000</SelectItem><SelectItem value="800000">$800,000</SelectItem></SelectContent></Select></FormItem>)} />
                        <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
              </Form>
            </CardContent>
          </Card>

           <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                <h3 className="text-2xl font-semibold text-foreground">
                    {properties.length > 0 ? `${properties.length} Homes For Sale` : 'No Properties Found'}
                </h3>
                <p className="text-sm text-muted-foreground">Based on your search criteria</p>
             </div>
             <div className="flex items-center gap-4">
                <Select defaultValue="relevant">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevant">Sort by: Relevant</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
                <div className="bg-muted p-1 rounded-md flex items-center">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}><List className="mr-2 h-4 w-4"/>List</Button>
                    <Button variant={viewMode === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('map')}><Map className="mr-2 h-4 w-4"/>Map</Button>
                </div>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

           {properties.length === 0 && (
            <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-foreground">No properties match your criteria.</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
            </div>
           )}
        </CardContent>
      </Card>
      
      <Separator />
      
      {/* Mortgage Calculator Section */}
       <Card id="mortgage-calculator" className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
            Mortgage Calculator
          </CardTitle>
          <CardDescription>
            Estimate your monthly mortgage payment. This is for informational purposes only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Form {...mortgageForm}>
              <form onSubmit={mortgageForm.handleSubmit(onMortgageCalculate)} className="space-y-6">
                <FormField control={mortgageForm.control} name="totalAmount" render={({ field }) => ( <FormItem> <FormLabel>Total Amount ($)</FormLabel> <FormControl><Input type="number" placeholder="350000" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={mortgageForm.control} name="downPayment" render={({ field }) => ( <FormItem> <FormLabel>Down Payment ($)</FormLabel> <FormControl><Input type="number" placeholder="70000" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={mortgageForm.control} name="interestRate" render={({ field }) => ( <FormItem> <FormLabel>Interest Rate (%)</FormLabel> <FormControl><Input type="number" step="0.01" placeholder="6.5" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={mortgageForm.control} name="loanTerm" render={({ field }) => ( <FormItem> <FormLabel>Loan Term (Years)</FormLabel> <FormControl><Input type="number" placeholder="30" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <Button type="submit">Calculate Payment</Button>
              </form>
            </Form>
            <div className="bg-muted/50 rounded-lg p-6 text-center h-full flex flex-col justify-center">
              {monthlyPayment !== null ? (
                <>
                  <p className="text-lg text-muted-foreground">Estimated Monthly Payment:</p>
                  <p className="text-4xl font-bold text-primary">${monthlyPayment.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2"> (Principal & Interest only)</p>
                </>
              ) : (
                <p className="text-muted-foreground">Enter your details to see an estimate.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
