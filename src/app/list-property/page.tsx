
// src/app/list-property/page.tsx
'use client';

import { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building, Info, Lightbulb, CheckCircle, MapPin, HomeIcon, Car, Bed, Bath, Users, Minus, Plus, Wifi, Wind, Snowflake, Utensils, WashingMachine, Tv, Waves, Sun, Eye, SquareParking, UploadCloud, Smoking, PartyPopper, Dog, Camera as CameraIcon, X, Coffee, ParkingCircle, Globe, DollarSign, HandCoins, User, Map as MapIconLucide } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import InteractiveMapPlaceholder from "@/components/map/interactive-map-placeholder";
import { useForm, FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { countries } from "@/lib/location-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";


const listingFormSchema = z.object({
  propertyName: z.string().min(5, "Property name must be at least 5 characters."),
  propertyType: z.string({ required_error: "Please select a property type." }),
  listingType: z.enum(["FOR_RENT", "FOR_SALE"]),
  bedrooms: z.array(z.object({
    beds: z.array(z.object({
        type: z.string(),
        count: z.number().min(1)
    }))
  })).optional(),
  maxGuests: z.coerce.number().min(1, "Must accommodate at least 1 guest.").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative.").optional(),
  address: z.string().min(5, "Address is required.").optional(),
  aptSuite: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  hostProfileHighlights: z.object({
    property: z.boolean().default(false),
    host: z.boolean().default(false),
    neighborhood: z.boolean().default(false),
    none: z.boolean().default(false),
  }).optional(),
  allowChildren: z.enum(["YES", "NO"]).optional(),
  offerCribs: z.enum(["YES", "NO"]).optional(),
  apartmentSize: z.coerce.number().optional(),
  apartmentSizeUnit: z.enum(["sqm", "sqft"]).default("sqm"),
  breakfast: z.enum(["YES", "NO"]).optional(),
  parking: z.enum(["YES_FREE", "YES_PAID", "NO"]).optional(),
  languages: z.array(z.string()).optional(),
  smokingAllowed: z.boolean().default(false),
  partiesAllowed: z.boolean().default(false),
  petsAllowed: z.enum(["YES", "UPON_REQUEST", "NO"]).default("NO"),
  checkInFrom: z.string().optional(),
  checkInUntil: z.string().optional(),
  checkOutFrom: z.string().optional(),
  checkOutUntil: z.string().optional(),
  photoDescriptions: z.string().optional(),
});
type ListingFormValues = z.infer<typeof listingFormSchema>;


const listingSteps = [
  // Step 0 - Not in progress bar
  { id: "type", title: "Select Type" }, 
  // Progress bar steps start here (index 1)
  { id: "basics", title: "Basic info", fields: ["propertyName", "propertyType", "listingType"] },
  { id: "location", title: "Location", fields: ["address", "city", "country", "state", "zip"] },
  { id: "details", title: "Property Details", fields: ["bedrooms", "maxGuests", "bathrooms"] },
  { id: "host-profile", title: "Host Profile", fields: ["hostProfileHighlights"] },
  { id: "amenities", title: "Amenities", fields: ["amenities"] },
  { id: "services", title: "Services", fields: ["breakfast", "parking"] },
  { id: "languages", title: "Languages", fields: ["languages"] },
  { id: "rules", title: "House Rules", fields: ["smokingAllowed", "partiesAllowed", "petsAllowed", "checkInFrom", "checkInUntil", "checkOutFrom", "checkOutUntil"] },
  { id: "photos", title: "Photos", fields: ["photoDescriptions"] },
  { id: "review", title: "Review and complete" },
];

const ListingTypeStep = ({ onSelect }: { onSelect: (type: 'property' | 'car') => void }) => {
    return (
        <div>
            <CardHeader className="p-0 text-center">
                <CardTitle className="text-3xl font-headline text-primary">What would you like to list?</CardTitle>
                <CardDescription className="pt-2">Choose a category to get started.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8 flex flex-col md:flex-row gap-6 justify-center">
                <Card
                    onClick={() => onSelect('property')}
                    className="w-full md:w-64 p-6 text-center cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
                >
                    <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold">A Property</h3>
                    <p className="text-sm text-muted-foreground mt-1">Homes, apartments, land, etc.</p>
                </Card>
                <Card
                    onClick={() => onSelect('car')}
                    className="w-full md:w-64 p-6 text-center cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
                >
                    <Car className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold">A Car</h3>
                    <p className="text-sm text-muted-foreground mt-1">For sale or for rent.</p>
                </Card>
            </CardContent>
        </div>
    );
};


const NameStep = () => {
    const { control, watch } = useFormContext<ListingFormValues>();
    
    const propertyType = watch("propertyType");
    
    const showPropertyDetails = propertyType && propertyType !== 'Land';

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-headline text-primary">Let's start with the basics</CardTitle>
                    <CardDescription className="pt-2">Tell us about the property you're listing.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-6 space-y-6">
                    <FormField
                        control={control}
                        name="propertyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Property Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Sunny Beachfront Villa" className="text-lg h-12" {...field} />
                                </FormControl>
                                <FormDescription>Give your property a name that stands out to guests.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="propertyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="House">House</SelectItem>
                                            <SelectItem value="Apartment">Apartment</SelectItem>
                                            <SelectItem value="Villa">Villa</SelectItem>
                                            <SelectItem value="Land">Land</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="listingType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Listing Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="FOR_RENT">For Rent</SelectItem>
                                            <SelectItem value="FOR_SALE">For Sale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </div>
            <div className="space-y-6">
                <Card className="bg-muted/30 border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-yellow-400" />What should I consider when choosing a name?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Keep it short and catchy</li>
                            <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Avoid abbreviations</li>
                            <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Stick to the facts</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30 border-dashed">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Info className="h-5 w-5 text-primary"/>Why do I need to name my property?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">The name is the first thing guests see. A good name can make your listing memorable.
                        <br/><strong className="text-foreground">Do not use your property's address as the name.</strong>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const LocationStep = () => {
    const { control, watch, setValue } = useFormContext<ListingFormValues>();
    const address = watch('address');
    const selectedCountryName = watch('country');
    const selectedCountry = countries.find(c => c.name === selectedCountryName);

    useEffect(() => {
        // Reset state/province when country changes
        setValue('state', undefined, { shouldValidate: true });
    }, [selectedCountryName, setValue]);

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0">
                <InteractiveMapPlaceholder pickup={address} />
            </div>
            <div className="absolute top-4 left-4 z-10 w-full max-w-md h-[calc(100%-2rem)] overflow-y-auto no-scrollbar">
                <Card className="shadow-2xl bg-background/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline text-primary">Where is your property?</CardTitle>
                        <CardDescription className="pt-2">Enter the address so guests can find you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Find Your Address</FormLabel>
                                <FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} value={field.value || ''} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={control} name="aptSuite" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment or floor number (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., Apt 4B" {...field} value={field.value || ''}/></FormControl>
                            </FormItem>
                        )}/>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="country" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country/Region</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Country"/></SelectTrigger>
                                            <SelectContent>
                                                {countries.map(country => (
                                                    <SelectItem key={country.code} value={country.name}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}/>
                             <FormField control={control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} value={field.value || ''}/></FormControl></FormItem>
                            )}/>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{selectedCountry?.stateLabel || 'State / Province'}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry || !selectedCountry.states}>
                                            <SelectTrigger><SelectValue placeholder={`Select ${selectedCountry?.stateLabel || '...'}`}/></SelectTrigger>
                                            <SelectContent>
                                                {selectedCountry?.states?.map(state => (
                                                    <SelectItem key={state.code} value={state.name}>
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={control} name="zip" render={({ field }) => (
                                <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} value={field.value || ''}/></FormControl></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const PhotosStep = () => {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control } = useFormContext<ListingFormValues>();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 5)); // Limit to 5 for preview
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <CardHeader className="p-0">
          <CardTitle className="text-3xl font-headline text-primary">What does your place look like?</CardTitle>
          <CardDescription className="pt-2">Upload at least 5 high-quality photos to attract guests. The first photo will be your cover image.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-8 space-y-4">
            <div 
                className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center min-h-64 flex flex-col justify-center items-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {photoPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {photoPreviews.map((src, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden group/photo">
                                <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); setPhotoPreviews(p => p.filter((_, i) => i !== index))}} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover/photo:opacity-100 transition-opacity"><X className="h-3 w-3"/></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">Drag and drop or</p>
                        <Button type="button">
                            Upload photos
                        </Button>
                    </>
                )}
                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                />
            </div>
            <p className="text-xs text-muted-foreground text-center">jpg/jpeg or png, maximum 47MB each</p>

            <FormField
              control={control}
              name="photoDescriptions"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Photo descriptions</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Briefly describe what's in the photos to improve accessibility and search results." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
        </CardContent>
      </div>
       <Card className="bg-muted/30 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-yellow-400" />What if I don't have professional photos?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">No problem! Photos taken with a smartphone can work well.</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Clean up the space before taking photos.</li>
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Take photos during the day for the best natural light.</li>
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Use landscape (horizontal) orientation.</li>
                </ul>
                <Button variant="link" asChild className="p-0 h-auto">
                    <a href="#" target="_blank" rel="noopener noreferrer">Read our guide to great photos</a>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
};

const DetailsStep = () => {
    const { control, setValue, getValues } = useFormContext<ListingFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "bedrooms",
    });

    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">Property Details</CardTitle>
                <CardDescription className="pt-2">Provide key details about the space.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8 space-y-6">
                 <div>
                    <h3 className="text-lg font-semibold">Where can people sleep?</h3>
                    <Accordion type="multiple" className="w-full mt-2">
                        {fields.map((field, index) => (
                             <AccordionItem value={`item-${index}`} key={field.id}>
                                <AccordionTrigger>Bedroom {index + 1}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm text-muted-foreground mb-2">Specify the number and type of beds in this room.</p>
                                    {/* Placeholder for bed selection UI */}
                                    <p>Bed selection controls go here.</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ beds: [] })} className="mt-2">
                        Add Bedroom
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={control} name="maxGuests"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>How many guests can stay?</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" size="icon" onClick={() => setValue('maxGuests', Math.max(1, (getValues('maxGuests') || 1) - 1))}><Minus className="h-4 w-4"/></Button>
                                    <Input className="text-center w-20" {...field} type="number" min="1" value={field.value || ''}/>
                                    <Button type="button" variant="outline" size="icon" onClick={() => setValue('maxGuests', ((getValues('maxGuests') || 0) + 1))}><Plus className="h-4 w-4"/></Button>
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                     <FormField
                        control={control} name="bathrooms"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>How many bathrooms are there?</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" size="icon" onClick={() => setValue('bathrooms', Math.max(0, (getValues('bathrooms') || 0) - 0.5))}><Minus className="h-4 w-4"/></Button>
                                    <Input className="text-center w-20" {...field} type="number" min="0" step="0.5" value={field.value || ''} />
                                    <Button type="button" variant="outline" size="icon" onClick={() => setValue('bathrooms', ((getValues('bathrooms') || 0) + 0.5))}><Plus className="h-4 w-4"/></Button>
                                </div>
                            </FormControl>
                             <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={control} name="allowChildren" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Do you allow children?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={control} name="offerCribs" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Do you offer cribs?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Apartment size (optional)</h3>
                    <div className="flex gap-2">
                         <FormField control={control} name="apartmentSize" render={({ field }) => (
                            <FormItem className="flex-grow"><FormControl><Input type="number" placeholder="e.g., 80" {...field} value={field.value || ''}/></FormControl><FormMessage/></FormItem>
                         )}/>
                         <FormField control={control} name="apartmentSizeUnit" render={({ field }) => (
                             <FormItem>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="sqm">m²</SelectItem><SelectItem value="sqft">ft²</SelectItem></SelectContent>
                                </Select>
                             </FormItem>
                         )}/>
                    </div>
                </div>
            </CardContent>
        </div>
    );
};

const amenitiesList = {
    "General": [{ id: "wifi", label: "Free Wifi", icon: Wifi }, { id: "ac", label: "Air conditioning", icon: Snowflake }, { id: "heating", label: "Heating", icon: Wind }],
    "Cooking and cleaning": [{ id: "kitchen", label: "Kitchen", icon: Utensils }, { id: "washing_machine", label: "Washing machine", icon: WashingMachine }],
    "Entertainment": [{ id: "tv", label: "Flat-screen TV", icon: Tv }, { id: "pool", label: "Swimming pool", icon: Waves }],
    "Outside and view": [{ id: "balcony", label: "Balcony", icon: Sun }, { id: "terrace", label: "Terrace", icon: Eye }, { id: "parking", label: "Free parking", icon: SquareParking }],
};

const AmenitiesStep = () => {
    const { control } = useFormContext<ListingFormValues>();
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">What can guests use at your place?</CardTitle>
                <CardDescription className="pt-2">Select all the amenities your property offers.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8">
                <FormField
                    control={control}
                    name="amenities"
                    render={() => (
                        <FormItem className="space-y-6">
                            {Object.entries(amenitiesList).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold mb-3">{category}</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {items.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={control}
                                                name="amenities"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm hover:bg-muted/50 transition-colors">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...(field.value || []), item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal flex items-center gap-2">
                                                                <item.icon className="h-5 w-5 text-primary" />
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </FormItem>
                    )}
                />
            </CardContent>
        </div>
    )
};

const ServicesStep = () => {
    const { control } = useFormContext<ListingFormValues>();
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">Services at your property</CardTitle>
                <CardDescription className="pt-2">Let guests know about additional services you offer.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8 space-y-8">
                <FormField control={control} name="breakfast" render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-lg">
                        <FormLabel className="text-lg font-semibold">
                            <div className="flex items-center gap-2"><Coffee className="h-5 w-5"/>Do you serve guests breakfast?</div>
                        </FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={control} name="parking" render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-lg">
                        <FormLabel className="text-lg font-semibold">
                             <div className="flex items-center gap-2"><ParkingCircle className="h-5 w-5"/>Is parking available to guests?</div>
                        </FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row sm:gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES_FREE" /></FormControl><FormLabel className="font-normal">Yes, free</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES_PAID" /></FormControl><FormLabel className="font-normal">Yes, paid</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </CardContent>
        </div>
    );
};

const languageList = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
    { id: 'de', label: 'German' },
    { id: 'zh', label: 'Chinese' },
    { id: 'pt', label: 'Portuguese' },
];

const LanguagesStep = () => {
    const { control } = useFormContext<ListingFormValues>();
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">What languages do you or your staff speak?</CardTitle>
                <CardDescription className="pt-2">Select all languages that you can use to communicate with guests.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8">
                <FormField
                    control={control}
                    name="languages"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold">Select languages</FormLabel>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                {languageList.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={control}
                                        name="languages"
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm hover:bg-muted/50 transition-colors">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item.id
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal flex items-center gap-2">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <Button variant="link" className="px-0 mt-2">Add additional languages</Button>
                        </FormItem>
                    )}
                />
            </CardContent>
        </div>
    )
};

const HostProfileStep = () => {
    const { control, watch, setValue } = useFormContext<ListingFormValues>();
    const noneChecked = watch("hostProfileHighlights.none");

    useEffect(() => {
        if (noneChecked) {
            setValue("hostProfileHighlights.property", false);
            setValue("hostProfileHighlights.host", false);
            setValue("hostProfileHighlights.neighborhood", false);
        }
    }, [noneChecked, setValue]);

    const handleCheckboxChange = (name: "property" | "host" | "neighborhood", checked: boolean) => {
        if (checked) {
            setValue("hostProfileHighlights.none", false);
        }
        setValue(`hostProfileHighlights.${name}`, checked);
    };

    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">Host profile</CardTitle>
                <CardDescription className="pt-2">Tell us what makes your place unique. You can write about this later.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8">
                <FormField
                    control={control}
                    name="hostProfileHighlights"
                    render={() => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-lg font-semibold">What makes your place special?</FormLabel>
                            <FormField
                                control={control} name="hostProfileHighlights.property"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={(checked) => handleCheckboxChange("property", checked as boolean)} disabled={noneChecked} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none"><FormLabel className="flex items-center gap-2"><HomeIcon className="h-5 w-5"/>The property</FormLabel><FormDescription>Architecture, garden, art, history, view, etc.</FormDescription></div>
                                    </FormItem>
                                )} />
                             <FormField
                                control={control} name="hostProfileHighlights.host"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={(checked) => handleCheckboxChange("host", checked as boolean)} disabled={noneChecked} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none"><FormLabel className="flex items-center gap-2"><User className="h-5 w-5"/>The host</FormLabel><FormDescription>Hobbies, work, helpfulness, breakfast, etc.</FormDescription></div>
                                    </FormItem>
                                )} />
                             <FormField
                                control={control} name="hostProfileHighlights.neighborhood"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={(checked) => handleCheckboxChange("neighborhood", checked as boolean)} disabled={noneChecked} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none"><FormLabel className="flex items-center gap-2"><MapIconLucide className="h-5 w-5"/>The neighborhood</FormLabel><FormDescription>Quiet, restaurants, safety, public transportation, etc.</FormDescription></div>
                                    </FormItem>
                                )} />
                             <FormField
                                control={control} name="hostProfileHighlights.none"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none"><FormLabel>None of the above / I'll add these later</FormLabel></div>
                                    </FormItem>
                                )} />
                        </FormItem>
                    )}
                />
            </CardContent>
        </div>
    )
};

const HouseRulesStep = () => {
    const { control } = useFormContext<ListingFormValues>();
    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-headline text-primary">House Rules</CardTitle>
                    <CardDescription className="pt-2">Set the rules for your property.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-8 space-y-6">
                    <FormField control={control} name="smokingAllowed" render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <FormLabel className="flex items-center gap-2 text-base">
                                <Smoking className="h-5 w-5"/>Smoking allowed
                            </FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={control} name="partiesAllowed" render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <FormLabel className="flex items-center gap-2 text-base">
                                <PartyPopper className="h-5 w-5"/>Parties/events allowed
                            </FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={control} name="petsAllowed" render={({ field }) => (
                        <FormItem className="space-y-3 p-4 border rounded-lg">
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <Dog className="h-5 w-5"/>Do you allow pets?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="YES" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="UPON_REQUEST" /></FormControl><FormLabel className="font-normal">Upon request</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Check-in</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="checkInFrom" render={({ field }) => (<FormItem><FormLabel>From</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl><SelectContent>{timeOptions.map(t => <SelectItem key={`cin-from-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                            <FormField control={control} name="checkInUntil" render={({ field }) => (<FormItem><FormLabel>Until</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl><SelectContent>{timeOptions.map(t => <SelectItem key={`cin-until-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Check-out</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="checkOutFrom" render={({ field }) => (<FormItem><FormLabel>From</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl><SelectContent>{timeOptions.map(t => <SelectItem key={`cout-from-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                            <FormField control={control} name="checkOutUntil" render={({ field }) => (<FormItem><FormLabel>Until</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl><SelectContent>{timeOptions.map(t => <SelectItem key={`cout-until-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>)} />
                        </div>
                    </div>
                </CardContent>
            </div>
            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-yellow-400" />What if my house rules change?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You can easily customize these rules later from your Partner Dashboard.</p>
                </CardContent>
            </Card>
        </div>
    );
};


export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const methods = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
        listingType: "FOR_RENT",
        amenities: [],
        bedrooms: [{beds: []}],
        maxGuests: 2,
        bathrooms: 1,
        apartmentSizeUnit: 'sqm',
        languages: [],
        smokingAllowed: false,
        partiesAllowed: false,
        petsAllowed: "NO",
        hostProfileHighlights: { property: false, host: false, neighborhood: false, none: false },
    }
  });


  const nextStep = async () => {
    const currentStepConfig = listingSteps[currentStep];
    const fields = currentStepConfig?.fields;
    const isValid = fields ? await methods.trigger(fields as (keyof ListingFormValues)[]) : true;

    if (!isValid) {
        toast({ title: "Please complete the required fields.", variant: "destructive" });
        return;
    }
    
    if (currentStep < listingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
    } else {
        toast({ title: "Listing Submitted (Demo)", description: "Your property is now pending review."});
        console.log(methods.getValues());
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleListingTypeSelect = (type: 'property' | 'car') => {
    if (type === 'property') {
      setCurrentStep(1);
    } else if (type === 'car') {
      router.push('/cars-for-sale/new');
    }
  };
  
  const fiveStages = [
    { title: 'Basic info', steps: [1, 2] },
    { title: 'Property setup', steps: [3, 4, 5, 6, 7, 8] },
    { title: 'Photos', steps: [9] },
    { title: 'Pricing and calendar', steps: [10] },
    { title: 'Review and complete', steps: [10] },
  ];

  const getCurrentStageIndex = () => {
    if (currentStep >= 1 && currentStep <= 2) return 0; // Basic info
    if (currentStep >= 3 && currentStep <= 8) return 1; // Property setup
    if (currentStep === 9) return 2; // Photos
    if (currentStep === 10) return 4; // Review
    return -1;
  }
  
  const currentStageIndex = getCurrentStageIndex();
  const fiveStageProgress = currentStageIndex >= 0 ? ((currentStageIndex) / (fiveStages.length - 1)) * 100 : 0;


  return (
    <div className="space-y-8">
      <FormProvider {...methods}>
      <Card className="shadow-lg rounded-lg overflow-hidden flex flex-col min-h-[90vh]">
        <CardHeader className="bg-primary/10 border-b z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-primary">List Your Property</h1>
            </div>
          </div>
          {currentStep > 0 && (
            <div className="pt-4">
              <div className="relative mb-2 h-2">
                <Progress value={fiveStageProgress} className="w-full h-2 absolute" />
              </div>
               <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {fiveStages.map((stage, index) => {
                      const isCompleted = currentStageIndex > index;
                      const isCurrent = currentStageIndex === index;
                      return (
                          <div key={stage.title} className="flex items-center gap-1">
                              {isCompleted && <CheckCircle className="h-4 w-4 text-green-500"/>}
                              <span className={cn(
                                  "font-medium",
                                  isCurrent && "text-primary",
                                  isCompleted && "text-green-600"
                              )}>
                                  {stage.title}
                              </span>
                          </div>
                      )
                  })}
               </div>
            </div>
          )}
        </CardHeader>
        <div className={cn("flex-grow flex flex-col", currentStep === 2 ? "p-0" : "p-6 md:p-8")}>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={currentStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn(
                        "w-full",
                         currentStep === 2 ? "h-full" : "max-w-4xl mx-auto my-auto"
                    )}
                 >
                    {currentStep === 0 && <ListingTypeStep onSelect={handleListingTypeSelect} />}
                    {currentStep === 1 && <NameStep />}
                    {currentStep === 2 && <LocationStep />}
                    {currentStep === 3 && <DetailsStep />}
                    {currentStep === 4 && <HostProfileStep />}
                    {currentStep === 5 && <AmenitiesStep />}
                    {currentStep === 6 && <ServicesStep />}
                    {currentStep === 7 && <LanguagesStep />}
                    {currentStep === 8 && <HouseRulesStep />}
                    {currentStep === 9 && <PhotosStep />}
                    {currentStep === 10 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Step {currentStep} content goes here.</h2>
                            <p className="text-muted-foreground">{listingSteps[currentStep].title}</p>
                        </div>
                    )}
                 </motion.div>
            </AnimatePresence>
        </div>
        <CardFooter className="border-t p-4 flex justify-between bg-muted/50 mt-auto z-10">
            {currentStep === 0 ? (
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        <span><ArrowLeft className="mr-2 h-4 w-4" /> Back</span>
                    </Link>
                </Button>
            ) : (
                <Button variant="outline" onClick={prevStep}>
                    <span><ArrowLeft className="mr-2 h-4 w-4"/> Back</span>
                </Button>
            )}
            {currentStep > 0 && currentStep < listingSteps.length - 1 && (
                <Button onClick={nextStep}>
                    Continue
                </Button>
            )}
            {currentStep === listingSteps.length - 1 && (
                <Button onClick={nextStep}>
                    Publish Listing
                </Button>
            )}
        </CardFooter>
      </Card>
      </FormProvider>
    </div>
  );
}
