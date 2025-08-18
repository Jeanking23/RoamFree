// src/app/transport/bus-transportation-search-form.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BusIcon, CalendarIcon, MapPin, Users, Search, Repeat } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const busSearchSchema = z.object({
  originCity: z.string().min(2, "Origin city is required."),
  destinationCity: z.string().min(2, "Destination city is required."),
  departureDate: z.date({ required_error: "Departure date is required." }),
  passengers: z.coerce.number().min(1, "At least one passenger required.").max(20, "Max 20 passengers."),
  isRoundTrip: z.boolean().default(false),
  returnDate: z.date().optional(),
}).refine(data => !data.isRoundTrip || !!data.returnDate, {
    message: "Return date is required for a round trip.",
    path: ["returnDate"],
});

type BusSearchFormValues = z.infer<typeof busSearchSchema>;

export default function BusTransportationSearchForm() {
    const router = useRouter();
    const form = useForm<BusSearchFormValues>({
        resolver: zodResolver(busSearchSchema),
        defaultValues: {
          originCity: "",
          destinationCity: "",
          passengers: 1,
          isRoundTrip: false,
        },
      });

    const isRoundTrip = form.watch("isRoundTrip");

    useEffect(() => {
        if (!form.getValues("departureDate")) {
            form.setValue("departureDate", new Date());
        }
    }, [form]);

    function onBusSearchSubmit(data: BusSearchFormValues) {
        // Redirect to the main bus transportation page with query params
        const params = new URLSearchParams();
        params.set('origin', data.originCity);
        params.set('destination', data.destinationCity);
        params.set('departureDate', format(data.departureDate, 'yyyy-MM-dd'));
        params.set('passengers', data.passengers.toString());
        if (data.isRoundTrip && data.returnDate) {
            params.set('returnDate', format(data.returnDate, 'yyyy-MM-dd'));
        }
        router.push(`/bus-transportation?${params.toString()}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onBusSearchSubmit)} className="space-y-4">
                <h3 className="text-lg font-semibold">Book a Bus</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="originCity" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Origin City</FormLabel> <FormControl><Input placeholder="e.g., Douala" {...field} value={field.value || ''} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="destinationCity" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Destination City</FormLabel> <FormControl><Input placeholder="e.g., Yaoundé" {...field} value={field.value || ''} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid md:grid-cols-2 gap-4 items-end">
                    <FormField control={form.control} name="departureDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel className="flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-primary" />Departure Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus/> </PopoverContent> </Popover> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="passengers" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" />Passengers</FormLabel> <FormControl><Input type="number" min="1" max="20" placeholder="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} value={field.value || 1} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <FormField control={form.control} name="isRoundTrip" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} /> </FormControl> <FormLabel className="font-normal flex items-center gap-2"><Repeat className="h-4 w-4" />Round Trip</FormLabel> </FormItem> )}/>
                {isRoundTrip && (
                    <FormField control={form.control} name="returnDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Return Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("departureDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )}/>
                )}
                <Button type="submit" size="lg" className="w-full"> <Search className="mr-2 h-5 w-5" /> Search Buses </Button>
            </form>
        </Form>
    );
}
