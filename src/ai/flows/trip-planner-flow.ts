
'use server';
/**
 * @fileOverview AI flow for planning a trip itinerary.
 *
 * - planTrip - A function that generates a trip plan based on location, duration, and preferences.
 * - AiTripPlanInput - The input type for the planTrip function.
 * - AiTripPlanOutput - The return type for the planTrip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTripPlanInputSchema = z.object({
  location: z.string().describe('The destination location for the trip (e.g., "Paris, France", "Kyoto, Japan").'),
  duration: z.number().int().min(1).max(30).describe('The duration of the trip in days (e.g., 3, 7, 14).'),
  preferences: z.string().describe('User preferences for activities, interests, pace, budget considerations, etc. (e.g., "historical sites, local cuisine, relaxed pace, mid-range budget", "adventure sports, nightlife, fast-paced").'),
});
export type AiTripPlanInput = z.infer<typeof AiTripPlanInputSchema>;

const AiTripPlanOutputSchema = z.object({
  itinerary: z.string().describe('A detailed day-by-day itinerary based on the inputs. Should include suggested activities, sights, and potentially meal suggestions for each day.'),
  additionalTips: z.string().optional().describe('Any additional tips for the trip, such as packing advice, local customs, transportation tips, or safety notes.'),
});
export type AiTripPlanOutput = z.infer<typeof AiTripPlanOutputSchema>;

export async function planTrip(input: AiTripPlanInput): Promise<AiTripPlanOutput> {
  return aiTripPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTripPlannerPrompt',
  input: {schema: AiTripPlanInputSchema},
  output: {schema: AiTripPlanOutputSchema},
  prompt: `You are an expert travel planner AI. Your task is to create a personalized trip itinerary.

User's Destination: {{{location}}}
Trip Duration: {{{duration}}} days
User's Preferences: {{{preferences}}}

Generate a detailed day-by-day itinerary. For each day, suggest specific activities, sights to see, and optionally, types of local cuisine or restaurants to try.
Consider the trip duration and user preferences to create a balanced and enjoyable plan.
If relevant, include practical travel tips for the destination (e.g., best way to get around, cultural etiquette, safety advice, packing suggestions) in the 'additionalTips' field.

Structure your response according to the AiTripPlanOutput schema. Ensure the itinerary is engaging and informative.
For example:
Day 1:
- Morning: Arrive at [Airport/Station], check into hotel in [Area].
- Afternoon: Visit [Landmark 1], explore [Neighborhood].
- Evening: Dinner at [Restaurant Suggestion/Type of Cuisine], enjoy [Evening Activity].

Day 2:
...and so on for {{{duration}}} days.
`,
});

const aiTripPlannerFlow = ai.defineFlow(
  {
    name: 'aiTripPlannerFlow',
    inputSchema: AiTripPlanInputSchema,
    outputSchema: AiTripPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a trip plan.");
    }
    return output;
  }
);

    