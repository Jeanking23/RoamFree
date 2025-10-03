
"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Lightbulb, User } from "lucide-react";
import { getPoiRecommendationsAction } from "@/app/actions";
import type { RecommendPoiOutput, RecommendPoiInput } from "@/ai/flows/poi-recommendation";
import POIRecommendationResults from "./poi-recommendation-results";

const poiRecommendationSchema = z.object({
  accommodationDescription: z.string().min(10, "Please provide a more detailed description (min 10 characters).").max(1000),
  userReviews: z.string().min(10, "Please provide some user reviews (min 10 characters).").max(1000),
  userInterests: z.string().optional().describe("Optional user interests to refine recommendations."),
});

type POIRecommendationFormValues = z.infer<typeof poiRecommendationSchema>;

export default function POIRecommendationForm() {
  const [recommendations, setRecommendations] = useState<RecommendPoiOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<POIRecommendationFormValues>({
    resolver: zodResolver(poiRecommendationSchema),
    defaultValues: {
      accommodationDescription: "",
      userReviews: "",
      userInterests: "",
    },
  });

  async function onSubmit(values: POIRecommendationFormValues) {
    setIsLoading(true);
    setError(undefined);
    setRecommendations(undefined);

    const input: RecommendPoiInput = {
      accommodationDescription: values.accommodationDescription,
      userReviews: values.userReviews,
      ...(values.userInterests && { userInterests: values.userInterests }), 
    };
    
    const result = await getPoiRecommendationsAction(input);
    
    if ("error" in result) {
      setError(result.error);
    } else {
      setRecommendations(result);
    }
    setIsLoading(false);
  }

  return (
    <div className="p-6 bg-card shadow-lg rounded-lg border">
      <h3 className="text-xl font-headline font-semibold text-primary mb-1 flex items-center gap-2">
        <Lightbulb className="h-6 w-6" />
        AI Powered Recommendations
      </h3>
      <p className="text-muted-foreground mb-4">
        Get suggestions for points of interest near your chosen accommodation, tailored to your interests.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accommodationDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accommodation Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A cozy beachfront villa with stunning ocean views and a private pool."
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Describe the accommodation to help us find relevant points of interest.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userReviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Reviews & Ratings (of Accommodation)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Loved the location, very close to historical sites. Rating: 4.5/5."
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Provide some user reviews or ratings for context.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userInterests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-primary" />Your Interests (Optional)
                  </div>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Interested in history, nature, local cuisine, nightlife."
                    rows={2}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Tell us your interests to get more personalized recommendations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Getting Suggestions..." : "Get Suggestions"}
          </Button>
        </form>
      </Form>
      <POIRecommendationResults results={recommendations} isLoading={isLoading} error={error} />
    </div>
  );
}
