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
  FormDescription,
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
import { useRouter } from 'next/navigation';

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
  propertyType: z.enum(["ANY", "HOTEL", "RENTAL", "GUEST_HOUSE"]).default("ANY").optional(),
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
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

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
    const oneWeekFromNow = addDays(today, 7);
    
    if (!form.getValues('dateRange.from') && !form.getValues('dateRange.to')) {
      form.setValue('dateRange.from', today);
      form.setValue('dateRange.to', oneWeekFromNow);
    }
  }, [form]);

  function onSubmit(values: AccommodationSearchFormValues) {
    if (isResultsPage) {
        onSearch(values);
    } else {
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

  const labelColorClass = isResultsPage ? "text-foreground" : "text-white drop-shadow-md";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-y-4 md:gap-4 items-end p-0 bg-transparent rounded-lg">
        {/* Destination */}
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-3">
              <FormLabel className={cn("flex items-center gap-2 mb-1.5 font-semibold", labelColorClass)}>
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Destination</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Paris, France"
                  {...field}
                  value={field.value || ''}
                  className={cn(
                    "h-12 md:h-10",
                    !isResultsPage && "bg-background/90 hover:bg-background text-foreground border-white/30"
                  )}
                />
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
            <FormItem className="flex flex-col col-span-12 md:col-span-3">
              <FormLabel className={cn("flex items-center gap-2 mb-1.5 font-semibold", labelColorClass)}>
                <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                <span>Check-in - Check-out</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 md:h-10",
                        !field.value?.from && "text-muted-foreground",
                        !isResultsPage && "bg-background/90 hover:bg-background text-foreground border-white/30"
                      )}
                    >
                      {hasMounted && field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "MMM dd")} - {format(field.value.to, "MMM dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "MMM dd, y")
                        )
                      ) : (
                        <span>Pick Dates</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value as DateRange | undefined} 
                    onSelect={(range) => field.onChange(range || { from: undefined, to: undefined })}
                    numberOfMonths={hasMounted && window.innerWidth < 768 ? 1 : 2}
                    disabled={(date) => hasMounted ? date < new Date(new Date().setHours(0, 0, 0, 0)) : true} 
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
            <FormItem className="flex flex-col col-span-12 md:col-span-3">
              <FormLabel className={cn("flex items-center gap-2 mb-1.5 font-semibold", labelColorClass)}>
                <Users className="h-4 w-4 text-primary shrink-0" />
                <span>Guests & Rooms</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between text-left font-normal flex items-center h-12 md:h-10",
                      !isResultsPage && "bg-background/90 hover:bg-background text-foreground border-white/30"
                    )}
                  >
                    <span className="truncate">{`${adults + children} guest${(adults + children) !== 1 ? 's' : ''} · ${rooms} room${rooms !== 1 ? 's' : ''}`}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[300px] p-4" align="start">
                  <div className="space-y-4">
                    <FormField control={form.control} name="adults" render={({ field: adultField }) => ( <FormItem className="flex items-center justify-between space-y-0"> <FormLabel className="text-sm">Adults</FormLabel> <FormControl><Input type="number" min="1" max="10" className="w-20" {...adultField} value={adultField.value || 1} onChange={e => adultField.onChange(parseInt(e.target.value,10) || 1)}/></FormControl> </FormItem> )}/>
                    <FormField control={form.control} name="children" render={({ field: childrenField }) => ( <FormItem className="flex items-center justify-between space-y-0"> <FormLabel className="text-sm">Children</FormLabel> <FormControl><Input type="number" min="0" max="10" className="w-20" {...childrenField} value={childrenField.value || 0} onChange={e => childrenField.onChange(parseInt(e.target.value,10) || 0)}/></FormControl> </FormItem> )}/>
                    <FormField control={form.control} name="rooms" render={({ field: roomField }) => ( <FormItem className="flex items-center justify-between space-y-0"> <FormLabel className="text-sm">Rooms</FormLabel> <FormControl><Input type="number" min="1" max="5" className="w-20" {...roomField} value={roomField.value || 1} onChange={e => roomField.onChange(parseInt(e.target.value,10) || 1)}/></FormControl> </FormItem> )}/>
                  </div>
                </PopoverContent>
              </Popover>
               <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        {/* Search Button */}
        <div className="col-span-12 md:col-span-3">
            <Button type="submit" className="w-full h-12 md:h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                <Search className="mr-2 h-5 w-5" /> Search
            </Button>
        </div>
        
        {/* Advanced Filters */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 pt-4 border-t border-white/20 md:border-t-0 md:mt-0 md:pt-0">
            <FormField control={form.control} name="propertyType" render={({ field }) => ( <FormItem>
                <FormLabel className={cn("flex items-center gap-2 mb-1 md:hidden lg:flex font-semibold", labelColorClass)}>
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Type</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className={cn("h-11 md:h-9", !isResultsPage && "bg-background/90 hover:bg-background text-foreground border-white/30")}>
                            <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="ANY">Any Type</SelectItem>
                        <SelectItem value="HOTEL">Hotel</SelectItem>
                        <SelectItem value="RENTAL">Rental</SelectItem>
                        <SelectItem value="GUEST_HOUSE">Guest House</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem> )}/>
            <FormField control={form.control} name="mood" render={({ field }) => ( <FormItem>
                <FormLabel className={cn("flex items-center gap-2 mb-1 md:hidden lg:flex font-semibold", labelColorClass)}>
                    <Smile className="h-4 w-4 text-primary" />
                    <span>Mood</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className={cn("h-11 md:h-9", !isResultsPage && "bg-background/90 hover:bg-background text-foreground border-white/30")}>
                            <SelectValue placeholder="Vibe / Mood" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="ANY">Any Mood</SelectItem>
                        <SelectItem value="PEACEFUL">Peaceful</SelectItem>
                        <SelectItem value="ROMANTIC">Romantic</SelectItem>
                        <SelectItem value="ADVENTUROUS">Adventurous</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem> )}/>
            <FormField control={form.control} name="wheelchairAccessible" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0 h-11 md:h-9">
                <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={cn("h-5 w-5", !isResultsPage && "border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}
                    />
                </FormControl>
                <FormLabel className={cn("font-normal flex items-center gap-2 text-sm", labelColorClass)}>
                    <Accessibility className="h-4 w-4 text-primary shrink-0"/>
                    <span>Accessible</span>
                </FormLabel>
            </FormItem> )}/>
            <FormField control={form.control} name="ecoFriendly" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-2 space-y-0 h-11 md:h-9">
                <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={cn("h-5 w-5", !isResultsPage && "border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}
                    />
                </FormControl>
                <FormLabel className={cn("font-normal flex items-center gap-2 text-sm", labelColorClass)}>
                    <Leaf className="h-4 w-4 text-primary shrink-0"/>
                    <span>Eco-Friendly</span>
                </FormLabel>
            </FormItem> )}/>
        </div>
        
      </form>
    </Form>
  );
}
