
// src/app/list-property/page.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building, Info, Lightbulb, CheckCircle, MapPin, HomeIcon, Car, Bed, Bath, Users, Minus, Plus } from "lucide-react";
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
});
type ListingFormValues = z.infer<typeof listingFormSchema>;


const listingSteps = [
  { id: "type", title: "Select Type" },
  { id: "basics", title: "Basic Info", fields: ["propertyName", "propertyType", "listingType", "bedrooms", "bathrooms", "maxGuests"] },
  { id: "location", title: "Location" },
  { id: "details", title: "Details" },
  { id: "photos", title: "Photos" },
  { id: "pricing", title: "Pricing & Availability" },
  { id: "publish", title: "Publish" },
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
    const { watch } = useFormContext<ListingFormValues>();
    const address = watch("address");

    return (
        <div className="grid md:grid-cols-2 gap-8 h-full">
            <Card className="flex flex-col">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Where is your property?</CardTitle>
                    <CardDescription>Enter the address so guests can find you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow">
                     <FormField control={useFormContext().control} name="address" render={({ field }) => (
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
                    <FormField control={useFormContext().control} name="aptSuite" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Apartment or floor number (Optional)</FormLabel>
                             <FormControl><Input placeholder="e.g., Apt 3B" {...field} value={field.value || ''}/></FormControl>
                             <FormMessage/>
                         </FormItem>
                     )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={useFormContext().control} name="country" render={({ field }) => (
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
                         <FormField control={useFormContext().control} name="city" render={({ field }) => (
                             <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl><Input placeholder="e.g., Camden" {...field} value={field.value || ''}/></FormControl>
                                <FormMessage/>
                             </FormItem>
                         )}/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={useFormContext().control} name="state" render={({ field }) => (
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
                         <FormField control={useFormContext().control} name="zip" render={({ field }) => (
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
            <div className="h-full min-h-[400px] md:min-h-0 rounded-lg overflow-hidden">
                <InteractiveMapPlaceholder pickup={address} />
            </div>
        </div>
    );
};


export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // State for Property Details step
  const [bedrooms, setBedrooms] = useState([{ id: 1, beds: [{ type: 'Full', count: 1 }] }]);
  const [guests, setGuests] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);


  const methods = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
        listingType: "FOR_RENT"
    }
  });


  const nextStep = async () => {
    // Trigger validation for the current step's fields before proceeding
    const currentStepConfig = listingSteps.find((_, index) => index === currentStep);
    const fields = currentStepConfig?.fields;
    const isValid = fields ? await methods.trigger(fields as any) : true;

    if (!isValid) {
        toast({ title: "Please complete the required fields.", variant: "destructive" });
        return;
    }
    
    if (currentStep < listingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
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
      setCurrentStep(1); // Move to the next step which is 'basics'
    } else if (type === 'car') {
      router.push('/cars-for-sale/new');
    }
  };
  
  const progress = ((currentStep) / (listingSteps.length - 1)) * 100;

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
               <Progress value={progress} className="w-full h-2" />
               <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {listingSteps.slice(1).map((step, index) => (
                      <span key={step.id} className={cn(
                          "font-medium",
                          (index + 1) === currentStep && "text-primary",
                          (index + 1) < currentStep && "text-primary/70"
                      )}>
                          {step.title}
                      </span>
                  ))}
               </div>
            </div>
          )}
        </CardHeader>
        <div className="p-6 md:p-8 flex-grow flex flex-col">
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
                    {currentStep === 3 && (
                        <div>
                            <CardHeader className="p-0 text-center md:text-left">
                                <CardTitle className="text-3xl font-headline text-primary">Property Details</CardTitle>
                                <CardDescription className="pt-2">Tell us about the sleeping arrangements and guest capacity.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 pt-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Where can people sleep?</h3>
                                    <div className="space-y-4">
                                        {bedrooms.map((room, index) => (
                                            <Card key={room.id} className="p-4 bg-muted/50">
                                                <p className="font-semibold">Bedroom {index + 1}</p>
                                                {/* Add bed type/count selection here */}
                                                <p className="text-sm text-muted-foreground">1 full bed</p>
                                            </Card>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setBedrooms(prev => [...prev, { id: prev.length + 1, beds: [] }])}>Add bedroom</Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">How many guests can stay?</Label>
                                        <div className="flex items-center gap-2">
                                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(p => Math.max(1, p - 1))}><Minus className="h-4 w-4" /></Button>
                                            <Input type="number" readOnly value={guests} className="w-16 h-8 text-center" />
                                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setGuests(p => p + 1)}><Plus className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">How many bathrooms are there?</Label>
                                         <div className="flex items-center gap-2">
                                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setBathrooms(p => Math.max(0.5, p - 0.5))}><Minus className="h-4 w-4" /></Button>
                                            <Input type="number" readOnly value={bathrooms} className="w-16 h-8 text-center" />
                                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setBathrooms(p => p + 0.5)}><Plus className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                                 <div className="space-y-4 pt-4 border-t">
                                     <div className="flex items-center space-x-2">
                                         <Checkbox id="allow-children"/>
                                         <Label htmlFor="allow-children">Do you allow children?</Label>
                                     </div>
                                      <div className="flex items-center space-x-2">
                                         <Checkbox id="offer-cribs"/>
                                         <Label htmlFor="offer-cribs">Do you offer cribs?</Label>
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <Label>Apartment size (Optional)</Label>
                                         <Input type="number" className="w-32"/>
                                         <Select defaultValue="sqft">
                                             <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="sqft">sq ft</SelectItem>
                                                 <SelectItem value="sqm">sq m</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     </div>
                                 </div>
                            </CardContent>
                        </div>
                    )}
                    {currentStep > 3 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Step {currentStep + 1} content goes here.</h2>
                        </div>
                    )}
                 </motion.div>
            </AnimatePresence>
        </div>
        <CardFooter className="border-t p-4 flex justify-between bg-muted/50 mt-auto z-10">
            {currentStep === 0 ? (
                <Button variant="outline" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Exit
                    </Link>
                </Button>
            ) : currentStep === 1 ? (
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                </Button>
            ) : (
                <Button variant="outline" onClick={prevStep} disabled={currentStep < 1}>
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back
                </Button>
            )}
            {currentStep !== 0 && (
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
