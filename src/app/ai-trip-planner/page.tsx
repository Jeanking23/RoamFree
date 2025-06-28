
// src/app/ai-trip-planner/page.tsx
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2, AlertTriangle, Briefcase, Users, Heart, Calendar, Plane, Car, Bus, ArrowRight, Home, Ticket } from "lucide-react";
import { useState } from "react";
import { getAiTripPlanAction } from "@/app/actions";
import type { AiTripPlanInput, AiTripPlanOutput } from "@/ai/flows/trip-planner-flow";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

export default function AiTripPlannerSurveyPage() {
  const [tripPlan, setTripPlan] = useState<AiTripPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

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

  async function onSubmit(values: TripPlannerFormValues) {
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Section 1: Core Details */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground border-b pb-2">Step 1: The Basics</h3>
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
                        <FormField control={form.control} name="budgetLevel" render={({ field }) => (
                            <FormItem><FormLabel>What's your budget level?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low ($)</SelectItem>
                                        <SelectItem value="MODERATE">Moderate ($$)</SelectItem>
                                        <SelectItem value="LUXURY">Luxury ($$$)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="budgetCustom" render={({ field }) => (<FormItem><FormLabel>Or, a custom budget (USD, Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl></FormItem>)} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <FormField control={form.control} name="dateFrom" render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="dateTo" render={({ field }) => (<FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="isFlexibleDates" render={({ field }) => (<FormItem className="flex flex-row items-end space-x-3 space-y-0 pb-1"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">My dates are flexible</FormLabel></FormItem>)} />
                    </div>
                </div>

                {/* Section 2: Vibe & Destination */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground border-b pb-2">Step 2: Destination & Vibe</h3>
                     <FormField control={form.control} name="destinationSpecific" render={({ field }) => (<FormItem><FormLabel>Enter a specific destination (City/Country)</FormLabel><FormControl><Input placeholder="e.g., Kyoto, Japan" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="isSurpriseMe" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Or, surprise me based on my vibe!</FormLabel></div></FormItem>)} />
                     <FormField control={form.control} name="destinationType" render={({ field }) => (
                            <FormItem><FormLabel>Destination Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ANY">Any</SelectItem>
                                        <SelectItem value="DOMESTIC">Nearby / Domestic</SelectItem>
                                        <SelectItem value="INTERNATIONAL">International</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                    <FormField control={form.control} name="tripVibe" render={() => (
                        <FormItem><FormLabel>What's the vibe of the trip?</FormLabel>
                            {vibeItems.map((item) => (<FormField key={item.id} control={form.control} name="tripVibe" render={({ field }) => {
                                return (<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...field.value, item.label]) : field.onChange(field.value?.filter((value) => value !== item.label))
                                    }} /></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>)
                            }} />))}<FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Section 3: Preferences */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground border-b pb-2">Step 3: Your Preferences</h3>
                     <FormField control={form.control} name="travelerType" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Who are you traveling with?</FormLabel>
                            <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="SOLO" /></FormControl><FormLabel className="font-normal">Solo</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="COUPLE" /></FormControl><FormLabel className="font-normal">Couple</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="GROUP" /></FormControl><FormLabel className="font-normal">Group</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="FAMILY" /></FormControl><FormLabel className="font-normal">Family with kids</FormLabel></FormItem>
                            </RadioGroup></FormControl><FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="isPetFriendly" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Pet friendly?</FormLabel></FormItem>)} />
                    
                    <FormField control={form.control} name="accommodationTypes" render={() => (
                        <FormItem><FormLabel>Preferred Accommodation Types</FormLabel>
                            <div className="flex flex-wrap gap-4">{accommodationTypeItems.map((item) => (<FormField key={item} control={form.control} name="accommodationTypes" render={({ field }) => {
                                return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)
                            }} />))}</div><FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="accommodationAmenities" render={() => (
                        <FormItem><FormLabel>Must-Have Amenities</FormLabel>
                            <div className="flex flex-wrap gap-4">{accommodationAmenityItems.map((item) => (<FormField key={item} control={form.control} name="accommodationAmenities" render={({ field }) => {
                                return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)
                            }} />))}</div><FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Section 4: Transport & Extras */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground border-b pb-2">Step 4: Transport & Extras</h3>
                     <FormItem><FormLabel>Transport Preferences</FormLabel>
                        <div className="flex flex-wrap gap-4">
                            <FormField control={form.control} name="needsFlight" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Need flight?</FormLabel></FormItem>)} />
                            <FormField control={form.control} name="needsCarRental" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Car rental needed?</FormLabel></FormItem>)} />
                            <FormField control={form.control} name="needsLocalTransport" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Local transport?</FormLabel></FormItem>)} />
                            <FormField control={form.control} name="needsAiRides" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">AI-arranged rides?</FormLabel></FormItem>)} />
                        </div>
                    </FormItem>
                    <FormField control={form.control} name="extras" render={() => (
                        <FormItem><FormLabel>Any Extras?</FormLabel>
                            <div className="grid md:grid-cols-2 gap-2">{extraItems.map((item) => (<FormField key={item} control={form.control} name="extras" render={({ field }) => {
                                return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                }} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)
                            }} />))}</div><FormMessage />
                        </FormItem>
                    )} />
                </div>


                <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate My Trip Plan
                </Button>
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
                <div className="space-y-6 animate-in fade-in-50">
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline text-primary">Your Trip to {tripPlan.suggestedDestination.name}</CardTitle>
                            <CardDescription>{tripPlan.suggestedDestination.reason}</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <p className="text-xl font-bold">Estimated Cost: ${tripPlan.estimatedCost.total}</p>
                            <p className="text-sm text-muted-foreground">{tripPlan.estimatedCost.breakdown}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Accommodation Suggestion</CardTitle></CardHeader>
                        <CardContent>
                            <h4 className="font-semibold">{tripPlan.accommodationSuggestion.name} ({tripPlan.accommodationSuggestion.type})</h4>
                            <p className="text-muted-foreground">{tripPlan.accommodationSuggestion.reason}</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Transport Suggestion</CardTitle></CardHeader>
                        <CardContent><p>{tripPlan.transportSuggestion}</p></CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Your Day-by-Day Itinerary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {tripPlan.itinerary.map(day => (
                                <div key={day.day} className="p-3 border rounded-md">
                                    <h4 className="font-semibold text-lg text-primary">Day {day.day}: {day.title}</h4>
                                    <p className="whitespace-pre-line mt-1">{day.activities}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {tripPlan.additionalTips && (
                        <Card><CardHeader><CardTitle>Additional Tips</CardTitle></CardHeader><CardContent><p>{tripPlan.additionalTips}</p></CardContent></Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle>Ready to Go?</CardTitle></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={() => toast({title: "Booking All (Demo)"})}><Briefcase className="mr-2"/>Book All Now</Button>
                            <Button size="lg" variant="outline" onClick={() => toast({title: "Booking Flight+Hotel (Demo)"})}><Plane className="mr-2"/>Just Book Flight + Hotel</Button>
                            <Button size="lg" variant="outline" onClick={() => toast({title: "Booking Car (Demo)"})}><Car className="mr-2"/>Only Rent Car</Button>
                            <Button size="lg" variant="outline" onClick={() => toast({title: "Booking Accommodation (Demo)"})}><Home className="mr-2"/>Only Book Accommodation</Button>
                            <Button size="lg" variant="secondary" onClick={() => toast({title: "Itinerary Saved (Demo)"})}><Heart className="mr-2"/>View Itinerary & Customize</Button>
                        </CardContent>
                    </Card>
                     <Button variant="link" onClick={() => setTripPlan(null)}>
                        <ArrowRight className="mr-2 h-4 w-4 transform rotate-180" /> Back to Survey
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
