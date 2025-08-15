
'use server';
/**
 * @fileOverview AI flow for planning a trip itinerary based on a detailed user survey.
 *
 * - planTrip - A function that generates a trip plan based on a comprehensive set of user preferences.
 * - AiTripPlanInput - The input type for the planTrip function.
 * - AiTripPlanOutput - The return type for the planTrip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTripPlanInputSchema = z.object({
  travelPurpose: z.enum(["VACATION", "BUSINESS", "FAMILY", "ROMANTIC", "EVENT", "SPIRITUAL"]).describe("The main purpose of the trip."),
  budget: z.object({
    level: z.enum(["LOW", "MODERATE", "LUXURY"]),
    customAmount: z.number().optional(),
  }).describe("The user's budget for the trip."),
  dates: z.object({
    from: z.string().describe("The start date of the trip in YYYY-MM-DD format."),
    to: z.string().describe("The end date of the trip in YYYY-MM-DD format."),
    isFlexible: z.boolean().describe("Whether the user's dates are flexible."),
  }).describe("The travel dates."),
  destination: z.object({
    specificLocation: z.string().optional().describe("A specific city or country the user wants to visit."),
    surpriseMe: z.boolean().describe("Whether the user wants the AI to suggest a destination."),
    type: z.enum(["ANY", "DOMESTIC", "INTERNATIONAL"]).describe("The type of destination."),
  }).describe("The user's destination preference."),
  tripVibe: z.array(z.string()).describe("A list of vibes the user is looking for (e.g., Relaxation, Adventure, Culture & History)."),
  travelType: z.object({
    type: z.enum(["SOLO", "COUPLE", "GROUP", "FAMILY"]),
    isPetFriendly: z.boolean(),
  }).describe("The type of travel group."),
  accommodation: z.object({
    types: z.array(z.string()).describe("Preferred accommodation types (e.g., Hotel, Apartment, Villa)."),
    amenities: z.array(z.string()).describe("Must-have amenities (e.g., Wi-Fi, Pool)."),
  }).describe("Accommodation preferences."),
  transport: z.object({
    needsFlight: z.boolean(),
    needsCarRental: z.boolean(),
    needsLocalTransport: z.boolean(),
    needsAiRides: z.boolean(),
    needsDriver: z.boolean(),
  }).describe("Transportation preferences."),
  extras: z.array(z.string()).describe("Any extra services the user is interested in (e.g., Airport pickup, Local guide)."),
});

export type AiTripPlanInput = z.infer<typeof AiTripPlanInputSchema>;

const AiTripPlanOutputSchema = z.object({
  suggestedDestination: z.object({
    name: z.string().describe('The suggested destination city or region.'),
    reason: z.string().describe('A short reason why this destination was chosen based on the user\'s vibe.'),
  }),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string().describe('A catchy title for the day\'s activities.'),
    activities: z.string().describe('A detailed description of the activities for the day, in a list format.'),
  })).describe('A day-by-day plan for the trip.'),
  accommodationSuggestion: z.object({
    name: z.string().describe('The name of a suggested hotel or rental.'),
    type: z.string().describe('The type of accommodation (e.g., Hotel, Villa).'),
    reason: z.string().describe('Why this accommodation is a good fit.'),
  }),
  transportSuggestion: z.string().describe('Suggestions for flights, car rentals, or local transport.'),
  estimatedCost: z.object({
    total: z.number().describe('The estimated total cost for the trip in USD.'),
    breakdown: z.string().describe('A brief breakdown of the cost (e.g., Flights: $XXX, Stay: $XXX, Activities: $XXX).'),
  }),
  additionalTips: z.string().optional().describe('Any extra tips for the trip.'),
});

export type AiTripPlanOutput = z.infer<typeof AiTripPlanOutputSchema>;

export async function planTrip(input: AiTripPlanInput): Promise<AiTripPlanOutput> {
  return aiTripPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTripPlannerSurveyPrompt',
  input: {schema: AiTripPlanInputSchema},
  output: {schema: AiTripPlanOutputSchema},
  prompt: `You are an expert travel planner AI for RoamFree. Your task is to create a personalized trip itinerary based on a detailed user survey.
If the user wants a surprise destination, pick one that perfectly matches their vibe and preferences. Otherwise, build the plan around their specified location.

Here is the user's survey data:
- Travel Purpose: {{{travelPurpose}}}
- Budget: Level: {{{budget.level}}}{{#if budget.customAmount}}, Custom Amount: {{{budget.customAmount}}}{{/if}}
- Dates: From {{{dates.from}}} to {{{dates.to}}} (Flexible: {{{dates.isFlexible}}})
- Destination: {{#if destination.specificLocation}}User wants to go to {{{destination.specificLocation}}}{{else}}User wants to be surprised{{/if}}. Type: {{{destination.type}}}
- Desired Vibe: {{#each tripVibe}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Travel Type: {{{travelType.type}}}{{#if travelType.isPetFriendly}}, with a pet{{/if}}
- Accommodation Preferences: Types: {{#each accommodation.types}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}. Amenities: {{#each accommodation.amenities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
- Transport Needs: Flight: {{{transport.needsFlight}}}, Car Rental: {{{transport.needsCarRental}}}, Local Transport: {{{transport.needsLocalTransport}}}, AI Rides: {{{transport.needsAiRides}}}, Driver: {{{transport.needsDriver}}}
- Extras: {{#if extras}}{{#each extras}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

Based on this, generate a comprehensive trip plan.
- The itinerary should be broken down day-by-day.
- Suggest one specific, well-matched accommodation.
- Provide a clear transport suggestion.
- Give a realistic estimated total cost in USD and a simple breakdown.
- Include helpful additional tips.
- Make the plan sound exciting and perfectly tailored to the user.
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
    
