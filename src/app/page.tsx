
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import TransportationSearchForm from '@/components/search/transportation-search-form';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import POIRecommendationForm from '@/components/recommendations/poi-recommendation-form';
import { BedDouble, Car, Compass, Sparkles, Brain, MapPin as MapPinIcon, User, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { getAiTripPlanAction } from "./actions"; 
import type { AiTripPlanOutput } from "@/ai/flows/trip-planner-flow"; 
import Link from 'next/link';

const tripPlannerSchema = z.object({
  location: z.string().min(3, "Location must be at least 3 characters."),
  preferences: z.string().min(10, "Preferences must be at least 10 characters (e.g., 'historical sites, local cuisine, museums').").max(500),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day.").max(30, "Duration cannot exceed 30 days."),
});

type TripPlannerFormValues = z.infer<typeof tripPlannerSchema>;

function AiTripPlannerSection() {
  const [plan, setPlan] = useState<AiTripPlanOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<TripPlannerFormValues>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      location: "",
      preferences: "",
      duration: 3,
    },
  });

  async function onSubmit(values: TripPlannerFormValues) {
    setIsLoading(true);
    setError(undefined);
    setPlan(undefined);

    const result = await getAiTripPlanAction(values);
    
    if ("error" in result) {
      setError(result.error);
    } else {
      setPlan(result);
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-lg rounded-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
          <Brain className="h-8 w-8" />
          AI Trip Planner
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Let our AI craft the perfect itinerary for your next adventure, including lodging, transit, and activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><MapPinIcon className="h-4 w-4 text-primary" />Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rome, Italy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-primary" />Your Interests & Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Interested in ancient history, art museums, authentic local food, and some relaxation. Not a fan of crowded tourist traps."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Generating Plan..." : "Generate My Trip Plan"}
            </Button>
          </form>
        </Form>
        {isLoading && <p className="mt-4 text-center text-muted-foreground">Our AI is crafting your journey...</p>}
        {error && <p className="mt-4 text-center text-destructive">{error}</p>}
        {plan && plan.itinerary && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Personalized Itinerary for {form.getValues("location")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{plan.itinerary}</p>
              {plan.additionalTips && (
                <>
                  <h4 className="font-semibold mt-4 mb-2">Additional Tips:</h4>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{plan.additionalTips}</p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}


export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-inner border border-primary/20">
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-4">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          RoamFree helps you find the perfect stay, seamless transport, and exciting local experiences.
        </p>
         <div className="mt-6">
            <Button variant="link" asChild>
                <Link href="/corporate-solutions-demo">
                    <Briefcase className="mr-2 h-4 w-4"/> RoamFree for Business (Demo)
                </Link>
            </Button>
        </div>
      </section>

      <section id="stays" className="scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <BedDouble className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl font-headline font-semibold text-foreground">Find Your Perfect Stay</h2>
            <p className="text-muted-foreground">Search hotels, vacation rentals, and even land effortlessly.</p>
          </div>
        </div>
        <AccommodationSearchForm />
         <div className="mt-4 text-center">
            <Link href="/stays/123">
                <Button variant="link">View Example Accommodation Profile</Button>
            </Link>
         </div>
      </section>

      <section id="rides" className="scroll-mt-20">
         <div className="flex items-center gap-3 mb-6">
          <Car className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl font-headline font-semibold text-foreground">Travel With Ease</h2>
            <p className="text-muted-foreground">Book rides, rental cars, and flights in one place.</p>
          </div>
        </div>
        <TransportationSearchForm />
      </section>
      
      <section id="ai-planner" className="scroll-mt-20">
        <AiTripPlannerSection />
      </section>

      <div className="grid md:grid-cols-2 gap-12 scroll-mt-20" id="explore">
        <section>
           <div className="flex items-center gap-3 mb-6">
            <Compass className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground">Explore Your Destination</h2>
              <p className="text-muted-foreground">Visualize your trip and discover hidden gems.</p>
            </div>
          </div>
          <InteractiveMapPlaceholder />
        </section>

        <section>
           <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground">AI-Powered Insights</h2>
              <p className="text-muted-foreground">Get smart recommendations for your trip.</p>
            </div>
          </div>
          <POIRecommendationForm />
        </section>
      </div>

    </div>
  );
}
    