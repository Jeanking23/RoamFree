
// src/app/cars-for-sale/new/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, DollarSign, Gauge, CalendarDays, UploadCloud, Send, X, Settings2, Droplets, Palette, Users, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';

const carForSaleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  make: z.string({ required_error: "Make is required." }),
  model: z.string({ required_error: "Model is required." }),
  year: z.coerce.number({ required_error: "Year is required." }).min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0),
  price: z.coerce.number().positive(),
  vin: z.string().length(17, "VIN must be 17 characters."),
  engine: z.string().min(2, "Engine details are required."),
  transmission: z.string().min(2, "Transmission type is required."),
  fuelType: z.string().min(2, "Fuel type is required."),
  exteriorColor: z.string().min(2, "Exterior color is required."),
  interiorColor: z.string().min(2, "Interior color is required."),
  features: z.array(z.object({ value: z.string() })).optional(),
  description: z.string().min(20, "Please provide a more detailed description."),
  photos: z.array(z.string()).optional(),
});

const carForRentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  pricePerDay: z.coerce.number().positive("Daily price is required."),
  pricePerHour: z.coerce.number().positive("Hourly price is required.").optional(),
  pricePerWeek: z.coerce.number().positive("Weekly price is required.").optional(),
  seats: z.coerce.number().min(1, "Seating capacity is required."),
  transmission: z.string().min(2, "Transmission type is required."),
  mileage: z.coerce.number().min(0, "Mileage is required."),
  fuelPolicy: z.string().min(2, "Fuel policy is required."),
  pickupLocations: z.array(z.object({ value: z.string() })).min(1, "At least one pickup location is required."),
  features: z.array(z.object({ value: z.string() })).optional(),
  description: z.string().min(20, "Please provide a description.").max(500),
  ecoFriendly: z.boolean().default(false),
  insuranceIncluded: z.boolean().default(true),
});

type CarForSaleFormValues = z.infer<typeof carForSaleSchema>;
type CarForRentFormValues = z.infer<typeof carForRentSchema>;

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


export default function ListCarPage() {
  const [salePhotoPreviews, setSalePhotoPreviews] = useState<string[]>([]);
  const [rentPhotoPreviews, setRentPhotoPreviews] = useState<string[]>([]);
  
  const [saleFeatureInput, setSaleFeatureInput] = useState("");
  const [rentFeatureInput, setRentFeatureInput] = useState("");
  const [rentLocationInput, setRentLocationInput] = useState("");

  const saleForm = useForm<CarForSaleFormValues>({ 
      resolver: zodResolver(carForSaleSchema),
      defaultValues: { features: [] } 
  });
  const rentForm = useForm<CarForRentFormValues>({ 
      resolver: zodResolver(carForRentSchema),
      defaultValues: { features: [], pickupLocations: [], ecoFriendly: false, insuranceIncluded: true }
  });
  
  const { fields: saleFeatures, append: appendSaleFeature, remove: removeSaleFeature } = useFieldArray({
    control: saleForm.control, name: "features",
  });
  const { fields: rentFeatures, append: appendRentFeature, remove: removeRentFeature } = useFieldArray({
    control: rentForm.control, name: "features",
  });
  const { fields: rentLocations, append: appendRentLocation, remove: removeRentLocation } = useFieldArray({
    control: rentForm.control, name: "pickupLocations",
  });

  const selectedMake = saleForm.watch("make");
  const availableModels = selectedMake ? carMakesAndModels[selectedMake] : [];

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const files = event.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setter(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleAddSaleFeature = () => { if (saleFeatureInput.trim()) { appendSaleFeature({ value: saleFeatureInput.trim() }); setSaleFeatureInput(""); } };
  const handleAddRentFeature = () => { if (rentFeatureInput.trim()) { appendRentFeature({ value: rentFeatureInput.trim() }); setRentFeatureInput(""); } };
  const handleAddRentLocation = () => { if (rentLocationInput.trim()) { appendRentLocation({ value: rentLocationInput.trim() }); setRentLocationInput(""); } };


  const onSaleSubmit = (data: CarForSaleFormValues) => {
    console.log("Car for Sale Submitted:", data, { photos: salePhotoPreviews });
    toast({ title: "Listing Submitted!", description: "Your car has been listed for sale." });
    saleForm.reset();
    setSalePhotoPreviews([]);
  };

  const onRentSubmit = (data: CarForRentFormValues) => {
    console.log("Car for Rent Submitted:", data, { photos: rentPhotoPreviews });
    toast({ title: "Listing Submitted!", description: "Your car has been listed for rent." });
    rentForm.reset();
    setRentPhotoPreviews([]);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <CarFront className="h-8 w-8" />
            List Your Car
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Easily list your car for sale or for rent on RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="for_sale" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="for_sale">For Sale</TabsTrigger>
              <TabsTrigger value="for_rent">For Rent</TabsTrigger>
            </TabsList>
            <TabsContent value="for_sale" className="mt-6">
              <Form {...saleForm}>
                <form onSubmit={saleForm.handleSubmit(onSaleSubmit)} className="space-y-6">
                  <FormField control={saleForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Listing Title</FormLabel><FormControl><Input placeholder="e.g., Well-maintained Toyota Corolla 2018" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={saleForm.control} name="make" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Make</FormLabel>
                          <Select onValueChange={(value) => { field.onChange(value); saleForm.setValue('model', ''); }} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select Make"/></SelectTrigger></FormControl>
                              <SelectContent>
                                  {carMakes.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage/>
                      </FormItem>
                    )}/>
                    <FormField control={saleForm.control} name="model" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Model</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMake}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select Model"/></SelectTrigger></FormControl>
                              <SelectContent>
                                  {availableModels.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage/>
                      </FormItem>
                    )}/>
                    <FormField control={saleForm.control} name="year" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select Year"/></SelectTrigger></FormControl>
                              <SelectContent>
                                  {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage/>
                      </FormItem>
                    )}/>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={saleForm.control} name="mileage" render={({ field }) => (<FormItem><FormLabel>Mileage</FormLabel><FormControl><Input type="number" placeholder="45000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="15000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={saleForm.control} name="vin" render={({ field }) => (<FormItem><FormLabel>VIN</FormLabel><FormControl><Input placeholder="17-character VIN" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={saleForm.control} name="engine" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Settings2 className="h-4 w-4"/>Engine</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Engine Type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="4-Cylinder">4-Cylinder</SelectItem><SelectItem value="6-Cylinder">6-Cylinder</SelectItem><SelectItem value="8-Cylinder">8-Cylinder</SelectItem><SelectItem value="Electric">Electric</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="transmission" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Settings2 className="h-4 w-4"/>Transmission</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Transmission"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="fuelType" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Droplets className="h-4 w-4"/>Fuel Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Fuel Type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Gasoline">Gasoline</SelectItem><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Electric">Electric</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                  </div>
                   <div className="grid md:grid-cols-2 gap-4">
                     <FormField control={saleForm.control} name="exteriorColor" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Palette className="h-4 w-4"/>Exterior Color</FormLabel><FormControl><Input placeholder="e.g., Silver" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={saleForm.control} name="interiorColor" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Palette className="h-4 w-4"/>Interior Color</FormLabel><FormControl><Input placeholder="e.g., Black" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                   </div>
                  <FormField control={saleForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the vehicle's features, condition, and history." rows={5} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  
                   <FormItem>
                    <FormLabel>Key Features</FormLabel>
                    <div className="flex gap-2">
                        <Input value={saleFeatureInput} onChange={(e) => setSaleFeatureInput(e.target.value)} placeholder="e.g., Rearview Camera, Bluetooth" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSaleFeature(); } }}/>
                        <Button type="button" onClick={handleAddSaleFeature}>Add</Button>
                    </div>
                    <div className="mt-2 space-y-2">
                        {saleFeatures.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                <span>{field.value}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeSaleFeature(index)}><X className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                  </FormItem>

                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary"/>Photos</FormLabel>
                    <FormControl><Input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(e, setSalePhotoPreviews)} /></FormControl>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                        {salePhotoPreviews.map((src, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden"><Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" /></div>
                        ))}
                    </div>
                  </FormItem>

                  <Button type="submit" size="lg" className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4"/>Submit Sale Listing</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="for_rent" className="mt-6">
                 <Form {...rentForm}>
                <form onSubmit={rentForm.handleSubmit(onRentSubmit)} className="space-y-6">
                  <FormField control={rentForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Rental Listing Title</FormLabel><FormControl><Input placeholder="e.g., Reliable Sedan for City Trips" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                     <FormField control={rentForm.control} name="pricePerDay" render={({ field }) => (<FormItem><FormLabel>Price per Day (USD)</FormLabel><FormControl><Input type="number" placeholder="55" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={rentForm.control} name="pricePerHour" render={({ field }) => (<FormItem><FormLabel>Price per Hour (Optional)</FormLabel><FormControl><Input type="number" placeholder="10" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={rentForm.control} name="pricePerWeek" render={({ field }) => (<FormItem><FormLabel>Price per Week (Optional)</FormLabel><FormControl><Input type="number" placeholder="350" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  </div>
                  
                   <div className="grid md:grid-cols-2 gap-4">
                     <FormField control={rentForm.control} name="seats" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Users className="h-4 w-4"/>Seating Capacity</FormLabel><FormControl><Input type="number" placeholder="5" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={rentForm.control} name="transmission" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Settings2 className="h-4 w-4"/>Transmission</FormLabel><FormControl><Input placeholder="e.g., Automatic" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={rentForm.control} name="mileage" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Gauge className="h-4 w-4"/>Mileage</FormLabel><FormControl><Input type="number" placeholder="25000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                     <FormField control={rentForm.control} name="fuelPolicy" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><Droplets className="h-4 w-4"/>Fuel Policy</FormLabel><FormControl><Input placeholder="e.g., Full-to-Full" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                   </div>

                  <FormField control={rentForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the vehicle, its best uses, and any rental rules." rows={4} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  
                   <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4"/>Pickup Locations</FormLabel>
                    <div className="flex gap-2">
                        <Input value={rentLocationInput} onChange={(e) => setRentLocationInput(e.target.value)} placeholder="e.g., Airport, Downtown" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRentLocation(); } }}/>
                        <Button type="button" onClick={handleAddRentLocation}>Add</Button>
                    </div>
                    <div className="mt-2 space-y-2">
                        {rentLocations.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                <span>{field.value}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRentLocation(index)}><X className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                     <FormMessage>{rentForm.formState.errors.pickupLocations?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Key Features</FormLabel>
                    <div className="flex gap-2">
                        <Input value={rentFeatureInput} onChange={(e) => setRentFeatureInput(e.target.value)} placeholder="e.g., Apple CarPlay, Sunroof" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRentFeature(); } }}/>
                        <Button type="button" onClick={handleAddRentFeature}>Add</Button>
                    </div>
                    <div className="mt-2 space-y-2">
                        {rentFeatures.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                <span>{field.value}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRentFeature(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                  </FormItem>
                  
                  <div className="space-y-2">
                     <FormField control={rentForm.control} name="ecoFriendly" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Eco-Friendly Vehicle</FormLabel></FormItem> )}/>
                     <FormField control={rentForm.control} name="insuranceIncluded" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Basic Insurance Included</FormLabel></FormItem> )}/>
                  </div>
                  
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><UploadCloud className="h-5 w-5"/>Photos</FormLabel>
                    <FormControl><Input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(e, setRentPhotoPreviews)} /></FormControl>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {rentPhotoPreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </FormItem>
                  <Button type="submit" size="lg" className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4"/>Submit Rental Listing</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
