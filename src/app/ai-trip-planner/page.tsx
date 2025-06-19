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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Wand2, Loader2, AlertTriangle, CalendarDays, MapPin, Edit3 } from "lucide-react";
import { useState } from "react";
import { getAiTripPlanAction } from "@/app/actions";
import type { AiTripPlanInput, AiTripPlanOutput } from "@/ai/flows/trip-planner-flow";

const aiTripPlanSchema = z.object({
  location: z.string().min(2, "Destination is required (e.g., Paris, France)."),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 day.").max(30, "Duration cannot exceed 30 days."),
  preferences: z.string().min(10, "Please describe your preferences (min 10 characters).").max(1000),
});

type AiTripPlanFormValues = z.infer<typeof aiTripPlanSchema>;

export default function AiTripPlannerPage() {
  const [tripPlan, setTripPlan] = useState<AiTripPlanOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<AiTripPlanFormValues>({
    resolver: zodResolver(aiTripPlanSchema),
    defaultValues: {
      location: "",
      duration: 7,
      preferences: "",
    },
  });

  async function onSubmit(values: AiTripPlanFormValues) {
    setIsLoading(true);
    setError(undefined);
    setTripPlan(undefined);

    const input: AiTripPlanInput = {
      location: values.location,
      duration: values.duration,
      preferences: values.preferences,
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
            Let our AI craft a personalized itinerary for your next adventure. Just tell us your destination, duration, and preferences!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary"/>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France or Kyoto, Japan" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where would you like to go?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><CalendarDays className="h-4 w-4 text-primary"/>Trip Duration (in days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="30" placeholder="e.g., 7" {...field} />
                    </FormControl>
                     <FormDescription>
                      How many days will your trip be? (1-30 days)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Edit3 className="h-4 w-4 text-primary"/>Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Interested in historical sites, local cuisine, relaxed pace, mid-range budget. Or, adventure sports, nightlife, fast-paced."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are your interests, preferred pace, budget considerations, etc.?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Generate My Trip Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Error Generating Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Please try adjusting your inputs or try again later.</p>
          </CardContent>
        </Card>
      )}

      {tripPlan && !isLoading && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Your Personalized Itinerary</CardTitle>
            <CardDescription>Here's a plan crafted just for you based on your inputs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Day-by-Day Itinerary:</h3>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-foreground whitespace-pre-line">{tripPlan.itinerary}</p>
              </div>
            </div>
            {tripPlan.additionalTips && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Additional Tips:</h3>
                 <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-foreground whitespace-pre-line">{tripPlan.additionalTips}</p>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
