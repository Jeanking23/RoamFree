// src/app/flights/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plane, CalendarIcon, Users, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const flightSearchSchema = z.object({
  origin: z.string().min(3, "Origin airport/city is required."),
  destination: z.string().min(3, "Destination airport/city is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  returnDate: z.date().optional(),
  passengers: z.coerce.number().min(1, "At least one passenger is required."),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]).default("ROUND_TRIP"),
}).refine(data => data.tripType === "ONE_WAY" || (data.tripType === "ROUND_TRIP" && data.returnDate), {
  message: "Return date is required for a round trip.",
  path: ["returnDate"],
}).refine(data => !data.returnDate || data.returnDate >= data.departureDate, {
  message: "Return date must be on or after departure date.",
  path: ["returnDate"],
});

type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;

export default function FlightsPage() {
  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      tripType: "ROUND_TRIP",
      passengers: 1,
    }
  });

  const tripType = form.watch("tripType");

  function onFlightSearchSubmit(data: FlightSearchFormValues) {
    console.log("Flight Search Submitted:", data);
    toast({ title: "Flight Search (Demo)", description: "Searching for flights... This is a placeholder and no actual search is being performed." });
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Search for Flights
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find the best deals on flights to your next destination.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFlightSearchSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                        <div className="flex gap-4">
                            <Button type="button" variant={field.value === 'ROUND_TRIP' ? 'default' : 'outline'} onClick={() => field.onChange('ROUND_TRIP')}>Round Trip</Button>
                            <Button type="button" variant={field.value === 'ONE_WAY' ? 'default' : 'outline'} onClick={() => field.onChange('ONE_WAY')}>One Way</Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="origin" render={({ field }) => (<FormItem><FormLabel>Origin</FormLabel><FormControl><Input placeholder="e.g., New York (JFK)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="destination" render={({ field }) => (<FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., London (LHR)" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="departureDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {tripType === "ROUND_TRIP" && (
                  <FormField control={form.control} name="returnDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}

                <FormField control={form.control} name="passengers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4"/>Passengers</FormLabel>
                    <FormControl><Input type="number" min="1" placeholder="1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="mr-2 h-5 w-5" /> Search Flights
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center py-12 bg-muted/30 rounded-md">
        <p className="text-xl font-semibold">Flight Results Placeholder</p>
        <p className="text-muted-foreground mt-2">Your flight search results would appear here.</p>
      </div>
    </div>
  );
}
