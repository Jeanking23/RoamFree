
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, Home, DollarSign, MapPin, Maximize, Layers, CalendarDays, Phone, Calculator, Search, Smile, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

const mortgageSchema = z.object({
  loanAmount: z.coerce.number().positive("Loan amount must be positive."),
  interestRate: z.coerce.number().min(0.1, "Interest rate must be at least 0.1%.").max(25, "Interest rate seems too high."),
  loanTerm: z.coerce.number().int().min(1, "Loan term must be at least 1 year.").max(40, "Loan term seems too long."),
});

type MortgageFormValues = z.infer<typeof mortgageSchema>;

const propertySearchSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z.enum(["ANY", "HOUSE", "LAND", "APARTMENT"]).default("ANY").optional(),
  minSize: z.coerce.number().optional(), // sqft or acres
  zoning: z.string().optional(),
  amenities: z.string().optional(), // Added amenities filter
});

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;


export default function BuyPropertyPage() {
  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [properties, setProperties] = useState([
    { id: 1, name: "Spacious Family Home", price: 350000, location: "Green Valley", type: "House", size: "2200 sqft", zoning: "Residential", image: "https://placehold.co/600x400.png?text=Family+Home", dataAiHint: "family house" },
    { id: 2, name: "Prime Commercial Land", price: 1200000, location: "Downtown Core", type: "Land", size: "2 acres", zoning: "Commercial", image: "https://placehold.co/600x400.png?text=Commercial+Land", dataAiHint: "empty lot" },
    { id: 3, name: "Modern Downtown Apartment", price: 450000, location: "City Center", type: "Apartment", size: "1200 sqft", zoning: "Residential", image: "https://placehold.co/600x400.png?text=Modern+Apartment", dataAiHint: "apartment building" },
  ]);

  const mortgageForm = useForm<MortgageFormValues>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: { loanAmount: 250000, interestRate: 5.5, loanTerm: 30 },
  });

  const propertySearchForm = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: { propertyType: "ANY" },
  });

  function onMortgageSubmit(data: MortgageFormValues) {
    const principal = data.loanAmount;
    const interestRateMonthly = data.interestRate / 100 / 12;
    const numberOfPayments = data.loanTerm * 12;

    if (interestRateMonthly === 0) { // Edge case for 0% interest
        setMonthlyPayment((principal / numberOfPayments).toFixed(2));
        return;
    }

    const payment =
      principal *
      (interestRateMonthly * Math.pow(1 + interestRateMonthly, numberOfPayments)) /
      (Math.pow(1 + interestRateMonthly, numberOfPayments) - 1);
    setMonthlyPayment(payment.toFixed(2));
  }

  function onPropertySearchSubmit(data: PropertySearchFormValues) {
    console.log("Property Search Filters:", data);
    toast({ title: "Search Submitted", description: "Filtering properties (simulation)." });
    // In a real app, you would filter the properties array or fetch from an API
  }

  const handleScheduleTour = (propertyName: string) => {
    toast({ title: "Tour Scheduled (Demo)", description: `A tour for ${propertyName} has been requested.` });
  };
  const handleVirtualWalkthrough = (propertyName: string) => {
    toast({ title: "Virtual Walkthrough (Demo)", description: `Starting virtual walkthrough for ${propertyName}. This is a placeholder.`});
  };
   const handleContactAgent = (propertyName: string) => {
    toast({ title: "Contacting Agent (Demo)", description: `Connecting you with an agent for ${propertyName}. Chat, Call or Schedule Appointment options would appear here.` });
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Home className="h-8 w-8" />
            Buy Land or House
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find properties for sale, including land and houses. Invest in your future.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-6 w-6" /> Search Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...propertySearchForm}>
                <form onSubmit={propertySearchForm.handleSubmit(onPropertySearchSubmit)} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <FormField
                    control={propertySearchForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location</FormLabel>
                        <FormControl><Input placeholder="e.g., City, State, Zip" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={propertySearchForm.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><ClipboardList className="h-4 w-4 text-primary" />Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="ANY">Any Type</SelectItem>
                            <SelectItem value="HOUSE">House</SelectItem>
                            <SelectItem value="LAND">Land</SelectItem>
                            <SelectItem value="APARTMENT">Apartment</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={propertySearchForm.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Min Price</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 100000" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={propertySearchForm.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Max Price</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={propertySearchForm.control}
                    name="minSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Maximize className="h-4 w-4 text-primary" />Min Size (sqft/acres)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500 or 0.5" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={propertySearchForm.control}
                    name="zoning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Layers className="h-4 w-4 text-primary" />Zoning (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Residential, Commercial" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={propertySearchForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Smile className="h-4 w-4 text-primary" />Amenities (Keywords)</FormLabel>
                        <FormControl><Input placeholder="e.g., Pool, Garage" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="md:col-span-2 lg:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground self-end">
                    <Search className="mr-2 h-4 w-4" /> Search Properties
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Property Listings Placeholder */}
          <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Available Properties</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => (
              <Card key={prop.id} className="overflow-hidden">
                <Image src={prop.image} alt={prop.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={prop.dataAiHint}/>
                <CardHeader>
                  <CardTitle>{prop.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold text-lg">${prop.price.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 mr-1"/>{prop.location}</p>
                  <p className="text-sm text-muted-foreground"><ClipboardList className="inline h-4 w-4 mr-1"/>Type: {prop.type}</p>
                  <p className="text-sm text-muted-foreground"><Maximize className="inline h-4 w-4 mr-1"/>Size: {prop.size}</p>
                  <p className="text-sm text-muted-foreground"><Layers className="inline h-4 w-4 mr-1"/>Zoning: {prop.zoning}</p>
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
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">More listings coming soon!</p>
            <p className="text-muted-foreground mt-2">Discover your dream property shortly.</p>
          </div>

          {/* Mortgage Calculator Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6" /> Mortgage Calculator (Estimate)</CardTitle>
              <CardDescription>Estimate your monthly mortgage payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...mortgageForm}>
                <form onSubmit={mortgageForm.handleSubmit(onMortgageSubmit)} className="grid md:grid-cols-3 gap-4 items-end">
                  <FormField
                    control={mortgageForm.control}
                    name="loanAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="250000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mortgageForm.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="5.5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mortgageForm.control}
                    name="loanTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term (Years)</FormLabel>
                        <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="md:col-start-2 bg-primary hover:bg-primary/90 text-primary-foreground">Calculate</Button>
                </form>
              </Form>
              {monthlyPayment && (
                <div className="mt-6 p-4 bg-accent/10 rounded-md">
                  <p className="text-lg font-semibold text-accent-foreground">
                    Estimated Monthly Payment: <span className="text-2xl">${monthlyPayment}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">This is an estimate and does not include taxes, insurance, or PMI.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 p-4 border rounded-md bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">Coming Soon:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><FileText className="inline h-4 w-4 mr-1 text-primary"/>Secure Document Upload & E-signature for contracts.</li>
              <li><Star className="inline h-4 w-4 mr-1 text-primary"/>Verified Agent Rating & Review System.</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
