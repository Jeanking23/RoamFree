
"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, ChevronsUpDown, Building2, Smile, Accessibility, Leaf } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter

const accommodationSearchSchema = z.object({
  destination: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional().refine(data => !data || !data.from || !data.to || data.to > data.from, {
    message: "Check-out date must be after check-in date if both are provided.",
    path: ["to"],
  }),
  adults: z.coerce.number().min(1, "At least 1 adult is required").max(10, "Max 10 adults").optional(),
  children: z.coerce.number().min(0, "Children cannot be negative").max(10, "Max 10 children").optional(),
  rooms: z.coerce.number().min(1, "At least 1 room is required").max(5, "Max 5 rooms").optional(),
  propertyType: z.enum(["ANY", "HOTEL", "RENTAL"]).default("ANY").optional(),
  mood: z.enum(["ANY", "PEACEFUL", "ROMANTIC", "ADVENTUROUS"]).default("ANY").optional(),
  wheelchairAccessible: z.boolean().default(false).optional(),
  ecoFriendly: z.boolean().default(false).optional(),
});

export type AccommodationSearchFormValues = z.infer<typeof accommodationSearchSchema>;

interface AccommodationSearchFormProps {
  onSearch: (values: AccommodationSearchFormValues) => void;
  isResultsPage?: boolean;
}


export default function AccommodationSearchForm({ onSearch, isResultsPage = false }: AccommodationSearchFormProps) {
  const router = useRouter(); // Initialize router
  const [hasMounted, setHasMounted] = useState(false);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);

  const form = useForm<AccommodationSearchFormValues>({
    resolver: zodResolver(accommodationSearchSchema),
    defaultValues: {
      destination: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
      adults: 2,
      children: 0,
      rooms: 1,
      propertyType: "ANY",
      mood: "ANY",
      wheelchairAccessible: false,
      ecoFriendly: false,
    },
  });
  
  useEffect(() => {
    setHasMounted(true);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today);

    if (!form.getValues("dateRange.from") && !form.getValues("dateRange.to")) {
      form.setValue("dateRange.from", new Date(), { shouldValidate: false });
      form.setValue("dateRange.to", addDays(new Date(), 7), { shouldValidate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function onSubmit(values: AccommodationSearchFormValues) {
    if (isResultsPage) {
        // If on results page, call onSearch to update results in place
        onSearch(values);
    } else {
        // If on homepage or other pages, navigate to search results page
        const queryParams = new URLSearchParams();
        if (values.destination) queryParams.set('destination', values.destination);
        if (values.dateRange?.from) queryParams.set('dateFrom', values.dateRange.from.toISOString());
        if (values.dateRange?.to) queryParams.set('dateTo', values.dateRange.to.toISOString());
        if (values.adults) queryParams.set('adults', values.adults.toString());
        if (values.children) queryParams.set('children', values.children.toString());
        if (values.rooms) queryParams.set('rooms', values.rooms.toString());
        if (values.propertyType && values.propertyType !== "ANY") queryParams.set('propertyType', values.propertyType);
        if (values.mood && values.mood !== "ANY") queryParams.set('mood', values.mood);
        if (values.wheelchairAccessible) queryParams.set('wheelchairAccessible', 'true');
        if (values.ecoFriendly) queryParams.set('ecoFriendly', 'true');
        
        router.push(`/stays/search?${queryParams.toString()}`);
    }
  }

  const { watch } = form;
  const adults = watch("adults", 2); 
  const children = watch("children", 0);
  const rooms = watch("rooms", 1);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-0 bg-card rounded-lg">
        {/* Destination */}
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-12 lg:col-span-3">
              <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Destination</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Paris, France" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date Range */}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-1 md:col-span-6 lg:col-span-3">
              <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" />Check-in - Check-out</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      {hasMounted && field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} - {" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Check-in - Check-out</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value as DateRange | undefined} 
                    onSelect={(range) => field.onChange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                    disabled={(date) => minDate ? date < minDate : true} 
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Guests & Rooms */}
        <FormField
          control={form.control}
          name="adults" 
          render={() => ( 
            <FormItem className="flex flex-col col-span-1 md:col-span-6 lg:col-span-2">
              <FormLabel className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Guests & Rooms</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal flex items-center h-10"
                  >
                    <span className="truncate">{`${adults} adult${adults !== 1 ? 's' : ''} · ${children} child${children !== 1 ? 'ren' : ''} · ${rooms} room${rooms !== 1 ? 's' : ''}`}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-4" align="start">
                  <div className="space-y-4">
                    <FormField control={form.control} name="adults" render={({ field: adultField }) => ( <FormItem><FormLabel>Adults</FormLabel><FormControl><Input type="number" min="1" max="10" {...adultField} value={adultField.value || 1} onChange={e => adultField.onChange(parseInt(e.target.value,10) || 1)}/></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="children" render={({ field: childrenField }) => ( <FormItem><FormLabel>Children</FormLabel><FormControl><Input type="number" min="0" max="10" {...childrenField} value={childrenField.value || 0} onChange={e => childrenField.onChange(parseInt(e.target.value,10) || 0)}/></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="rooms" render={({ field: roomField }) => ( <FormItem><FormLabel>Rooms</FormLabel><FormControl><Input type="number" min="1" max="5" {...roomField} value={roomField.value || 1} onChange={e => roomField.onChange(parseInt(e.target.value,10) || 1)}/></FormControl><FormMessage /></FormItem> )}/>
                  </div>
                </PopoverContent>
              </Popover>
               <FormMessage>{form.formState.errors.adults?.message || form.formState.errors.children?.message || form.formState.errors.rooms?.message}</FormMessage>
            </FormItem>
          )}
        />
        
        <div className="col-span-1 md:col-span-6 lg:col-span-2 grid grid-cols-2 gap-4">
          <FormField control={form.control} name="propertyType" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any</SelectItem><SelectItem value="HOTEL">Hotel</SelectItem><SelectItem value="RENTAL">Rental</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
          <FormField control={form.control} name="mood" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Smile className="h-4 w-4 text-primary" />Mood</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any</SelectItem><SelectItem value="PEACEFUL">Peaceful</SelectItem><SelectItem value="ROMANTIC">Romantic</SelectItem><SelectItem value="ADVENTUROUS">Adventurous</SelectItem></SelectContent></Select><FormMessage /></FormItem> )}/>
        </div>

        <div className="col-span-1 md:col-span-6 lg:col-span-2 pt-2 md:pt-8 flex items-center gap-4">
            <FormField control={form.control} name="wheelchairAccessible" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-2 text-sm"><Accessibility className="h-4 w-4 text-primary"/>Accessible</FormLabel></FormItem> )}/>
            <FormField control={form.control} name="ecoFriendly" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-2 text-sm"><Leaf className="h-4 w-4 text-primary"/>Eco-Friendly</FormLabel></FormItem> )}/>
        </div>
        
        <div className="col-span-1 md:col-span-12 lg:col-span-12">
            <Button type="submit" className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="mr-2 h-4 w-4" /> Search
            </Button>
        </div>
      </form>
    </Form>
  );
}
