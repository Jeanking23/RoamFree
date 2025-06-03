
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, DollarSign, Bed, Bath, Phone, Mail, MapPin } from "lucide-react";

const propertySchema = z.object({
  propertyName: z.string().min(3, "Property name must be at least 3 characters."),
  propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "LAND", "OTHER"]),
  location: z.string().min(5, "Location must be at least 5 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative.").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative.").optional(),
  description: z.string().min(20, "Description must be at least 20 characters.").max(1000),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(7, "Phone number seems too short.").optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function ListPropertyPage() {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyName: "",
      propertyType: "HOUSE",
      location: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      description: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  function onSubmit(data: PropertyFormValues) {
    console.log("Property Listing Submitted:", data);
    // Here you would typically send data to your backend
    alert("Property submitted! Check console for data.");
    form.reset();
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Building className="h-8 w-8" />
            List Your Property
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Reach millions of potential buyers or renters by listing your property with RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="propertyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Property Name/Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunny Beachfront Villa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Building className="h-4 w-4 text-primary" />Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="HOUSE">House</SelectItem>
                          <SelectItem value="VILLA">Villa</SelectItem>
                          <SelectItem value="LAND">Land</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location / Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Ocean Drive, Miami, FL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Price (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 250000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4 text-primary" />Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Bath className="h-4 w-4 text-primary" />Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of your property, amenities, nearby attractions, etc."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible to attract buyers/renters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary" />Contact Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                Submit Property Listing
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
