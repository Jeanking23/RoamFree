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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Car, CarFront, Search } from "lucide-react";

const rideBookingSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().min(1, "Pickup time is required (e.g., HH:MM)"),
});

const rentalCarSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().optional(),
  pickupDate: z.date({ required_error: "Pickup date is required." }),
  pickupTime: z.string().min(1, "Pickup time is required (e.g., HH:MM)"),
  dropoffDate: z.date({ required_error: "Dropoff date is required." }),
  dropoffTime: z.string().min(1, "Dropoff time is required (e.g., HH:MM)"),
}).refine(data => data.dropoffDate >= data.pickupDate, {
  message: "Dropoff date must be on or after pickup date.",
  path: ["dropoffDate"],
});


type RideBookingFormValues = z.infer<typeof rideBookingSchema>;
type RentalCarFormValues = z.infer<typeof rentalCarSchema>;

function RideBookingForm() {
  const form = useForm<RideBookingFormValues>({
    resolver: zodResolver(rideBookingSchema),
    defaultValues: { pickupLocation: "", dropoffLocation: "", pickupTime: "10:00" },
  });

  function onSubmit(values: RideBookingFormValues) {
    console.log("Ride Booking:", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Pickup Location</FormLabel>
                <FormControl><Input placeholder="Enter pickup address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Dropoff Location</FormLabel>
                <FormControl><Input placeholder="Enter dropoff address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" />Pickup Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
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
            )}
          />
          <FormField
            control={form.control}
            name="pickupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Pickup Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <Search className="mr-2 h-4 w-4" /> Search Rides
        </Button>
      </form>
    </Form>
  );
}

function RentalCarForm() {
  const form = useForm<RentalCarFormValues>({
    resolver: zodResolver(rentalCarSchema),
    defaultValues: { pickupLocation: "", pickupTime: "10:00", dropoffTime: "10:00" },
  });

  function onSubmit(values: RentalCarFormValues) {
    console.log("Rental Car:", values);
  }
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Pickup Location</FormLabel>
                <FormControl><Input placeholder="Enter pickup city or airport" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Dropoff Location (Optional)</FormLabel>
                <FormControl><Input placeholder="Leave blank if same as pickup" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" />Pickup Date</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
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
            )}
          />
           <FormField
            control={form.control}
            name="pickupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Pickup Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dropoffDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" />Dropoff Date</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("pickupDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="dropoffTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Dropoff Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
           <Search className="mr-2 h-4 w-4" /> Search Cars
        </Button>
      </form>
    </Form>
  );
}

export default function TransportationSearchForm() {
  return (
    <div className="p-6 bg-card shadow-lg rounded-lg border">
      <Tabs defaultValue="rides">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="rides" className="gap-2"><Car className="h-5 w-5" />Ride Booking</TabsTrigger>
          <TabsTrigger value="cars" className="gap-2"><CarFront className="h-5 w-5" />Rental Cars</TabsTrigger>
        </TabsList>
        <TabsContent value="rides">
          <RideBookingForm />
        </TabsContent>
        <TabsContent value="cars">
          <RentalCarForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
