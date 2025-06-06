
'use server';
/**
 * @fileOverview AI flow for a customer support chatbot / AI Personal Travel Assistant.
 *
 * - getSupportChatResponse - A function that provides a response to a user's support query or travel planning request.
 * - SupportChatbotInput - The input type for the getSupportChatResponse function.
 * - SupportChatbotOutput - The return type for the getSupportChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s question, support request, or travel planning query related to RoamFree services (bookings, listings, account issues, trip planning, recommendations, etc.).'),
  // conversationHistory: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional().describe("Optional history of the conversation so far."),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  response: z.string().describe('A helpful and relevant response from the AI Personal Travel Assistant to address the user\'s query. If the query is complex or requires human intervention, the bot should state its limitations and suggest contacting human support.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

export async function getSupportChatResponse(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: {schema: SupportChatbotInputSchema},
  output: {schema: SupportChatbotOutputSchema},
  prompt: `You are a friendly, helpful, and highly capable AI Personal Travel Assistant for "RoamFree", a comprehensive travel and accommodation booking platform.
Your goal is to assist users with their questions about our services, help them plan trips, make bookings, and adjust existing travel plans.

RoamFree offers:
- Accommodation Search (hotels, vacation rentals, land) - including mood-based filters (peaceful, romantic, adventurous) and eco-friendly/accessibility options.
- Transportation Booking (rides, rental cars, flights) - including airport pickup scheduling and baggage assistance options.
- Attraction Tickets & Local Event Discovery.
- Property Listing for Owners (stays, cars, land) with an Owner Dashboard (analytics, pricing tools, availability management).
- Real Estate & Land Sales (search, tours, mortgage calculator).
- User Accounts and Profiles (preferences, booking history, wishlist, loyalty program, wallet system).
- Advanced Security: ID verification (standard & video), AI fraud detection.
- In-App Chat & Support with an SOS feature.
- AI Trip Planner: Builds itineraries based on location, duration, and preferences.

User's Query: {{{query}}}

{{#if conversationHistory}}
Conversation History:
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}
{{/if}}

Please provide a clear, concise, and helpful response.
- If the question is about a feature RoamFree offers, provide information or guidance.
- If the user wants to plan a trip, ask clarifying questions (destination, duration, interests) and then provide suggestions or use the AI Trip Planner capabilities.
- If the user wants to book something, guide them on how to do it on the platform or (as a demo) confirm a mock booking.
- If the question is about account issues (e.g., password reset, payment problems, wallet top-up), explain how to resolve it or where to find help.
- If the query is too complex, involves sensitive personal information, or requires human intervention, politely state your limitations and guide the user to contact human support (e.g., "For this specific issue, please contact our human support team through the 'Send us a Message' form or by calling us.").
- Do not make up information or promise features that don't exist beyond what's listed above (mentioning "demo" or "future feature" is okay).
- Be empathetic and professional.
`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI chatbot failed to generate a response.");
    }
    return output;
  }
);
    