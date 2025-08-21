
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Building, DollarSign, Bed, Bath, MapPin, ImageIcon, CalendarCheck2, FileText, Users, Sparkles, X, Home as HomeIcon, LandPlot, Landmark as AttractionIcon, CarFront, UploadCloud } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; 
import { toast } from "@/hooks/use-toast"; 
import { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

const propertySchema = z.object({
  propertyName: z.string().min(3, "Property name must be at least 3 characters."),
  propertyType: z.enum(["APARTMENT", "HOUSE", "VILLA", "LAND", "ATTRACTION", "EVENT_CENTER", "OTHER"]),
  listingType: z.enum(["RENT", "SALE"]),
  location: z.string().min(5, "Location must be at least 5 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  priceType: z.enum(["PER_NIGHT", "PER_MONTH", "TOTAL"]),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative.").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative.").optional(),
  sizeSqft: z.coerce.number().positive("Size must be positive").optional(),
  sizeAcres: z.coerce.number().positive("Size must be positive").optional(),
  zoning: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters.").max(1000),
  features: z.array(z.object({ value: z.string() })).optional(),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(7, "Phone number seems too short.").optional(),
  photos: z.array(z.string()).optional().describe("Placeholder for photo upload URLs"),
  instantBooking: z.boolean().default(true),
  requestToBook: z.boolean().default(false),
  blackoutDates: z.string().optional().describe("e.g., MM/DD/YYYY, MM/DD/YYYY-MM/DD/YYYY"),
  legalDocs: z.object({
    landTitle: z.string().optional(),
    surveyPlan: z.string().optional(),
    attestation: z.string().optional(),
  }).optional(),
  propertyStatus: z.string().optional().describe("e.g., Freehold, Leasehold, Verified - for sale"),
  enableTenantScreening: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function ListPropertyPage() {
  const [interiorPhotoPreviews, setInteriorPhotoPreviews] = useState<string[]>([]);
  const [exteriorPhotoPreviews, setExteriorPhotoPreviews] = useState<string[]>([]);
  const [landTitlePreview, setLandTitlePreview] = useState<string | null>(null);
  const [surveyPlanPreview, setSurveyPlanPreview] = useState<string | null>(null);
  const [attestationPreview, setAttestationPreview] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");

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
      features: [],
      contactEmail: "",
      contactPhone: "",
      instantBooking: true,
      requestToBook: false,
      enableTenantScreening: false,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const listingType = form.watch("listingType");
  const propertyType = form.watch("propertyType");

  useEffect(() => {
    if (listingType === 'SALE') {
      form.setValue('priceType', 'TOTAL');
    } else if (listingType === 'RENT' && form.getValues('priceType') === 'TOTAL') {
      form.setValue('priceType', 'PER_NIGHT');
    }
  }, [listingType, form]);
  
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[] | string | null>>,
    isMultiple: boolean
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (isMultiple) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            (setter as React.Dispatch<React.SetStateAction<string[]>>)(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        (setter as React.Dispatch<React.SetStateAction<string | null>>)(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  function onSubmit(data: PropertyFormValues) {
    // In a real app, you'd upload the files and get URLs before saving
    const submissionData = {
      ...data,
      photos: [...interiorPhotoPreviews, ...exteriorPhotoPreviews],
      legalDocs: {
          landTitle: landTitlePreview,
          surveyPlan: surveyPlanPreview,
          attestation: attestationPreview,
      }
    };
    console.log("Property Listing Submitted:", submissionData);
    toast({title: "Property Submitted (Demo)", description: "Your listing has been submitted for review."});
    form.reset();
    setInteriorPhotoPreviews([]);
    setExteriorPhotoPreviews([]);
    setLandTitlePreview(null);
    setSurveyPlanPreview(null);
    setAttestationPreview(null);
  }
  
  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      append({ value: featureInput.trim() });
      setFeatureInput("");
    }
  };

  const showResidentialFields = ["APARTMENT", "HOUSE", "VILLA"].includes(propertyType);
  const showLandFields = propertyType === "LAND";
  const showFeatureFields = ["ATTRACTION", "EVENT_CENTER"].includes(propertyType);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
                <Building className="h-8 w-8" />
                List Your Property, Land, or Venue
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">
                Reach millions of potential buyers or renters by listing with RoamFree.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/cars-for-sale/new" className="flex items-center gap-2">
                <CarFront className="h-4 w-4" /> List a Car Instead?
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="propertyType" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><Building className="h-4 w-4 text-primary" />Property Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="HOUSE">House</SelectItem> <SelectItem value="APARTMENT">Apartment</SelectItem> <SelectItem value="VILLA">Villa</SelectItem> <SelectItem value="LAND">Land</SelectItem> <SelectItem value="ATTRACTION">Attraction</SelectItem> <SelectItem value="EVENT_CENTER">Event Center</SelectItem> <SelectItem value="OTHER">Other</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="listingType" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Listing Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select listing type" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="RENT">For Rent</SelectItem> <SelectItem value="SALE">For Sale</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
              </div>

              <FormField control={form.control} name="propertyName" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Listing Title</FormLabel> <FormControl><Input placeholder="e.g., Sunny Beachfront Villa or Prime Commercial Plot" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              
              <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />Location / Address</FormLabel> <FormControl><Input placeholder="e.g., 123 Ocean Drive, Miami, FL" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="price" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary" />Price (USD)</FormLabel> <FormControl><Input type="number" placeholder={listingType === 'RENT' ? "e.g., 150 or 2500" : "e.g., 250000"} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="priceType" render={({ field }) => ( <FormItem> <FormLabel>Price Is</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select price type" /></SelectTrigger></FormControl> <SelectContent> {listingType === 'RENT' && <SelectItem value="PER_NIGHT">Per Night</SelectItem>} {listingType === 'RENT' && <SelectItem value="PER_MONTH">Per Month</SelectItem>} {listingType === 'SALE' && <SelectItem value="TOTAL">Total Price</SelectItem>} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
              </div>

              {showResidentialFields && (
                <Card><CardHeader><CardTitle className="text-xl flex items-center gap-2"><HomeIcon className="h-5 w-5 text-primary"/>Residential Details</CardTitle></CardHeader><CardContent className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4" />Bedrooms</FormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Bath className="h-4 w-4" />Bathrooms</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sizeSqft" render={({ field }) => (<FormItem><FormLabel>Size (sqft)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent></Card>
              )}

              {showLandFields && (
                 <Card><CardHeader><CardTitle className="text-xl flex items-center gap-2"><LandPlot className="h-5 w-5 text-primary"/>Land Details</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="sizeAcres" render={({ field }) => (<FormItem><FormLabel>Size (Acres)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 2.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="zoning" render={({ field }) => (<FormItem><FormLabel>Zoning</FormLabel><FormControl><Input placeholder="e.g., Residential, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 </CardContent></Card>
              )}
              
              {showFeatureFields && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><AttractionIcon className="h-5 w-5 text-primary"/>Venue Features</CardTitle>
                        <CardDescription>Add features for your {propertyType === "ATTRACTION" ? "Attraction" : "Event Center"}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="e.g., Stage Available or Guided Tours" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}/>
                            <Button type="button" onClick={handleAddFeature}>Add Feature</Button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <p>{field.value}</p>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              )}

              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of your listing, amenities, nearby attractions, etc." rows={6} {...field} /></FormControl><FormDescription>Provide as much detail as possible to attract buyers/renters.</FormDescription><FormMessage /></FormItem>)} />
              
              {showResidentialFields && (
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/>Photos</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormItem>
                            <FormLabel>Interior Photos</FormLabel>
                            <FormControl><Input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setInteriorPhotoPreviews, true)} /></FormControl>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                                {interiorPhotoPreviews.map((src, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border"><Image src={src} alt={`Interior Preview ${index + 1}`} fill className="object-cover" /></div>
                                ))}
                            </div>
                        </FormItem>
                        <FormItem>
                            <FormLabel>Exterior Photos</FormLabel>
                            <FormControl><Input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setExteriorPhotoPreviews, true)} /></FormControl>
                             <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                                {exteriorPhotoPreviews.map((src, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border"><Image src={src} alt={`Exterior Preview ${index + 1}`} fill className="object-cover" /></div>
                                ))}
                            </div>
                        </FormItem>
                    </CardContent>
                </Card>
              )}
              
              {showLandFields && (
                 <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Land Documents</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormItem>
                            <FormLabel>Land Title</FormLabel>
                            <FormControl><Input type="file" onChange={(e) => handleFileChange(e, setLandTitlePreview, false)} /></FormControl>
                            {landTitlePreview && <p className="text-xs text-muted-foreground mt-1">Preview ready</p>}
                        </FormItem>
                        <FormItem>
                            <FormLabel>Survey Plan</FormLabel>
                            <FormControl><Input type="file" onChange={(e) => handleFileChange(e, setSurveyPlanPreview, false)} /></FormControl>
                            {surveyPlanPreview && <p className="text-xs text-muted-foreground mt-1">Preview ready</p>}
                        </FormItem>
                        <FormItem>
                            <FormLabel>Attestation</FormLabel>
                            <FormControl><Input type="file" onChange={(e) => handleFileChange(e, setAttestationPreview, false)} /></FormControl>
                            {attestationPreview && <p className="text-xs text-muted-foreground mt-1">Preview ready</p>}
                        </FormItem>
                    </CardContent>
                 </Card>
              )}


             {listingType === "RENT" && (
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><CalendarCheck2 className="h-5 w-5 text-primary"/>Rental Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="instantBooking" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Enable Instant Booking</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="requestToBook" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Require Request to Book</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="blackoutDates" render={({ field }) => (<FormItem><FormLabel>Blackout Dates</FormLabel><FormControl><Input placeholder="e.g., 12/24/2024, 01/01/2025-01/07/2025" {...field} /></FormControl><FormDescription>Enter dates or date ranges separated by commas.</FormDescription><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="enableTenantScreening" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal flex items-center gap-1"><Users className="h-4 w-4"/>Enable Tenant Screening Options (ID, income, etc.)</FormLabel></FormItem>)} />
                    </CardContent>
                </Card>
             )}

            {listingType === "SALE" && (
                 <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Sale Details (Demo)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="propertyStatus" render={({ field }) => (<FormItem><FormLabel>Property Status</FormLabel><FormControl><Input placeholder="e.g., Freehold, Leasehold, Verified" {...field} /></FormControl><FormDescription>Indicate current legal status.</FormDescription><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
            )}

              <Card>
                <CardHeader><CardTitle className="text-xl">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-primary" />Contact Email</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-primary" />Contact Phone (Optional)</FormLabel><FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
