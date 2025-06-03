
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, ChevronsUpDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-6 bg-card shadow-lg rounded-lg border">
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Destination</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Paris, France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
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
          name="adults" // This field is mainly for the popover trigger, individual fields are handled inside
          render={({ field }) => ( // We only use field for error display here if needed for the whole group
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Guests</FormLabel>
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
                            <Input type="number" min="1" max="10" {...adultField} onChange={e => adultField.onChange(parseInt(e.target.value,10) || 1)}/>
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
                            <Input type="number" min="0" max="10" {...childrenField} onChange={e => childrenField.onChange(parseInt(e.target.value,10) || 0)}/>
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
                            <Input type="number" min="1" max="5" {...roomField} onChange={e => roomField.onChange(parseInt(e.target.value,10) || 1)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              {/* Display general errors for the group if needed, or specific errors under each input via FormMessage */}
               <FormMessage>{form.formState.errors.adults?.message || form.formState.errors.children?.message || form.formState.errors.rooms?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full self-end bg-accent hover:bg-accent/90 text-accent-foreground">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
    </Form>
  );
}

    