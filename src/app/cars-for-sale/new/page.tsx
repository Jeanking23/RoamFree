
// src/app/cars-for-sale/new/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarFront, DollarSign, Gauge, CalendarDays, UploadCloud, Send } from 'lucide-react';
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
  make: z.string().min(2, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0),
  price: z.coerce.number().positive(),
  description: z.string().min(20, "Please provide a more detailed description."),
  photos: z.array(z.string()).optional(),
});

const carForRentSchema = z.object({
  title: z.string().min(5, "Title is required."),
  pricePerDay: z.coerce.number().positive(),
  pricePerHour: z.coerce.number().positive().optional(),
  features: z.string().optional(),
});

type CarForSaleFormValues = z.infer<typeof carForSaleSchema>;

export default function ListCarPage() {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const saleForm = useForm<CarForSaleFormValues>({ resolver: zodResolver(carForSaleSchema) });
  // You would create a separate form instance for the rental tab
  // const rentForm = useForm...

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

  const onSaleSubmit = (data: CarForSaleFormValues) => {
    console.log("Car for Sale Submitted:", data, { photos: photoPreviews });
    toast({ title: "Listing Submitted!", description: "Your car has been listed for sale." });
    saleForm.reset();
    setPhotoPreviews([]);
  };

  const onRentSubmit = (data: any) => { // Replace 'any' with Zod schema for rent
    console.log("Car for Rent Submitted:", data);
    toast({ title: "Listing Submitted!", description: "Your car has been listed for rent." });
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
                    <FormField control={saleForm.control} name="make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="Toyota" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="Corolla" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="2018" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={saleForm.control} name="mileage" render={({ field }) => (<FormItem><FormLabel>Mileage</FormLabel><FormControl><Input type="number" placeholder="45000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={saleForm.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" placeholder="15000" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  </div>
                  <FormField control={saleForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the vehicle's features, condition, and history." rows={5} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><UploadCloud className="h-5 w-5"/>Photos</FormLabel>
                    <FormControl><Input type="file" accept="image/*" multiple onChange={handlePhotoUpload} /></FormControl>
                    <FormDescription>Upload up to 10 photos of your vehicle.</FormDescription>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {photoPreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </FormItem>
                  <Button type="submit" size="lg" className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4"/>Submit Sale Listing</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="for_rent" className="mt-6">
                <Card className="border-dashed">
                    <CardHeader className="text-center">
                        <CardTitle>Coming Soon!</CardTitle>
                        <CardDescription>The car rental listing form is under development.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">We're working hard to bring you a seamless car rental listing experience. Check back soon!</p>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
