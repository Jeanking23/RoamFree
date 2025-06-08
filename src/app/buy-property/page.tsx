
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, Home, DollarSign, MapPin, Maximize, Layers, CalendarDays, Phone, Calculator, Search, Smile, FileText, Star, TvIcon, Plane, Contact, ShieldCheck, Handshake, TrendingUp, Library, MessageSquare, Video } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator'; // Added import

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
  minSize: z.coerce.number().optional(), 
  zoning: z.string().optional(),
  amenities: z.string().optional(), 
  investmentReady: z.boolean().default(false).optional(), // New
});

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;


export default function BuyPropertyPage() {
  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [properties, setProperties] = useState([
    { id: 1, name: "Spacious Family Home", price: 350000, location: "Green Valley", type: "House", size: "2200 sqft", zoning: "Residential", image: "https://placehold.co/600x400.png?text=Family+Home", dataAiHint: "family house", status: "Verified", lastSalePrice: 280000, marketTrend: "+5% YoY" },
    { id: 2, name: "Prime Commercial Land", price: 1200000, location: "Downtown Core", type: "Land", size: "2 acres", zoning: "Commercial", image: "https://placehold.co/600x400.png?text=Commercial+Land", dataAiHint: "empty lot", status: "Title Deed Uploaded", lastSalePrice: 950000, marketTrend: "+8% YoY" },
    { id: 3, name: "Modern Downtown Apartment", price: 450000, location: "City Center", type: "Apartment", size: "1200 sqft", zoning: "Residential", image: "https://placehold.co/600x400.png?text=Modern+Apartment", dataAiHint: "apartment building", status: "Leasehold", lastSalePrice: 400000, marketTrend: "+3% YoY" },
  ]);

  const mortgageForm = useForm<MortgageFormValues>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: { loanAmount: 250000, interestRate: 5.5, loanTerm: 30 },
  });

  const propertySearchForm = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: { propertyType: "ANY", location: "", amenities: "", zoning: "", investmentReady: false },
  });

  function onMortgageSubmit(data: MortgageFormValues) {
    const principal = data.loanAmount;
    const interestRateMonthly = data.interestRate / 100 / 12;
    const numberOfPayments = data.loanTerm * 12;

    if (interestRateMonthly === 0) { 
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
    toast({ title: "Search Submitted (Demo)", description: "Filtering properties based on your criteria." });
  }

  const handleScheduleTour = (propertyName: string) => {
    toast({ title: "Tour Scheduled (Demo)", description: `A tour for ${propertyName} has been requested. You will receive GPS route navigation.` });
  };
  const handleVirtualWalkthrough = (propertyName: string) => {
    toast({ title: "Virtual Walkthrough (Demo)", description: `Starting virtual walkthrough for ${propertyName}.`});
  };
   const handleContactAgent = (propertyName: string) => {
    toast({ title: "Contacting Agent (Demo)", description: `Connecting you with an agent for ${propertyName}.` });
  };
  const handleMediaTool = (toolName: string, propertyName: string) => {
    toast({ title: `${toolName} (Demo)`, description: `Showing ${toolName.toLowerCase()} for ${propertyName}.` });
  };
  const handleViewPlotMap = (propertyName: string) => {
    toast({ title: "View Plot Map (Demo)", description: `Displaying interactive plot map for ${propertyName} with boundaries, landmarks, and utilities access.`})
  };
  const handleVirtualConsultation = (propertyName: string) => {
    toast({ title: "Virtual Consultation (Demo)", description: `Starting video call with agent for ${propertyName}.`})
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
            Find properties for sale, including land and houses. Secure transactions with Blockchain-backed verification (Future Feature).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-6 w-6" /> Search Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...propertySearchForm}>
                <form onSubmit={propertySearchForm.handleSubmit(onPropertySearchSubmit)} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                  <FormField control={propertySearchForm.control} name="location" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location</FormLabel><FormControl><Input placeholder="e.g., City, State, Zip" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ClipboardList className="h-4 w-4 text-primary" />Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any Type</SelectItem><SelectItem value="HOUSE">House</SelectItem><SelectItem value="LAND">Land</SelectItem><SelectItem value="APARTMENT">Apartment</SelectItem></SelectContent></Select></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="minPrice" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Min Price</FormLabel><FormControl><Input type="number" placeholder="e.g., 100000" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="maxPrice" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Max Price</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="minSize" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Maximize className="h-4 w-4 text-primary" />Min Size (sqft/acres)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1500 or 0.5" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="zoning" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Layers className="h-4 w-4 text-primary" />Zoning (Optional)</FormLabel><FormControl><Input placeholder="e.g., Residential, Commercial" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField control={propertySearchForm.control} name="amenities" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Smile className="h-4 w-4 text-primary" />Amenities (Keywords)</FormLabel><FormControl><Input placeholder="e.g., Pool, Garage" {...field} value={field.value || ""} /></FormControl></FormItem>)} />
                  <FormField
                    control={propertySearchForm.control} name="investmentReady"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm h-10 self-center xl:col-span-1">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="font-normal text-sm flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary"/>Investment Ready</FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="md:col-span-full xl:col-span-4 bg-accent hover:bg-accent/90 text-accent-foreground self-end mt-4">
                    <Search className="mr-2 h-4 w-4" /> Search Properties
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold text-foreground mb-4 mt-8">Available Properties</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => (
              <Card key={prop.id} className="overflow-hidden flex flex-col">
                <Image src={prop.image} alt={prop.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={prop.dataAiHint}/>
                <CardHeader>
                  <CardTitle>{prop.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold text-lg">${prop.price.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <p className="text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 mr-1"/>{prop.location}</p>
                  <p className="text-sm text-muted-foreground"><ClipboardList className="inline h-4 w-4 mr-1"/>Type: {prop.type}</p>
                  <p className="text-sm text-muted-foreground"><Maximize className="inline h-4 w-4 mr-1"/>Size: {prop.size}</p>
                  <p className="text-sm text-muted-foreground"><Layers className="inline h-4 w-4 mr-1"/>Zoning: {prop.zoning}</p>
                  <p className="text-sm text-muted-foreground"><ShieldCheck className="inline h-4 w-4 mr-1 text-green-600"/>Status: {prop.status} (Doc Upload Demo)</p>
                   <Separator className="my-2"/>
                  <h4 className="text-xs font-semibold text-muted-foreground">Market Info (Demo):</h4>
                  <p className="text-xs text-muted-foreground">Last Sale: ${prop.lastSalePrice?.toLocaleString() || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Trend: {prop.marketTrend || 'N/A'}</p>
                  <div className="flex flex-wrap gap-1 pt-2">
                      <Button variant="outline" size="xs" onClick={() => handleMediaTool("Drone View", prop.name)}><Plane className="mr-1 h-3 w-3"/>Drone View</Button>
                      <Button variant="outline" size="xs" onClick={() => handleMediaTool("Floor Plan", prop.name)}><Contact className="mr-1 h-3 w-3"/>Floor Plan</Button>
                      {prop.type === "Land" && <Button variant="outline" size="xs" onClick={() => handleViewPlotMap(prop.name)}><MapPin className="mr-1 h-3 w-3"/>Plot Map</Button>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <Button variant="outline" size="sm" onClick={() => handleScheduleTour(prop.name)}>
                            <CalendarDays className="mr-2 h-4 w-4" /> Schedule Physical Tour
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleVirtualWalkthrough(prop.name)}>
                            <TvIcon className="mr-2 h-4 w-4"/>Virtual Walkthrough
                        </Button>
                    </div>
                     <Button variant="secondary" size="sm" className="w-full" onClick={() => handleVirtualConsultation(prop.name)}>
                        <Video className="mr-2 h-4 w-4" /> Virtual Agent Consultation
                    </Button>
                   <Button variant="default" size="sm" className="w-full" onClick={() => handleContactAgent(prop.name)}>
                    <Phone className="mr-2 h-4 w-4" /> Contact Agent
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-1">Secure Escrow Payment Available (Demo)</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-foreground">More listings coming soon!</p>
            <p className="text-muted-foreground mt-2">Discover your dream property shortly. Get listing alerts (Demo).</p>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="h-6 w-6" /> Mortgage Calculator (Estimate)</CardTitle>
              <CardDescription>Estimate your monthly mortgage payments. Link to land loan calculator available.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...mortgageForm}>
                <form onSubmit={mortgageForm.handleSubmit(onMortgageSubmit)} className="grid md:grid-cols-3 gap-4 items-end">
                  <FormField control={mortgageForm.control} name="loanAmount" render={({ field }) => (<FormItem><FormLabel>Loan Amount ($)</FormLabel><FormControl><Input type="number" placeholder="250000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={mortgageForm.control} name="interestRate" render={({ field }) => (<FormItem><FormLabel>Interest Rate (%)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="5.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={mortgageForm.control} name="loanTerm" render={({ field }) => (<FormItem><FormLabel>Loan Term (Years)</FormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            <h4 className="font-semibold text-foreground mb-2">Real Estate Services & Trust (Demo):</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><ShieldCheck className="inline h-4 w-4 mr-1 text-primary"/>Property Validation: Upload legal docs (title, ownership, zoning certs). Status indicators (Freehold, Leasehold, Verified - Demo).</li>
              <li><Library className="inline h-4 w-4 mr-1 text-primary"/>Blockchain-based property ownership verification (Future Feature).</li>
              <li><FileText className="inline h-4 w-4 mr-1 text-primary"/>Secure Document Upload & E-signature for contracts.</li>
              <li><Star className="inline h-4 w-4 mr-1 text-primary"/>Verified Agent Rating & Review System.</li>
              <li><Handshake className="inline h-4 w-4 mr-1 text-primary"/>In-app chat with agents.</li>
              <li><MessageSquare className="inline h-4 w-4 mr-1 text-primary"/>Push notifications for new listings or saved search alerts.</li>
            </ul>
            <Button variant="link" asChild className="mt-2 px-0"><Link href="/list-property">List Your Property for Sale (Demo)</Link></Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
    
