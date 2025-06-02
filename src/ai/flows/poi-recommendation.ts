'use server';

/**
 * @fileOverview AI flow for recommending points of interest (POI) near a given accommodation.
 *
 * - recommendPoi - A function that recommends POIs based on accommodation details.
 * - RecommendPoiInput - The input type for the recommendPoi function.
 * - RecommendPoiOutput - The return type for the recommendPoi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPoiInputSchema = z.object({
  accommodationDescription: z
    .string()
    .describe('Description of the selected accommodation.'),
  userReviews: z.string().describe('User reviews and ratings for the accommodation.'),
});
export type RecommendPoiInput = z.infer<typeof RecommendPoiInputSchema>;

const RecommendPoiOutputSchema = z.object({
  poiRecommendations: z
    .string()
    .describe(
      'A list of recommended points of interest near the accommodation, considering user reviews and ratings.'
    ),
});
export type RecommendPoiOutput = z.infer<typeof RecommendPoiOutputSchema>;

export async function recommendPoi(input: RecommendPoiInput): Promise<RecommendPoiOutput> {
  return recommendPoiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPoiPrompt',
  input: {schema: RecommendPoiInputSchema},
  output: {schema: RecommendPoiOutputSchema},
  prompt: `You are a travel expert. Based on the description of the accommodation and user reviews, suggest points of interest near the lodging.

Accommodation Description: {{{accommodationDescription}}}
User Reviews and Ratings: {{{userReviews}}}

Points of Interest Recommendations:`,
});

const recommendPoiFlow = ai.defineFlow(
  {
    name: 'recommendPoiFlow',
    inputSchema: RecommendPoiInputSchema,
    outputSchema: RecommendPoiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
