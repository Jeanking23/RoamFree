
// src/app/ai-trip-planner/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Wand2, Loader2, AlertTriangle, ArrowRight, ArrowLeft, BedDouble, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { getAiTripPlanAction } from "@/app/actions";
import type { AiTripPlanInput, AiTripPlanOutput } from "@/ai/flows/trip-planner-flow";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';

const tripPlannerSurveySchema = z.object({
  travelPurpose: z.enum(["VACATION", "BUSINESS", "FAMILY", "ROMANTIC", "EVENT", "SPIRITUAL"], {
    required_error: "You need to select a travel purpose.",
  }),
  budgetLevel: z.enum(["LOW", "MODERATE", "LUXURY"]),
  budgetCustom: z.string().optional(),
  dateFrom: z.date(),
  dateTo: z.date(),
  isFlexibleDates: z.boolean().default(false),
  destinationSpecific: z.string().optional(),
  isSurpriseMe: z.boolean().default(false),
  destinationType: z.enum(["ANY", "DOMESTIC", "INTERNATIONAL"]),
  tripVibe: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one vibe.",
  }),
  travelerType: z.enum(["SOLO", "COUPLE", "GROUP", "FAMILY"]),
  isPetFriendly: z.boolean().default(false),
  accommodationTypes: z.array(z.string()),
  accommodationAmenities: z.array(z.string()),
  needsFlight: z.boolean().default(false),
  needsCarRental: z.boolean().default(false),
  needsLocalTransport: z.boolean().default(false),
  needsAiRides: z.boolean().default(false),
  extras: z.array(z.string()),
}).refine((data) => data.destinationSpecific || data.isSurpriseMe, {
  message: "Either a specific destination or 'Surprise Me' must be selected.",
  path: ["destinationSpecific"],
});

type TripPlannerFormValues = z.infer<typeof tripPlannerSurveySchema>;

const vibeItems = [
  { id: "vibe-relaxation", label: "🌴 Relaxation" },
  { id: "vibe-adventure", label: "🏔️ Adventure" },
  { id: "vibe-culture", label: "🏛️ Culture & History" },
  { id: "vibe-nightlife", label: "🎵 Nightlife" },
  { id: "vibe-shopping", label: "🛍️ Shopping" },
  { id: "vibe-food", label: "🍴 Food Tour" },
  { id: "vibe-workcation", label: "💻 Workcation" },
];

const accommodationTypeItems = ["Hotel", "Apartment", "Villa", "Resort", "Guest House"];
const accommodationAmenityItems = ["Wi-Fi", "Pool", "Kitchen", "Free Parking", "Gym"];
const extraItems = ["Airport pickup/drop-off", "Luggage storage", "Local guide or translator", "Shopping guide", "Restaurant suggestions or reservations", "Courier services"];

const formSteps = [
    { title: "The Basics", fields: ["travelPurpose", "budgetLevel", "budgetCustom", "dateFrom", "dateTo", "isFlexibleDates"] },
    { title: "Destination & Vibe", fields: ["destinationSpecific", "isSurpriseMe", "destinationType", "tripVibe"] },
    { title: "Your Preferences", fields: ["travelerType", "isPetFriendly", "accommodationTypes", "accommodationAmenities"] },
    { title: "Transport & Extras", fields: ["needsFlight", "needsCarRental", "needsLocalTransport", "needsAiRides", "extras"] },
];

const slideshowImages = [
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx0cmF2ZWwlMjBtb3VudGFpbnN8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "travel mountains" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHN1bnJpc2V8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "beach sunrise" },
  { url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NTI4MTQxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080", hint: "mountain landscape" },
  { url: "https://images.unsplash.com/photo-1519010470956-6d877008eaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaXR5c2NhcGUlMjBhJ25pZ2h0fGVufDB8fHx8MTc1MjgwMzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080", hint: "cityscape night" },
];

export default function AiTripPlannerSurveyPage() {
  const [tripPlan, setTripPlan] = useState<AiTripPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let slideshowTimer: NodeJS.Timeout;
    if (tripPlan && !isLoading) {
      slideshowTimer = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % slideshowImages.length);
      }, 5000); // Change image every 5 seconds
    }
    return () => clearInterval(slideshowTimer);
  }, [tripPlan, isLoading]);


  const form = useForm<TripPlannerFormValues>({
    resolver: zodResolver(tripPlannerSurveySchema),
    defaultValues: {
      travelPurpose: "VACATION",
      budgetLevel: "MODERATE",
      budgetCustom: "",
      isFlexibleDates: false,
      destinationSpecific: "",
      isSurpriseMe: false,
      destinationType: "ANY",
      tripVibe: [],
      travelerType: "COUPLE",
      isPetFriendly: false,
      accommodationTypes: [],
      accommodationAmenities: [],
      needsFlight: false,
      needsCarRental: false,
      needsLocalTransport: true,
      needsAiRides: true,
      extras: [],
    },
  });
  
   useEffect(() => {
    // Set default dates on the client to avoid hydration mismatch
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    if (!form.getValues('dateFrom') && !form.getValues('dateTo')) {
      form.setValue('dateFrom', today);
      form.setValue('dateTo', oneWeekFromNow);
    }
  }, [form]);

  async function processForm(values: TripPlannerFormValues) {
    setIsLoading(true);
    setError(undefined);
    setTripPlan(null);

    const input: AiTripPlanInput = {
        travelPurpose: values.travelPurpose,
        budget: { level: values.budgetLevel, customAmount: values.budgetCustom ? Number(values.budgetCustom) : undefined },
        dates: { from: format(values.dateFrom, "yyyy-MM-dd"), to: format(values.dateTo, "yyyy-MM-dd"), isFlexible: values.isFlexibleDates },
        destination: { specificLocation: values.destinationSpecific, surpriseMe: values.isSurpriseMe, type: values.destinationType },
        tripVibe: values.tripVibe,
        travelType: { type: values.travelerType, isPetFriendly: values.isPetFriendly },
        accommodation: { types: values.accommodationTypes, amenities: values.accommodationAmenities },
        transport: { needsFlight: values.needsFlight, needsCarRental: values.needsCarRental, needsLocalTransport: values.needsLocalTransport, needsAiRides: values.needsAiRides },
        extras: values.extras,
    };
    
    const result = await getAiTripPlanAction(input);
    
    if ("error" in result) {
      setError(result.error);
    } else {
      setTripPlan(result);
    }
    setIsLoading(false);
  }
  
  type FieldName = keyof TripPlannerFormValues;
  const nextStep = async () => {
    const fields = formSteps[currentStep].fields as FieldName[];
    const output = await form.trigger(fields, { shouldFocus: true });
    
    if (!output) {
      // Find the first error to notify the user
      const firstErrorField = fields.find(field => form.formState.errors[field]);
      if (firstErrorField) {
        const errorMessage = (form.formState.errors[firstErrorField] as FieldError)?.message;
        toast({
          title: "Please complete this step",
          description: errorMessage || "There's an error in the form.",
          variant: "destructive"
        });
      }
      return;
    }

    if (currentStep < formSteps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const progress = ((currentStep + 1) / formSteps.length) * 100;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Wand2 className="h-8 w-8" />
            AI Trip Planner
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Tell us about your dream trip, and our AI will craft a personalized itinerary just for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!tripPlan && !isLoading && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                
                <div className="space-y-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep].title}</p>
                </div>
                
                <AnimatePresence mode="wait">
                 <motion.div
                    key={currentStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                 >

                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <FormField control={form.control} name="travelPurpose" render={({ field }) => (
                                <FormItem className="space-y-3"><FormLabel>What's the purpose of your trip?</FormLabel>
                                    <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="VACATION" /></FormControl><FormLabel className="font-normal">🎯 Vacation</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="BUSINESS" /></FormControl><FormLabel className="font-normal">🏢 Business</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="FAMILY" /></FormControl><FormLabel className="font-normal">👪 Family</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="ROMANTIC" /></FormControl><FormLabel className="font-normal">💑 Romantic</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="EVENT" /></FormControl><FormLabel className="font-normal">🎉 Event</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="SPIRITUAL" /></FormControl><FormLabel className="font-normal">✝️ Spiritual</FormLabel></FormItem>
                                    </RadioGroup></FormControl><FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="budgetLevel" render={({ field }) => (<FormItem><FormLabel>What's your budget level?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger></FormControl><SelectContent><SelectItem value="LOW">Low ($)</SelectItem><SelectItem value="MODERATE">Moderate ($$)</SelectItem><SelectItem value="LUXURY">Luxury ($$$)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="budgetCustom" render={({ field }) => (<FormItem><FormLabel>Or, a custom budget (USD, Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl></FormItem>)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 items-end">
                                <FormField control={form.control} name="dateFrom" render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="dateTo" render={({ field }) => (<FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="isFlexibleDates" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 pb-1.5"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">My dates are flexible</FormLabel></FormItem>)} />
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <FormField control={form.control} name="destinationSpecific" render={({ field }) => (<FormItem><FormLabel>Enter a specific destination (City/Country)</FormLabel><FormControl><Input placeholder="e.g., Kyoto, Japan" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="isSurpriseMe" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Or, surprise me based on my vibe!</FormLabel></div></FormItem>)} />
                            <FormField control={form.control} name="destinationType" render={({ field }) => (<FormItem><FormLabel>Destination Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ANY">Any</SelectItem><SelectItem value="DOMESTIC">Nearby / Domestic</SelectItem><SelectItem value="INTERNATIONAL">International</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="tripVibe" render={() => (<FormItem><FormLabel>What's the vibe of the trip?</FormLabel>{vibeItems.map((item) => (<FormField key={item.id} control={form.control} name="tripVibe" render={({ field }) => { return (<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item.label]) : field.onChange(field.value?.filter((value) => value !== item.label)) }} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>)}} />))}<FormMessage /></FormItem>)} />
                        </div>
                    )}

                    {currentStep === 2 && (
                         <div className="space-y-6">
                             <FormField control={form.control} name="travelerType" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Who are you traveling with?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="SOLO" /></FormControl><FormLabel className="font-normal">Solo</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="COUPLE" /></FormControl><FormLabel className="font-normal">Couple</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="GROUP" /></FormControl><FormLabel className="font-normal">Group</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="FAMILY" /></FormControl><FormLabel className="font-normal">Family with kids</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="isPetFriendly" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Pet friendly?</FormLabel></FormItem>)} />
                            <FormField control={form.control} name="accommodationTypes" render={() => (<FormItem><FormLabel>Preferred Accommodation Types</FormLabel><div className="flex flex-wrap gap-4">{accommodationTypeItems.map((item) => (<FormField key={item} control={form.control} name="accommodationTypes" render={({ field }) => { return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item)) }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)}} />))}</div><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="accommodationAmenities" render={() => (<FormItem><FormLabel>Must-Have Amenities</FormLabel><div className="flex flex-wrap gap-4">{accommodationAmenityItems.map((item) => (<FormField key={item} control={form.control} name="accommodationAmenities" render={({ field }) => { return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item)) }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)}} />))}</div><FormMessage /></FormItem>)} />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                             <FormItem><FormLabel>Transport Preferences</FormLabel><div className="flex flex-wrap gap-4"><FormField control={form.control} name="needsFlight" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Need flight?</FormLabel></FormItem>)} /><FormField control={form.control} name="needsCarRental" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Car rental needed?</FormLabel></FormItem>)} /><FormField control={form.control} name="needsLocalTransport" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Local transport?</FormLabel></FormItem>)} /><FormField control={form.control} name="needsAiRides" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">AI-arranged rides?</FormLabel></FormItem>)} /></div></FormItem>
                            <FormField control={form.control} name="extras" render={() => (<FormItem><FormLabel>Any Extras?</FormLabel><div className="grid md:grid-cols-2 gap-2">{extraItems.map((item) => (<FormField key={item} control={form.control} name="extras" render={({ field }) => { return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item)) }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)}} />))}</div><FormMessage /></FormItem>)} />
                        </div>
                    )}
                </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  
                  {currentStep < formSteps.length - 1 && (
                     <Button type="button" onClick={nextStep}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {currentStep === formSteps.length - 1 && (
                     <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate My Trip Plan
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}

           {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Crafting your personalized adventure...</p>
              </div>
            )}

            {error && (
                <Card className="border-destructive">
                <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-6 w-6" />Error Generating Plan</CardTitle></CardHeader>
                <CardContent><p className="text-destructive-foreground">{error}</p><p className="text-sm text-muted-foreground mt-2">Please try adjusting your inputs or try again later.</p></CardContent>
                </Card>
            )}

            {tripPlan && !isLoading && (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-muted/30 overflow-hidden relative h-64">
                        <AnimatePresence>
                            <motion.div
                                key={currentImageIndex}
                                className="absolute inset-0 z-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                            >
                                <Image 
                                    src={slideshowImages[currentImageIndex].url}
                                    alt={`Scenery of ${tripPlan.suggestedDestination.name}`} 
                                    fill
                                    className="object-cover"
                                    data-ai-hint={slideshowImages[currentImageIndex].hint}
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <CardTitle className="text-3xl font-headline text-white shadow-lg">Your Trip to {tripPlan.suggestedDestination.name}</CardTitle>
                            <CardDescription className="text-white/90">{tripPlan.suggestedDestination.reason}</CardDescription>
                        </div>
                    </Card>
                    
                     <Card>
                        <CardHeader>
                            <CardTitle>Trip Overview</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <p className="text-2xl font-bold">Estimated Cost: ${tripPlan.estimatedCost.total.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{tripPlan.estimatedCost.breakdown}</p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Accommodation Suggestion</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <h4 className="font-semibold">{tripPlan.accommodationSuggestion.name} ({tripPlan.accommodationSuggestion.type})</h4>
                                <p className="text-muted-foreground text-sm">{tripPlan.accommodationSuggestion.reason}</p>
                            </CardContent>
                             <CardFooter>
                                <Button asChild className="w-full"><Link href="/stays/search"><BedDouble className="mr-2 h-4 w-4"/>Book this Stay (Demo)</Link></Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Transport Suggestion</CardTitle></CardHeader>
                            <CardContent><p className="text-sm">{tripPlan.transportSuggestion}</p></CardContent>
                            <CardFooter>
                                <Button asChild className="w-full"><Link href="/transport"><Car className="mr-2 h-4 w-4"/>Arrange Transport (Demo)</Link></Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Your Day-by-Day Itinerary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {tripPlan.itinerary.map(day => (
                                <div key={day.day} className="p-4 border rounded-md transition-all hover:bg-muted/50 hover:shadow-sm">
                                    <h4 className="font-semibold text-lg text-primary">Day {day.day}: {day.title}</h4>
                                    <p className="whitespace-pre-line mt-1 text-sm text-muted-foreground">{day.activities}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {tripPlan.additionalTips && (
                        <Card><CardHeader><CardTitle>Additional Tips</CardTitle></CardHeader><CardContent><p className="text-sm">{tripPlan.additionalTips}</p></CardContent></Card>
                    )}

                     <Button variant="link" onClick={() => setTripPlan(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
                    </Button>
                </motion.div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
