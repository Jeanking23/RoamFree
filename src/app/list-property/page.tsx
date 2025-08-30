// src/app/list-property/page.tsx
'use client';

import { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building, Info, Lightbulb, CheckCircle, MapPin, HomeIcon, Car, Bed, Bath, Users, Minus, Plus, Wifi, Wind, Snowflake, Utensils, WashingMachine, Tv, Waves, Sun, Eye, SquareParking, UploadCloud, Smoking, PartyPopper, Dog, Camera as CameraIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import InteractiveMapPlaceholder from "@/components/map/interactive-map-placeholder";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";


const listingFormSchema = z.object({
  propertyName: z.string().min(5, "Property name must be at least 5 characters."),
  propertyType: z.string({ required_error: "Please select a property type." }),
  listingType: z.enum(["FOR_RENT", "FOR_SALE"]),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative.").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative.").optional(),
  maxGuests: z.coerce.number().min(1, "Must accommodate at least 1 guest.").optional(),
  address: z.string().optional(),
  aptSuite: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});
type ListingFormValues = z.infer<typeof listingFormSchema>;


const listingSteps = [
  // Step 0 - Not in progress bar
  { id: "type", title: "Select Type" }, 
  // Progress bar steps start here (index 1)
  { id: "basics", title: "Basic info", fields: ["propertyName", "propertyType", "listingType", "bedrooms", "bathrooms", "maxGuests"] },
  { id: "setup", title: "Property setup", fields: ["address"] },
  { id: "photos", title: "Photos" },
  { id: "pricing", title: "Pricing and calendar" },
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
    const listingType = watch("listingType");
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
                     {showPropertyDetails && (
                        <div className="grid grid-cols-3 gap-4 pt-2">
                             <FormField control={control} name="bedrooms" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1"><Bed className="h-4 w-4"/>Bedrooms</FormLabel>
                                    <FormControl><Input type="number" min="0" placeholder="e.g., 3" {...field} /></FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={control} name="bathrooms" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1"><Bath className="h-4 w-4"/>Bathrooms</FormLabel>
                                    <FormControl><Input type="number" min="0" step="0.5" placeholder="e.g., 2.5" {...field} /></FormControl>
                                </FormItem>
                            )}/>
                            {listingType === 'FOR_RENT' && (
                                <FormField control={control} name="maxGuests" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4"/>Guests</FormLabel>
                                        <FormControl><Input type="number" min="1" placeholder="e.g., 6" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                            )}
                        </div>
                    )}
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
    const { watch, control, setValue } = useFormContext<ListingFormValues>();
    const address = watch("address");

    return (
        <div className="relative h-full w-full min-h-[60vh] -m-6 md:-m-8">
            <div className="absolute inset-0 z-0">
                <InteractiveMapPlaceholder 
                    pickup={address} 
                    onMapClick={(latLng) => {
                        console.log("Map clicked at:", latLng);
                        setValue("address", `Approx. location at ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`, { shouldValidate: true });
                        toast({ title: "Location Updated", description: "Address updated from map pin." });
                    }}
                />
            </div>
            <div className="relative z-10 p-6 md:p-8 h-full flex items-start">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-primary">Where is your property?</CardTitle>
                        <CardDescription>Enter the address so guests can find you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <FormField control={control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="address-search">Find Your Address</FormLabel>
                                <FormControl>
                                    <Input 
                                        id="address-search" 
                                        placeholder="Start typing your street address..." 
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={control} name="aptSuite" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apartment or floor number (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., Apt 3B" {...field} value={field.value || ''}/></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="country" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country/Region</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Country"/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="US">United States</SelectItem>
                                            <SelectItem value="CA">Canada</SelectItem>
                                            <SelectItem value="CM">Cameroon</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input placeholder="e.g., Camden" {...field} value={field.value || ''}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select State"/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="DE">Delaware</SelectItem>
                                            <SelectItem value="CA">California</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={control} name="zip" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl><Input placeholder="e.g., 19934" {...field} value={field.value || ''}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="update-pin" defaultChecked />
                            <Label htmlFor="update-pin" className="text-sm font-normal">Update the address by moving the pin on the map.</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">If the pin isn't quite right, you can drag it to the correct location.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const DetailsStep = () => {
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">Services at your property</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-8 space-y-8">
                <FormItem>
                    <FormLabel className="text-lg font-semibold">Do you serve guests breakfast?</FormLabel>
                    <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
                        <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="breakfast-yes"/>
                            <Label htmlFor="breakfast-yes" className="font-normal">Yes</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="breakfast-no"/>
                            <Label htmlFor="breakfast-no" className="font-normal">No</Label>
                        </FormItem>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <FormLabel className="text-lg font-semibold">Is parking available to guests?</FormLabel>
                    <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
                        <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-free" id="parking-yes-free"/>
                            <Label htmlFor="parking-yes-free" className="font-normal">Yes, free</Label>
                        </FormItem>
                         <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-paid" id="parking-yes-paid"/>
                            <Label htmlFor="parking-yes-paid" className="font-normal">Yes, paid</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="parking-no"/>
                            <Label htmlFor="parking-no" className="font-normal">No</Label>
                        </FormItem>
                    </RadioGroup>
                </FormItem>
            </CardContent>
        </div>
    );
};


const amenitiesList = {
  general: [
    { id: "Wifi", label: "Free Wifi", icon: Wifi },
    { id: "Air conditioning", label: "Air conditioning", icon: Snowflake },
    { id: "Heating", label: "Heating", icon: Wind },
    { id: "Parking", label: "Parking", icon: SquareParking },
  ],
  cookingCleaning: [
    { id: "Kitchen", label: "Kitchen", icon: Utensils },
    { id: "Washing machine", label: "Washing machine", icon: WashingMachine },
  ],
  entertainment: [
    { id: "Flat-screen TV", label: "Flat-screen TV", icon: Tv },
    { id: "Swimming pool", label: "Swimming pool", icon: Waves },
  ],
  outsideView: [
    { id: "Balcony", label: "Balcony", icon: Sun },
    { id: "Terrace", label: "Terrace", icon: Eye },
  ],
};

const AmenitiesStep = () => {
    const { control } = useFormContext<ListingFormValues>();
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">What amenities do you offer?</CardTitle>
                <CardDescription className="pt-2">Select all the amenities available to guests.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-8">
                 <FormField
                    control={control}
                    name="amenities"
                    render={() => (
                        <FormItem className="space-y-6">
                            {Object.entries(amenitiesList).map(([categoryKey, amenities]) => (
                                <div key={categoryKey}>
                                    <h3 className="text-lg font-semibold capitalize mb-3">{categoryKey.replace(/([A-Z])/g, ' $1')}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {amenities.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={control}
                                            name="amenities"
                                            render={({ field }) => {
                                            return (
                                                <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                                                >
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
                                                <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                                    <item.icon className="h-5 w-5 text-muted-foreground" />
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
    );
};

const PhotosStep = () => {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center h-64 flex flex-col justify-center items-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop or</p>
                <Button type="button">
                    Upload photos
                </Button>
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

            {photoPreviews.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2">Photo Previews ({photoPreviews.length}/5):</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {photoPreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden"><Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" /></div>
                        ))}
                    </div>
                </div>
            )}
            <FormItem>
                <FormLabel>Photo descriptions</FormLabel>
                <FormControl>
                    <Textarea placeholder="Briefly describe what's in the photos to improve accessibility and search results." rows={3} />
                </FormControl>
                <FormMessage />
            </FormItem>
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


const languages = ["Chinese", "English", "French", "Portuguese", "Spanish"];
const LanguagesStep = () => {
    return (
        <div>
            <CardHeader className="p-0 text-center md:text-left">
                <CardTitle className="text-3xl font-headline text-primary">What languages do you or your staff speak?</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-8">
                <FormItem>
                    <FormLabel className="text-lg font-semibold">Select languages</FormLabel>
                    <div className="space-y-2 pt-2">
                        {languages.map(lang => (
                             <FormItem key={lang} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox />
                                </FormControl>
                                <FormLabel className="font-normal">{lang}</FormLabel>
                             </FormItem>
                        ))}
                    </div>
                     <Button variant="link" className="px-0 mt-2" onClick={() => toast({ title: "Feature coming soon!" })}>
                        Add additional languages
                    </Button>
                </FormItem>
            </CardContent>
        </div>
    );
};

const HouseRulesStep = () => {
    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
                <CardHeader className="p-0 text-center md:text-left">
                    <CardTitle className="text-3xl font-headline text-primary">House Rules</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-8 space-y-6">
                    <div className="space-y-4">
                        <FormItem className="flex items-center justify-between p-3 border rounded-md">
                            <FormLabel className="font-normal flex items-center gap-2"><Smoking className="h-4 w-4"/>Smoking allowed</FormLabel>
                            <FormControl><Switch /></FormControl>
                        </FormItem>
                         <FormItem className="flex items-center justify-between p-3 border rounded-md">
                            <FormLabel className="font-normal flex items-center gap-2"><PartyPopper className="h-4 w-4"/>Parties/events allowed</FormLabel>
                            <FormControl><Switch /></FormControl>
                        </FormItem>
                    </div>
                    <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2"><Dog className="h-5 w-5"/>Do you allow pets?</FormLabel>
                        <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="yes" id="pets-yes"/><Label htmlFor="pets-yes" className="font-normal">Yes</Label></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="request" id="pets-request"/><Label htmlFor="pets-request" className="font-normal">Upon request</Label></FormItem>
                            <FormItem className="flex items-center space-x-2"><RadioGroupItem value="no" id="pets-no"/><Label htmlFor="pets-no" className="font-normal">No</Label></FormItem>
                        </RadioGroup>
                    </FormItem>
                    <div className="space-y-4 pt-4 border-t">
                        <div>
                            <h3 className="text-base font-semibold">Check-in</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <Select><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeOptions.map(t => <SelectItem key={`cin-from-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Until</FormLabel>
                                    <Select><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeOptions.map(t => <SelectItem key={`cin-to-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                                </FormItem>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-base font-semibold">Check-out</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                 <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <Select><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeOptions.map(t => <SelectItem key={`cout-from-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Until</FormLabel>
                                    <Select><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{timeOptions.map(t => <SelectItem key={`cout-to-${t}`} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-yellow-400" />What if my house rules change?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You can easily customize these rules later from your partner dashboard. Be sure to inform any confirmed guests of changes.</p>
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
    }
  });


  const nextStep = async () => {
    // Trigger validation for the current step's fields before proceeding
    const currentStepConfig = listingSteps[currentStep];
    const fields = currentStepConfig?.fields;
    const isValid = fields ? await methods.trigger(fields as any) : true;

    if (!isValid) {
        toast({ title: "Please complete the required fields.", variant: "destructive" });
        return;
    }
    
    // Logic to jump over steps for "Land" property type
    const propertyType = methods.getValues("propertyType");
    let nextStepIndex = currentStep + 1;
    if (propertyType === 'Land' && (currentStep >= 3 && currentStep <= 7)) { // Steps for Details, Amenities, Languages, House Rules
      nextStepIndex = 8; // Jump to Pricing & Availability
    }

    if (nextStepIndex < listingSteps.length) {
        setCurrentStep(nextStepIndex);
    } else {
        toast({ title: "Listing Submitted (Demo)", description: "Your property is now pending review."});
        console.log(methods.getValues());
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // Logic to jump back correctly if coming from a skipped sequence
      const propertyType = methods.getValues("propertyType");
      let prevStepIndex = currentStep - 1;
      if (propertyType === 'Land' && currentStep === 8) {
        prevStepIndex = 2; // Jump back to Location
      }
      setCurrentStep(prevStepIndex);
    }
  };
  
  const handleListingTypeSelect = (type: 'property' | 'car') => {
    if (type === 'property') {
      setCurrentStep(1); // Move to the next step which is 'basics'
    } else if (type === 'car') {
      router.push('/cars-for-sale/new');
    }
  };
  
  const fiveStages = [
    { title: 'Basic info', steps: [1] },
    { title: 'Property setup', steps: [2] }, // Simplified: just location for now
    { title: 'Photos', steps: [3] },
    { title: 'Pricing and calendar', steps: [4] },
    { title: 'Review and complete', steps: [5] }
  ];

  const getCurrentStageIndex = () => {
    for (let i = 0; i < fiveStages.length; i++) {
        if (fiveStages[i].steps.includes(currentStep)) {
            return i;
        }
    }
    return -1; // Should not happen if step is > 0
  }
  
  const currentStageIndex = getCurrentStageIndex();
  const fiveStageProgress = currentStageIndex >= 0 ? ((currentStageIndex) / (fiveStages.length - 1)) * 100 : 0;


  return (
    <div className="space-y-8">
      <FormProvider {...methods}>
      <Card className="shadow-lg rounded-lg overflow-hidden flex flex-col h-[85vh]">
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
        <div className={cn("p-6 md:p-8 flex-grow flex flex-col", currentStep === 2 ? "p-0 md:p-0" : "")}>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={currentStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-grow flex flex-col justify-center"
                 >
                    {currentStep === 0 && <ListingTypeStep onSelect={handleListingTypeSelect} />}
                    {currentStep === 1 && <NameStep />}
                    {currentStep === 2 && <LocationStep />}
                    {currentStep === 3 && <PhotosStep />}
                    {currentStep > 3 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Step {currentStep + 1} content goes here.</h2>
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
            {currentStep > 0 && (
                <Button onClick={nextStep}>
                    {currentStep === listingSteps.length - 1 ? 'Publish Listing' : 'Continue'}
                </Button>
            )}
        </CardFooter>
      </Card>
      </FormProvider>
    </div>
  );
}
