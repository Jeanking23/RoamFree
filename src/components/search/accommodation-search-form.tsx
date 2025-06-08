
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
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, ChevronsUpDown, Building2, Smile, Accessibility, Leaf } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";

const accommodationSearchSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  dateRange: z.object({
    from: z.date({ required_error: "Check-in date is required." }),
    to: z.date({ required_error: "Check-out date is required." }),
  }, { required_error: "Date range is required." }).refine(data => data.from && data.to && data.to > data.from, {
    message: "Check-out date must be after check-in date.",
    path: ["to"],
  }),
  adults: z.coerce.number().min(1, "At least 1 adult is required").max(10, "Max 10 adults"),
  children: z.coerce.number().min(0, "Children cannot be negative").max(10, "Max 10 children"),
  rooms: z.coerce.number().min(1, "At least 1 room is required").max(5, "Max 5 rooms"),
  propertyType: z.enum(["ANY", "HOTEL", "RENTAL"]).default("ANY"),
  mood: z.enum(["ANY", "PEACEFUL", "ROMANTIC", "ADVENTUROUS"]).default("ANY").optional(),
  wheelchairAccessible: z.boolean().default(false).optional(),
  ecoFriendly: z.boolean().default(false).optional(),
});

type AccommodationSearchFormValues = z.infer<typeof accommodationSearchSchema>;

export default function AccommodationSearchForm() {
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

  function onSubmit(values: AccommodationSearchFormValues) {
    console.log("Accommodation Search:", values);
    // Handle form submission, e.g., API call
  }

  const { watch } = form;
  const adults = watch("adults");
  const children = watch("children");
  const rooms = watch("rooms");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end p-6 bg-card shadow-lg rounded-lg border">
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem className="lg:col-span-1 xl:col-span-1">
              <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Destination</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Paris, France" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col lg:col-span-1 xl:col-span-1">
              <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" />Check-in - Check-out</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      {field.value?.from ? (
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
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adults" 
          render={({ field }) => (
            <FormItem className="flex flex-col lg:col-span-1 xl:col-span-1">
              <FormLabel className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Guests & Rooms</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal flex items-center"
                  >
                    <span>{`${adults} adult${adults !== 1 ? 's' : ''} · ${children} child${children !== 1 ? 'ren' : ''} · ${rooms} room${rooms !== 1 ? 's' : ''}`}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-4" align="start">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="adults"
                      render={({ field: adultField }) => (
                        <FormItem>
                          <FormLabel>Adults</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="10" {...adultField} value={adultField.value || 1} onChange={e => adultField.onChange(parseInt(e.target.value,10) || 1)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="children"
                      render={({ field: childrenField }) => (
                        <FormItem>
                          <FormLabel>Children</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="10" {...childrenField} value={childrenField.value || 0} onChange={e => childrenField.onChange(parseInt(e.target.value,10) || 0)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rooms"
                      render={({ field: roomField }) => (
                        <FormItem>
                          <FormLabel>Rooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="5" {...roomField} value={roomField.value || 1} onChange={e => roomField.onChange(parseInt(e.target.value,10) || 1)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </PopoverContent>
              </Popover>
               <FormMessage>{form.formState.errors.adults?.message || form.formState.errors.children?.message || form.formState.errors.rooms?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem className="lg:col-span-1 xl:col-span-1">
              <FormLabel className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ANY">Any</SelectItem>
                  <SelectItem value="HOTEL">Hotel</SelectItem>
                  <SelectItem value="RENTAL">Rental (Vacation)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem className="lg:col-span-1 xl:col-span-1">
              <FormLabel className="flex items-center gap-2"><Smile className="h-4 w-4 text-primary" />Mood (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ANY">Any</SelectItem>
                  <SelectItem value="PEACEFUL">Peaceful</SelectItem>
                  <SelectItem value="ROMANTIC">Romantic</SelectItem>
                  <SelectItem value="ADVENTUROUS">Adventurous</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 lg:col-span-2 xl:col-span-2">
            <FormField
            control={form.control}
            name="wheelchairAccessible"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm h-10">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <FormLabel className="font-normal flex items-center gap-2"><Accessibility className="h-4 w-4 text-primary"/>Wheelchair Accessible</FormLabel>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="ecoFriendly"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm h-10">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <FormLabel className="font-normal flex items-center gap-2"><Leaf className="h-4 w-4 text-primary"/>Eco-Friendly Certified</FormLabel>
                </FormItem>
            )}
            />
        </div>


        <Button type="submit" className="w-full self-end bg-accent hover:bg-accent/90 text-accent-foreground lg:col-span-full xl:col-span-1">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
    </Form>
  );
}
    
