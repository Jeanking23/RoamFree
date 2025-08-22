// src/app/cars-for-sale/new/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, UploadCloud, Send, X, Settings2, Droplets, Palette, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


const carForSaleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  make: z.string({ required_error: "Make is required." }),
  model: z.string({ required_error: "Model is required." }),
  year: z.coerce.number({ required_error: "Year is required." }).min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number({ required_error: "Mileage is required." }).min(0),
  price: z.coerce.number({ required_error: "Price is required." }).positive(),
  vin: z.string().length(17, "VIN must be 17 characters."),
  engine: z.string().min(2, "Engine details are required."),
  transmission: z.string().min(2, "Transmission type is required."),
  fuelType: z.string().min(2, "Fuel type is required."),
  exteriorColor: z.string().min(2, "Exterior color is required."),
  interiorColor: z.string().min(2, "Interior color is required."),
  features: z.array(z.object({ value: z.string() })).optional(),
  description: z.string().min(20, "Please provide a more detailed description."),
});

type CarForSaleFormValues = z.infer<typeof carForSaleSchema>;

const listingSteps = [
  { id: "basics", title: "The Basics", fields: ["title", "make", "model", "year", "vin"] },
  { id: "details", title: "Vehicle Details", fields: ["mileage", "engine", "transmission", "fuelType", "exteriorColor", "interiorColor"] },
  { id: "features", title: "Features & Description", fields: ["features", "description"] },
  { id: "photos", title: "Photos" },
  { id: "pricing", title: "Set Your Price", fields: ["price"] },
  { id: "publish", title: "Review & Publish" },
];

const carMakesAndModels: Record<string, string[]> = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'],
  'Ford': ['F-150', 'Explorer', 'Mustang', 'Escape', 'Bronco'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Traverse'],
  'Nissan': ['Altima', 'Rogue', 'Sentra', 'Titan', 'Frontier'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe'],
  'Kia': ['Forte', 'Optima', 'Sorento', 'Telluride'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
};
const carMakes = Object.keys(carMakesAndModels);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
const carColors = ["Black", "White", "Silver", "Gray", "Red", "Blue", "Brown", "Green", "Beige", "Gold", "Yellow", "Orange", "Purple", "Other"];

// Step Components
const BasicsStep = () => {
  const { control, watch, setValue } = useForm<CarForSaleFormValues>();
  const selectedMake = watch("make");
  const availableModels = selectedMake ? carMakesAndModels[selectedMake] : [];

  return (
    <div>
      <CardHeader className="p-0 text-center md:text-left">
        <CardTitle className="text-3xl font-headline text-primary">Let's start with the basics</CardTitle>
        <CardDescription className="pt-2">Enter the main details of the car you are listing for sale.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-8 space-y-6">
        <FormField control={control} name="title" render={({ field }) => (<FormItem><FormLabel>Listing Title</FormLabel><FormControl><Input placeholder="e.g., Well-maintained Toyota Corolla 2018" {...field}/></FormControl><FormMessage/></FormItem>)}/>
        <div className="grid md:grid-cols-3 gap-4">
          <FormField control={control} name="make" render={({ field }) => (
            <FormItem>
                <FormLabel>Make</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); setValue('model', ''); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Make"/></SelectTrigger></FormControl>
                    <SelectContent>
                        {carMakes.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage/>
            </FormItem>
          )}/>
          <FormField control={control} name="model" render={({ field }) => (
            <FormItem>
                <FormLabel>Model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedMake}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Model"/></SelectTrigger></FormControl>
                    <SelectContent>
                        {availableModels.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage/>
            </FormItem>
          )}/>
          <FormField control={control} name="year" render={({ field }) => (
            <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : undefined}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Year"/></SelectTrigger></FormControl>
                    <SelectContent>
                        {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage/>
            </FormItem>
          )}/>
        </div>
        <FormField control={control} name="vin" render={({ field }) => (<FormItem><FormLabel>VIN (Vehicle Identification Number)</FormLabel><FormControl><Input placeholder="17-character VIN" {...field}/></FormControl><FormMessage/></FormItem>)}/>
      </CardContent>
    </div>
  );
};

const DetailsStep = () => {
    const { control } = useFormContext<CarForSaleFormValues>();
     return (
    <div>
      <CardHeader className="p-0 text-center md:text-left">
        <CardTitle className="text-3xl font-headline text-primary">Tell us more about the car</CardTitle>
        <CardDescription className="pt-2">Provide the specifications and condition details.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-8 space-y-6">
        <FormField control={control} name="mileage" render={({ field }) => (<FormItem><FormLabel>Mileage</FormLabel><FormControl><Input type="number" placeholder="45000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
         <div className="grid md:grid-cols-3 gap-4">
            <FormField control={control} name="engine" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Settings2 className="h-4 w-4"/>Engine</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Engine Type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="4-Cylinder">4-Cylinder</SelectItem><SelectItem value="6-Cylinder">6-Cylinder</SelectItem><SelectItem value="8-Cylinder">8-Cylinder</SelectItem><SelectItem value="Electric">Electric</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
            <FormField control={control} name="transmission" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Settings2 className="h-4 w-4"/>Transmission</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Transmission"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
            <FormField control={control} name="fuelType" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Droplets className="h-4 w-4"/>Fuel Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Fuel Type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Gasoline">Gasoline</SelectItem><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Electric">Electric</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField control={control} name="exteriorColor" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Palette className="h-4 w-4"/>Exterior Color</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a color"/></SelectTrigger></FormControl><SelectContent>{carColors.map(color => <SelectItem key={`ext-${color}`} value={color}>{color}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)}/>
            <FormField control={control} name="interiorColor" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Palette className="h-4 w-4"/>Interior Color</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a color"/></SelectTrigger></FormControl><SelectContent>{carColors.map(color => <SelectItem key={`int-${color}`} value={color}>{color}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)}/>
        </div>
      </CardContent>
    </div>
  );
};

// ... other step components would be created similarly ...

export default function ListCarPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const router = useRouter();

  const methods = useForm<CarForSaleFormValues>({
    resolver: zodResolver(carForSaleSchema),
    defaultValues: { features: [] },
  });

  const { fields: features, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: methods.control, name: "features",
  });
  const [featureInput, setFeatureInput] = useState("");

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPhotoPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddFeature = () => { if (featureInput.trim()) { appendFeature({ value: featureInput.trim() }); setFeatureInput(""); } };

  const onFinalSubmit = (data: CarForSaleFormValues) => {
    console.log("Car for Sale Submitted:", { ...data, photos: photoPreviews });
    toast({ title: "Listing Submitted!", description: "Your car has been listed for sale." });
    router.push('/cars-for-sale');
  };
  
  const nextStep = async () => {
    const fields = listingSteps[currentStep].fields;
    const isValid = fields ? await methods.trigger(fields as any) : true;

    if (!isValid) {
      toast({ title: "Please complete all required fields.", variant: "destructive" });
      return;
    }

    if (currentStep < listingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      methods.handleSubmit(onFinalSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / listingSteps.length) * 100;
  
  const allValues = methods.getValues();

  return (
    <div className="space-y-8">
      <FormProvider {...methods}>
        <Card className="shadow-lg rounded-lg overflow-hidden flex flex-col min-h-[85vh]">
          <CardHeader className="bg-primary/10 border-b z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CarFront className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-semibold text-primary">List Your Car For Sale</h1>
              </div>
            </div>
            <div className="pt-4">
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {listingSteps.map((step, index) => (
                  <span key={step.id} className={cn("font-medium", index === currentStep && "text-primary", index < currentStep && "text-primary/70")}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
          <div className="p-6 md:p-8 flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full max-w-4xl mx-auto"
              >
                {currentStep === 0 && <BasicsStep />}
                {currentStep === 1 && <DetailsStep />}
                {currentStep === 2 && (
                    <div>
                        <CardHeader className="p-0 text-center md:text-left">
                            <CardTitle className="text-3xl font-headline text-primary">Describe your car</CardTitle>
                            <CardDescription className="pt-2">Add key features and a compelling description.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-8 space-y-6">
                            <FormField control={methods.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the vehicle's features, condition, and history." rows={5} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormItem>
                                <FormLabel>Key Features</FormLabel>
                                <div className="flex gap-2">
                                    <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="e.g., Rearview Camera, Bluetooth" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}/>
                                    <Button type="button" onClick={handleAddFeature}>Add</Button>
                                </div>
                                <div className="mt-2 space-y-2">
                                    {features.map((field, index) => (
                                        <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                            <span>{field.value}</span>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFeature(index)}><X className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </FormItem>
                        </CardContent>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <CardHeader className="p-0 text-center md:text-left">
                            <CardTitle className="text-3xl font-headline text-primary">Upload Photos</CardTitle>
                            <CardDescription className="pt-2">A picture is worth a thousand words. Add high-quality photos to attract buyers.</CardDescription>
                        </CardHeader>
                         <CardContent className="p-0 pt-8">
                             <FormItem>
                                <FormLabel className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Photos</FormLabel>
                                <FormControl><Input type="file" accept="image/*" multiple onChange={handlePhotoUpload} /></FormControl>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                                    {photoPreviews.map((src, index) => (
                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden"><Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" /></div>
                                    ))}
                                </div>
                            </FormItem>
                         </CardContent>
                    </div>
                )}
                 {currentStep === 4 && (
                    <div>
                        <CardHeader className="p-0 text-center md:text-left">
                            <CardTitle className="text-3xl font-headline text-primary">Set Your Price</CardTitle>
                            <CardDescription className="pt-2">What is the asking price for your car?</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-8">
                           <FormField control={methods.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="15000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        </CardContent>
                    </div>
                )}
                {currentStep === 5 && (
                    <div>
                        <CardHeader className="p-0 text-center">
                            <CardTitle className="text-3xl font-headline text-primary">Review & Publish</CardTitle>
                            <CardDescription className="pt-2">Review your listing details before publishing.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-8 space-y-4">
                            <p><strong>Title:</strong> {allValues.title}</p>
                            <p><strong>Make:</strong> {allValues.make}</p>
                            <p><strong>Model:</strong> {allValues.model}</p>
                            <p><strong>Year:</strong> {allValues.year}</p>
                            <p><strong>Price:</strong> ${allValues.price?.toLocaleString()}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                {photoPreviews.map((src, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden"><Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" /></div>
                                ))}
                            </div>
                        </CardContent>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <CardFooter className="border-t p-4 flex justify-between bg-muted/50 mt-auto z-10">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={nextStep}>
              {currentStep === listingSteps.length - 1 ? <><Send className="mr-2 h-4 w-4"/>Publish Listing</> : 'Continue'}
            </Button>
          </CardFooter>
        </Card>
      </FormProvider>
    </div>
  );
}
