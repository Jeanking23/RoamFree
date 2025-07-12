
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building, DollarSign, Bed, Bath, Phone, Mail, MapPin, Image as ImageIcon, CalendarCheck2, FileText, ShieldCheck, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; 
import { toast } from "@/hooks/use-toast"; 
import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const propertySchema = z.object({
  propertyName: z.string().min(3, "Property name must be at least 3 characters."),
  propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "LAND", "OTHER"]),
  listingType: z.enum(["RENT", "SALE"]).default("RENT"), // New: Rent or Sale
  location: z.string().min(5, "Location must be at least 5 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  priceType: z.enum(["PER_NIGHT", "PER_MONTH", "TOTAL"]).default("PER_NIGHT"), // For rent/sale distinction
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative.").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative.").optional(),
  sizeSqft: z.coerce.number().positive("Size must be positive").optional(), // For houses/apartments
  sizeAcres: z.coerce.number().positive("Size must be positive").optional(), // For land
  zoning: z.string().optional(), // For land/property sale
  description: z.string().min(20, "Description must be at least 20 characters.").max(1000),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(7, "Phone number seems too short.").optional(),
  photos: z.string().optional().describe("Placeholder for photo upload URLs or identifiers"),
  instantBooking: z.boolean().default(true), // For rentals
  requestToBook: z.boolean().default(false), // For rentals
  blackoutDates: z.string().optional().describe("e.g., MM/DD/YYYY, MM/DD/YYYY-MM/DD/YYYY"), // For rentals
  legalDocs: z.string().optional().describe("Placeholder for land title, ownership proof upload"), // For sale
  propertyStatus: z.string().optional().describe("e.g., Freehold, Leasehold, Verified - for sale"), // For sale
  enableTenantScreening: z.boolean().default(false), // For rentals
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function ListPropertyPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyName: "",
      propertyType: "HOUSE",
      listingType: "RENT",
      location: "",
      price: 0,
      priceType: "PER_NIGHT",
      bedrooms: 1,
      bathrooms: 1,
      description: "",
      contactEmail: "",
      contactPhone: "",
      photos: "",
      instantBooking: true,
      requestToBook: false,
      blackoutDates: "",
      legalDocs: "",
      propertyStatus: "",
      enableTenantScreening: false,
    },
  });

  const listingType = form.watch("listingType");

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUrl(reader.result as string);
        form.setValue("photos", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      setPhotoDataUrl(null);
      form.setValue("photos", undefined);
    }
  };


  function onSubmit(data: PropertyFormValues) {
    console.log("Property Listing Submitted:", data);
    toast({title: "Property Submitted (Demo)", description: "Your listing has been submitted for review."});
    form.reset();
    setPhotoPreview(null);
    setPhotoDataUrl(null);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Building className="h-8 w-8" />
            List Your Property, Land, or Rental
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Reach millions of potential buyers or renters by listing with RoamFree.
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
                      <FormControl><Input placeholder="e.g., Sunny Beachfront Villa or Prime Commercial Plot" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Listing Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select listing type" /></SelectTrigger></FormControl>
                            <SelectContent>
                            <SelectItem value="RENT">For Rent</SelectItem>
                            <SelectItem value="SALE">For Sale</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Building className="h-4 w-4 text-primary" />Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
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
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location / Address</FormLabel>
                      <FormControl><Input placeholder="e.g., 123 Ocean Drive, Miami, FL" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Price (USD)</FormLabel>
                      <FormControl><Input type="number" placeholder={listingType === 'RENT' ? "e.g., 150 or 2500" : "e.g., 250000"} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="priceType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price Is</FormLabel>
                        <Select onValueChange={(value) => {
                                field.onChange(value);
                                if (value === "PER_NIGHT" || value === "PER_MONTH") form.setValue("listingType", "RENT");
                                if (value === "TOTAL") form.setValue("listingType", "SALE");
                            }} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select price type" /></SelectTrigger></FormControl>
                            <SelectContent>
                            {listingType === 'RENT' && <SelectItem value="PER_NIGHT">Per Night</SelectItem>}
                            {listingType === 'RENT' && <SelectItem value="PER_MONTH">Per Month</SelectItem>}
                            {listingType === 'SALE' && <SelectItem value="TOTAL">Total Price</SelectItem>}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>

              {form.watch("propertyType") !== "LAND" && (
                <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4 text-primary" />Bedrooms</FormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Bath className="h-4 w-4 text-primary" />Bathrooms</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sizeSqft" render={({ field }) => (<FormItem><FormLabel>Size (sqft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              )}

              {form.watch("propertyType") === "LAND" && (
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="sizeAcres" render={({ field }) => (<FormItem><FormLabel>Size (Acres)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 2.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="zoning" render={({ field }) => (<FormItem><FormLabel>Zoning</FormLabel><FormControl><Input placeholder="e.g., Residential, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
              )}


              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Property Description</FormLabel><FormControl><Textarea placeholder="Detailed description of your property, amenities, nearby attractions, etc." rows={6} {...field} /></FormControl><FormDescription>Provide as much detail as possible to attract buyers/renters.</FormDescription><FormMessage /></FormItem>)} />
              
              <FormItem>
                <FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-primary" />Property Photo</FormLabel>
                <FormControl><Input type="file" accept="image/*" onChange={handlePhotoChange} /></FormControl>
                <FormDescription>Upload a main photo for your listing. Virtual tour and 3D floorplan uploads coming soon.</FormDescription>
                <FormMessage />
              </FormItem>

              {photoPreview && (
                <div className="mt-4">
                  <Label>Photo Preview:</Label>
                  <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border">
                     <Image src={photoPreview} alt="Property preview" fill objectFit="cover" />
                  </div>
                </div>
              )}


             {listingType === "RENT" && (
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><CalendarCheck2 className="h-5 w-5 text-primary"/>Rental Availability & Settings (Demo)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="instantBooking" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Enable Instant Booking</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="requestToBook" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Require Request to Book</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="blackoutDates" render={({ field }) => (<FormItem><FormLabel>Blackout Dates</FormLabel><FormControl><Input placeholder="e.g., 12/24/2024, 01/01/2025-01/07/2025" {...field} /></FormControl><FormDescription>Enter dates or date ranges separated by commas. Calendar sync with Airbnb/Booking.com (Demo).</FormDescription><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="enableTenantScreening" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-1"><Users className="h-4 w-4"/>Enable Tenant Screening Options (ID, income, rental history - Demo)</FormLabel></FormItem>)} />
                        <p className="text-xs text-muted-foreground">Lease management (digital signing, rent payment reminders) available in dashboard (Demo).</p>
                    </CardContent>
                </Card>
             )}

            {listingType === "SALE" && (
                 <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Property Sale Details (Demo)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="legalDocs" render={({ field }) => (<FormItem><FormLabel>Legal Documents (Placeholder)</FormLabel><FormControl><Input type="file" multiple disabled {...field} /></FormControl><FormDescription>Upload land title, ownership proof, zoning certificate, etc. (Demo)</FormDescription><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="propertyStatus" render={({ field }) => (<FormItem><FormLabel>Property Status</FormLabel><FormControl><Input placeholder="e.g., Freehold, Leasehold, Verified" {...field} /></FormControl><FormDescription>Indicate current legal status.</FormDescription><FormMessage /></FormItem>)} />
                        <p className="text-xs text-muted-foreground">Blockchain verification for ownership (Future Feature).</p>
                    </CardContent>
                </Card>
            )}


              <Card>
                <CardHeader><CardTitle className="text-xl">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />Contact Email</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary" />Contact Phone (Optional)</FormLabel><FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                Submit Listing
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
